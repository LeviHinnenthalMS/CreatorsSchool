import { cn } from '@/lib/utils'
import { stegaClean } from 'next-sanity'

export default function Eyebrow({
	children,
	className,
	tone = 'coral',
}: {
	children?: React.ReactNode
	className?: string
	tone?: 'coral' | 'blush' | 'paper'
}) {
	if (!children) return null
	const t = stegaClean(tone) as 'coral' | 'blush' | 'paper'
	const colors =
		t === 'paper'
			? 'text-paper'
			: t === 'blush'
				? 'text-blush'
				: 'text-coral-deep'
	const pipBg =
		t === 'paper'
			? 'bg-paper'
			: t === 'blush'
				? 'bg-coral-soft'
				: 'bg-coral'
	const pipRing =
		t === 'paper'
			? 'shadow-[0_0_0_4px_rgba(255,255,255,0.18)]'
			: t === 'blush'
				? 'shadow-[0_0_0_4px_rgba(232,71,74,0.22)]'
				: 'shadow-[0_0_0_4px_var(--color-coral-tint)]'
	return (
		<span
			className={cn(
				'inline-flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-[0.06em]',
				colors,
				className,
			)}
		>
			<span
				aria-hidden
				className={cn(
					'inline-block size-2 shrink-0 rounded-full',
					pipBg,
					pipRing,
				)}
			/>
			{children}
		</span>
	)
}
