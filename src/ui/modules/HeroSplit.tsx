import { PortableText } from 'next-sanity'
import CTAList from '@/ui/CTAList'
import Asset from './Asset'
import CustomHTML from './CustomHTML'
import { ResponsiveImg } from '@/ui/Img'
import { cn } from '@/lib/utils'
import type {
	SanityCTA,
	SanityCode,
	SanityCustomHTML,
	SanityImg,
} from '@/sanity/typeHelpers'

export default function HeroSplit({
	title,
	eyebrowImage,
	content,
	ctas,
	assets,
	assetOnRight,
	assetBelowContent,
}: Partial<{
	title: string
	eyebrowImage: SanityImg
	content: any
	ctas: SanityCTA[]
	assets: Array<SanityImg | SanityCode | SanityCustomHTML>
	assetOnRight: boolean
	assetBelowContent: boolean
}>) {
	const asset = assets?.[0]

	return (
		<section className="section grid items-center gap-4 md:gap-8 overflow-hidden py-4 md:max-h-[calc(100svh-var(--header-height))] md:grid-cols-2 md:gap-x-12">
			<figure
				className={cn(
					asset?._type === 'img' &&
						// `max-h` is tied to the VIEWPORT (not to the grid cell)
						// because the cell grows with the image's natural size and
						// can't cap it. Subtract the section's md:py-12 (6rem total)
						// so the figure fits inside the section's content box.
						'flex h-full max-h-[50svh] md:max-h-[calc(100svh-var(--header-height)-2rem)] items-center justify-center overflow-hidden rounded-lg',
					assetOnRight && 'md:order-1',
					assetBelowContent && 'max-md:order-last',
				)}
			>
				<Asset asset={asset} />
			</figure>

			<div className="richtext headings:text-balance mx-auto w-full max-w-lg">
				{eyebrowImage?.image && (
					<ResponsiveImg
						img={eyebrowImage}
						width={400}
						sizes="300px"
						className="block h-auto w-auto max-h-8"
						pictureProps={{ className: 'mb-4 inline-block' }}
					/>
				)}
				{title && <h1 className="whitespace-pre-line leading-tight">{title}</h1>}
				<PortableText
					value={content}
					components={{
						types: {
							'custom-html': ({ value }) => <CustomHTML {...value} />,
						},
					}}
				/>
				<CTAList ctas={ctas} className="!mt-6" />
			</div>
		</section>
	)
}
