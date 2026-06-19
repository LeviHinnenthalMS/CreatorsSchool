import { defineField, defineType } from 'sanity'
import { VscBriefcase } from 'react-icons/vsc'

export default defineType({
	name: 'job',
	title: 'Stelle',
	type: 'document',
	icon: VscBriefcase,
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'icon',
			title: 'Icon',
			description:
				'Icon-Key, der zur Stellen-Karte passt (z. B. "dance", "music", "star").',
			type: 'string',
		}),
		defineField({
			name: 'type',
			title: 'Anstellungsart',
			description: 'z. B. Teilzeit, Honorarbasis',
			type: 'string',
		}),
		defineField({
			name: 'location',
			title: 'Ort',
			type: 'string',
		}),
		defineField({
			name: 'summary',
			title: 'Kurzbeschreibung',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'description',
			title: 'Volltext',
			type: 'array',
			of: [{ type: 'block' }],
		}),
		defineField({
			name: 'applyEmailSubject',
			title: 'Mail-Betreff für Bewerbung',
			description:
				'Wird in den mailto-Link eingesetzt. z. B. „Bewerbung Tanzlehrer:in".',
			type: 'string',
		}),
		defineField({
			name: 'active',
			title: 'Aktiv (anzeigen)',
			type: 'boolean',
			initialValue: true,
		}),
		defineField({
			name: 'order',
			title: 'Sortierung',
			type: 'number',
		}),
		defineField({
			name: 'language',
			type: 'string',
			readOnly: true,
			hidden: true,
		}),
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'type',
			language: 'language',
		},
		prepare: ({ title, subtitle, language }) => ({
			title,
			subtitle: [language && `[${language}]`, subtitle].filter(Boolean).join(' · '),
		}),
	},
})
