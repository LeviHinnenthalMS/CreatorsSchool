import moduleProps from '@/lib/moduleProps'
import { cn } from '@/lib/utils'
import SectionHead from '@/ui/creators/SectionHead'
import type { SanityModule } from '@/sanity/typeHelpers'

type Testimonial = {
	_id?: string
	author?: { name?: string | null; role?: string | null } | null
	content?: unknown
}

type Props = SanityModule & {
	eyebrow?: string | null
	titleBefore?: string | null
	titleAccent?: string | null
	titleAfter?: string | null
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

export default function TestimonialCards(props: Props) {
	const items: Testimonial[] = (props.testimonials ?? [])
		.flatMap((t) => t?.items ?? [])
		.filter(Boolean) as Testimonial[]

	if (!items.length) return null

	return (
		<section
			{...moduleProps(props)}
			className="py-[clamp(80px,9vw,130px)]"
		>
			<div className="wrap">
				<SectionHead
					eyebrow={props.eyebrow}
					titleBefore={props.titleBefore}
					titleAccent={props.titleAccent}
					titleAfter={props.titleAfter}
					tagline={props.tagline}
				/>

				<div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
					{items.map((t, i) => {
						const tint = i % 2 === 0 ? 'coral' : 'soft'
						const quote = plainText(t.content)
						const name = t.author?.name
						const role = t.author?.role
						return (
							<article
								key={t._id ?? i}
								className={cn(
									'relative flex flex-col gap-6 rounded-card border p-8',
									tint === 'coral'
										? 'bg-blush border-coral-tint'
										: 'bg-warm-white border-line',
								)}
							>
								<div aria-hidden className="text-coral text-[15px] tracking-[2px]">
									★★★★★
								</div>
								<blockquote className="text-ink font-display m-0 text-[clamp(18px,1.5vw,21px)] font-medium leading-tight -tracking-[0.005em]">
									<span
										aria-hidden
										className="text-coral font-display mb-3 block text-[56px] leading-[0.3] italic"
									>
										&ldquo;
									</span>
									{quote}
								</blockquote>
								<div className="border-line-2 mt-auto flex items-center gap-3.5 border-t border-dashed pt-4.5">
									<div className="bg-paper border-line text-ink font-display grid size-11 place-items-center rounded-full border text-[16px] font-semibold">
										{name?.split(' ').map((p) => p[0]).join('').slice(0, 2)}
									</div>
									<div className="leading-tight">
										{name && (
											<div className="text-ink text-[15px] font-semibold">{name}</div>
										)}
										{role && (
											<div className="text-mute text-[12.5px]">{role}</div>
										)}
									</div>
								</div>
							</article>
						)
					})}
				</div>
			</div>
		</section>
	)
}
