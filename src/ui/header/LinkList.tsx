'use client'

import { useState } from 'react'
import { CgChevronDown } from 'react-icons/cg'
import CTA from '@/ui/CTA'
import { cn } from '@/lib/utils'
import type { SanityLink } from '@/sanity/typeHelpers'

type LinkListInput = {
	link?: SanityLink | null
	links?: Array<
		| (SanityLink & {
				icon?: string | null
				description?: string | null
		  })
		| null
	> | null
	summaryClassName?: string
}

export default function LinkList({
	link,
	links,
	summaryClassName,
}: LinkListInput) {
	const [mobileOpen, setMobileOpen] = useState(false)

	return (
		<div className="group relative max-lg:w-full">
			<button
				type="button"
				aria-haspopup="menu"
				aria-expanded={mobileOpen}
				onClick={() => setMobileOpen((v) => !v)}
				className={cn(summaryClassName, 'group-hover:text-ink')}
			>
				{link?.label}
				<CgChevronDown
					className={cn(
						'size-4 shrink-0 transition-transform duration-200',
						'lg:group-hover:-rotate-180',
						mobileOpen && 'max-lg:-rotate-180',
					)}
					aria-hidden
				/>
			</button>

			<div
				className={cn(
					'lg:absolute lg:top-full lg:left-0 lg:hidden lg:pt-3',
					'lg:group-hover:block lg:group-focus-within:block lg:group-hover:anim-fade-to-b motion-reduce:lg:group-hover:animate-none',
					mobileOpen ? 'max-lg:block' : 'max-lg:hidden',
				)}
			>
				<ul
					role="menu"
					className={cn(
						'bg-paper flex flex-col rounded-2xl border border-line p-3 shadow-xl',
						'lg:min-w-80 lg:gap-1',
						'max-lg:my-2 max-lg:gap-2',
					)}
				>
					{links?.map((sublink, key) => (
						<li key={key} role="none">
							<CTA
								role="menuitem"
								className={cn(
									'group/row flex w-full items-start gap-3 rounded-xl px-4 py-3 transition-colors duration-150',
									key === 0
										? 'bg-coral-tint hover:bg-coral-deep'
										: 'hover:bg-warm-white',
								)}
								link={sublink}
							>
								{sublink?.icon && (
									<img
										src={sublink.icon}
										alt=""
										aria-hidden
										className="mt-0.5 h-5 w-auto shrink-0"
										height={20}
										loading="lazy"
									/>
								)}
								<span className="flex min-w-0 flex-col gap-0.5">
									<span
										className={cn(
											'text-regular leading-6 font-semibold transition-colors duration-150',
											key === 0
												? 'text-coral-deep group-hover/row:text-white'
												: 'text-ink group-hover/row:text-coral-deep',
										)}
									>
										{sublink?.label || sublink?.internal?.title}
									</span>
									</span>
							</CTA>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
