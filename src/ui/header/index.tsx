import { getSite, getNavigation } from '@/sanity/lib/queries'
import getServerLang from '@/lib/getServerLang'
import { DEFAULT_LANG } from '@/lib/i18n'
import Wrapper from './Wrapper'
import Link from 'next/link'
import { Img } from '@/ui/Img'
import Navigation from './Navigation'
import Toggle from './Toggle'
import EventBadge from './EventBadge'
import CTA from '@/ui/CTA'
import { cn } from '@/lib/utils'
import css from './Header.module.css'
import type { NAVIGATION_DOC_QUERY_RESULT } from '@/sanity/types'
import type { SanityCTA, SanityLink } from '@/sanity/typeHelpers'

type NavItem = NonNullable<
	NonNullable<NAVIGATION_DOC_QUERY_RESULT>['items']
>[number]

export default async function Header() {
	const site = (await getSite()) as {
		title?: string | null
		logo?: { name?: string | null; image?: { default?: unknown; dark?: unknown } } | null
		eventBadge?: {
			active?: boolean | null
			label?: string | null
			sub?: string | null
			link?: SanityLink | null
		} | null
	}
	const lang = await getServerLang()
	const nav = await getNavigation(lang)

	const items: NavItem[] = nav?.items ?? []
	const activeItems = items.filter(
		(i) => (i as { active?: boolean }).active !== false,
	)
	const navItems = activeItems.filter((i) => i._type !== 'cta')
	const ctaItems = activeItems.filter(
		(i): i is Extract<NavItem, { _type: 'cta' }> => i._type === 'cta',
	)

	const logoImage =
		(site.logo?.image as { dark?: unknown; default?: unknown } | undefined)?.dark ||
		(site.logo?.image as { dark?: unknown; default?: unknown } | undefined)?.default
	const homeHref = lang && lang !== DEFAULT_LANG ? `/${lang}` : '/'
	const eventBadgeActive = site.eventBadge?.active !== false

	return (
		<Wrapper className="z-100 fixed inset-x-0 top-3.5 lg:px-2">
			<div
				className={cn(
					css.header,
					'border-line bg-paper shadow-sm',
					'max-lg:flex max-lg:max-h-[100dvh] max-lg:w-full max-lg:flex-col max-lg:rounded-[32px] max-lg:border',
					'lg:mx-auto lg:max-w-wrap lg:items-center lg:gap-x-4 lg:rounded-pill lg:border lg:pl-6 lg:pr-3 lg:h-15',
				)}
			>
				<div className="max-lg:relative max-lg:z-10 max-lg:flex max-lg:h-18 max-lg:shrink-0 max-lg:items-center max-lg:gap-x-4 max-lg:bg-paper max-lg:px-5 lg:contents">
					<div className="[grid-area:logo] max-lg:me-auto">
						<Link
							className="grid"
							href={homeHref}
							aria-label={
								(site.logo?.name as string | undefined) ??
								(site.title as string | undefined) ??
								'Home'
							}
						>
							{logoImage ? (
								<Img
									className="inline-block h-9 w-auto max-lg:h-8"
									image={logoImage as never}
									alt={
										(site.logo?.name as string | undefined) ??
										(site.title as string | undefined) ??
										''
									}
								/>
							) : (
								<span className="font-display text-ink text-[20px] font-bold -tracking-[0.02em]">
									{site.title}
								</span>
							)}
						</Link>
					</div>

					<Toggle />
				</div>

				<div
					className={cn(
						'max-lg:fixed max-lg:inset-x-3 max-lg:top-[88px] max-lg:z-0',
						'max-lg:max-h-[calc(100dvh-100px)] max-lg:overflow-y-auto max-lg:overscroll-contain',
						'max-lg:flex max-lg:flex-col max-lg:bg-paper max-lg:rounded-[28px] max-lg:border max-lg:border-line max-lg:shadow-lg',
						'max-lg:transition-transform max-lg:duration-300 max-lg:ease-out motion-reduce:max-lg:transition-none',
						'max-lg:header-closed:-translate-y-[120%] max-lg:header-closed:pointer-events-none',
						'max-lg:header-open:translate-y-0',
						'lg:contents',
					)}
				>
					<Navigation items={navItems} />

					<div
						className={cn(
							'flex items-center [grid-area:ctas]',
							'max-lg:flex-col max-lg:items-stretch max-lg:gap-3 max-lg:border-t max-lg:border-line max-lg:px-5 max-lg:py-4',
							'lg:gap-2.5',
						)}
					>
						{eventBadgeActive && site.eventBadge && (
							<EventBadge badge={site.eventBadge} />
						)}
						{ctaItems.map((cta, key) => (
							<CTA
								{...(cta as SanityCTA)}
								size="small"
								className="max-lg:w-full"
								key={key}
							/>
						))}
					</div>
				</div>
			</div>
		</Wrapper>
	)
}
