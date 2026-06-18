import CTA from './CTA'
import { resolveCtaLabel } from '@/lib/resolveCtaLabel'
import { cn } from '@/lib/utils'
import type { SanityCTA } from '@/sanity/typeHelpers'

export default function CTAList({
	ctas,
	className,
	ctaClassName,
}: {
	ctas?: SanityCTA[] | null
	ctaClassName?: string
} & React.ComponentProps<'div'>) {
	const visible =
		ctas?.filter(
			(cta) => cta?.active !== false && !!resolveCtaLabel(cta),
		) ?? []

	if (!visible.length) return null

	return (
		<div className={cn('flex flex-wrap items-center gap-[.5em]', className)}>
			{visible.map((cta, key) => (
				<CTA
					className={cn('max-sm:w-full', ctaClassName)}
					{...cta}
					key={cta._key ?? key}
				/>
			))}
		</div>
	)
}
