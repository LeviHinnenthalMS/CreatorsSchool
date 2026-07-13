import { cn } from '@/lib/utils'
import { stegaClean } from 'next-sanity'
import {
	Music,
	Sparkles,
	Monitor,
	Users,
	Clock,
	Calendar,
	Mic,
	Heart,
	Star,
	Activity,
	MapPin,
	Phone,
	Mail,
	ArrowRight,
	Check,
	ChevronDown,
	Smile,
	Piano,
	Leaf,
	Car,
	Bus,
	Bike,
	Train,
	type LucideIcon,
} from 'lucide-react'

type IconProps = {
	name?: string | null
	size?: number | string
	className?: string
	strokeWidth?: number
	stroke?: string
}

const LUCIDE_MAP: Record<string, LucideIcon> = {
	music: Music,
	sparkle: Sparkles,
	stage: Monitor,
	people: Users,
	clock: Clock,
	calendar: Calendar,
	voice: Mic,
	heart: Heart,
	star: Star,
	dance: Activity,
	movement: Activity,
	pin: MapPin,
	phone: Phone,
	mail: Mail,
	arrow: ArrowRight,
	check: Check,
	chev: ChevronDown,
	smile: Smile,
	piano: Piano,
	wedding: Heart,
	leaf: Leaf,
	car: Car,
	bus: Bus,
	bike: Bike,
	train: Train,
}

// ponytail: brand icons kept as custom SVGs — removed from Lucide
// whatsapp is fill-based, rendered separately below
const CUSTOM_ICONS: Record<string, (size: number | string) => React.ReactNode> = {
	instagram: (_size) => (
		<>
			<rect x="2" y="2" width="20" height="20" rx="5" />
			<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" />
		</>
	),
	facebook: (_size) => (
		<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
	),
	youtube: (_size) => (
		<>
			<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
			<polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
		</>
	),
}

export function Icon({ name, className, size = 22, strokeWidth, stroke }: IconProps) {
	const key = stegaClean(name || '').trim()
	if (!key) return null

	if (key === 'whatsapp') {
		return (
			<svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				aria-hidden
				fill="currentColor"
				stroke="none"
				className={cn('block shrink-0', className)}
			>
				<path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28" />
			</svg>
		)
	}

	const customBody = CUSTOM_ICONS[key]
	if (customBody) {
		return (
			<svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				aria-hidden
				fill="none"
				stroke="currentColor"
				strokeWidth={strokeWidth ?? 1.8}
				strokeLinecap="round"
				strokeLinejoin="round"
				className={cn('block shrink-0', className)}
				style={stroke ? { stroke } : undefined}
			>
				{customBody(size)}
			</svg>
		)
	}

	const LucideComponent = LUCIDE_MAP[key]
	if (!LucideComponent) return null

	return (
		<LucideComponent
			width={size}
			height={size}
			aria-hidden
			strokeWidth={strokeWidth ?? 1.8}
			className={cn('block shrink-0', className)}
			style={stroke ? { stroke } : undefined}
		/>
	)
}

export default Icon
