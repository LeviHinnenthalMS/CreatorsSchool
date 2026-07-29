import CTA from './CTA'
import { resolveCtaLabel } from '@/lib/resolveCtaLabel'
import { cn } from '@/lib/utils'
import type { SanityCTA } from '@/sanity/typeHelpers'
import type { ButtonSize, ButtonVariant } from './Button'

export default function CTAList({
	ctas,
	className,
	ctaClassName,
	variantOverrides,
	size,
	withArrow,
}: {
	ctas?: Array<SanityCTA | null> | null
	ctaClassName?: string
	variantOverrides?: Array<ButtonVariant | undefined>
	size?: ButtonSize
	withArrow?: boolean
} & React.ComponentProps<'div'>) {
	const visible: Array<{ cta: SanityCTA; index: number }> = []
	ctas?.forEach((cta, index) => {
		if (cta && cta.active !== false && resolveCtaLabel(cta)) {
			visible.push({ cta, index })
		}
	})

	if (!visible.length) return null

	return (
		<div className={cn('flex flex-wrap items-center gap-[.5em]', className)}>
			{visible.map(({ cta, index }) => (
				<CTA
					className={cn('max-sm:w-full', ctaClassName)}
					{...cta}
					key={cta._key ?? index}
					variantOverride={variantOverrides?.[index]}
					sizeOverride={size}
					withArrow={withArrow}
				/>
			))}
		</div>
	)
}
