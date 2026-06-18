import { PortableText, stegaClean } from 'next-sanity'
import moduleProps from '@/lib/moduleProps'
import { buildYouTubeEmbedSrc } from '@/lib/youtube'
import { cn } from '@/lib/utils'
import ModuleHeader from '@/ui/ModuleHeader'
import type { SanityModule } from '@/sanity/typeHelpers'

const SECTION_BG: Record<string, string> = {
	white: 'bg-canvas',
	'neutral-lightest': 'bg-canvas-muted',
	transparent: 'bg-transparent',
}

export default function VideoWithText({
	title,
	intro,
	youtubeUrl,
	body,
	background = 'white',
	...props
}: Partial<{
	title: string
	intro: any
	youtubeUrl: string
	body: any
	background: 'white' | 'neutral-lightest' | 'transparent'
}> &
	SanityModule) {
	const sectionBg = SECTION_BG[stegaClean(background)] ?? SECTION_BG.white
	const embedSrc = buildYouTubeEmbedSrc(stegaClean(youtubeUrl ?? ''))
	const cleanTitle = stegaClean(title ?? '').trim()

	return (
		<section
			className={cn('section-pad-medium md:section-pad-large', sectionBg)}
			{...moduleProps(props)}
		>
			<div className="mx-auto flex max-w-xxlarge flex-col items-center gap-10 px-8 max-md:px-4 md:gap-14">
				<ModuleHeader title={title} intro={intro} />

				{embedSrc && (
					<div className="bg-canvas-muted relative aspect-video w-full overflow-hidden rounded-lg md:rounded-4xl">
						<iframe
							src={embedSrc}
							title={cleanTitle || 'Video'}
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowFullScreen
							loading="lazy"
							referrerPolicy="strict-origin-when-cross-origin"
							className="absolute inset-0 h-full w-full border-0"
						/>
					</div>
				)}

				{body && (
					<div className="mx-auto flex max-w-large flex-col gap-4 text-balance text-center text-medium md:text-large">
						<PortableText value={body} />
					</div>
				)}
			</div>
		</section>
	)
}
