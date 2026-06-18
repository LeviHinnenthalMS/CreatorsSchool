'use client'

import { useRouter } from 'next/navigation'
import { CgArrowLeft } from 'react-icons/cg'
import { cn } from '@/lib/utils'

export default function GoBackButton({
	label,
	className,
}: {
	label: string
	className?: string
}) {
	const router = useRouter()

	return (
		<button
			type="button"
			onClick={() => router.back()}
			className={cn(
				'inline-flex select-none items-center justify-center whitespace-nowrap rounded-button font-semibold',
				'transition-[background-color,color,border-color] duration-150 motion-reduce:transition-none',
				'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
				'bg-canvas text-ink border-2 border-border-strong hover:bg-canvas-muted',
				'gap-[var(--btn-gap)] px-[var(--btn-lg-px)] py-[var(--btn-lg-py)] text-[length:var(--btn-lg-text)] leading-[var(--btn-lg-leading)]',
				className,
			)}
		>
			<CgArrowLeft
				aria-hidden
				className="size-[var(--btn-icon-size)] shrink-0"
			/>
			<span>{label}</span>
		</button>
	)
}
