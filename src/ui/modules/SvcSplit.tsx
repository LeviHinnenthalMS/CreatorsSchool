import moduleProps from '@/lib/moduleProps'
import { cn } from '@/lib/utils'
import { stegaClean } from 'next-sanity'
import Eyebrow from '@/ui/creators/Eyebrow'
import AccentTitle from '@/ui/creators/AccentTitle'
import { Icon } from '@/ui/creators/Icon'
import type { SanityModule } from '@/sanity/typeHelpers'

type Item = { _key?: string; title?: string | null; text?: string | null }

type Props = SanityModule & {
	eyebrow?: string | null
	titleBefore?: string | null
	titleAccent?: string | null
	titleAfter?: string | null
	lead?: string | null
	tinted?: boolean | null
	items?: Item[] | null
}

export default function SvcSplit(props: Props) {
	const tinted = stegaClean(props.tinted ?? false)
	return (
		<section
			{...moduleProps(props)}
			className={cn(
				'py-[clamp(50px,6vw,90px)]',
				tinted && 'bg-warm-white',
			)}
		>
			<div className="wrap">
				<div className="grid gap-[clamp(32px,4vw,64px)] md:grid-cols-2">
					<div>
						{props.eyebrow && <Eyebrow>{props.eyebrow}</Eyebrow>}
						<AccentTitle
							as="h2"
							before={props.titleBefore}
							accent={props.titleAccent}
							after={props.titleAfter}
							className="text-ink h-sub mt-3"
						/>
						{props.lead && (
							<p className="text-charcoal mt-5 max-w-[50ch] text-[16.5px] leading-relaxed">
								{props.lead}
							</p>
						)}
					</div>

					{props.items && props.items.length > 0 && (
						<ul className="m-0 flex list-none flex-col gap-4 p-0">
							{props.items.map((it, i) => (
								<li
									key={it._key ?? i}
									className="flex items-start gap-3.5"
								>
									<span className="bg-coral-tint text-coral-deep mt-0.5 grid size-7 shrink-0 place-items-center rounded-full">
										<Icon name="check" size={13} strokeWidth={3} />
									</span>
									<span className="text-charcoal">
										{it.title && (
											<strong className="text-ink mb-0.5 block text-[15.5px] font-semibold">
												{it.title}
											</strong>
										)}
										<span className="text-[14.5px] leading-relaxed">{it.text}</span>
									</span>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</section>
	)
}
