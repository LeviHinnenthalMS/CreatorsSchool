import moduleProps from '@/lib/moduleProps'
import { Img } from '@/ui/Img'
import ModuleHeader from '@/ui/ModuleHeader'
import type { SanityImage, SanityModule } from '@/sanity/typeHelpers'

export default function MeetTheTeam({
	title,
	titleMobile,
	intro,
	image,
	mobileImage,
	...props
}: Partial<{
	title: string
	titleMobile: string
	intro: string
	image: SanityImage
	mobileImage: SanityImage
}> &
	SanityModule) {
	return (
		<section
			className="bg-canvas section-pad-medium md:section-pad-large"
			{...moduleProps(props)}
		>
			<div className="mx-auto max-w-screen-xl px-8 max-md:px-4">
				<div
					className="rounded-3xl p-px"
					style={{ background: 'var(--color-accent-button)' }}
				>
					<div className="bg-canvas rounded-3xl px-6 py-10 md:px-12 md:py-14">
						<div className="mx-auto mb-8 max-w-2xl text-center">
							<ModuleHeader title={title ?? undefined} titleMobile={titleMobile ?? undefined} className="mb-4" />
							{intro && (
								<p className="text-medium text-ink/70 leading-relaxed">
									{intro}
								</p>
							)}
						</div>
						{!!image?.asset && (
							<>
								<Img
									image={image}
									alt={title ?? ''}
									width={2400}
									className={`h-auto w-full object-contain${mobileImage?.asset ? ' hidden md:block' : ''}`}
								/>
								{!!mobileImage?.asset && (
									<Img
										image={mobileImage}
										alt={title ?? ''}
										width={1600}
										className="h-auto w-full object-contain md:hidden"
									/>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}
