import { PortableText, stegaClean } from 'next-sanity'
import moduleProps from '@/lib/moduleProps'
import { cn } from '@/lib/utils'
import CTAList from '@/ui/CTAList'
import ModuleHeader from '@/ui/ModuleHeader'
import { ResponsiveImg } from '@/ui/Img'
import Tick from '@/ui/Tick'
import type { SanityCTA, SanityImg, SanityModule } from '@/sanity/typeHelpers'

const SECTION_BG: Record<string, string> = {
	white: 'bg-canvas',
	'neutral-lightest': 'bg-canvas-muted',
	transparent: 'bg-transparent',
}

export default function ImageCallouts({
	title,
	intro,
	image,
	bottomVariant = 'checklist',
	checklist,
	bottomText,
	ctas,
	background = 'white',
	removeTopPadding,
	...props
}: Partial<{
	title: string
	intro: any
	image: SanityImg
	bottomVariant: 'none' | 'checklist' | 'text'
	checklist: (string | null)[]
	bottomText: any
	ctas: SanityCTA[]
	background: 'white' | 'neutral-lightest' | 'transparent'
	removeTopPadding: boolean
}> &
	SanityModule) {
	const sectionBg = SECTION_BG[stegaClean(background)] ?? SECTION_BG.white
	const variant = stegaClean(bottomVariant) ?? 'checklist'
	const noTopPad = !!stegaClean(removeTopPadding)

	const checks = (checklist ?? []).filter(
		(s): s is string => !!s && !!stegaClean(s).trim(),
	)

	return (
		<section
			className={cn(
				'section-pad-medium md:section-pad-large',
				// `pt-0!` (important) — `section-pad-*` writes to `padding-block`
				// which also targets the top, so a plain `pt-0` would lose the
				// cascade race. The `!` modifier forces the override.
				noTopPad && 'pt-0! md:pt-0!',
				sectionBg,
			)}
			{...moduleProps(props)}
		>
			<div className="mx-auto flex max-w-xxlarge flex-col items-center px-8 max-md:px-4">
				<ModuleHeader title={title} intro={intro} />

				{image?.image?.asset ? (
					<ResponsiveImg
						img={image}
						// 1800px = 2× the image's max CSS width (900px) for retina.
						width={1800}
						sizes="(min-width: 900px) 900px, 100vw"
						className="block h-auto w-full"
						pictureProps={{
							className: 'mt-module-gap mx-auto block w-full max-w-[900px]',
						}}
					/>
				) : null}

				{variant === 'checklist' && checks.length > 0 && (
					<ul className="mt-module-gap flex w-full max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-4">
						{checks.map((item, i) => (
							<li
								key={i}
								className="text-medium font-medium text-ink flex items-center gap-3 max-md:max-w-[290px] max-md:text-center"
							>
								<Tick size="md" />
								<span>{stegaClean(item)}</span>
							</li>
						))}
					</ul>
				)}

				{variant === 'text' && bottomText && (
					<div className="md:mt-module-gap mx-auto flex max-w-large flex-col gap-4 text-balance text-center text-medium md:text-large text-ink">
						<PortableText value={bottomText} />
					</div>
				)}

				<CTAList ctas={ctas} className="mt-module-gap justify-center gap-3" />
			</div>
		</section>
	)
}
