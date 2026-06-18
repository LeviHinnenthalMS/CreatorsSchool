import moduleProps from '@/lib/moduleProps'
import CTAList from '@/ui/CTAList'
import { Img } from '@/ui/Img'
import { PortableText } from 'next-sanity'

import type {
	SanityCTA,
	SanityImage,
	SanityModule,
} from '@/sanity/typeHelpers'

type LogoDoc = {
	_id?: string
	name?: string | null
	image?: {
		default?: SanityImage | null
		light?: SanityImage | null
		dark?: SanityImage | null
	} | null
}

const MARQUEE_REPEAT = 2

export default function SocialProofLogos({
	title,
	intro,
	logos,
	ctas,
	...props
}: Partial<{
	title: string
	intro: any
	logos: LogoDoc[]
	ctas: SanityCTA[]
}> &
	SanityModule) {
	const visible = logos?.filter((logo) => !!logo?.image?.default?.asset) ?? []
	if (!visible.length && !title && !intro) return null

	return (
		<section
			className="bg-canvas section-pad-medium md:section-pad-large overflow-hidden"
			{...moduleProps(props)}
		>
			<div className="mx-auto flex max-w-xxlarge flex-col items-center gap-module-gap px-8 max-md:px-4">
				
				{title && (
				<h2 className="font-display text-h3 leading-tight whitespace-pre-line">
					{title}
				</h2>
			)}
			{intro && (
				<div className="text-accent-dark text-medium md:text-large">
					<PortableText value={intro} />
				</div>
			)}
				{visible.length > 0 && (
					<div
						className="flex w-full flex-col items-center gap-y-4"
						style={{
							maskImage:
								'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
							WebkitMaskImage:
								'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
						}}
					>
						<div className="flex w-full motion-reduce:justify-center">
							{Array.from({ length: MARQUEE_REPEAT }, (_, stripIndex) => (
								<div
									key={stripIndex}
									className="anim-marquee flex shrink-0 items-center gap-10 pl-10 motion-reduce:animate-none md:gap-14 md:pl-14"
									aria-hidden={stripIndex > 0 ? 'true' : undefined}
								>
									{visible.map((logo, i) => {
										const image = logo.image?.dark ?? logo.image?.default
										if (!image?.asset) return null
										return (
											<Img
												key={`${stripIndex}-${logo._id ?? i}`}
												image={image}
												alt={logo.name ?? ''}
												height={80}
												className="h-8 w-auto shrink-0 object-contain opacity-85 md:h-10"
											/>
										)
									})}
								</div>
							))}
						</div>
					</div>
				)}

				{ctas?.length ? (
					<CTAList ctas={ctas} className="justify-center gap-3" />
				) : null}
			</div>
		</section>
	)
}
