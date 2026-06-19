import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Icon } from './Icon'

type Variant = 'coral' | 'ink' | 'outline' | 'ghost' | 'blush' | 'paper-outline'

const variants: Record<Variant, string> = {
	coral:
		'bg-coral text-paper shadow-[0_10px_28px_-10px_color-mix(in_srgb,var(--color-coral)_42%,transparent)] hover:shadow-[0_18px_38px_-12px_color-mix(in_srgb,var(--color-coral)_52%,transparent)]',
	ink: 'bg-ink text-paper',
	outline:
		'bg-transparent text-ink border border-ink hover:bg-ink hover:text-paper',
	ghost: 'bg-paper-2 text-ink',
	blush: 'bg-blush text-plum hover:bg-paper',
	'paper-outline':
		'bg-transparent text-paper border border-paper/40 hover:bg-paper hover:text-ink',
}

const arrowColors: Record<Variant, string> = {
	coral: 'bg-paper text-coral',
	ink: 'bg-coral-soft text-ink',
	outline: 'bg-ink text-paper',
	ghost: 'bg-ink text-paper-2',
	blush: 'bg-plum text-blush',
	'paper-outline': 'bg-paper text-ink',
}

export default function Btn({
	href,
	variant = 'coral',
	withArrow = true,
	children,
	className,
	type,
	onClick,
	disabled,
	target,
	rel,
	ariaLabel,
}: {
	href?: string
	variant?: Variant
	withArrow?: boolean
	children: React.ReactNode
	className?: string
	type?: 'button' | 'submit'
	onClick?: () => void
	disabled?: boolean
	target?: string
	rel?: string
	ariaLabel?: string
}) {
	const classes = cn('action-base', variants[variant], className)

	const content = (
		<>
			<span>{children}</span>
			{withArrow && (
				<span
					aria-hidden
					className={cn(
						'grid size-7 place-items-center rounded-full transition-transform duration-300',
						'group-hover/btn:-rotate-45',
						arrowColors[variant],
					)}
				>
					<Icon name="arrow" size={14} strokeWidth={2.5} />
				</span>
			)}
		</>
	)

	const sharedProps = {
		className: cn(classes, 'group/btn'),
		'aria-label': ariaLabel,
	}

	if (href) {
		const external = href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('https://wa.me')
		if (external) {
			return (
				<a
					href={href}
					target={target}
					rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
					{...sharedProps}
				>
					{content}
				</a>
			)
		}
		return (
			<Link href={href} {...sharedProps}>
				{content}
			</Link>
		)
	}

	return (
		<button type={type || 'button'} onClick={onClick} disabled={disabled} {...sharedProps}>
			{content}
		</button>
	)
}
