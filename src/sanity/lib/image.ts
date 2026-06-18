import {
	createImageUrlBuilder,
	type SanityImageSource,
} from '@sanity/image-url'
import { client } from '@/sanity/lib/client'

const builder = createImageUrlBuilder(client)

export function urlFor(image: SanityImageSource) {
	return builder.image(image)
}
