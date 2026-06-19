import { stegaClean } from 'next-sanity'
import resolveUrl from '@/lib/resolveUrl'
import { resolveCtaLabel } from '@/lib/resolveCtaLabel'
import type { SanityCTA } from '@/sanity/typeHelpers'
import Btn from './Btn'

type Variant = React.ComponentProps<typeof Btn>['variant']

function hrefForCta(cta: SanityCTA): string | undefined {
	const link = cta.link
	if (link?.type === 'internal' && link.internal)
		return resolveUrl(link.internal, {
			base: false,
			params: link.params ?? undefined,
			language: stegaClean(link.internal.language ?? '') || undefined,
		})
	if (link?.type === 'external' && link.external) return stegaClean(link.external)
	if (link?.params) return stegaClean(link.params)
	return undefined
}

function variantForCta(cta: SanityCTA, fallback: Variant): Variant {
	const v = stegaClean(cta.variant ?? '') as string
	if (v === 'primary') return 'coral'
	if (v === 'secondary') return 'ink'
	if (v === 'tertiary') return 'outline'
	return fallback
}

export default function CTAs({
	ctas,
	variants = [],
	className,
}: {
	ctas?: Array<SanityCTA | null> | null
	variants?: Variant[]
	className?: string
}) {
	if (!ctas?.length) return null

	return (
		<div className={className ?? 'flex flex-wrap items-center gap-4'}>
			{ctas.map((cta, key) => {
				if (!cta || cta.active === false) return null
				const href = hrefForCta(cta)
				if (!href) return null
				const variant = variantForCta(cta, variants[key] ?? 'coral')
				const isExternal = cta.link?.type === 'external'
				const label = resolveCtaLabel(cta) || ''

				return (
					<Btn
						key={key}
						href={href}
						variant={variant}
						target={isExternal ? '_blank' : undefined}
					>
						{label}
					</Btn>
				)
			})}
		</div>
	)
}
