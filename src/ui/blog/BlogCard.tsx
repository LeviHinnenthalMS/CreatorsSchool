import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Img } from '@/ui/Img'
import type { BlogPost } from '@/sanity/lib/blog'

export function formatBlogDate(value?: string | null) {
	if (!value) return null
	return new Intl.DateTimeFormat('de-DE', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	}).format(new Date(value))
}

export default function BlogCard({ post }: { post: BlogPost }) {
	const slug = post.slug?.current
	if (!slug) return null

	const date = formatBlogDate(post.publishedAt)

	return (
		<article className="group flex h-full flex-col">
			<Link
				href={`/blog/${slug}`}
				className="bg-paper-2 relative aspect-[4/3] overflow-hidden rounded-[24px]"
				aria-label={post.title || 'Blogartikel lesen'}
			>
				{!!post.coverImage?.asset ? (
					<Img
						image={post.coverImage}
						width={900}
						sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 33vw"
						className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
					/>
				) : (
					<span aria-hidden className="grain bg-coral-tint absolute inset-0" />
				)}
			</Link>

			<div className="flex flex-1 flex-col px-1 pt-5">
				{date && (
					<time
						dateTime={post.publishedAt || undefined}
						className="text-coral-deep mb-2 text-xs font-semibold uppercase tracking-[0.06em]"
					>
						{date}
					</time>
				)}
				<h2 className="text-ink font-display m-0 text-[clamp(22px,2.1vw,28px)] font-semibold leading-tight">
					<Link
						href={`/blog/${slug}`}
						className="inline-flex items-start gap-2 no-underline"
					>
						<span>{post.title}</span>
						<ArrowUpRight
							aria-hidden
							className="text-mute group-hover:text-coral mt-1 size-5 shrink-0 transition-colors"
						/>
					</Link>
				</h2>
				{post.excerpt && (
					<p className="text-charcoal mt-3 line-clamp-3 text-[15px] leading-relaxed">
						{post.excerpt}
					</p>
				)}
				{post.author?.name && (
					<div className="border-line mt-auto flex items-center gap-3 border-t pt-5">
						{!!post.author.image?.asset && (
							<Img
								image={post.author.image}
								width={72}
								alt={post.author.name}
								className="size-9 rounded-full object-cover"
							/>
						)}
						<span className="text-ink-2 text-sm font-semibold">
							{post.author.name}
						</span>
					</div>
				)}
			</div>
		</article>
	)
}
