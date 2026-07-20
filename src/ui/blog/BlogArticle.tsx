import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Img } from '@/ui/Img'
import Content from '@/ui/modules/RichtextModule/Content'
import { formatBlogDate } from './BlogCard'
import type { BlogPost } from '@/sanity/lib/blog'

export default function BlogArticle({ post }: { post: BlogPost }) {
	const date = formatBlogDate(post.publishedAt)
	const minutes = Math.max(1, Math.ceil(post.readTime || 1))

	return (
		<article>
			<header className="relative overflow-hidden pb-[clamp(44px,6vw,84px)] pt-[calc(var(--header-height)+14px+clamp(34px,5vw,72px))]">
				<span
					aria-hidden
					className="bg-coral-tint/60 pointer-events-none absolute -right-[12vw] -top-[12vw] -z-10 aspect-square w-[48vw] rounded-full blur-3xl"
				/>
				<div className="wrap">
					<Link
						href="/blog"
						className="text-coral-deep mb-8 inline-flex items-center gap-2 text-sm font-semibold no-underline hover:underline"
					>
						<ArrowLeft aria-hidden className="size-4" />
						Alle Artikel
					</Link>
					<div className="grid items-center gap-[clamp(36px,5vw,72px)] lg:grid-cols-[1.02fr_.98fr]">
						<div>
							<div className="text-coral-deep mb-5 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.06em]">
								{date && <time dateTime={post.publishedAt || undefined}>{date}</time>}
								{date && <span aria-hidden>·</span>}
								<span>{minutes} Min. Lesezeit</span>
							</div>
							<h1 className="h-display text-ink m-0 max-w-[18ch] text-balance">
								{post.title}
							</h1>
							{post.excerpt && (
								<p className="text-charcoal mt-7 max-w-[58ch] text-[clamp(17px,1.5vw,20px)] leading-relaxed">
									{post.excerpt}
								</p>
							)}
							{post.author?.name && (
								<div className="mt-7 flex items-center gap-3">
									{!!post.author.image?.asset && (
										<Img
											image={post.author.image}
											width={96}
											alt={post.author.name}
											className="size-12 rounded-full object-cover"
										/>
									)}
									<div className="flex flex-col">
										<span className="text-ink text-sm font-semibold">{post.author.name}</span>
										{post.author.role && <span className="text-mute text-xs">{post.author.role}</span>}
									</div>
								</div>
							)}
						</div>
						{!!post.coverImage?.asset && (
							<div className="bg-paper-2 relative aspect-[4/3] overflow-hidden rounded-[28px]">
								<Img
									image={post.coverImage}
									width={1400}
									sizes="(max-width: 1023px) 100vw, 48vw"
									loading="eager"
									className="absolute inset-0 size-full object-cover"
								/>
							</div>
						)}
					</div>
				</div>
			</header>

			<section className="border-line border-t py-[clamp(50px,7vw,96px)]">
				<div className="wrap">
					<Content
						value={post.body || []}
						className="max-w-[760px] text-[17px] leading-[1.75] md:grid md:grid-cols-[minmax(0,1fr)]"
					/>
				</div>
			</section>
		</article>
	)
}
