import { notFound } from 'next/navigation'
import { OFFERING_SLUGS_QUERY, getOfferingBySlug } from '@/sanity/lib/creators'
import { client } from '@/sanity/lib/client'
import OfferingDetail from '@/ui/modules/OfferingDetail'
import CTABand from '@/ui/modules/CTABand'
import { DEFAULT_LANG, languages } from '@/lib/i18n'
import processMetadata from '@/lib/processMetadata'
import OfferingStructuredData from '@/ui/OfferingStructuredData'
import { getSite } from '@/sanity/lib/queries'

type Params = { lang: string; slug: string }
type Props = { params: Promise<Params> }

// Reject unknown locale/slug combinations at the router boundary. Without
// this, `/angebote/angebote/...` can be mistaken for a localized static route.
export const dynamicParams = false

export default async function OfferingLangPage({ params }: Props) {
	const { lang, slug } = await params
	if (!(languages as readonly string[]).includes(lang)) notFound()

	const offering = await getOfferingBySlug(slug, lang)
	if (!offering) notFound()
	const site = await getSite()

	return (
		<>
			<OfferingStructuredData
				offering={offering}
				slug={slug}
				lang={lang}
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
	const { lang, slug } = await params
	if (!(languages as readonly string[]).includes(lang)) return {}

	const offering = await getOfferingBySlug(slug, lang)
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
	const nonDefault = all.filter(
		(o) => o.language && o.language !== DEFAULT_LANG && o.slug,
	)
	return nonDefault.map((o) => ({ lang: o.language as string, slug: o.slug }))
}
