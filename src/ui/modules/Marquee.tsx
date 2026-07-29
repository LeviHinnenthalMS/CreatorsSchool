import moduleProps from '@/lib/moduleProps'
import { cn } from '@/lib/utils'
import type { SanityModule } from '@/sanity/typeHelpers'
import type { CSSProperties } from 'react'

type Item = { _key?: string; text?: string | null; accent?: boolean | null }

type Props = SanityModule & {
	items?: Item[] | null
	durationSeconds?: number | null
}

export default function Marquee(props: Props) {
	const items = (props.items ?? []).filter((i) => i?.text)
	if (!items.length) return null

	const baseDuration = props.durationSeconds || 55
	const speed = {
		'--marquee-duration-mobile': `${Math.max(12, Math.round(baseDuration * 0.5))}s`,
		'--marquee-duration-desktop': `${Math.max(16, Math.round(baseDuration * 0.8))}s`,
	} as CSSProperties

	const renderRow = (key: string) => (
		<span
			key={key}
			className="font-display flex items-center gap-10 text-[clamp(20px,2.4vw,30px)] font-medium whitespace-nowrap max-sm:gap-6"
		>
			{items.map((item, i) => (
				<span
					key={`${key}-${i}`}
					className="flex items-center gap-10 max-sm:gap-6"
				>
					<span
						className={cn(item.accent && 'text-coral-soft font-medium italic')}
					>
						{item.text}
					</span>
					<span
						aria-hidden
						className="bg-coral-soft inline-block size-2.5 rounded-full"
					/>
				</span>
			))}
		</span>
	)

	return (
		<div
			{...moduleProps(props)}
			aria-hidden
			className="bg-ink text-paper mx-[clamp(20px,3.5vw,48px)] mt-[clamp(25px,3vw,45px)] mb-[clamp(50px,6vw,90px)] overflow-hidden rounded-full py-4"
		>
			<div
				className="offerings-marquee-speed anim-marquee flex w-max gap-10 max-sm:gap-6"
				style={speed}
			>
				{renderRow('a')}
				{renderRow('b')}
			</div>
		</div>
	)
}
