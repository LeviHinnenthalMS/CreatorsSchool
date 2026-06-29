import moduleProps from '@/lib/moduleProps'
import { cn } from '@/lib/utils'
import { stegaClean } from 'next-sanity'
import { Icon } from '@/ui/creators/Icon'
import SectionHead from '@/ui/creators/SectionHead'
import getServerLang from '@/lib/getServerLang'
import { getJobs } from '@/sanity/lib/creators'
import { getSite } from '@/sanity/lib/queries'
import type { SanityModule } from '@/sanity/typeHelpers'

type Block = { _type?: string; children?: Array<{ text?: string; marks?: string[] }> }

type Props = SanityModule & {
	eyebrow?: string | null
	title?: Block[] | null
	applyLabel?: string | null
	emptyText?: string | null
	tinted?: boolean | null
}

export default async function JobsList(props: Props) {
	const lang = await getServerLang()
	const [jobs, site] = await Promise.all([
		getJobs(lang),
		getSite() as Promise<{ email?: string | null }>,
	])

	const tinted = stegaClean(props.tinted ?? true)

	return (
		<section
			{...moduleProps(props)}
			className={cn(
				'py-[clamp(50px,6vw,90px)]',
				tinted && 'bg-warm-white',
			)}
		>
			<div className="wrap">
				<SectionHead eyebrow={props.eyebrow} title={props.title} />

				{jobs.length === 0 ? (
					<p className="text-mute text-[15px]">
						{props.emptyText || 'No open positions at the moment.'}
					</p>
				) : (
					<div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{jobs.map((j) => {
							const subject = j.applyEmailSubject
								? `?subject=${encodeURIComponent(stegaClean(j.applyEmailSubject))}`
								: ''
							const href = site.email
								? `mailto:${site.email}${subject}`
								: undefined
							return (
								<article
									key={j._id}
									className="bg-paper border-line rounded-card-sm border p-7"
								>
									<div className="bg-coral-tint text-coral-deep mb-4.5 grid size-[50px] place-items-center rounded-[14px]">
										<Icon name={j.icon || 'star'} size={24} />
									</div>
									{j.title && (
										<h3 className="text-ink font-display m-0 mb-2 text-[20px] font-semibold -tracking-[0.01em]">
											{j.title}
										</h3>
									)}
									{(j.type || j.location) && (
										<div className="text-mute mb-2 text-[12.5px] font-semibold uppercase tracking-[0.04em]">
											{[j.type, j.location].filter(Boolean).join(' · ')}
										</div>
									)}
									{j.summary && (
										<p className="text-charcoal m-0 text-[14.5px] leading-relaxed">
											{j.summary}
										</p>
									)}
									{href && (
										<a
											href={href}
											className="text-coral-deep mt-4 inline-flex items-center gap-2 text-[13.5px] font-semibold no-underline"
										>
											{props.applyLabel || 'Apply'}
											<Icon name="arrow" size={14} strokeWidth={2.5} />
										</a>
									)}
								</article>
							)
						})}
					</div>
				)}
			</div>
		</section>
	)
}
