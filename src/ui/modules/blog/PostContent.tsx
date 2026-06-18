import Link from 'next/link'
import { GoPerson } from 'react-icons/go'
import { stegaClean } from 'next-sanity'
import moduleProps from '@/lib/moduleProps'
import { Img } from '@/ui/Img'
import TableOfContents from '@/ui/modules/RichtextModule/TableOfContents'
import Content from '@/ui/modules/RichtextModule/Content'
import { cn } from '@/lib/utils'
import { BLOG_DIR } from '@/lib/env'
import { DEFAULT_LANG } from '@/lib/i18n'
import css from './PostContent.module.css'
import type { BLOG_POST_QUERY_RESULT } from '@/sanity/types'
import type { SanityModule } from '@/sanity/typeHelpers'

type Author = NonNullable<
	NonNullable<BLOG_POST_QUERY_RESULT>['authors']
>[number]

export default function PostContent({
	post,
	...props
}: { post?: BLOG_POST_QUERY_RESULT } & SanityModule) {
	if (!post) return null

	const showTOC = !post.hideTableOfContents || !!post.headings?.length
	const heroImage = post.metadata?.image
	const description = post.metadata?.description
	const lang = stegaClean(post.language ?? '') || undefined
	const blogPathname =
		lang && lang !== DEFAULT_LANG ? `/${lang}/${BLOG_DIR}` : `/${BLOG_DIR}`

	return (
		<article className="bg-canvas" {...moduleProps(props)}>
			{/* Hero — 2-col split when there's an image, centered when not */}
			<header className="section-pad-medium">
				<div className="mx-auto w-full max-w-xxlarge px-8 max-md:px-4">
					{heroImage?.asset ? (
						<div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
							<HeroText
								post={post}
								description={description}
								blogPathname={blogPathname}
								align="start"
							/>

							<div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg max-md:order-first">
								<Img
									image={heroImage}
									width={2000}
									sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
									className="absolute inset-0 size-full object-cover"
									loading="eager"
								/>
							</div>
						</div>
					) : (
						<HeroText
							post={post}
							description={description}
							blogPathname={blogPathname}
							align="center"
						/>
					)}
				</div>
			</header>

			<div className="mx-auto w-full max-w-xxlarge px-8 pb-module-gap max-md:px-4">
				<div
					className={cn(
						'mx-auto grid w-full max-w-large gap-8',
						showTOC && 'lg:max-w-xlarge lg:grid-cols-[1fr_auto]',
					)}
				>
					{showTOC && (
						<aside className="lg:sticky-below-header mx-auto w-full max-w-large self-start [--offset:1rem] lg:order-1 lg:w-3xs">
							<TableOfContents headings={post.headings} />
						</aside>
					)}

					<Content
						value={post.body}
						className={cn(css.body, 'grid w-full')}
					>
						<hr />
					</Content>
				</div>
			</div>
		</article>
	)
}

function HeroText({
	post,
	description,
	blogPathname,
	align,
}: {
	post: NonNullable<BLOG_POST_QUERY_RESULT>
	description?: string | null
	blogPathname: string
	align: 'start' | 'center'
}) {
	const dateText = formatDate(post.publishDate)
	const readTimeText = formatReadTime(post.readTime)

	return (
		<div
			className={cn(
				'flex w-full flex-col gap-6',
				align === 'center'
					? 'mx-auto max-w-large items-center text-center text-balance'
					: 'items-start text-start',
			)}
		>
			{(dateText || readTimeText) && (
				<p className="text-accent text-small font-semibold leading-normal">
					{[dateText, readTimeText].filter(Boolean).join(' • ')}
				</p>
			)}

			<h1
				className={cn(
					'h1 whitespace-pre-line',
					align === 'start' && 'text-balance',
				)}
			>
				{post.metadata?.title}
			</h1>

			{description && (
				<p className="text-accent-dark text-medium md:text-large leading-relaxed">
					{description}
				</p>
			)}

			{post.authors?.length ? (
				<ul
					className={cn(
						'mt-2 flex flex-col gap-4',
						align === 'center' && 'items-center',
					)}
				>
					{post.authors.map((author) => (
						<li key={author._id}>
							<AuthorRow
								author={author}
								blogPathname={blogPathname}
							/>
						</li>
					))}
				</ul>
			) : null}
		</div>
	)
}

function AuthorRow({
	author,
	blogPathname,
}: {
	author: Author
	blogPathname: string
}) {
	const role = stegaClean(author.role ?? '').trim()
	const slug = author.slug?.current

	const content = (
		<>
			<div className="bg-canvas-muted relative size-12 shrink-0 overflow-hidden rounded-full ring-1 ring-black/5">
				{author.image ? (
					<Img
						image={author.image}
						width={96}
						alt={author.name}
						className="size-full object-cover"
					/>
				) : (
					<GoPerson
						aria-hidden
						className="text-ink-muted absolute inset-0 m-auto size-6"
					/>
				)}
			</div>
			<div className="flex flex-col leading-tight">
				<span className="text-ink text-regular font-semibold">
					{author.name}
				</span>
				{role && (
					<span className="text-ink-muted text-small">{role}</span>
				)}
			</div>
		</>
	)

	if (slug) {
		return (
			<Link
				href={{
					pathname: blogPathname,
					query: { author: slug },
				}}
				className="group flex items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
			>
				{content}
			</Link>
		)
	}

	return <div className="flex items-center gap-3">{content}</div>
}

function formatDate(value?: string | null) {
	if (!value) return ''
	return new Date(value + 'T00:00:00').toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	})
}

function formatReadTime(value?: number | null) {
	if (!value || value <= 0) return ''
	const minutes = Math.ceil(value)
	return `${minutes} min read`
}
