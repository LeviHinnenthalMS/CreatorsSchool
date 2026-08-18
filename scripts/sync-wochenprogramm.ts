// Run with: npx tsx --env-file=.env.local scripts/sync-wochenprogramm.ts
//
// Applies Miriam's ground-truth Wochenprogramm to the scheduleSlot documents:
//  - renames Mo 17:30 (was "Modern-/Contemporary dance") → "Jazzdance"
//  - normalizes "Moderndance ab 12/16" → "Modern dance ab 12/16"
//  - adds two Dissen (Außenstelle) slots that don't exist yet
//  - keeps existing Melle slots labelled "Melle" so location shows up in UI
import { createClient } from '@sanity/client'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2026-08-13',
	useCdn: false,
})

type Patch = { id: string; set: Record<string, unknown>; unset?: string[] }

const patches: Patch[] = [
	// slot-002: Mo 17:30 → Jazzdance (was "Modern-/Contemporary dance")
	{
		id: 'schedule-slot-002',
		set: { name: 'Jazzdance', room: 'Melle' },
		unset: ['ageRange'],
	},
	// slot-007: normalize spelling
	{
		id: 'schedule-slot-007',
		set: { name: 'Modern dance ab 12', room: 'Melle' },
	},
	// slot-008: normalize spelling
	{
		id: 'schedule-slot-008',
		set: { name: 'Modern dance ab 16', room: 'Melle' },
	},
]

type NewSlot = {
	_id: string
	weekday: 'mo' | 'di' | 'mi' | 'do' | 'fr' | 'sa' | 'so'
	weekdayOrder: number
	time: string
	duration: string
	name: string
	ageRange?: string | null
	subInfo?: string | null
	room: string
	status: 'open'
	bereich: 'tanz' | 'musik' | 'instrument'
	categories?: string[]
	language: 'de'
}

const newSlots: NewSlot[] = [
	{
		_id: 'schedule-slot-dissen-tanz-frueh',
		weekday: 'mo',
		weekdayOrder: 0,
		time: '16:30',
		duration: '45 min',
		name: 'Tänzerische Früherziehung',
		ageRange: '3–6 Jahre',
		room: 'Dissen · Regenbogen KiGa',
		status: 'open',
		bereich: 'tanz',
		categories: ['frueh'],
		language: 'de',
	},
	{
		_id: 'schedule-slot-dissen-ballett-vorstufe',
		weekday: 'di',
		weekdayOrder: 1,
		time: '16:00',
		duration: '45 min',
		name: 'Ballett Vorstufe',
		room: 'Dissen · Regenbogen KiGa',
		status: 'open',
		bereich: 'tanz',
		language: 'de',
	},
]

async function main() {
	for (const p of patches) {
		let patch = client.patch(p.id).set(p.set)
		if (p.unset?.length) patch = patch.unset(p.unset)
		const res = await patch.commit()
		console.log(`Patched ${res._id}`)
	}

	for (const slot of newSlots) {
		const res = await client.createOrReplace({
			_type: 'scheduleSlot',
			...slot,
		})
		console.log(`Upserted ${res._id}`)
	}
}

main().catch((e) => {
	console.error(e)
	process.exitCode = 1
})
