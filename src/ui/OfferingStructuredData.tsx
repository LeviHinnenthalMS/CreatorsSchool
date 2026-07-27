import { BASE_URL } from '@/lib/env'
import type { OfferingDetail } from '@/sanity/lib/creators'
import JsonLd from './JsonLd'

export default function OfferingStructuredData({
	offering,
	slug,
	siteName,
	lang,
}: {
	offering: OfferingDetail
	slug: string
	siteName?: string | null
	lang: string
}) {
	const langPrefix = lang === 'de' ? '' : `/${lang}`
	const url = `${BASE_URL}${langPrefix}/angebote/${slug}`
	const offersUrl = `${BASE_URL}${langPrefix}/angebote`
	const faq = offering.faq?.filter((item) => item?.q && item?.a) ?? []

	return (
		<JsonLd
			value={[
				{
					'@context': 'https://schema.org',
					'@type': 'Course',
					'@id': `${url}#course`,
					name: offering.title,
					description: offering.lede,
					url,
					inLanguage: lang,
					provider: { '@id': `${BASE_URL}#organization` },
				},
				{
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					itemListElement: [
						{
							'@type': 'ListItem',
							position: 1,
							name: siteName,
							item: BASE_URL,
						},
						{
							'@type': 'ListItem',
							position: 2,
							name: 'Angebote',
							item: offersUrl,
						},
						{
							'@type': 'ListItem',
							position: 3,
							name: offering.title,
							item: url,
						},
					],
				},
				...(faq.length
					? [
							{
								'@context': 'https://schema.org',
								'@type': 'FAQPage',
								mainEntity: faq.map((item) => ({
									'@type': 'Question',
									name: item.q,
									acceptedAnswer: { '@type': 'Answer', text: item.a },
								})),
							},
						]
					: []),
			]}
		/>
	)
}
