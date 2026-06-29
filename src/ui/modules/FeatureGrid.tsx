import moduleProps from '@/lib/moduleProps'
import { cn } from '@/lib/utils'
import SectionHead from '@/ui/creators/SectionHead'
import { Icon } from '@/ui/creators/Icon'
import { stegaClean } from 'next-sanity'
import type { SanityModule } from '@/sanity/typeHelpers'

type Feature = {
	_key?: string
	tint?: 'coral' | 'soft' | null
	icon?: string | null
	title?: string | null
	text?: string | null
}

type Block = { _type?: string; children?: Array<{ text?: string; marks?: string[] }> }

type Props = SanityModule & {
	eyebrow?: string | null
	title?: Block[] | null
	tagline?: string | null
	features?: Feature[] | null
}

export default function FeatureGrid(props: Props) {
	const { features } = props
	if (!features?.length) return null

	return (
		<section
			{...moduleProps(props)}
			className="pb-[clamp(40px,5vw,60px)] pt-[clamp(80px,9vw,130px)]"
		>
			<div className="wrap">
				<SectionHead
					eyebrow={props.eyebrow}
					title={props.title}
					tagline={props.tagline}
				/>

				<div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
					{features.map((f, i) => {
						const tint = stegaClean(f.tint || 'soft') as 'coral' | 'soft'
						return (
							<article
								key={f._key ?? i}
								className={cn(
									'rounded-card border p-8 transition-[transform,border-color] duration-300 hover:-translate-y-1',
									tint === 'coral'
										? 'bg-blush border-coral-tint hover:border-coral-soft'
										: 'bg-warm-white border-line hover:border-line-2',
								)}
							>
								<div
									className={cn(
										'mb-5 grid size-14 place-items-center rounded-[16px]',
										tint === 'coral'
											? 'bg-paper text-coral'
											: 'bg-paper text-ink',
									)}
								>
									<Icon name={f.icon} size={26} />
								</div>
								{f.title && (
									<h3 className="text-ink font-display m-0 mb-2 text-[22px] font-semibold leading-tight -tracking-[0.01em]">
										{f.title}
									</h3>
								)}
								{f.text && (
									<p className="text-charcoal m-0 text-[14.5px] leading-relaxed">
										{f.text}
									</p>
								)}
							</article>
						)
					})}
				</div>
			</div>
		</section>
	)
}
