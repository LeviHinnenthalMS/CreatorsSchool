import { notFound } from 'next/navigation'
import {
	PERFORMANCE_SLUGS_QUERY,
	getPerformanceBySlug,
} from '@/sanity/lib/creators'
import { client } from '@/sanity/lib/client'
import PerformancePage from '@/ui/performance/PerformancePage'
import PerformanceStructuredData from '@/ui/performance/PerformanceStructuredData'
import { DEFAULT_LANG } from '@/lib/i18n'
import { BASE_URL } from '@/lib/env'
import processMetadata from '@/lib/processMetadata'

type Props = { params: Promise<{ slug: string }> }

export default async function PerformanceRoute({ params }: Props) {
	const { slug } = await params
	const performance = await getPerformanceBySlug(slug, DEFAULT_LANG)
	if (!performance) notFound()

	return (
		<>
			<PerformanceStructuredData
				performance={performance}
				url={`${BASE_URL}/performances/${slug}`}
				lang={DEFAULT_LANG}
			/>
			<PerformancePage performance={performance} lang={DEFAULT_LANG} />
		</>
	)
}

export async function generateMetadata({ params }: Props) {
	const { slug } = await params
	const performance = await getPerformanceBySlug(slug, DEFAULT_LANG)
	if (!performance) return {}

	return processMetadata(performance)
}

export async function generateStaticParams() {
	const all = await client.fetch<{ slug: string; language?: string }[]>(
		PERFORMANCE_SLUGS_QUERY,
	)
	return Array.from(
		new Set(
			all
				.filter((p) => !p.language || p.language === DEFAULT_LANG)
				.map((p) => p.slug),
		),
	).map((slug) => ({ slug }))
}
