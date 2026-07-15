import Icon from '@/ui/creators/Icon'

export default function WhatsAppFab({ number }: { number: string }) {
	return (
		<a
			href={`https://wa.me/${number}`}
			aria-label="WhatsApp kontaktieren"
			className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-150 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] motion-reduce:hover:scale-100"
		>
			<Icon name="whatsapp" size={28} strokeWidth={1} />
		</a>
	)
}
