import CTA from '@/ui/CTA'
import LinkList from './LinkList'
import { cn } from '@/lib/utils'
import type { NAVIGATION_DOC_QUERY_RESULT } from '@/sanity/types'

type NavItem = NonNullable<
	NonNullable<NAVIGATION_DOC_QUERY_RESULT>['items']
>[number]

export default function Navigation({ items }: { items: NavItem[] }) {
	const itemClassName = cn(
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
					case 'link':
						return <CTA className={itemClassName} link={item} key={key} />

					case 'link.list':
						return (
							<LinkList summaryClassName={itemClassName} {...item} key={key} />
						)

					default:
						return null
				}
			})}
		</nav>
	)
}
