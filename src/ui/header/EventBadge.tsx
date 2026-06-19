import Link from 'next/link'
import { Icon } from '@/ui/creators/Icon'
import resolveUrl from '@/lib/resolveUrl'
import type { SanityLink } from '@/sanity/typeHelpers'

type Props = {
	badge: {
		label?: string | null
		sub?: string | null
		link?: SanityLink | null
	}
}

function href(link?: SanityLink | null) {
	if (!link) return undefined
	if (link.type === 'internal' && link.internal) return resolveUrl(link.internal)
	return link.external ?? undefined
}

export default function EventBadge({ badge }: Props) {
	const url = href(badge.link)
	if (!badge.label && !badge.sub) return null

	const content = (
		<>
			<Icon name="stage" size={17} />
			<span className="flex flex-col leading-[1.04]">
				{badge.label && (
					<strong className="text-[13px] font-bold -tracking-[0.01em]">
						{badge.label}
					</strong>
				)}
				{badge.sub && (
					<small className="text-[10px] font-semibold uppercase tracking-[0.03em] opacity-80 max-xl:hidden">
						{badge.sub}
					</small>
				)}
			</span>
		</>
	)

	const cls =
		'bg-coral-tint text-coral-deep border-coral-tint hover:bg-coral hover:text-paper inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border px-4 py-2 text-[13px] no-underline transition-[background,color,transform] hover:-translate-y-px'

	return url ? (
		<Link href={url} className={cls}>
			{content}
		</Link>
	) : (
		<span className={cls}>{content}</span>
	)
}
