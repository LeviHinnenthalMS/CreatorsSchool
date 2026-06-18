'use client'

import { useEffect, useRef, useState } from 'react'
import moduleProps from '@/lib/moduleProps'
import Icon from '@/ui/Icon'
import CTAList from '@/ui/CTAList'
import ModuleHeader from '@/ui/ModuleHeader'
import { cn } from '@/lib/utils'
import type { SanityModule, SanityIcon, SanityCTA } from '@/sanity/typeHelpers'

export default function StatsGrid({
	title,
	intro,
	stats,
	ctas,
	...props
}: Partial<{
	title: string
	intro: any
	stats: {
		_key: string
		icon?: SanityIcon | null
		value?: string | null
		label?: string | null
	}[]
	ctas: SanityCTA[]
}> &
	SanityModule) {
	const listRef = useRef<HTMLUListElement>(null)
	const [inView, setInView] = useState(false)

	useEffect(() => {
		const el = listRef.current
		if (!el || typeof IntersectionObserver === 'undefined') {
			setInView(true)
			return
		}
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setInView(true)
					observer.disconnect()
				}
			},
			{ rootMargin: '0px 0px -10% 0px' },
		)
		observer.observe(el)
		return () => observer.disconnect()
	}, [])

	return (
		<section
			className="bg-canvas section-pad-medium"
			{...moduleProps(props)}
		>
			<div className="mx-auto w-full max-w-xxlarge px-8 max-md:px-4">
				<ModuleHeader title={title} intro={intro} />

				{stats?.length ? (
					<ul
						ref={listRef}
						data-in-view={inView}
						className="group/stats mt-module-gap grid grid-cols-1 gap-x-8 gap-y-10 min-[450px]:grid-cols-2 md:gap-y-12 lg:grid-cols-4 max-md:mx-auto max-md:w-fit"
					>
						{stats.map(({ _key, icon, value, label }, i) => (
							<li
								key={_key}
								style={{ transitionDelay: `${i * 80}ms` }}
								className={cn(
									'flex items-start gap-4 max-md:w-fit',
									'opacity-0 translate-y-4',
									'transition-[opacity,transform] duration-500 ease-out',
									'group-data-[in-view=true]/stats:opacity-100 group-data-[in-view=true]/stats:translate-y-0',
									'motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none',
								)}
							>
								{icon && (
									<figure
										aria-hidden="true"
										className="bg-accent-lightest text-ink grid size-13 shrink-0 place-items-center rounded-full"
									>
										<div className="bg-accent-lighter grid size-10 place-items-center rounded-full">
											<Icon
												icon={{ ...icon, size: '24px' }}
												className="size-6 object-contain"
											/>
										</div>
									</figure>
								)}
								<div className="flex flex-col gap-3">
									{value && (
										<h3 className="h3 leading-none text-neutral-dark mt-1">{value}</h3>
									)}
									{label && (
										<span className="text-medium text-neutral-dark font-medium">
											{label}
										</span>
									)}
								</div>
							</li>
						))}
					</ul>
				) : null}

				{ctas?.length ? (
					<div className="mt-module-gap flex justify-center">
						<CTAList ctas={ctas} className="justify-center gap-3" />
					</div>
				) : null}
			</div>
		</section>
	)
}
