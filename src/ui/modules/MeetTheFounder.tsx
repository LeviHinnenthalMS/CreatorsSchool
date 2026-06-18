import moduleProps from '@/lib/moduleProps'
import { Img } from '@/ui/Img'
import type { SanityImage, SanityModule } from '@/sanity/typeHelpers'

type FounderDoc = {
	name?: string | null
	bio?: string | null
	image?: SanityImage | null
}

export default function MeetTheFounder({
	title,
	founder,
	...props
}: Partial<{
	title: string
	founder: FounderDoc
}> &
	SanityModule) {
	if (!founder) return null

	return (
		<section
			className="bg-canvas section-pad-medium md:section-pad-large"
			{...moduleProps(props)}
		>
			<div className="mx-auto flex max-w-screen-lg flex-col items-center gap-8 px-8 max-md:px-4">
				{title && (
					<h2 className="font-display text-h2 text-center leading-tight">
						{title}
					</h2>
				)}
				<div className="bg-neutral/5 flex w-full flex-col items-center gap-6 rounded-2xl p-6 md:flex-row md:items-center md:gap-8 md:p-8">
					{!!founder.image?.asset && (
						<div className="w-full shrink-0 overflow-hidden rounded-xl md:w-48 md:rounded-xl">
							<Img
								image={founder.image}
								alt={founder.name ?? ''}
								width={384}
								className="h-64 w-full object-cover grayscale md:h-auto md:w-48"
							/>
						</div>
					)}
					{!!founder.image?.asset && founder.bio && (
						<div className="hidden self-stretch border-l border-current opacity-10 md:block" />
					)}
					{founder.bio && (
						<p className="text-medium text-ink/80 text-center leading-relaxed md:text-left">
							{founder.bio}
						</p>
					)}
				</div>
			</div>
		</section>
	)
}
