'use client'

import { usePathname } from 'next/navigation'
import { stegaClean } from 'next-sanity'
import resolveUrl from '@/lib/resolveUrl'
import CTA from '@/ui/CTA'
import LinkList from './LinkList'
import { cn } from '@/lib/utils'
import type { NAVIGATION_DOC_QUERY_RESULT } from '@/sanity/types'
import type { SanityLink } from '@/sanity/typeHelpers'

type NavItem = NonNullable<
	NonNullable<NAVIGATION_DOC_QUERY_RESULT>['items']
>[number]

function resolveNavHref(item: SanityLink): string | undefined {
	if (item.type === 'internal' && item.internal)
		return resolveUrl(item.internal as never, {
			base: false,
			language: stegaClean(item.internal.language ?? '') || undefined,
			params: item.params ?? undefined,
		})
	if (item.type === 'external' && item.external) return stegaClean(item.external)
	return undefined
}

function matchesPath(href: string | undefined, pathname: string): boolean {
	if (!href) return false
	if (href === '/' || href === '') return pathname === '/'
	return pathname === href || pathname.startsWith(href + '/')
}

export default function Navigation({ items }: { items: NavItem[] }) {
	const pathname = usePathname()

	const baseClassName = cn(
		'flex items-center gap-1 rounded-sm font-semibold text-ink transition-colors duration-150',
		'max-lg:w-full max-lg:justify-between max-lg:py-3 max-lg:text-regular max-lg:leading-6',
		'lg:px-2 lg:py-1 lg:text-regular lg:leading-6 lg:text-neutral-dark',
		'lg:hover:bg-canvas-muted lg:hover:text-ink',
		'focus-visible:bg-canvas-muted focus-visible:text-ink focus-visible:outline-none',
	)

	return (
		<nav
			className={cn(
				'flex [grid-area:nav]',
				'max-lg:flex-col max-lg:gap-1 max-lg:px-4 max-lg:py-2',
				'lg:items-center lg:justify-self-center lg:gap-3',
			)}
			aria-label="Main"
		>
			{items?.map((item, key) => {
				switch (item._type) {
					case 'link': {
						const link = item as unknown as SanityLink
						const href = resolveNavHref(link)
						const active = matchesPath(href, pathname)
						return (
							<CTA
								className={cn(
									baseClassName,
									active && [
										'!text-coral',
										'relative',
										'after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2',
										'after:h-[3px] after:w-[calc(100%-8px)] after:rounded-full after:bg-coral',
										'after:content-[""]',
									],
								)}
								link={item}
								key={key}
							/>
						)
					}

					case 'link.list': {
						const childActive = (item.links ?? []).some((l) =>
							matchesPath(resolveNavHref(l as SanityLink), pathname),
						)
						return (
							<LinkList
								summaryClassName={cn(
									baseClassName,
									childActive && '!text-coral',
								)}
								{...item}
								key={key}
							/>
						)
					}

					default:
						return null
				}
			})}
		</nav>
	)
}
