import Link from 'next/link'
import { Img } from '@/ui/Img'
import { GoPerson } from 'react-icons/go'
import { BLOG_DIR } from '@/lib/env'
import { DEFAULT_LANG } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { stegaClean } from 'next-sanity'
import type { Person } from '@/sanity/types'

export default function Authors({
	authors,
	skeleton,
	linked,
	language,
	...props
}: {
	authors?: Person[]
	skeleton?: boolean
	linked?: boolean
	language?: string | null
} & React.ComponentProps<'dl'>) {
	if (!authors?.length && !skeleton) return null

	return (
		<dl {...props}>
			{authors?.map((author) => (
				<Author
					author={author}
					key={author._id}
					linked={linked}
					language={language}
				/>
			))}

			{skeleton && <Author />}
		</dl>
	)
}

function Author({
	author,
	linked,
	language,
}: {
	author?: Person
	linked?: boolean
	language?: string | null
}) {
	const lang = stegaClean(language ?? '') || undefined
	const blogPathname =
		lang && lang !== DEFAULT_LANG ? `/${lang}/${BLOG_DIR}` : `/${BLOG_DIR}`
	const props = {
		className: cn(
			'flex items-center gap-[.5ch] hover:underline',
			!linked && 'pointer-events-none',
		),
		children: (
			<>
				<dd className="bg-accent/3 grid aspect-square w-[1.7em] shrink-0 place-content-center overflow-hidden rounded-lg">
					{author?.image ? (
						<Img
							className="aspect-square"
							image={author.image}
							width={60}
							alt={author.name}
						/>
					) : (
						<GoPerson className="text-accent/20 text-xl" />
					)}
				</dd>

				<dt>{author?.name}</dt>
			</>
		),
	}
	return linked ? (
		<Link
			href={{
				pathname: blogPathname,
				query: { author: author?.slug?.current },
			}}
			{...props}
		/>
	) : (
		<div {...props} />
	)
}
