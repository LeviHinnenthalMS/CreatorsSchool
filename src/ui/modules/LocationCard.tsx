import moduleProps from '@/lib/moduleProps'
import { Img } from '@/ui/Img'
import { Icon } from '@/ui/creators/Icon'
import RichTitle from '@/ui/creators/RichTitle'
import Btn from '@/ui/creators/Btn'
import { stegaClean } from 'next-sanity'
import resolveUrl from '@/lib/resolveUrl'
import MapEmbed from './MapEmbed'
import { getSite } from '@/sanity/lib/queries'
import type { SanityImage, SanityLink, SanityModule } from '@/sanity/typeHelpers'

type Direction = {
	_key?: string
	icon?: string | null
	title?: string | null
	text?: string | null
}
type Block = { _type?: string; children?: Array<{ text?: string; marks?: string[] }> }

type Props = SanityModule & {
	eyebrow?: string | null
	title?: Block[] | null
	text?: string | null
	directions?: Direction[] | null
	mapEmbedUrl?: string | null
	mapImage?: SanityImage | null
	mapLink?: SanityLink | null
	mapLinkLabel?: string | null
}

function href(link?: SanityLink | null) {
	if (!link) return undefined
	if (link.type === 'internal') {
		if (link.internal) return resolveUrl(link.internal, { params: link.params ?? undefined })
		if (link.params) return stegaClean(link.params)
	}
	return link.external ?? undefined
}

export default async function LocationCard(props: Props) {
	const site = await getSite() as { mapEmbedUrl?: string | null }
	const mapHref = href(props.mapLink)
	const embedUrl = props.mapEmbedUrl ?? site.mapEmbedUrl

	return (
		<section
			{...moduleProps(props)}
			className="px-[clamp(8px,1.5vw,24px)] pb-[clamp(60px,7vw,100px)]"
		>
			<div className="bg-paper-2 border-line overflow-hidden rounded-band border md:grid md:grid-cols-[1fr_1.2fr]">
				<div className="flex flex-col justify-center p-[clamp(40px,5vw,70px)]">
					{props.eyebrow && (
						<span className="text-coral mb-4 inline-flex items-center gap-2 text-[12.5px] font-bold uppercase tracking-[0.08em]">
							<span aria-hidden className="bg-coral inline-block size-2 rounded-full" />
							{props.eyebrow}
						</span>
					)}
					<RichTitle
						title={props.title}
						as="h2"
						className="text-ink font-display m-0 text-[clamp(32px,4vw,52px)] font-bold leading-[1.02] -tracking-[0.025em]"
					/>
					{props.text && (
						<p className="text-ink-2 my-6 max-w-[42ch] text-[16px]">
							{props.text}
						</p>
					)}
					{props.directions && props.directions.length > 0 && (
						<div className="mb-8 grid gap-3.5">
							{props.directions.map((d, i) => (
								<div
									key={d._key ?? i}
									className="text-ink-2 grid grid-cols-[32px_1fr] items-start gap-3.5 text-[14.5px]"
								>
									<span className="bg-paper border-line text-coral grid size-8 shrink-0 place-items-center rounded-full border">
										<Icon name={d.icon || 'pin'} size={14} />
									</span>
									<span>
										{d.title && (
											<strong className="text-ink mb-0.5 block text-[14px] font-semibold">
												{d.title}
											</strong>
										)}
										{d.text}
									</span>
								</div>
							))}
						</div>
					)}
					{mapHref && (
						<Btn href={mapHref} variant="ink" target="_blank">
							{props.mapLinkLabel || 'Open in Maps'}
						</Btn>
					)}
				</div>

				<div className="from-warm-white to-paper-2 relative min-h-[320px] overflow-hidden bg-gradient-to-b md:min-h-[480px]">
					{embedUrl ? (
						<MapEmbed src={embedUrl} />
					) : props.mapImage ? (
						<Img
							image={props.mapImage}
							alt={props.mapImage.alt ?? ''}
							className="size-full object-cover"
							sizes="(min-width: 768px) 50vw, 100vw"
						/>
					) : (
						<div className="grid size-full place-items-center">
							<Icon name="pin" size={64} className="text-coral/40" />
						</div>
					)}
				</div>
			</div>
		</section>
	)
}
