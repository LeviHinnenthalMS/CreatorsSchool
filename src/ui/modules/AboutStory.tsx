import { PortableText, stegaClean } from 'next-sanity'
import moduleProps from '@/lib/moduleProps'
import { Img } from '@/ui/Img'
import type { SanityImage, SanityModule } from '@/sanity/typeHelpers'

type Milestone = {
	_key?: string
	year?: string | null
	image?: SanityImage | null
}

type InlineImage = SanityImage & {
	_key?: string
	caption?: string | null
	source?: string | null
}

export default function AboutStory({
	content,
	timeline,
	...props
}: Partial<{
	content: any
	timeline: Milestone[]
}> &
	SanityModule) {
	const hasContent = Array.isArray(content) && content.length > 0
	const milestones = (timeline ?? []).filter((m) => !!m?.image?.asset)
	const hasTimeline = milestones.length > 0

	if (!hasContent && !hasTimeline) return null

	return (
		<section
			className="bg-canvas section-pad-medium"
			{...moduleProps(props)}
		>
			<div className="mx-auto flex w-full max-w-large flex-col gap-module-gap px-8 max-md:px-4">
				{hasContent && (
					<div className="richtext space-y-6 [&>:first-child]:!mt-0">
						<PortableText
							value={content}
							components={{
								types: {
									image: StoryImage,
								},
							}}
						/>
					</div>
				)}

				{hasTimeline && (
					<ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
						{milestones.map((m, i) => (
							<Milestone milestone={m} key={m._key ?? i} />
						))}
					</ul>
				)}
			</div>
		</section>
	)
}

function StoryImage({ value }: { value: InlineImage }) {
	const caption = stegaClean(value.caption ?? '').trim()
	const source = stegaClean(value.source ?? '').trim()

	return (
		<figure className="my-8 space-y-2 first:mt-0">
			<Img
				image={value}
				width={1600}
				sizes="(max-width: 768px) 100vw, (max-width: 1280px) calc(100vw - 4rem), 1280px"
				className="block h-auto w-full rounded-md"
			/>
			{(caption || source) && (
				<figcaption className="text-ink-muted text-small italic">
					{caption}
					{source && (
						<>
							{caption ? ' (' : ''}
							<a
								href={source}
								target="_blank"
								rel="noopener noreferrer"
								className="link"
							>
								Source
							</a>
							{caption ? ')' : ''}
						</>
					)}
				</figcaption>
			)}
		</figure>
	)
}

function Milestone({ milestone }: { milestone: Milestone }) {
	const year = stegaClean(milestone.year ?? '').trim()
	const alt = stegaClean(milestone.image?.alt ?? '').trim() || year

	return (
		<li className="relative aspect-[3/4] overflow-hidden rounded-lg">
			<Img
				image={milestone.image}
				width={800}
				alt={alt}
				className="absolute inset-0 size-full object-cover"
			/>
			{year && (
				<>
					<div
						aria-hidden
						className="from-ink/60 absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t to-transparent"
					/>
					<span className="text-ink-inverse font-display absolute inset-x-0 bottom-4 text-center text-h3 font-medium leading-none md:bottom-6">
						{year}
					</span>
				</>
			)}
		</li>
	)
}
