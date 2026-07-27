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
import WhatsAppFab from '@/ui/WhatsAppFab'
import JsonLd from '@/ui/JsonLd'
import '@/styles/app.css'

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const site = await getSite()
	const whatsapp =
		(site as { whatsapp?: string | null } | null)?.whatsapp ?? null
	const siteName =
		(site as { title?: string | null } | null)?.title ?? undefined
	const siteData = site as {
		logoUrl?: string | null
		phoneTel?: string | null
		email?: string | null
		addressLines?: string[] | null
		city?: string | null
		sameAs?: string[] | null
	}
	const jsonLd = [
		{
			'@context': 'https://schema.org',
			'@type': 'EducationalOrganization',
			'@id': `${BASE_URL}#organization`,
			name: siteName,
			url: BASE_URL,
			logo: siteData.logoUrl,
			telephone: siteData.phoneTel,
			email: siteData.email,
			address: {
				'@type': 'PostalAddress',
				streetAddress: siteData.addressLines?.join(', '),
				addressLocality: siteData.city,
				addressCountry: 'DE',
			},
			sameAs: siteData.sameAs,
		},
		{
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			'@id': `${BASE_URL}#website`,
			name: siteName,
			url: BASE_URL,
			publisher: { '@id': `${BASE_URL}#organization` },
			inLanguage: 'de-DE',
		},
	]

	return (
		<Root>
			<body className="text-ink antialiased">
				<JsonLd value={jsonLd} />
				<GTMNoScript />
				<GTMScript />
				<CookieYesScript />
				<NuqsAdapter>
					<SkipToContent />
					<Announcement />
					<Header />
					<main id="main-content" tabIndex={-1}>
						{children}
					</main>
					<Footer />

					<VisualEditingControls />
				</NuqsAdapter>
				{whatsapp && <WhatsAppFab number={whatsapp} />}

				<Analytics />
				<SpeedInsights />
			</body>
		</Root>
	)
}
