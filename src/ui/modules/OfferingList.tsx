import moduleProps from '@/lib/moduleProps'
import { cn } from '@/lib/utils'
import { stegaClean } from 'next-sanity'
import Link from 'next/link'
import SectionHead from '@/ui/creators/SectionHead'
import { Icon } from '@/ui/creators/Icon'
import getServerLang from '@/lib/getServerLang'
import { getOfferings } from '@/sanity/lib/creators'
import { DEFAULT_LANG } from '@/lib/i18n'
import resolveUrl from '@/lib/resolveUrl'
import type { SanityLink, SanityModule } from '@/sanity/typeHelpers'
import OfferingCatalog from './OfferingCatalog'
import TanzCarousel from './TanzCarousel'

type Block = { _type?: string; children?: Array<{ text?: string; marks?: string[] }> }

type Props = SanityModule & {
	eyebrow?: string | null
	title?: Block[] | null
	tagline?: string | null
	bereich?: 'alle' | 'musik' | 'tanz' | null
	layout?: 'musik-pair' | 'tanz-grid' | 'prog' | 'catalog' | null
	tinted?: boolean | null
	cardCtaLabel?: string | null
	ctaTileTitle?: string | null
	ctaTileText?: string | null
	ctaTileLink?: SanityLink | null
	ctaTileLinkLabel?: string | null
	catalogKontaktLink?: SanityLink | null
}

function offeringHref(o: { slug?: string | null; language?: string | null }) {
	if (!o.slug) return '#'
	const lang = o.language && o.language !== DEFAULT_LANG ? `/${o.language}` : ''
	return `${lang}/angebote/${o.slug}`
}

export default async function OfferingList(props: Props) {
	const lang = await getServerLang()
	const all = await getOfferings(lang)
	const bereich = stegaClean(props.bereich || 'alle')
	const layout = stegaClean(props.layout || 'prog')
	const tinted = stegaClean(props.tinted ?? false)

	const byBereich =
		bereich === 'alle' ? all : all.filter((o) => o.bereich === bereich)

	// Stage card offerings (order >= 21) are home tanz-grid only
	// prog overview shows only the 8 main offerings (order <= 20)
	const items =
		layout === 'prog'
			? byBereich.filter((o) => !o.order || o.order <= 20)
			: byBereich

	if (!items.length) return null

	const ctaTileHref =
		props.ctaTileLink?.type === 'internal' && props.ctaTileLink.internal
			? resolveUrl(props.ctaTileLink.internal)
			: props.ctaTileLink?.external

	return (
		<section
			{...moduleProps(props)}
			className={cn(
				'py-[clamp(44px,8vw,120px)]',
				tinted && 'bg-warm-white',
			)}
		>
			<div className="wrap">
				<SectionHead
					eyebrow={props.eyebrow}
					title={props.title}
					tagline={props.tagline}
				/>

				{layout === 'musik-pair' && (
					<div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
						{items.slice(0, 2).map((o) => (
							<Link
								key={o._id}
								href={offeringHref(o)}
								className="bg-paper border-line hover:border-coral flex min-h-[300px] flex-col gap-4 rounded-[26px] border p-[clamp(28px,2.8vw,40px)] no-underline transition-colors"
							>
								<div className="flex flex-wrap gap-2">
									{o.facts?.slice(0, 2).map((f, i) => (
										<span
											key={f._key ?? i}
											className={cn(
												'border-line text-charcoal inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold',
												i === 0
													? 'bg-blush text-coral-deep border-coral-tint'
													: 'bg-paper-2',
											)}
										>
											{i === 0 && (
												<span aria-hidden className="bg-coral inline-block size-1.5 rounded-full" />
											)}
											{f.value}
										</span>
									))}
								</div>
								{o.title && (
									<h3 className="text-ink font-display m-0 text-[clamp(26px,2.6vw,34px)] font-semibold leading-[1.05] -tracking-[0.015em]">
										{o.title}
									</h3>
								)}
								{o.lede && (
									<p className="text-charcoal m-0 grow text-[15.5px] leading-relaxed">
										{o.lede}
									</p>
								)}
								{o.facts && o.facts.length > 2 && (
									<div className="border-line-2 mt-2 flex flex-col gap-2.5 border-t border-dashed pt-5">
										{o.facts.slice(2).map((f, i) => (
											<span
												key={f._key ?? i}
												className="text-coral-deep inline-flex items-center gap-2.5 text-[14px] font-semibold"
											>
												<span className="bg-blush flex size-6 shrink-0 items-center justify-center rounded-md">
													<Icon name="check" size={12} className="text-coral-deep" strokeWidth={2.5} />
												</span>
												{f.value}
											</span>
										))}
									</div>
								)}
							</Link>
						))}
					</div>
				)}

				{layout === 'tanz-grid' && (
					<TanzCarousel
						items={items}
						cardCtaLabel={props.cardCtaLabel}
						ctaTileHref={ctaTileHref}
						ctaTileTitle={props.ctaTileTitle}
						ctaTileText={props.ctaTileText}
						ctaTileLinkLabel={props.ctaTileLinkLabel}
					/>
				)}

				{layout === 'catalog' && (
					<OfferingCatalog
						items={items}
						kontaktHref={
							props.catalogKontaktLink?.type === 'internal' && props.catalogKontaktLink.internal
								? resolveUrl(props.catalogKontaktLink.internal)
								: '/kontakt'
						}
					/>
				)}

				{layout === 'prog' && (
					<div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
						{items.map((o) => (
							<Link
								key={o._id}
								href={offeringHref(o)}
								className="bg-paper border-line hover:border-coral group/prog relative flex min-h-[270px] flex-col gap-3.5 overflow-hidden rounded-card border p-6 text-ink no-underline transition-[transform,border-color] duration-300 hover:-translate-y-1"
							>
								{o.facts?.[0]?.value && (
									<span className="bg-paper-2 text-ink-2 border-line inline-flex items-center gap-2 self-start rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold">
										<span aria-hidden className="bg-coral inline-block size-1.5 rounded-full" />
										{o.facts[0].value}
									</span>
								)}
								{o.title && (
									<h3 className="text-ink font-display m-0 text-[22px] font-bold leading-tight -tracking-[0.02em]">
										{o.title}
									</h3>
								)}
								{o.lede && (
									<p className="text-mute m-0 text-[14px] leading-relaxed">
										{o.lede}
									</p>
								)}
								<div className="border-line-2 mt-auto flex items-center justify-between border-t border-dashed pt-4">
									<span className="text-mute text-[12.5px] font-semibold">
										{o.bereich === 'musik' ? 'Music' : 'Dance'}
									</span>
									<span
										aria-hidden
										className="bg-paper-2 text-ink grid size-9 place-items-center rounded-full transition-[background,color,transform] duration-300 group-hover/prog:bg-coral group-hover/prog:text-paper group-hover/prog:-rotate-45"
									>
										<Icon name="arrow" size={14} strokeWidth={2.5} />
									</span>
								</div>
							</Link>
						))}
					</div>
				)}
			</div>
		</section>
	)
}
