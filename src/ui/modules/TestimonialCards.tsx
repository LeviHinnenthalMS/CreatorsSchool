import moduleProps from '@/lib/moduleProps'
import SectionHead from '@/ui/creators/SectionHead'
import type { SanityModule } from '@/sanity/typeHelpers'

type Testimonial = {
	_id?: string
	author?: { name?: string | null; role?: string | null } | null
	content?: unknown
}

type Block = {
	_type?: string
	children?: Array<{ text?: string; marks?: string[] }>
}

type Props = SanityModule & {
	eyebrow?: string | null
	title?: Block[] | null
	tagline?: string | null
	testimonials?: Array<{
		_key?: string
		items?: Testimonial[] | null
	} | null> | null
}

function plainText(node: unknown): string {
	if (!Array.isArray(node)) return ''
	return node
		.map((block) => {
			if (
				typeof block === 'object' &&
				block &&
				Array.isArray((block as { children?: unknown[] }).children)
			) {
				return ((block as { children: { text?: string }[] }).children || [])
					.map((c) => c.text || '')
					.join('')
			}
			return ''
		})
		.join('\n')
		.trim()
}

function Attribution({ author }: { author?: Testimonial['author'] }) {
	if (!author?.name && !author?.role) return null

	return (
		<footer className="mt-7 flex items-start gap-3">
			<span aria-hidden className="bg-coral mt-[0.65em] h-px w-8 shrink-0" />
			<div>
				{author.name && (
					<p className="text-ink m-0 text-[15px] font-semibold">
						{author.name}
					</p>
				)}
				{author.role && (
					<p className="text-mute mt-1 text-[12.5px] leading-relaxed">
						{author.role}
					</p>
				)}
			</div>
		</footer>
	)
}

export default function TestimonialCards(props: Props) {
	const items: Testimonial[] = (props.testimonials ?? [])
		.flatMap((t) => t?.items ?? [])
		.filter(Boolean) as Testimonial[]

	if (!items.length) return null

	return (
		<section {...moduleProps(props)} className="py-[clamp(44px,9vw,130px)]">
			<div className="wrap">
				<SectionHead
					eyebrow={props.eyebrow}
					title={props.title}
					tagline={props.tagline}
				/>

				<ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-3">
					{items.map((testimonial, index) => (
						<li key={testimonial._id ?? index}>
							<article className="border-line bg-paper flex h-full flex-col rounded-[18px] border p-6 shadow-sm sm:p-8">
								<div
									aria-hidden
									className="text-coral mb-5 text-[14px] tracking-[0.16em]"
								>
									★★★★★
								</div>
								<blockquote className="text-ink font-display m-0 text-[clamp(18px,1.6vw,22px)] leading-[1.4] font-medium -tracking-[0.008em]">
									<span aria-hidden>&ldquo;</span>
									{plainText(testimonial.content)}
									<span aria-hidden>&rdquo;</span>
								</blockquote>
								<div className="mt-auto">
									<Attribution author={testimonial.author} />
								</div>
							</article>
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}
