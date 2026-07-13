'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@/ui/creators/Icon'

function hasMapsConsent(): boolean {
	if (typeof window === 'undefined') return false
	// CookieYes not loaded → no blocking needed
	if (!document.getElementById('cookieyes')) return true
	const entry = document.cookie
		.split('; ')
		.find((r) => r.startsWith('cookieyes-consent='))
	if (!entry) return false
	const val = decodeURIComponent(entry.split('=').slice(1).join('='))
	return val.includes('functional:yes') || val.includes('analytics:yes')
}

export default function MapEmbed({ src, title = 'Google Maps' }: { src: string; title?: string }) {
	const [consented, setConsented] = useState<boolean | null>(null)

	useEffect(() => {
		setConsented(hasMapsConsent())
		const handler = () => setConsented(hasMapsConsent())
		window.addEventListener('cookieyes-consent-update', handler)
		return () => window.removeEventListener('cookieyes-consent-update', handler)
	}, [])

	// null = not yet determined (avoids flash on hydration)
	if (consented === null) return null

	if (!consented) {
		return (
			<div className="grid size-full place-items-center bg-paper-3 p-8 text-center">
				<div className="flex flex-col items-center gap-4">
					<span className="bg-paper border-line grid size-14 place-items-center rounded-full border">
						<Icon name="pin" size={22} className="text-coral" />
					</span>
					<p className="text-mute max-w-[28ch] text-[14px] leading-relaxed">
						Für die Kartenansicht sind funktionale Cookies erforderlich.
					</p>
					<button
						onClick={() => (window as { revisitCkyConsent?: () => void }).revisitCkyConsent?.()}
						className="action-base bg-ink text-paper hover:bg-ink/85"
					>
						Cookie-Einstellungen
					</button>
				</div>
			</div>
		)
	}

	return (
		<iframe
			src={src}
			title={title}
			className="size-full border-0"
			loading="lazy"
			referrerPolicy="no-referrer-when-downgrade"
			allowFullScreen
		/>
	)
}
