'use client'

import Icon from '@/ui/creators/Icon'

export default function WhatsAppFab({ number }: { number: string }) {
	const phone = number.replace(/\D/g, '')
	const webHref = `https://wa.me/${phone}`

	function openWhatsApp(event: React.MouseEvent<HTMLAnchorElement>) {
		if (!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return

		event.preventDefault()
		window.location.href = `whatsapp://send?phone=${phone}`

		window.setTimeout(() => {
			if (!document.hidden) window.location.href = webHref
		}, 1200)
	}

	return (
		<a
			href={webHref}
			onClick={openWhatsApp}
			aria-label="WhatsApp kontaktieren"
			className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-150 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] motion-reduce:hover:scale-100"
		>
			<Icon name="whatsapp" size={28} strokeWidth={1} />
		</a>
	)
}
