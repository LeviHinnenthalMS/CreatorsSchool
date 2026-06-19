import { cn } from '@/lib/utils'

export default function AccentTitle({
	before,
	accent,
	after,
	pill,
	className,
	accentClassName,
	pillClassName,
	tone = 'coral',
	as = 'h2',
}: {
	before?: string | null
	accent?: string | null
	after?: string | null
	pill?: string | null
	className?: string
	accentClassName?: string
	pillClassName?: string
	tone?: 'coral' | 'blush' | 'paper'
	as?: 'h1' | 'h2' | 'h3' | 'div'
}) {
	const Tag = as as React.ElementType
	if (!before && !accent && !after && !pill) return null

	const accentColor =
		tone === 'blush'
			? 'text-blush'
			: tone === 'paper'
				? 'text-paper'
				: 'text-coral'

	return (
		<Tag className={cn('text-ink', className)}>
			{before}
			{accent && (
				<>
					{before && before.endsWith(' ') ? '' : ' '}
					<span
						className={cn(
							'font-medium italic',
							accentColor,
							accentClassName,
						)}
					>
						{accent}
					</span>
				</>
			)}
			{pill && (
				<>
					{' '}
					<span
						className={cn(
							'bg-coral text-paper inline-block -rotate-[2deg] rounded-pill px-4 pb-1 font-semibold italic',
							pillClassName,
						)}
					>
						{pill}
					</span>
				</>
			)}
			{after}
		</Tag>
	)
}
