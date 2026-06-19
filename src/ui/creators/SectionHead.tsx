import { cn } from '@/lib/utils'
import Eyebrow from './Eyebrow'
import AccentTitle from './AccentTitle'

export default function SectionHead({
	eyebrow,
	titleBefore,
	titleAccent,
	titleAfter,
	titlePill,
	tagline,
	tone = 'coral',
	className,
	as = 'h2',
	titleClassName,
	taglineClassName,
}: {
	eyebrow?: string | null
	titleBefore?: string | null
	titleAccent?: string | null
	titleAfter?: string | null
	titlePill?: string | null
	tagline?: string | null
	tone?: 'coral' | 'blush' | 'paper'
	className?: string
	as?: 'h1' | 'h2'
	titleClassName?: string
	taglineClassName?: string
}) {
	const hasHead =
		titleBefore || titleAccent || titleAfter || titlePill || eyebrow
	if (!hasHead && !tagline) return null

	return (
		<div
			className={cn(
				'mb-[clamp(2.5rem,5vw,3.75rem)] grid items-end gap-x-10 gap-y-4 md:grid-cols-[1.2fr_1fr]',
				className,
			)}
		>
			<div>
				{eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
				{hasHead && (
					<AccentTitle
						as={as}
						before={titleBefore}
						accent={titleAccent}
						after={titleAfter}
						pill={titlePill}
						className={cn('mt-3 h-section', titleClassName)}
						tone={tone}
					/>
				)}
			</div>
			{tagline && (
				<p
					className={cn(
						'text-mute max-w-[50ch] text-[16px] leading-relaxed',
						tone === 'paper' && 'text-paper/70',
						tone === 'blush' && 'text-paper/85',
						taglineClassName,
					)}
				>
					{tagline}
				</p>
			)}
		</div>
	)
}
