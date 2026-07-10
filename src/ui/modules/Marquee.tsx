import moduleProps from '@/lib/moduleProps'
import { cn } from '@/lib/utils'
import type { SanityModule } from '@/sanity/typeHelpers'

type Item = { _key?: string; text?: string | null; accent?: boolean | null }

type Props = SanityModule & {
	items?: Item[] | null
	durationSeconds?: number | null
}

export default function Marquee(props: Props) {
	const items = (props.items ?? []).filter((i) => i?.text)
	if (!items.length) return null

	const duration = `${props.durationSeconds || 55}s`

	const renderRow = (key: string) => (
		<span
			key={key}
			className="font-display flex items-center gap-14 whitespace-nowrap text-[clamp(20px,2.4vw,30px)] font-medium"
		>
			{items.map((item, i) => (
				<span key={`${key}-${i}`} className="flex items-center gap-14">
					<span
						className={cn(
							item.accent && 'text-coral-soft font-medium italic',
						)}
					>
						{item.text}
					</span>
					<span aria-hidden className="bg-coral-soft inline-block size-2.5 rounded-full" />
				</span>
			))}
		</span>
	)

	return (
		<div
			{...moduleProps(props)}
			aria-hidden
			className="bg-ink text-paper mx-[clamp(8px,1.5vw,24px)] my-[clamp(20px,4vw,40px)] overflow-hidden rounded-full py-4"
		>
			<div
				className="flex w-max gap-14 motion-reduce:animate-none"
				style={{ animation: `marquee ${duration} linear infinite` }}
			>
				{renderRow('a')}
				{renderRow('b')}
			</div>
		</div>
	)
}
