import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { OFFERING_SLUGS_QUERY, getOfferingBySlug } from '@/sanity/lib/creators'
import { client } from '@/sanity/lib/client'
import OfferingDetail from '@/ui/modules/OfferingDetail'
import CTABand from '@/ui/modules/CTABand'
import { BASE_URL } from '@/lib/env'
import { DEFAULT_LANG, languages } from '@/lib/i18n'

type Params = { lang: string; slug: string }
type Props = { params: Promise<Params> }

export default async function OfferingLangPage({ params }: Props) {
	const { lang, slug } = await params
	if (!(languages as readonly string[]).includes(lang)) notFound()

	const offering = await getOfferingBySlug(slug, lang)
	if (!offering) notFound()

	return (
		<>
			<OfferingDetail
				_type="offering-detail"
				_key="offering-detail"
				offering={{ _id: offering._id }}
			/>
			<CTABand _type="cta-band" _key="cta-band" />
		</>
	)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { lang, slug } = await params
	if (!(languages as readonly string[]).includes(lang)) return {}

	const offering = await getOfferingBySlug(slug, lang)
	if (!offering) return {}

	const langPrefix = lang && lang !== DEFAULT_LANG ? `/${lang}` : ''
	const url = `${BASE_URL}${langPrefix}/angebote/${slug}`

	return {
		title: offering.title || undefined,
		description: offering.lede || undefined,
		alternates: { canonical: url },
	}
}

export async function generateStaticParams() {
	const all = await client.fetch<{ slug: string; language?: string }[]>(
		OFFERING_SLUGS_QUERY,
	)
	const nonDefault = all.filter(
		(o) => o.language && o.language !== DEFAULT_LANG && o.slug,
	)
	return nonDefault.map((o) => ({ lang: o.language as string, slug: o.slug }))
}
