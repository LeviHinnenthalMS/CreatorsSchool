import { getSite, getNavigation } from '@/sanity/lib/queries'
import getServerLang from '@/lib/getServerLang'
import { DEFAULT_LANG } from '@/lib/i18n'
import Wrapper from './Wrapper'
import Link from 'next/link'
import { Img } from '@/ui/Img'
import Navigation from './Navigation'
import CTA from '@/ui/CTA'
import LanguageSwitcher from '@/ui/LanguageSwitcher'
import Toggle from './Toggle'
import { cn } from '@/lib/utils'
import css from './Header.module.css'
import type { NAVIGATION_DOC_QUERY_RESULT } from '@/sanity/types'
import type { SanityCTA } from '@/sanity/typeHelpers'

type NavItem = NonNullable<
	NonNullable<NAVIGATION_DOC_QUERY_RESULT>['items']
>[number]

export default async function Header() {
	const { title, logo } = await getSite()
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

	const logoImage = logo?.image?.dark || logo?.image?.default
	const homeHref = lang && lang !== DEFAULT_LANG ? `/${lang}` : '/'

	return (
		<Wrapper className="z-100 fixed inset-x-0 top-0 lg:px-4 lg:pt-4">
			<div
				className={cn(
					css.header,
					'border-border-strong bg-canvas',
					'max-lg:flex max-lg:max-h-[100dvh] max-lg:w-full max-lg:flex-col max-lg:border-b',
					'lg:mx-auto lg:max-w-7xl lg:items-center lg:gap-x-6 lg:rounded-md lg:border lg:px-8 lg:h-16',
				)}
			>
				<div className="max-lg:relative max-lg:z-10 max-lg:flex max-lg:h-18 max-lg:shrink-0 max-lg:items-center max-lg:gap-x-4 max-lg:bg-canvas max-lg:px-4 lg:contents">
					<div className="[grid-area:logo] max-lg:me-auto">
						<Link
							className={cn('grid', logo?.image && 'max-w-3xs')}
							href={homeHref}
							aria-label={logo?.name || title}
						>
							{logoImage ? (
								<Img
									className="inline-block h-8 w-auto max-lg:h-6"
									image={logoImage}
									alt={logo?.name || title}
								/>
							) : (
								<span className="h4 lg:h3 text-gradient">{title}</span>
							)}
						</Link>
					</div>

					<LanguageSwitcher className="hidden [grid-area:lang]" />

					<Toggle />
				</div>

				<div
					className={cn(
						// mobile: fixed overlay anchored under the top bar; height = content (capped)
						'max-lg:fixed max-lg:inset-x-0 max-lg:top-[72px] max-lg:z-0',
						'max-lg:max-h-[calc(100dvh-72px)] max-lg:overflow-y-auto max-lg:overscroll-contain',
						'max-lg:flex max-lg:flex-col max-lg:bg-canvas max-lg:border-b max-lg:border-border-strong max-lg:shadow-md',
						// slide-only animation
						'max-lg:transition-transform max-lg:duration-300 max-lg:ease-out motion-reduce:max-lg:transition-none',
						'max-lg:header-closed:-translate-y-full max-lg:header-closed:pointer-events-none',
						'max-lg:header-open:translate-y-0',
						'lg:contents',
					)}
				>
					<Navigation items={navItems} />

					{ctaItems.length > 0 && (
						<div
							className={cn(
								'flex items-center [grid-area:ctas]',
								'max-lg:flex-col max-lg:items-stretch max-lg:gap-3 max-lg:border-t max-lg:border-border max-lg:px-4 max-lg:py-4',
								'lg:gap-3',
							)}
						>
							{ctaItems.map((cta, key) => (
								<CTA
									{...(cta as SanityCTA)}
									size="small"
									className="max-lg:w-full"
									key={key}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</Wrapper>
	)
}
