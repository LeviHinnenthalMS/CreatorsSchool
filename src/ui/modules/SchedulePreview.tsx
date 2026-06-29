import moduleProps from '@/lib/moduleProps'
import getServerLang from '@/lib/getServerLang'
import { getSchedule } from '@/sanity/lib/creators'
import SectionHead from '@/ui/creators/SectionHead'
import resolveUrl from '@/lib/resolveUrl'
import ScheduleFilter from './ScheduleFilter.client'
import { Icon } from '@/ui/creators/Icon'
import Link from 'next/link'
import type { SanityLink, SanityModule } from '@/sanity/typeHelpers'

type Block = { _type?: string; children?: Array<{ text?: string; marks?: string[] }> }

type Props = SanityModule & {
	eyebrow?: string | null
	title?: Block[] | null
	tagline?: string | null
	limit?: number | null
	footnote?: string | null
	link?: SanityLink | null
	linkLabel?: string | null
	filterLabels?: {
		all?: string | null
		musik?: string | null
		tanz?: string | null
		frueh?: string | null
		erwachsene?: string | null
	} | null
	statusLabels?: {
		open?: string | null
		few?: string | null
		full?: string | null
	} | null
}

export default async function SchedulePreview(props: Props) {
	const lang = await getServerLang()
	const slots = await getSchedule(lang)
	if (!slots.length) return null

	const limit = props.limit ?? 7
	const items = slots.slice(0, limit)

	const href =
		props.link?.type === 'internal' && props.link.internal
			? resolveUrl(props.link.internal)
			: (props.link?.external ?? undefined)

	const filterLabels = {
		all: props.filterLabels?.all || 'Alle',
		musik: props.filterLabels?.musik || 'Musik',
		tanz: props.filterLabels?.tanz || 'Tanz',
		frueh: props.filterLabels?.frueh || 'Frühförderung',
		erwachsene: props.filterLabels?.erwachsene || 'Erwachsene',
	}

	const statusLabels = {
		open: props.statusLabels?.open || 'Plätze frei',
		few: props.statusLabels?.few || 'Wenige Plätze',
		full: props.statusLabels?.full || 'Warteliste',
	}

	return (
		<section
			{...moduleProps(props)}
			className="pb-[clamp(80px,9vw,130px)] pt-[clamp(60px,7vw,100px)]"
		>
			<div className="wrap">
				<SectionHead
					eyebrow={props.eyebrow}
					title={props.title}
					tagline={props.tagline}
				/>

				<ScheduleFilter
					slots={items}
					filterLabels={filterLabels}
					statusLabels={statusLabels}
					layout="preview"
					detailHref={href}
				/>

				{(props.footnote || href) && (
					<div className="bg-paper-2 mt-0 flex flex-wrap items-center justify-between gap-4 rounded-b-panel px-7 py-4.5 text-[14px]">
						{props.footnote && (
							<span className="text-mute">{props.footnote}</span>
						)}
						{href && (
							<Link
								href={href}
								className="text-coral-deep hover:text-coral inline-flex items-center gap-1.5 font-semibold no-underline"
							>
								{props.linkLabel || 'Vollständigen Stundenplan ansehen'}
								<Icon name="arrow" size={13} strokeWidth={2.5} />
							</Link>
						)}
					</div>
				)}
			</div>
		</section>
	)
}
