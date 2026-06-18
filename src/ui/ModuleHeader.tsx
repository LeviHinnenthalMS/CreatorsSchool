import { PortableText } from 'next-sanity'
import { cn } from '@/lib/utils'

export default function ModuleHeader({
	title,
	titleMobile,
	intro,
	align = 'center',
	className,
	children,
}: {
	title?: string
	titleMobile?: string
	intro?: any
	align?: 'center' | 'start'
	className?: string
	children?: React.ReactNode
}) {
	if (!title && !intro && !children) return null

	return (
		<header
			className={cn(
				'mx-auto flex max-w-large flex-col gap-2 text-balance md:gap-5',
				align === 'center'
					? 'items-center text-center'
					: 'items-start text-start',
				className,
			)}
		>
			{title && (
				<h2 className={cn('font-display text-h2 leading-tight whitespace-pre-line', titleMobile && 'max-md:hidden')}>
					{title}
				</h2>
			)}
			{titleMobile && (
				<h2 className="font-display text-h2 leading-tight whitespace-pre-line md:hidden">
					{titleMobile}
				</h2>
			)}
			{intro && (
				<div className="text-accent-dark text-medium md:text-large">
					<PortableText value={intro} />
				</div>
			)}
			{children}
		</header>
	)
}
