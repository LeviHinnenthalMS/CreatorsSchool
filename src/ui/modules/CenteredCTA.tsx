import { PortableText } from 'next-sanity'
import moduleProps from '@/lib/moduleProps'
import CTAList from '@/ui/CTAList'
import type { SanityCTA, SanityModule } from '@/sanity/typeHelpers'

export default function CenteredCTA({
	title,
	intro,
	ctas,
	...props
}: Partial<{
	title: string
	intro: any
	ctas: SanityCTA[]
}> &
	SanityModule) {
	if (!title && !intro && !ctas?.length) return null

	return (
		<section
			className="bg-canvas section-pad-medium"
			{...moduleProps(props)}
		>
			<div className="mx-auto flex w-full max-w-xxlarge flex-col items-center gap-module-gap px-8 text-center text-balance max-md:px-4">
				{(title || intro) && (
					<div className="flex flex-col items-center gap-4 md:gap-5">
						{title && (
							<h2 className="font-display text-h4 font-medium leading-tight tracking-[-0.01em] whitespace-pre-line">
								{title}
							</h2>
						)}
						{intro && (
							<div className="text-ink-muted text-medium md:text-large">
								<PortableText value={intro} />
							</div>
						)}
					</div>
				)}

				{ctas?.length ? (
					<CTAList ctas={ctas} className="justify-center gap-3" />
				) : null}
			</div>
		</section>
	)
}
