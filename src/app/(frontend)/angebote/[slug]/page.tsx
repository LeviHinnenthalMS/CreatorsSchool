import { notFound } from 'next/navigation'
import { OFFERING_SLUGS_QUERY, getOfferingBySlug } from '@/sanity/lib/creators'
import { client } from '@/sanity/lib/client'
import OfferingDetail from '@/ui/modules/OfferingDetail'
import CTABand from '@/ui/modules/CTABand'
import { DEFAULT_LANG } from '@/lib/i18n'
import processMetadata from '@/lib/processMetadata'
import { getSite } from '@/sanity/lib/queries'
import OfferingStructuredData from '@/ui/OfferingStructuredData'

type Props = { params: Promise<{ slug: string }> }

export default async function OfferingPage({ params }: Props) {
	const { slug } = await params
	const offering = await getOfferingBySlug(slug, DEFAULT_LANG)
	if (!offering) notFound()
	const site = await getSite()

	return (
		<>
			<OfferingStructuredData
				offering={offering}
				slug={slug}
				lang={DEFAULT_LANG}
				siteName={(site as { title?: string }).title}
			/>
			<OfferingDetail
				_type="offering-detail"
				_key="offering-detail"
				offering={{ _id: offering._id }}
			/>
			<CTABand _type="cta-band" _key="cta-band" />
		</>
	)
}

export async function generateMetadata({ params }: Props) {
	const { slug } = await params
	const offering = await getOfferingBySlug(slug, DEFAULT_LANG)
	if (!offering) return {}

	return processMetadata({
		...offering,
		metadata: {
			...offering.metadata,
			slug: { current: `angebote/${slug}` },
		},
	})
}

export async function generateStaticParams() {
	const all =
		await client.fetch<{ slug: string; language?: string }[]>(
			OFFERING_SLUGS_QUERY,
		)
	return Array.from(
		new Set(
			all
				.filter((o) => !o.language || o.language === DEFAULT_LANG)
				.map((o) => o.slug),
		),
	).map((slug) => ({ slug }))
}
