import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { OFFERING_SLUGS_QUERY, getOfferingBySlug } from '@/sanity/lib/creators'
import { client } from '@/sanity/lib/client'
import OfferingDetail from '@/ui/modules/OfferingDetail'
import CTABand from '@/ui/modules/CTABand'
import getServerLang from '@/lib/getServerLang'
import { BASE_URL } from '@/lib/env'
import { DEFAULT_LANG } from '@/lib/i18n'

type Props = { params: Promise<{ slug: string }> }

export default async function OfferingPage({ params }: Props) {
	const { slug } = await params
	const lang = await getServerLang()
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
	const { slug } = await params
	const lang = await getServerLang()
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
	return Array.from(new Set(all.map((o) => o.slug))).map((slug) => ({ slug }))
}
