import { cn } from '@/lib/utils'

type Size = 'sm' | 'md' | 'lg'

const PILL: Record<Size, string> = {
	sm: 'size-6',
	md: 'size-8',
	lg: 'size-10',
}

const SVG: Record<Size, number> = {
	sm: 14,
	md: 16,
	lg: 20,
}

export default function Tick({
	size = 'md',
	className,
}: {
	size?: Size
	className?: string
}) {
	const svgSize = SVG[size]

	return (
		<span
			aria-hidden
			className={cn(
				'grid shrink-0 place-items-center rounded-full bg-canvas-muted text-ink',
				PILL[size],
				className,
			)}
		>
			<svg
				width={svgSize}
				height={svgSize}
				viewBox="0 0 20 20"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M6.667 10l2.5 2.5L13.333 7.5M18.333 10a8.333 8.333 0 1 1-16.666 0 8.333 8.333 0 0 1 16.666 0Z"
					stroke="currentColor"
					strokeWidth="1.667"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</span>
	)
}
