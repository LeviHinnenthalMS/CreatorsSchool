// Run once with:
// pnpm exec tsx --env-file=.env.local scripts/migrate-gallery.ts
import { createClient } from '@sanity/client'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2024-12-01',
	useCdn: false,
})

type LegacyGalleryImage = {
	_id: string
	image?: {
		_type?: 'image'
		asset?: { _type: 'reference'; _ref: string }
		crop?: unknown
		hotspot?: unknown
	}
	caption?: string
	bereich?: string
	span?: string
	order?: number
	language?: string
}

async function migrateGallery() {
	const existingGallery = await client.fetch<{ _id: string } | null>(
		`*[_type == "gallery" && _id == "gallery"][0]{_id}`,
	)

	if (existingGallery) {
		throw new Error(
			'The gallery document already exists. Migration stopped without changing it.',
		)
	}

	const legacyImages = await client.fetch<LegacyGalleryImage[]>(
		`*[_type == "galleryImage" && language == "de"] | order(order asc){
			_id,
			image,
			caption,
			bereich,
			span,
			order,
			language
		}`,
	)

	const images = legacyImages
		.filter((item) => item.image?.asset)
		.map((item) => ({
			...item.image,
			_type: 'image' as const,
			_key: item._id,
			caption: item.caption ? { de: item.caption } : undefined,
			bereich: item.bereich,
			span: item.span ?? 'normal',
		}))

	await client.create({
		_id: 'gallery',
		_type: 'gallery',
		images,
	})

	console.log(`Created the gallery with ${images.length} images.`)
	console.log(
		'Legacy galleryImage documents were retained as a recoverable backup.',
	)
}

migrateGallery().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
