import moduleProps from '@/lib/moduleProps'
import { cn } from '@/lib/utils'
import { stegaClean } from 'next-sanity'
import Eyebrow from '@/ui/creators/Eyebrow'
import AccentTitle from '@/ui/creators/AccentTitle'
import { Icon } from '@/ui/creators/Icon'
import type { SanityModule } from '@/sanity/typeHelpers'

type Card = {
	_key?: string
	icon?: string | null
	title?: string | null
	text?: string | null
}

type Props = SanityModule & {
	eyebrow?: string | null
	titleBefore?: string | null
	titleAccent?: string | null
	titleAfter?: string | null
	tinted?: boolean | null
	cards?: Card[] | null
}

export default function SvcLearn(props: Props) {
	if (!props.cards?.length) return null
	const tinted = stegaClean(props.tinted ?? true)

	return (
		<section
			{...moduleProps(props)}
			className={cn(
				'py-[clamp(50px,6vw,90px)]',
				tinted && 'bg-warm-white',
			)}
		>
			<div className="wrap">
				{props.eyebrow && <Eyebrow>{props.eyebrow}</Eyebrow>}
				<AccentTitle
					as="h2"
					before={props.titleBefore}
					accent={props.titleAccent}
					after={props.titleAfter}
					className="text-ink h-sub mt-3"
				/>

				<div className="mt-[clamp(36px,4vw,52px)] grid grid-cols-1 gap-4 md:grid-cols-3">
					{props.cards.map((c, i) => (
						<article
							key={c._key ?? i}
							className="bg-paper border-line rounded-card-sm border p-7"
						>
							<div className="bg-coral-tint text-coral-deep mb-4.5 grid size-[50px] place-items-center rounded-[14px]">
								<Icon name={c.icon} size={24} />
							</div>
							{c.title && (
								<h3 className="text-ink font-display m-0 mb-2 text-[20px] font-semibold -tracking-[0.01em]">
									{c.title}
								</h3>
							)}
							{c.text && (
								<p className="text-charcoal m-0 text-[14.5px] leading-relaxed">
									{c.text}
								</p>
							)}
						</article>
					))}
				</div>
			</div>
		</section>
	)
}
