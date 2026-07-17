import { preload } from 'react-dom'
import {
	getImageDimensions,
	type SanityImageSource,
} from '@sanity/asset-utils'
import { urlFor } from '@/sanity/lib/image'
import NextImage, { getImageProps, type ImageProps } from 'next/image'
import { stegaClean } from 'next-sanity'
import type { ComponentProps } from 'react'
import type { SanityImage, SanityImg } from '@/sanity/typeHelpers'

type ImgProps = { alt?: string } & Omit<ImageProps, 'src' | 'alt'>

export function Img({
	image,
	width: w,
	height: h,
	loading: loadingProp,
	alt,
	decorative,
	...props
}: { image?: SanityImage | null; decorative?: boolean | null } & ImgProps) {
	if (!image?.asset) return null

	const { src, width, height } = generateSrc(image, w, h)

	const loading = stegaClean(loadingProp ?? image.loading) as
		| 'lazy'
		| 'eager'
		| undefined

	const isDecorative =
		stegaClean(decorative ?? image.decorative ?? undefined) === true
	const resolvedAlt = isDecorative
		? ''
		: (alt ?? image.alt ?? image.assetAlt ?? '')

	if (
		process.env.NODE_ENV !== 'production' &&
		!isDecorative &&
		alt === undefined &&
		!image.alt &&
		!image.assetAlt
	) {
		console.warn(
			'[Img] Rendering an image with no alt text. Pass `alt=""` explicitly ' +
				'for decorative images, set the alt field on the Sanity image, or ' +
				'set Alternative text on the asset in the Media library.',
			{ src },
		)
	}

	return (
		<NextImage
			src={src}
			width={width}
			height={height}
			placeholder={image.lqip ? 'blur' : undefined}
			blurDataURL={image.lqip ?? undefined}
			{...props}
			alt={resolvedAlt}
			loading={loading === 'eager' ? undefined : loading}
			priority={loading === 'eager'}
		/>
	)
}

export function Source({
	image,
	media = '(width < 48rem)',
	width: w,
	height: h,
	...props
}: {
	image?: SanityImage | null
} & ComponentProps<'source'>) {
	if (!image?.asset) return null

	const { src, width, height } = generateSrc(image, w, h)
	const { props: imageProps } = getImageProps({ src, width, height, alt: '' })

	if (stegaClean(image.loading) === 'eager') {
		preload(imageProps.src, { as: 'image' })
	}

	const cleanedMedia =
		typeof media === 'string' ? (stegaClean(media) as string) : media

	return (
		<source
			srcSet={imageProps.srcSet}
			width={imageProps.width}
			height={imageProps.height}
			media={cleanedMedia}
			{...props}
		/>
	)
}

export function ResponsiveImg({
	img,
	pictureProps,
	...props
}: {
	img?: SanityImg | null
	pictureProps?: ComponentProps<'picture'>
} & ImgProps) {
	if (!img) return null

	const { responsive, image, alt, loading, decorative } = img

	return (
		<picture {...pictureProps}>
			{responsive?.map(
				(r, key) =>
					r && (
						<Source
							image={r.image}
							media={r.media ?? undefined}
							key={key}
						/>
					),
			)}
			<Img
				image={image}
				alt={alt ?? undefined}
				decorative={decorative ?? undefined}
				loading={loading ?? undefined}
				{...props}
			/>
		</picture>
	)
}

function generateSrc(
	image: SanityImage,
	w?: number | `${number}` | string,
	h?: number | `${number}` | string,
) {
	const { width: w_orig, height: h_orig } = getImageDimensions(
		image as unknown as SanityImageSource,
	)

	const w_calc = !!w // if width is provided
		? Number(w)
		: // if height is provided, calculate width
			!!h && Math.floor((Number(h) * w_orig) / h_orig)

	const h_calc = !!h // if height is provided
		? Number(h)
		: // if width is provided, calculate height
			!!w && Math.floor((Number(w) * h_orig) / w_orig)

	return {
		src: urlFor(image)
			.withOptions({
				width: !!w ? Number(w) : undefined,
				height: !!h ? Number(h) : undefined,
				auto: 'format',
			})
			.url(),
		width: w_calc || w_orig,
		height: h_calc || h_orig,
	}
}
