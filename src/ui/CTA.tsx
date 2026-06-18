'use client'

import Link from 'next/link'
import resolveUrl from '@/lib/resolveUrl'
import Button from './Button'
import { stegaClean } from 'next-sanity'
import { cn } from '@/lib/utils'
import { resolveCtaLabel } from '@/lib/resolveCtaLabel'
import type { ComponentProps } from 'react'
import type { SanityCTA } from '@/sanity/typeHelpers'

export { resolveCtaLabel }

export default function CTA({
	_type,
	_key,
	active,
	link,
	variant,
	size,
	icon,
	iconAspectRatio,
	iconHeight,
	iconPosition,
	className,
	children,
	...rest
}: SanityCTA & ComponentProps<'a'>) {
	if (active === false) return null

	const cleanVariant = stegaClean(variant) as SanityCTA['variant']
	const cleanSize = stegaClean(size) as SanityCTA['size']
	const cleanIconPosition = stegaClean(iconPosition) as SanityCTA['iconPosition']
	const cleanIcon = icon ? stegaClean(icon) : undefined
	const labelText = resolveCtaLabel({ link })

	if (!children && !labelText) return null

	const label =
		children ||
		link?.label ||
		link?.internal?.title ||
		link?.external

	const href =
		link?.type === 'internal' && link.internal
			? resolveUrl(link.internal, {
					base: false,
					params: link.params ?? undefined,
					language: stegaClean(link.internal.language ?? '') || undefined,
				})
			: link?.type === 'internal' && link.params
				? stegaClean(link.params)
				: link?.type === 'external' && link.external
					? stegaClean(link.external)
					: undefined

	if (cleanVariant) {
		if (!href) {
			return (
				<Button
					variant={cleanVariant}
					size={cleanSize ?? undefined}
					icon={icon ?? undefined}
					iconHeight={iconHeight ?? undefined}
					iconPosition={cleanIconPosition ?? undefined}
					className={className}
				>
					{label}
				</Button>
			)
		}
		return (
			<Button
				variant={cleanVariant}
				size={cleanSize ?? undefined}
				icon={cleanIcon}
				iconAspectRatio={iconAspectRatio ?? undefined}
				iconHeight={iconHeight ?? undefined}
				iconPosition={cleanIconPosition ?? undefined}
				href={href}
				external={link?.type === 'external'}
				className={className}
				{...(rest as Omit<ComponentProps<'a'>, 'href'>)}
			>
				{label}
			</Button>
		)
	}

	const props = {
		className: cn(className) || undefined,
		children: label,
		...rest,
	}

	if (link?.type === 'internal' && link.internal && href)
		return <Link href={href} {...props} />

	if (link?.type === 'external' && href)
		return <a href={href} {...props} />

	return <div {...(props as ComponentProps<'div'>)} />
}
