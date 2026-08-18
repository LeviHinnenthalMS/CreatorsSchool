import moduleProps from '@/lib/moduleProps'
import getServerLang from '@/lib/getServerLang'
import { getSchedule } from '@/sanity/lib/creators'
import ScheduleFilter from './ScheduleFilter.client'
import { Icon } from '@/ui/creators/Icon'
import Button from '@/ui/Button'
import resolveUrl from '@/lib/resolveUrl'
import { stegaClean } from 'next-sanity'
import type { SanityLink, SanityModule } from '@/sanity/typeHelpers'

type Props = SanityModule & {
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
	noteTitle?: string | null
	noteText?: string | null
	noteLink?: SanityLink | null
	noteLinkLabel?: string | null
	emptyText?: string | null
}

function hrefFor(link?: SanityLink | null) {
	if (!link) return undefined
	if (link.type === 'internal') {
		if (link.internal)
			return resolveUrl(link.internal, { params: link.params ?? undefined })
		if (link.params) return stegaClean(link.params)
	}
	return link.external ?? undefined
}

export default async function ScheduleFull(props: Props) {
	const lang = await getServerLang()
	const slots = await getSchedule(lang)

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

	const noteHref = hrefFor(props.noteLink)

	return (
		<section
			{...moduleProps(props)}
			className="pb-[clamp(80px,9vw,130px)] pt-[clamp(40px,5vw,70px)]"
		>
			<div className="wrap">
				<ScheduleFilter
					slots={slots}
					filterLabels={filterLabels}
					statusLabels={statusLabels}
					layout="full"
					emptyText={props.emptyText ?? undefined}
				/>

				{(props.noteTitle || props.noteText) && (
					<div className="bg-coral-tint border-coral-soft mt-12 grid grid-cols-[60px_1fr_auto] items-center gap-6 rounded-card border p-8 max-md:grid-cols-[60px_1fr] max-sm:grid-cols-1">
						<div className="bg-coral text-paper grid size-15 place-items-center rounded-[18px]">
							<Icon name="sparkle" size={26} />
						</div>
						<div>
							{props.noteTitle && (
								<h3 className="text-ink font-display m-0 text-[22px] font-bold -tracking-[0.015em]">
									{props.noteTitle}
								</h3>
							)}
							{props.noteText && (
								<p className="text-ink-2 m-0 mt-1 max-w-[60ch] text-[14.5px]">
									{props.noteText}
								</p>
							)}
						</div>
						{noteHref && (
							<Button
								href={noteHref}
								external={props.noteLink?.type === 'external'}
								variant="ink"
								size="action"
								withArrow
								className="max-md:col-span-2 max-md:justify-self-start max-sm:col-span-1"
							>
								{props.noteLinkLabel || 'Kontakt aufnehmen'}
							</Button>
						)}
					</div>
				)}
			</div>
		</section>
	)
}
