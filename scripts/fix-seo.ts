// Run once with: pnpm fix-seo
import { createClient } from '@sanity/client'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2024-12-01',
	useCdn: false,
})

type Page = {
	_id: string
	title?: string
	metadata?: Record<string, unknown>
	stage?: Array<Record<string, unknown>>
	modules?: Array<Record<string, unknown>>
}

function truncate(value: string, max: number) {
	const text = value.replace(/\s+/g, ' ').trim()
	if (text.length <= max) return text
	return `${text
		.slice(0, max)
		.replace(/\s+\S*$/, '')
		.trim()}…`
}

const pageSeo: Record<
	string,
	{ title: string; description: string; noIndex?: boolean }
> = {
	auffuehrungen: {
		title: 'Aufführungen 2026 | Creators School Melle',
		description:
			'Tanz- und Musikaufführungen der Creators School im Schauspielhaus Melle: Termine, Programm und Informationen zu Tickets.',
	},
	barrierefreiheit: {
		title: 'Barrierefreiheit | Creators School Melle',
		description:
			'Informationen zur digitalen Barrierefreiheit der Website der Creators School in Melle.',
		noIndex: true,
	},
	components: {
		title: 'Komponentenübersicht | Creators School',
		description:
			'Interne Komponentenübersicht der Website der Creators School.',
		noIndex: true,
	},
	datenschutz: {
		title: 'Datenschutz | Creators School Melle',
		description:
			'Datenschutzerklärung der Creators School in Melle mit Informationen zur Verarbeitung personenbezogener Daten.',
	},
	galerie: {
		title: 'Galerie | Creators School Melle',
		description:
			'Einblicke in Aufführungen, Proben und den Schulalltag der Creators School in Melle.',
		noIndex: true,
	},
	impressum: {
		title: 'Impressum | Creators School Melle',
		description:
			'Impressum und Anbieterkennzeichnung der Creators School in Melle.',
	},
	jobs: {
		title: 'Jobs | Creators School Melle',
		description:
			'Offene Stellen für Musik- und Tanzpädagog:innen bei der Creators School in Melle.',
	},
	stundenplan: {
		title: 'Stundenplan | Creators School Melle',
		description:
			'Aktueller Stundenplan für Musik, Tanz und Frühförderung bei der Creators School in Melle.',
	},
}

async function patchPages() {
	const pages = await client.fetch<Page[]>(
		`*[_type == "page" && defined(metadata.slug.current)]{
			_id, title, metadata, stage, modules
		}`,
	)

	for (const page of pages) {
		const slug = (page.metadata?.slug as { current?: string } | undefined)
			?.current
		if (!slug) continue
		const seo = pageSeo[slug]
		const isLegacyOffering = slug.startsWith('angebote/')
		if (
			!seo &&
			!isLegacyOffering &&
			slug !== 'angebote' &&
			slug !== 'ueber-uns'
		) {
			continue
		}

		const patch = client.patch(page._id)
		if (seo) {
			patch.set({
				'metadata.title': seo.title,
				'metadata.description': seo.description,
				'metadata.noIndex': seo.noIndex ?? false,
			})
		}
		if (isLegacyOffering) {
			patch.set({
				'metadata.title': truncate(
					`${page.title || 'Angebot'} | Creators School Melle`,
					60,
				),
				'metadata.description': `Informationen zu ${page.title || 'diesem Angebot'} bei der Creators School in Melle.`,
				'metadata.noIndex': true,
			})
		}

		if (slug === 'angebote' && page.modules) {
			const modules = page.modules.map((module) =>
				module._type === 'offering-list' && !module.title
					? {
							...module,
							title: [
								{
									_type: 'block',
									_key: 'seo-offerings-title',
									style: 'normal',
									markDefs: [],
									children: [
										{
											_type: 'span',
											_key: 'seo-offerings-title-text',
											text: 'Unsere Angebote im Überblick.',
											marks: [],
										},
									],
								},
							],
						}
					: module,
			)
			patch.set({ modules })
		}

		if (slug === 'ueber-uns' && page.modules) {
			const modules = page.modules.map((module) => {
				if (module._type !== 'timeline' || !Array.isArray(module.title))
					return module
				return {
					...module,
					title: (module.title as Array<Record<string, unknown>>).map(
						(block) => ({
							...block,
							children: Array.isArray(block.children)
								? (block.children as Array<Record<string, unknown>>).map(
										(child) =>
											child._key === 'tl-t1a'
												? { ...child, text: 'Seit 2002, ' }
												: child,
									)
								: block.children,
						}),
					),
				}
			})
			patch.set({ modules })
		}

		await patch.commit()
	}
}

async function patchOfferings() {
	const offerings = await client.fetch<
		Array<{
			_id: string
			title?: string
			lede?: string
			heroImage?: { alt?: string }
			metadata?: Record<string, unknown>
		}>
	>(`*[_type == "offering"]{_id, title, lede, heroImage, metadata}`)

	for (const offering of offerings) {
		if (!offering.title) continue
		const description = truncate(
			offering.lede ||
				`${offering.title} bei der Creators School in Melle: Inhalte, Zielgruppe, Zeiten und Anmeldung.`,
			160,
		)
		const patch = client.patch(offering._id).set({
			'metadata.title': truncate(
				`${offering.title} in Melle | Creators School`,
				60,
			),
			'metadata.description': description,
			'metadata.noIndex': false,
		})
		if (!offering.heroImage?.alt?.trim()) {
			patch.set({
				'heroImage.alt':
					'Schlagzeugunterricht in einem Unterrichtsraum der Creators School Melle',
			})
		}
		await patch.commit()
	}
}

async function patchImageAlternatives() {
	const assetId = await client.fetch<string | null>(
		`*[_type == "offering" && defined(heroImage.asset._ref)][0].heroImage.asset._ref`,
	)
	if (assetId) {
		await client
			.patch(assetId)
			.set({
				altText:
					'Schlagzeugunterricht in einem Unterrichtsraum der Creators School Melle',
			})
			.commit()
	}

	const home = await client.fetch<Page | null>(
		`*[_type == "page" && metadata.slug.current == "index" && language == "de"][0]{
			_id, modules
		}`,
	)
	if (!home?.modules) return
	const modules = home.modules.map((module) => {
		if (module._type !== 'welten-split' || !Array.isArray(module.cards))
			return module
		return {
			...module,
			cards: (module.cards as Array<Record<string, unknown>>).map((card) => ({
				...card,
				image:
					card.image && typeof card.image === 'object'
						? {
								...(card.image as Record<string, unknown>),
								alt: 'Schlagzeugunterricht in einem Unterrichtsraum der Creators School Melle',
							}
						: card.image,
			})),
		}
	})
	await client.patch(home._id).set({ modules }).commit()
}

async function main() {
	await patchPages()
	await patchOfferings()
	await patchImageAlternatives()
	console.log('SEO content migration completed.')
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
