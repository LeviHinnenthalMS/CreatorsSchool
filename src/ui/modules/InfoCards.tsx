import moduleProps from '@/lib/moduleProps'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { stegaClean } from 'next-sanity'
import { Icon } from '@/ui/creators/Icon'
import resolveUrl from '@/lib/resolveUrl'
import type { SanityLink, SanityModule } from '@/sanity/typeHelpers'

type Card = {
	_key?: string
	variant?: 'coral' | 'ink' | 'neutral' | null
	icon?: string | null
	label?: string | null
	value?: string | null
	small?: string | null
	link?: SanityLink | null
}

type Props = SanityModule & { cards?: Card[] | null }

function href(link?: SanityLink | null) {
	if (!link) return undefined
	if (link.type === 'internal' && link.internal) return resolveUrl(link.internal)
	return link.external ?? undefined
}

export default function InfoCards(props: Props) {
	if (!props.cards?.length) return null

	return (
		<section
			{...moduleProps(props)}
			className="py-[clamp(40px,5vw,70px)]"
		>
			<div className="wrap grid gap-4.5">
				{props.cards.map((c, i) => {
					const variant = stegaClean(c.variant || 'neutral') as
						| 'coral'
						| 'ink'
						| 'neutral'
					const ic =
						variant === 'coral'
							? 'bg-coral text-paper'
							: variant === 'ink'
								? 'bg-coral-soft text-ink'
								: 'bg-coral-tint text-coral-deep'

					const wrap = cn(
						'bg-paper border-line hover:border-coral grid grid-cols-[60px_1fr] items-center gap-5 rounded-card border p-7 no-underline transition-[transform,border-color] duration-300 hover:-translate-y-1',
						variant === 'ink' && 'bg-ink text-paper border-ink',
					)

					const inner = (
						<>
							<span className={cn('grid size-15 place-items-center rounded-[18px]', ic)}>
								<Icon name={c.icon} size={22} />
							</span>
							<div>
								{c.label && (
									<div
										className={cn(
											'text-mute text-[12px] font-semibold uppercase tracking-[0.08em]',
											variant === 'ink' && 'text-paper/60',
										)}
									>
										{c.label}
									</div>
								)}
								{c.value && (
									<div
										className={cn(
											'text-ink font-display mt-1.5 text-[22px] font-bold leading-tight -tracking-[0.015em]',
											variant === 'ink' && 'text-paper',
										)}
									>
										{c.value}
									</div>
								)}
								{c.small && (
									<div
										className={cn(
											'text-mute mt-1.5 text-[13.5px] font-normal',
											variant === 'ink' && 'text-paper/60',
										)}
									>
										{c.small}
									</div>
								)}
							</div>
						</>
					)

					const url = href(c.link)
					return url ? (
						<Link key={c._key ?? i} href={url} className={wrap}>
							{inner}
						</Link>
					) : (
						<div key={c._key ?? i} className={wrap}>
							{inner}
						</div>
					)
				})}
			</div>
		</section>
	)
}
