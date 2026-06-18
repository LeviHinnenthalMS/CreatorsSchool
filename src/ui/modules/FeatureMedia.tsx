import moduleProps from '@/lib/moduleProps'
import ModuleHeader from '@/ui/ModuleHeader'
import CTAList from '@/ui/CTAList'
import { ResponsiveImg } from '@/ui/Img'
import type {
	SanityCTA,
	SanityImg,
	SanityModule,
} from '@/sanity/typeHelpers'

export default function FeatureMedia({
	title,
	intro,
	image,
	ctas,
	...props
}: Partial<{
	title: string
	intro: any
	image: SanityImg
	ctas: SanityCTA[]
}> &
	SanityModule) {
	return (
		<section
			className="bg-canvas section-pad-medium"
			{...moduleProps(props)}
		>
			<div className="mx-auto w-full max-w-xxlarge px-8 max-md:px-4">
				<div className="flex flex-col items-center gap-module-gap">
					<ModuleHeader
						title={title}
						intro={intro}
						className="max-w-xlarge"
					/>

					{image?.image && (
						<div className="rounded-lg max-w-5xl w-full overflow-hidden">
							<ResponsiveImg
								img={image}
								className="size-full object-cover"
								width={2000}
							/>
						</div>
					)}

					<CTAList ctas={ctas} className="justify-center gap-3" />
				</div>
			</div>
		</section>
	)
}
