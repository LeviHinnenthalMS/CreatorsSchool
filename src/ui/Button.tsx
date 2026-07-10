import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { ComponentProps, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'pill' | 'pill-dark'
export type ButtonSize = 'small' | 'medium' | 'large'

const base =
	'inline-flex items-center justify-center whitespace-nowrap rounded-button font-semibold ' +
	'transition-[background-color,color,border-color] duration-150 motion-reduce:transition-none ' +
	'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ' +
	'disabled:pointer-events-none disabled:opacity-50 select-none'

const variants: Record<ButtonVariant, string> = {
	primary:
		'bg-accent text-ink-inverse border-2 border-accent hover:bg-transparent hover:text-accent',
	secondary:
		'bg-canvas text-ink border-2 border-border-strong hover:bg-canvas-muted',
	tertiary:
		'bg-transparent text-ink border-2 border-transparent hover:bg-canvas-muted',
	pill: 'bg-canvas text-ink border-2 border-line gap-0 pr-1 hover:bg-canvas-muted',
	'pill-dark': 'bg-ink text-ink-inverse gap-0 pr-1 hover:bg-ink/85',
}

const sizes: Record<ButtonSize, string> = {
	small:
		'gap-2 px-[var(--btn-sm-px)] py-[var(--btn-sm-py)] text-[length:var(--btn-sm-text)] leading-[var(--btn-sm-leading)]',
	medium:
		'gap-[var(--btn-gap)] px-[var(--btn-md-px)] py-[var(--btn-md-py)] text-[length:var(--btn-md-text)] leading-[var(--btn-md-leading)]',
	large:
		'gap-[var(--btn-gap)] px-[var(--btn-lg-px)] py-[var(--btn-lg-py)] text-[length:var(--btn-lg-text)] leading-[var(--btn-lg-leading)]',
}

const iconSizes: Record<ButtonSize, string> = {
	small: 'var(--btn-sm-icon-size)',
	medium: 'var(--btn-icon-size)',
	large: 'var(--btn-icon-size)',
}

function ButtonIcon({
	src,
	height,
	defaultHeight,
}: {
	src: string
	height?: number
	defaultHeight: string
}) {
	return (
		<img
			src={src}
			alt=""
			aria-hidden
			className="shrink-0 block w-auto"
			style={{ height: height ? `${height}px` : defaultHeight }}
		/>
	)
}

type StyleProps = {
	variant?: ButtonVariant
	size?: ButtonSize
	icon?: string
	iconAspectRatio?: number
	iconHeight?: number
	iconPosition?: 'leading' | 'trailing'
	className?: string
	children?: ReactNode
}

type AnchorProps = StyleProps & {
	href: string
	external?: boolean
} & Omit<ComponentProps<'a'>, keyof StyleProps | 'href'>

type ButtonElementProps = StyleProps & {
	href?: undefined
} & Omit<ComponentProps<'button'>, keyof StyleProps>

export type ButtonProps = AnchorProps | ButtonElementProps

export default function Button({
	variant = 'primary',
	size = 'medium',
	icon,
	iconAspectRatio,
	iconHeight,
	iconPosition = 'leading',
	className,
	children,
	...rest
}: ButtonProps) {
	const classes = cn(base, variants[variant], sizes[size], className)
	const defaultIconHeight = iconSizes[size]

	const content = (
		<>
			{icon && iconPosition === 'leading' && (
				<ButtonIcon
					src={icon}
					height={iconHeight}
					defaultHeight={defaultIconHeight}
				/>
			)}
			{children != null && <span>{children}</span>}
			{icon && iconPosition === 'trailing' && (
				<ButtonIcon
					src={icon}
					height={iconHeight}
					defaultHeight={defaultIconHeight}
				/>
			)}
			{(variant === 'pill' || variant === 'pill-dark') && (
				<span
					aria-hidden
					className={cn(
						'ml-3 shrink-0 flex items-center justify-center size-9 rounded-full',
						variant === 'pill' ? 'bg-accent text-ink-inverse' : 'bg-canvas text-ink',
					)}
				>
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
						<path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</span>
			)}
		</>
	)

	if ('href' in rest && rest.href) {
		const { href, external, ...anchorRest } = rest
		if (external) {
			return (
				<a
					href={href}
					className={classes}
					rel="noopener noreferrer"
					target="_blank"
					{...anchorRest}
				>
					{content}
				</a>
			)
		}
		return (
			<Link href={href} className={classes} {...anchorRest}>
				{content}
			</Link>
		)
	}

	return (
		<button type="button" className={classes} {...(rest as ComponentProps<'button'>)}>
			{content}
		</button>
	)
}
