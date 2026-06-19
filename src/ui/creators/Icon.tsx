import { cn } from '@/lib/utils'
import { stegaClean } from 'next-sanity'

type IconProps = Omit<React.SVGProps<SVGSVGElement>, 'name'> & {
	size?: number | string
}

const stroke = {
	fill: 'none',
	stroke: 'currentColor',
	strokeWidth: 1.8,
	strokeLinecap: 'round' as const,
	strokeLinejoin: 'round' as const,
}

const paths: Record<string, React.ReactNode> = {
	music: (
		<>
			<path d="M9 18V5l12-2v13" />
			<circle cx="6" cy="18" r="3" />
			<circle cx="18" cy="16" r="3" />
		</>
	),
	sparkle: (
		<>
			<path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z" />
			<path d="M18 14l.9 2.1L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.9z" />
		</>
	),
	stage: (
		<>
			<path d="M2 3h20v14H2z" />
			<path d="M8 21h8M12 17v4" />
		</>
	),
	people: (
		<>
			<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
			<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</>
	),
	clock: (
		<>
			<circle cx="12" cy="12" r="10" />
			<path d="M12 6v6l4 2" />
		</>
	),
	calendar: (
		<>
			<rect x="3" y="4" width="18" height="18" rx="2" />
			<path d="M16 2v4M8 2v4M3 10h18" />
		</>
	),
	voice: (
		<>
			<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
			<path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
		</>
	),
	heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />,
	star: <polygon points="12 2 15 8.7 22 9.3 17 14.1 18.2 21 12 17.6 5.8 21 7 14.1 2 9.3 9 8.7" />,
	dance: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
	movement: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
	pin: (
		<>
			<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
			<circle cx="12" cy="10" r="3" />
		</>
	),
	phone: (
		<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
	),
	mail: (
		<>
			<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
			<polyline points="22,6 12,13 2,6" />
		</>
	),
	whatsapp: (
		<path
			fill="currentColor"
			d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.67c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.42 5.82c0 4.54-3.7 8.24-8.24 8.24-1.52 0-3.01-.41-4.3-1.19l-.31-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.24-8.24zm-4.5 4.2c-.2 0-.53.08-.81.38-.28.3-1.07 1.05-1.07 2.56s1.1 2.97 1.25 3.17c.15.2 2.15 3.28 5.21 4.6.73.31 1.3.5 1.74.64.73.23 1.4.2 1.93.12.59-.09 1.81-.74 2.07-1.45.26-.71.26-1.32.18-1.45-.08-.13-.28-.2-.59-.36-.31-.15-1.81-.89-2.09-.99-.28-.1-.48-.15-.69.15-.2.3-.79.99-.97 1.19-.18.2-.36.23-.66.08-.31-.15-1.29-.48-2.46-1.52-.91-.81-1.52-1.81-1.7-2.11-.18-.3-.02-.47.13-.62.14-.14.31-.36.46-.54.15-.18.2-.3.31-.51.1-.2.05-.38-.03-.54-.08-.15-.69-1.66-.95-2.27-.25-.6-.5-.51-.69-.52l-.59-.01z"
		/>
	),
	arrow: (
		<>
			<path d="M5 12h14M13 5l7 7-7 7" />
		</>
	),
	check: <polyline points="20 6 9 17 4 12" />,
	chev: <path d="M6 9l6 6 6-6" />,
	instagram: (
		<>
			<rect x="2" y="2" width="20" height="20" rx="5" />
			<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" />
		</>
	),
	facebook: (
		<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
	),
	youtube: (
		<>
			<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
			<polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
		</>
	),
	smile: (
		<>
			<circle cx="12" cy="12" r="10" />
			<path d="M9 9h.01M15 9h.01M8 13a4 4 0 0 0 8 0" />
		</>
	),
	piano: (
		<>
			<rect x="3" y="6" width="18" height="12" rx="2" />
			<path d="M7 6v12M11 6v9M15 6v12M19 6v9" />
		</>
	),
	wedding: (
		<>
			<circle cx="9" cy="12" r="5" />
			<circle cx="15" cy="12" r="5" />
		</>
	),
	leaf: (
		<>
			<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.3c1.4 9.3-1.7 16.3-8.2 17.7" />
			<path d="M2 21c0-3 1.85-5.36 5.08-6" />
		</>
	),
}

export function Icon({
	name,
	className,
	size = 22,
	...props
}: { name?: string | null } & IconProps) {
	const key = stegaClean(name || '').trim()
	const body = key && paths[key]
	if (!body) return null

	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			aria-hidden
			className={cn('block shrink-0', className)}
			{...stroke}
			{...props}
		>
			{body}
		</svg>
	)
}

export default Icon
