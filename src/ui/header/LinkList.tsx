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
				active?: boolean | null
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
				className={cn(
					summaryClassName,
					'group-hover:text-ink',
				)}
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

			{/*
			  Desktop: pt-3 transparent hover bridge, absolutely positioned, controlled by group-hover.
			  Mobile: inline expansion controlled by mobileOpen.
			*/}
			<div
				className={cn(
					// desktop
					'lg:absolute lg:top-full lg:left-0 lg:hidden lg:pt-3',
					'lg:group-hover:block lg:group-focus-within:block lg:group-hover:anim-fade-to-b motion-reduce:lg:group-hover:animate-none',
					// mobile
					'',
					mobileOpen ? 'max-lg:block' : 'max-lg:hidden',
				)}
			>
				<ul
					role="menu"
					className={cn(
						'border-border bg-canvas flex flex-col rounded-md border p-2 shadow-lg',
						'lg:min-w-80 lg:gap-1',
						'max-lg:my-2 max-lg:gap-2',
					)}
				>
					{links?.map((sublink, key) => sublink?.active === false ? null : (
						<li key={key} role="none">
							<CTA
								role="menuitem"
								className="hover:bg-canvas-muted flex items-start gap-3 rounded-sm p-3 transition-colors"
								link={sublink}
							>
								{sublink?.icon && (
									<img
										src={sublink.icon}
										alt=""
										aria-hidden
										className="text-ink-muted mt-0.5 h-5 w-auto shrink-0"
										height={20}
										loading="lazy"
									/>
								)}
								<span className="flex min-w-0 flex-col gap-0.5">
									<span className="text-ink text-regular leading-6 font-semibold">
										{sublink?.label || sublink?.internal?.title}
									</span>
									{sublink?.description && (
										<span className="text-ink-muted text-small leading-5 font-normal">
											{sublink.description}
										</span>
									)}
								</span>
							</CTA>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
