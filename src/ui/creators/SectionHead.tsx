import { cn } from '@/lib/utils'
import Eyebrow from './Eyebrow'
import RichTitle from './RichTitle'

type Block = {
	_type?: string
	_key?: string
	children?: Array<{ text?: string; marks?: string[] }>
}

export default function SectionHead({
	eyebrow,
	title,
	tagline,
	tone = 'coral',
	className,
	as = 'h2',
	titleClassName,
	taglineClassName,
}: {
	eyebrow?: string | null
	title?: Block[] | null
	tagline?: string | null
	tone?: 'coral' | 'blush' | 'paper'
	className?: string
	as?: 'h1' | 'h2'
	titleClassName?: string
	taglineClassName?: string
}) {
	const hasTitle = title?.some((b) =>
		b.children?.some((c) => c.text && c.text.trim() !== ''),
	)
	if (!hasTitle && !eyebrow && !tagline) return null

	return (
		<div
			className={cn(
				'mb-[clamp(2.5rem,5vw,3.75rem)] grid items-end gap-x-10 gap-y-4 md:grid-cols-[1.2fr_1fr]',
				className,
			)}
		>
			<div>
				{eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
				{hasTitle && (
					<RichTitle
						title={title}
						tone={tone}
						as={as}
						className={cn('mt-3 h-section', titleClassName)}
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
