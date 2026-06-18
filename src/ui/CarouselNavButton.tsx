import { TfiAngleLeft, TfiAngleRight } from 'react-icons/tfi'
import { cn } from '@/lib/utils'

type Props = {
	direction: 'prev' | 'next'
	onClick: () => void
	disabled: boolean
	/** Override the default "Previous/Next slide" aria-label. */
	label?: string
	/** Extra classes for positioning, visibility, etc. */
	className?: string
	style?: React.CSSProperties
}

/**
 * Shared previous/next button for all carousels (VideoSlider, ResourcesSlider,
 * ReadingPlansSlider…). The button is exactly 44×44px so it meets the WCAG 2.2
 * AAA target-size requirement (SC 2.5.5) while staying as compact as possible.
 *
 * Parents own positioning (`absolute` + `left`/`right`) and visibility
 * breakpoints — pass them via `className` / `style`.
 */
export default function CarouselNavButton({
	direction,
	onClick,
	disabled,
	label,
	className,
	style,
}: Props) {
	const isPrev = direction === 'prev'
	const Icon = isPrev ? TfiAngleLeft : TfiAngleRight
	const fallbackLabel = isPrev ? 'Previous slide' : 'Next slide'

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-label={label ?? fallbackLabel}
			style={style}
			className={cn(
				'grid size-11 place-items-center rounded-button border',
				'border-neutral-darkest bg-canvas text-ink shadow-sm',
				'transition-[opacity,background-color] duration-150 ease-out',
				'hover:bg-canvas-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
				'disabled:pointer-events-none disabled:opacity-0',
				className,
			)}
		>
			<Icon className="size-4" aria-hidden />
		</button>
	)
}
