import moduleProps from '@/lib/moduleProps'
import { cn } from '@/lib/utils'
import { stegaClean } from 'next-sanity'
import { Img } from '@/ui/Img'
import GalleryVideo from './GalleryVideo.client'
import getServerLang from '@/lib/getServerLang'
import { getGallery } from '@/sanity/lib/creators'
import type { SanityModule } from '@/sanity/typeHelpers'

type Props = SanityModule & {
	bereich?: string | null
	emptyText?: string | null
}

const spanCls: Record<string, string> = {
	normal: '',
	wide: 'sm:col-span-2',
	tall: 'sm:row-span-2',
	big: 'sm:col-span-2 sm:row-span-2',
}

export default async function GalleryMasonry(props: Props) {
	const lang = await getServerLang()
	const all = await getGallery(lang)

	const filter = stegaClean(props.bereich || 'alle')
	const items =
		filter === 'alle' ? all : all.filter((g) => g.bereich === filter)

	return (
		<section
			{...moduleProps(props)}
			className="pt-[clamp(20px,3vw,40px)] pb-[clamp(50px,6vw,90px)]"
		>
			<div className="wrap">
				{items.length === 0 ? (
					<p className="text-mute text-center text-[15px]">
						{props.emptyText || 'Noch keine Bilder vorhanden.'}
					</p>
				) : (
					<div
						className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4"
						style={{ gridAutoFlow: 'dense' }}
					>
						{items.map((g) => {
							const span = stegaClean(g.span || 'normal')
							const spansTwoColumns = span === 'wide' || span === 'big'
							const imageSizes = spansTwoColumns
								? '(min-width: 1024px) 50vw, (min-width: 640px) 100vw, 100vw'
								: '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw'
							return (
								<figure
									key={g._id}
									className={cn(
										'bg-paper-2 relative m-0 overflow-hidden rounded-[18px]',
										spanCls[span] || '',
									)}
									style={{
										minHeight: span === 'tall' || span === 'big' ? 480 : 240,
									}}
								>
									{g.videoUrl ? (
										<>
											{g.poster?.asset && (
												<Img
													image={g.poster}
													decorative
													className="size-full object-cover"
													sizes={imageSizes}
												/>
											)}
											<GalleryVideo
												src={g.videoUrl}
												mimeType={g.mimeType}
												caption={g.caption}
												hasPoster={Boolean(g.poster?.asset)}
											/>
										</>
									) : g.image ? (
										<Img
											image={g.image}
											alt={g.caption || undefined}
											className="size-full object-cover"
											sizes={imageSizes}
										/>
									) : null}
								</figure>
							)
						})}
					</div>
				)}
			</div>
		</section>
	)
}
