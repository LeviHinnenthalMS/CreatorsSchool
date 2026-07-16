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
	heading?: string | null
	text?: string | null
}

type Block = { _type?: string; children?: Array<{ text?: string; marks?: string[] }> }

type Theme = 'light' | 'dark' | 'red'

type Props = SanityModule & {
	eyebrow?: string | null
	title?: Block[] | null
	tagline?: string | null
	features?: Feature[] | null
	theme?: Theme | null
	dark?: boolean | null
}

export default function FeatureGrid(props: Props) {
	const { features } = props
	if (!features?.length) return null

	const rawTheme = stegaClean(props.theme ?? null)
	// backward compat: dark:true → 'dark'
	const theme: Theme = rawTheme ?? (stegaClean(props.dark ?? false) ? 'dark' : 'light')

	const isDark = theme === 'dark'
	const isRed = theme === 'red'
	const isDecorated = isDark || isRed

	return (
		<section
			{...moduleProps(props)}
			className={cn(
				isDecorated
					? 'mb-[clamp(50px,6vw,90px)] mt-[clamp(25px,3vw,45px)] px-[clamp(20px,3.5vw,48px)]'
					: 'py-[clamp(40px,5vw,60px)]',
			)}
		>
			<div
				className={cn(
					'wrap',
					isDark && 'rounded-[36px] bg-ink p-6 md:px-[clamp(24px,4vw,64px)] md:py-[clamp(48px,6vw,80px)]',
					isRed && 'rounded-[36px] p-6 md:px-[clamp(24px,4vw,64px)] md:py-[clamp(48px,6vw,80px)]',
				)}
				style={isRed ? {
					background: 'radial-gradient(ellipse 55% 75% at 85% 15%, rgba(255,130,110,0.35) 0%, transparent 65%), var(--color-coral)',
				} : undefined}
			>
				<SectionHead
					eyebrow={props.eyebrow}
					title={props.title}
					tagline={props.tagline}
					tone={isDecorated ? 'paper' : 'coral'}
				/>

				<div
					className={cn(
						'flex gap-[14px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:overflow-visible',
						features.length >= 4 ? 'lg:grid-cols-4' : features.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2',
					)}
					style={{ scrollSnapType: 'x mandatory' }}
				>
					{features.map((f, i) => {
						if (isRed) {
							const [num, label] = (f.title ?? '').split(' · ')
							const idx = String(i + 1).padStart(2, '0')
							return (
								<article
									key={f._key ?? i}
									className="w-[80vw] shrink-0 lg:w-auto lg:shrink rounded-[18px] bg-white/10 p-6"
									style={{ scrollSnapAlign: 'start' }}
								>
									<div className="mb-4 inline-block rounded-full bg-black/20 px-3 py-1">
										<span className="font-body text-[12px] font-bold tracking-[0.04em] text-paper/80">
											{num || idx}
										</span>
									</div>
									<h3 className="font-display text-paper m-0 mb-2.5 text-[18px] font-bold leading-tight -tracking-[0.01em]">
										{label || f.title}
									</h3>
									{f.text && (
										<p className="m-0 text-[13.5px] leading-relaxed text-paper/65">
											{f.text}
										</p>
									)}
								</article>
							)
						}

						if (isDark) {
							const [num, label] = (f.title ?? '').split(' · ')
							return (
								<article
									key={f._key ?? i}
									className="w-[80vw] shrink-0 lg:w-auto lg:shrink rounded-[18px] border border-white/8 bg-white/5 p-6"
									style={{ scrollSnapAlign: 'start' }}
								>
									{f.title && (
										<p className="text-coral m-0 mb-3 text-[13px] font-bold tracking-[0.04em]">
											{num}{label ? <> / {label}</> : null}
										</p>
									)}
									{f.heading && (
										<h3 className="text-paper font-display m-0 mb-2.5 text-[19px] font-bold leading-tight -tracking-[0.01em]">
											{f.heading}
										</h3>
									)}
									{f.text && (
										<p className="m-0 text-[13.5px] leading-relaxed text-white/45">
											{f.text}
										</p>
									)}
								</article>
							)
						}

						// Light (default)
						const tint = stegaClean(f.tint || 'soft') as 'coral' | 'soft'
						return (
							<article
								key={f._key ?? i}
								className={cn(
									'w-[80vw] shrink-0 lg:w-auto lg:shrink rounded-card border p-8 max-sm:p-5 transition-[transform,border-color] duration-300 hover:-translate-y-1',
									tint === 'coral'
										? 'bg-blush border-coral-tint hover:border-coral-soft'
										: 'bg-warm-white border-line hover:border-line-2',
								)}
								style={{ scrollSnapAlign: 'start' }}
							>
								<div
									className={cn(
										'mb-5 grid size-14 place-items-center rounded-[16px]',
										tint === 'coral' ? 'bg-paper text-coral' : 'bg-paper text-ink',
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
