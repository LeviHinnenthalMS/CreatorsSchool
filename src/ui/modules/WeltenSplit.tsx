import moduleProps from '@/lib/moduleProps'
import { cn } from '@/lib/utils'
import SectionHead from '@/ui/creators/SectionHead'
import { Icon } from '@/ui/creators/Icon'
import resolveUrl from '@/lib/resolveUrl'
import Link from 'next/link'
import { stegaClean } from 'next-sanity'
import type { SanityLink, SanityModule } from '@/sanity/typeHelpers'
import { Img } from '@/ui/Img'
import type { SanityImage } from '@/sanity/typeHelpers'

type Card = {
	_key?: string
	variant?: 'musik' | 'tanz' | null
	eyebrow?: string | null
	title?: string | null
	subtitle?: string | null
	image?: SanityImage | null
	text?: string | null
	link?: SanityLink | null
	linkLabel?: string | null
}

type Block = { _type?: string; children?: Array<{ text?: string; marks?: string[] }> }

type Props = SanityModule & {
	eyebrow?: string | null
	title?: Block[] | null
	tagline?: string | null
	cards?: Card[] | null
}

function hrefFor(link?: SanityLink | null) {
	if (!link) return undefined
	if (link.type === 'internal') {
		if (link.internal) return resolveUrl(link.internal, { params: link.params ?? undefined })
		if (link.params) return stegaClean(link.params)
	}
	return link.external ?? undefined
}

export default function WeltenSplit(props: Props) {
	const { cards } = props
	if (!cards?.length) return null

	return (
		<section
			{...moduleProps(props)}
			className="py-[clamp(60px,7vw,100px)]"
		>
			<div className="wrap">
				<SectionHead
					eyebrow={props.eyebrow}
					title={props.title}
					tagline={props.tagline}
				/>

				<div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
					{cards.map((c, i) => {
						const variant = stegaClean(c.variant || 'musik') as 'musik' | 'tanz'
						const href = hrefFor(c.link)
						const dark = variant === 'tanz'

						const inner = (
							<>
								{c.eyebrow && (
									<span
										className={cn(
											'inline-flex items-center gap-2.5 self-start text-[12.5px] font-semibold uppercase tracking-[0.08em]',
											dark ? 'text-blush' : 'text-coral-deep',
										)}
									>
										<span
											aria-hidden
											className={cn(
												'inline-block size-2 rounded-full',
												dark ? 'bg-paper' : 'bg-coral',
											)}
										/>
										{c.eyebrow}
									</span>
								)}
								<div>
									{c.title && (
										<h3
											className={cn(
												'font-display m-0 text-[clamp(38px,4.6vw,60px)] font-semibold leading-none -tracking-[0.02em]',
												dark ? 'text-paper' : 'text-ink',
											)}
										>
											{c.title}
										</h3>
									)}
									{c.subtitle && (
										<p
											className={cn(
												'font-display mt-2.5 text-[clamp(17px,1.5vw,21px)] font-medium italic',
												dark ? 'text-paper/90' : 'text-charcoal',
											)}
										>
											{c.subtitle}
										</p>
									)}
								</div>
								{c.image?.asset && (
									<div className="w-full overflow-hidden rounded-2xl" style={{ aspectRatio: '4/3' }}>
										<Img
											image={c.image}
											alt={c.image.alt ?? ''}
											width={800}
											className="size-full object-cover"
										/>
									</div>
								)}
								{c.text && (
									<p
										className={cn(
											'm-0 max-w-[42ch] text-[15.5px] leading-relaxed',
											dark ? 'text-paper/85' : 'text-charcoal',
										)}
									>
										{c.text}
									</p>
								)}
								{c.linkLabel && (
									<span
										className={cn(
											'inline-flex items-center gap-3 text-[15px] font-semibold',
											dark ? 'text-paper' : 'text-ink',
										)}
									>
										{c.linkLabel}
										<span
											className={cn(
												'grid size-9 place-items-center rounded-full transition-transform duration-300',
												'group-hover/welt:-rotate-45',
												dark ? 'bg-paper text-coral' : 'bg-ink text-paper',
											)}
										>
											<Icon name="arrow" size={14} strokeWidth={2.5} />
										</span>
									</span>
								)}
							</>
						)

						const baseCls = cn(
							'group/welt relative flex min-h-[420px] max-sm:min-h-[240px] flex-col justify-between gap-5 md:gap-7 overflow-hidden rounded-[30px] border p-6 md:p-[clamp(34px,3.6vw,54px)] text-inherit no-underline transition-transform duration-500 hover:-translate-y-1.5',
							dark
								? 'bg-coral border-coral text-paper'
								: 'bg-warm-white border-line text-ink',
						)

						return href ? (
							<Link key={c._key ?? i} href={href} className={baseCls}>
								{dark && (
									<span
										aria-hidden
										className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_35%_at_110%_110%,rgba(255,255,255,0.22),transparent)]"
									/>
								)}
								{inner}
							</Link>
						) : (
							<div key={c._key ?? i} className={baseCls}>
								{inner}
							</div>
						)
					})}
				</div>
			</div>
		</section>
	)
}
