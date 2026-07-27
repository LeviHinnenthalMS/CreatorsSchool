import BlogCard from '@/ui/blog/BlogCard'
import { getBlogPosts } from '@/sanity/lib/blog'
import { BASE_URL } from '@/lib/env'
import { DEFAULT_LANG } from '@/lib/i18n'

export async function generateMetadata() {
	const posts = await getBlogPosts(DEFAULT_LANG)
	return {
		title: 'Blog | Creators School',
		description:
			'Neuigkeiten, Einblicke und Geschichten aus der Creators School.',
		alternates: { canonical: `${BASE_URL}/blog` },
		robots: { index: posts.length > 0 },
	}
}

export default async function BlogPage() {
	const posts = await getBlogPosts(DEFAULT_LANG)

	return (
		<>
			<section className="relative overflow-hidden pt-[calc(var(--header-height)+14px+clamp(42px,5vw,76px))] pb-[clamp(46px,6vw,80px)]">
				<span
					aria-hidden
					className="bg-coral-tint/70 pointer-events-none absolute -top-[24vw] -right-[16vw] -z-10 aspect-square w-[60vw] rounded-full blur-3xl"
				/>
				<div className="wrap">
					<span className="eyebrow">
						<span className="eyebrow-pip" />
						Creators School
					</span>
					<h1 className="h-display text-ink mt-5 max-w-[12ch]">
						Gedanken, Geschichten & Inspiration.
					</h1>
					<p className="text-charcoal mt-7 max-w-[58ch] text-[clamp(17px,1.5vw,20px)] leading-relaxed">
						Neuigkeiten, Einblicke und Geschichten aus der Creators School.
					</p>
				</div>
			</section>

			<section className="bg-paper-2 py-[clamp(52px,7vw,96px)]">
				<div className="wrap">
					{posts.length ? (
						<div className="grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
							{posts.map((post) => (
								<BlogCard key={post._id} post={post} />
							))}
						</div>
					) : (
						<div className="border-line bg-paper rounded-[24px] border p-10 text-center">
							<h2 className="text-ink font-display text-2xl font-semibold">
								Noch keine Artikel
							</h2>
							<p className="text-charcoal mt-2">
								Der erste Beitrag erscheint hier, sobald er veröffentlicht
								wurde.
							</p>
						</div>
					)}
				</div>
			</section>
		</>
	)
}
