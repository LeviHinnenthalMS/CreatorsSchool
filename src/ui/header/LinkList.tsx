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
						'bg-paper flex flex-col',
						// desktop: floating card
						'lg:rounded-2xl lg:border lg:border-line lg:p-3 lg:shadow-xl lg:min-w-80 lg:gap-1',
						// mobile: flat inline list, indented with left accent
						'max-lg:pl-4 max-lg:border-l-2 max-lg:border-coral/25 max-lg:ml-1 max-lg:mb-2 max-lg:gap-0',
					)}
				>
					{links?.map((sublink, key) => (
						<li key={key} role="none" className="max-lg:border-0">
							<CTA
								role="menuitem"
								className={cn(
									'group/row flex w-full items-start gap-3 transition-colors duration-150',
									// desktop
									'lg:rounded-xl lg:px-4 lg:py-3',
									key === 0
										? 'lg:bg-coral-tint lg:hover:bg-coral-deep'
										: 'lg:hover:bg-warm-white',
									// mobile: simple text link
									'max-lg:py-3 max-lg:text-[15px] max-lg:font-medium',
								)}
								link={sublink}
							>
								{sublink?.icon && (
									<img
										src={sublink.icon}
										alt=""
										aria-hidden
										className="mt-0.5 h-5 w-auto shrink-0 max-lg:hidden"
										height={20}
										loading="lazy"
									/>
								)}
								<span className="flex min-w-0 flex-col gap-0.5">
									<span
										className={cn(
											'leading-6 font-semibold transition-colors duration-150',
											'lg:text-regular',
											key === 0
												? 'lg:text-coral-deep lg:group-hover/row:text-white'
												: 'lg:text-ink lg:group-hover/row:text-coral-deep',
											'max-lg:text-ink-2 max-lg:hover:text-coral',
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
