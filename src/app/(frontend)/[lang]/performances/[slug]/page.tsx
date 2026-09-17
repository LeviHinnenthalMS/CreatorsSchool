import { notFound } from 'next/navigation'
import {
	PERFORMANCE_SLUGS_QUERY,
	getPerformanceBySlug,
} from '@/sanity/lib/creators'
import { client } from '@/sanity/lib/client'
import PerformancePage from '@/ui/performance/PerformancePage'
import PerformanceStructuredData from '@/ui/performance/PerformanceStructuredData'
import { DEFAULT_LANG, languages } from '@/lib/i18n'
import { BASE_URL } from '@/lib/env'
import processMetadata from '@/lib/processMetadata'

type Params = { lang: string; slug: string }
type Props = { params: Promise<Params> }

export const dynamicParams = false

export default async function PerformanceLangRoute({ params }: Props) {
	const { lang, slug } = await params
	if (!(languages as readonly string[]).includes(lang)) notFound()

	const performance = await getPerformanceBySlug(slug, lang)
	if (!performance) notFound()

	return (
		<>
			<PerformanceStructuredData
				performance={performance}
				url={`${BASE_URL}/${lang}/performances/${slug}`}
				lang={lang}
			/>
			<PerformancePage performance={performance} lang={lang} />
		</>
	)
}

export async function generateMetadata({ params }: Props) {
	const { lang, slug } = await params
	if (!(languages as readonly string[]).includes(lang)) return {}

	const performance = await getPerformanceBySlug(slug, lang)
	if (!performance) return {}

	return processMetadata(performance)
}

export async function generateStaticParams() {
	const all = await client.fetch<{ slug: string; language?: string }[]>(
		PERFORMANCE_SLUGS_QUERY,
	)
	return all
		.filter((p) => p.language && p.language !== DEFAULT_LANG && p.slug)
		.map((p) => ({ lang: p.language as string, slug: p.slug }))
}
