import { PortableText, stegaClean } from 'next-sanity'
import { LuCircleX } from 'react-icons/lu'
import moduleProps from '@/lib/moduleProps'
import { cn } from '@/lib/utils'
import { Img } from '@/ui/Img'
import CTAList from '@/ui/CTAList'
import Tick from '@/ui/Tick'
import type { SanityCTA, SanityImage, SanityModule } from '@/sanity/typeHelpers'

type Card = {
	heading?: string | null
	items?: (string | null)[] | null
}

type PositiveCard = Card & {
	ctas?: SanityCTA[] | null
}

type Footnote = {
	image?: SanityImage | null
	text?: string | null
}

export default function ComparisonCards({
	title,
	intro,
	negativeCard,
	positiveCard,
	footnote,
	...props
}: Partial<{
	title: string
	intro: any
	negativeCard: Card
	positiveCard: PositiveCard
	footnote: Footnote
}> &
	SanityModule) {
	const negItems = (negativeCard?.items ?? []).filter(
		(v): v is string => !!v && !!stegaClean(v).trim(),
	)
	const posItems = (positiveCard?.items ?? []).filter(
		(v): v is string => !!v && !!stegaClean(v).trim(),
	)
	const footnoteText = stegaClean(footnote?.text ?? '').trim()

	return (
		<section className="bg-canvas" {...moduleProps(props)}>
			<div className="relative">
				{/* Dark band — absolutely positioned so cards can overlap it */}
				<div className="bg-ink absolute inset-x-0 top-0 h-[58%] md:h-[62%] max-md:bottom-0 max-md:h-auto" />

				<div className="relative mx-auto flex max-w-xxlarge flex-col items-center px-8 max-md:px-4 max-md:pb-16">
					<header className="mx-auto flex max-w-large flex-col items-center gap-4 pt-16 pb-32 text-center text-balance text-ink-inverse md:gap-5 md:pt-24 md:pb-54">
						{title && (
							<h2 className="font-display text-h2 leading-tight whitespace-pre-line">
								{title}
							</h2>
						)}
						{intro && (
							<div className="text-medium md:text-large text-ink-inverse/80">
								<PortableText value={intro} />
							</div>
						)}
					</header>

					<div className="-mt-24 grid w-full grid-cols-1 items-stretch gap-6 md:-mt-32 md:grid-cols-2 md:gap-8">
						<div className="flex flex-col">
							<ComparisonCard
								card={negativeCard}
								items={negItems}
								tone="negative"
								footnote={footnote}
							/>

							{(Boolean(footnote?.image?.asset) || footnoteText) && (
								<div className="mt-10 hidden items-center justify-center md:flex">
									{footnote?.image?.asset ? (
										<Img
											image={footnote.image}
											alt={footnote.image.alt ?? ''}
											className="h-10 w-auto shrink-0 md:h-20"
										/>
									) : null}
									{footnoteText && (
										<p className="text-small md:text-medium text-ink">
											{footnoteText}
										</p>
									)}
								</div>
							)}
						</div>

						<ComparisonCard
							card={positiveCard}
							items={posItems}
							tone="positive"
							ctas={positiveCard?.ctas ?? null}
						/>
					</div>
				</div>
			</div>

		</section>
	)
}

function ComparisonCard({
	card,
	items,
	tone,
	ctas,
	footnote,
}: {
	card?: Card | null
	items: string[]
	tone: 'negative' | 'positive'
	ctas?: SanityCTA[] | null
	footnote?: Footnote | null
}) {
	if (!card?.heading && items.length === 0) return null

	const footnoteText = stegaClean(footnote?.text ?? '').trim()
	const hasFootnote = Boolean(footnote?.image?.asset) || footnoteText

	return (
		<article
			className={cn(
				'bg-canvas flex flex-col h-fit rounded-md px-8 pt-10 pb-8 md:rounded-lg md:px-12 md:pt-14 md:pb-10',
				'shadow-lg',
				'ring-1 ring-ink/40',
			)}
		>
			{card?.heading && (
				<h3 className="font-display text-h3 text-ink text-center leading-tight">
					{card.heading}
				</h3>
			)}

			<div className="border-ink/30 mt-6 border-t md:mt-8" />

			<ul className="mt-6 flex flex-col gap-3 md:mt-8 md:gap-4">
				{items.map((item, i) => (
					<li
						key={i}
						className="text-ink/80 text-small md:text-medium flex items-start gap-3"
					>
						{tone === 'positive' ? (
							<Tick size="sm" className="mt-0.5" />
						) : (
							<LuCircleX
								className="text-ink/40 mt-0.5 size-5 shrink-0"
								aria-hidden
							/>
						)}
						<span>{stegaClean(item)}</span>
					</li>
				))}
			</ul>

			{hasFootnote && (
				<div className="mt-8 flex items-center justify-center gap-3 md:hidden">
					{footnote?.image?.asset ? (
						<Img
							image={footnote.image}
							alt={footnote.image.alt ?? ''}
							className="h-14 md:h-10 w-auto shrink-0"
						/>
					) : null}
					{footnoteText && (
						<p className="text-small text-ink">{footnoteText}</p>
					)}
				</div>
			)}

			{ctas && ctas.length > 0 && (
				<>
					<div className="border-ink/10 mt-8 border-t md:mt-10" />
					<CTAList ctas={ctas} className="mt-6 [&>*]:w-full md:mt-8" />
				</>
			)}
		</article>
	)
}
