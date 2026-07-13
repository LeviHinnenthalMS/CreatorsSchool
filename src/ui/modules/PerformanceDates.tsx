import moduleProps from '@/lib/moduleProps'
import { cn } from '@/lib/utils'
import { stegaClean } from 'next-sanity'
import Eyebrow from '@/ui/creators/Eyebrow'
import RichTitle from '@/ui/creators/RichTitle'
import type { SanityModule } from '@/sanity/typeHelpers'

type DateRow = {
	_key?: string
	date?: string | null
	sublabel?: string | null
	title?: string | null
	text?: string | null
}

type Block = { _type?: string; children?: Array<{ text?: string; marks?: string[] }> }

type Props = SanityModule & {
	eyebrow?: string | null
	title?: Block[] | null
	rows?: DateRow[] | null
	tinted?: boolean | null
}

export default function PerformanceDates(props: Props) {
	if (!props.rows?.length) return null
	const tinted = stegaClean(props.tinted ?? true)

	return (
		<section
			{...moduleProps(props)}
			className={cn(
				'py-[clamp(60px,7vw,100px)]',
				tinted && 'bg-warm-white',
			)}
		>
			<div className="wrap">
				{(props.eyebrow || props.title) && (
					<div className="mb-[clamp(40px,5vw,64px)]">
						{props.eyebrow && <Eyebrow>{props.eyebrow}</Eyebrow>}
						{props.title && (
							<RichTitle
								title={props.title}
								as="h2"
								className="text-ink font-display m-0 mt-3 text-[clamp(32px,4vw,58px)] font-bold leading-tight -tracking-[0.025em]"
							/>
						)}
					</div>
				)}

				<div className="flex flex-col divide-y divide-line">
					{props.rows.map((row, i) => (
						<div
							key={row._key ?? i}
							className="grid grid-cols-[160px_1fr] gap-x-[clamp(32px,4vw,64px)] py-[clamp(28px,3.5vw,44px)] sm:grid-cols-[200px_1fr]"
						>
							{/* Left: date + sublabel */}
							<div className="flex flex-col gap-1.5">
								{row.date && (
									<span className="text-coral font-display text-[17px] font-bold leading-tight">
										{row.date}
									</span>
								)}
								{row.sublabel && (
									<span className="text-mute text-[13px]">{row.sublabel}</span>
								)}
							</div>

							{/* Right: title + text */}
							<div>
								{row.title && (
									<h3 className="text-ink font-display m-0 mb-2 text-[20px] font-bold leading-tight -tracking-[0.01em]">
										{row.title}
									</h3>
								)}
								{row.text && (
									<p className="text-charcoal m-0 max-w-[60ch] text-[15px] leading-relaxed">
										{row.text}
									</p>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
