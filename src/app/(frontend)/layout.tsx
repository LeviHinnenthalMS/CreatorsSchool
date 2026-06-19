import Root from '@/ui/Root'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import SkipToContent from '@/ui/SkipToContent'
import Announcement from '@/ui/Announcement'
import Header from '@/ui/header'
import Footer from '@/ui/footer'
import VisualEditingControls from '@/ui/VisualEditingControls'
import {
	GTMScript,
	CookieYesScript,
	GTMNoScript,
} from '@/ui/analytics/GTMScript'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { BASE_URL } from '@/lib/env'
import { getSite } from '@/sanity/lib/queries'
import '@/styles/app.css'

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const site = await getSite()
	const siteName = (site as { title?: string | null } | null)?.title ?? undefined
	const siteImage = (site as { ogimage?: string | null } | null)?.ogimage ?? undefined
	const jsonLd = [
		{
			'@context': 'https://schema.org',
			'@type': 'Organization',
			name: siteName,
			url: BASE_URL,
			logo: siteImage,
		},
		{
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: siteName,
			url: BASE_URL,
		},
	]

	return (
		<Root>
			<body className="text-ink antialiased">
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
				<GTMNoScript />
				<GTMScript />
				<CookieYesScript />
				<NuqsAdapter>
					<SkipToContent />
					<Announcement />
					<Header />
					<main id="main-content" tabIndex={-1}>
						<div aria-hidden className="h-[calc(var(--header-height)+14px)] shrink-0" />
						{children}
					</main>
					<Footer />

					<VisualEditingControls />
				</NuqsAdapter>

				<Analytics />
				<SpeedInsights />
			</body>
		</Root>
	)
}
