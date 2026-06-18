'use client'

import {
	useEffect,
	useId,
	useRef,
	useState,
	type KeyboardEvent,
} from 'react'
import Link from 'next/link'
import { stegaClean } from 'next-sanity'
import moduleProps from '@/lib/moduleProps'
import resolveUrl from '@/lib/resolveUrl'
import { urlFor } from '@/sanity/lib/image'
import ModuleHeader from '@/ui/ModuleHeader'
import { ResponsiveImg } from '@/ui/Img'
import { cn } from '@/lib/utils'
import type {
	SanityImg,
	SanityLink,
	SanityModule,
} from '@/sanity/typeHelpers'

type TabVideo = {
	asset?: {
		url?: string | null
		mimeType?: string | null
	} | null
} | null

type Tab = {
	_key?: string
	title?: string | null
	subtitle?: string | null
	link?: SanityLink | null
	linkLabel?: string | null
	image?: SanityImg | null
	video?: TabVideo
}

export default function FeatureTabs({
	title,
	intro,
	tabsHeading,
	tabs,
	...props
}: Partial<{
	title: string
	intro: any
	tabsHeading: string
	tabs: Tab[]
}> &
	SanityModule) {
	const items = tabs ?? []
	const reactId = useId()
	const [activeIndex, setActiveIndex] = useState(0)
	const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
	const tabContainerRefs = useRef<Array<HTMLDivElement | null>>([])

	useEffect(() => {
		if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined')
			return

		const mql = window.matchMedia('(max-width: 767px)')
		let observer: IntersectionObserver | null = null

		const connect = () => {
			observer?.disconnect()
			observer = null
			if (!mql.matches) return

			observer = new IntersectionObserver(
				(entries) => {
					const visible = entries
						.filter((e) => e.isIntersecting)
						.map((e) =>
							Number((e.target as HTMLElement).dataset.tabIndex),
						)
						.filter((n) => !Number.isNaN(n))
					if (!visible.length) return
					setActiveIndex(Math.min(...visible))
				},
				{ rootMargin: '-35% 0px -55% 0px', threshold: 0 },
			)

			tabContainerRefs.current.forEach((el) => {
				if (el) observer!.observe(el)
			})
		}

		connect()
		mql.addEventListener('change', connect)
		return () => {
			observer?.disconnect()
			mql.removeEventListener('change', connect)
		}
	}, [items.length])

	if (!items.length) return null

	const safeIndex = Math.min(activeIndex, items.length - 1)
	const activeTab = items[safeIndex]
	const cleanHeading = stegaClean(tabsHeading ?? '').trim()
	const panelId = `${reactId}-panel`
	const tabId = (i: number) => `${reactId}-tab-${i}`

	const focusTab = (i: number) => {
		const next = (i + items.length) % items.length
		setActiveIndex(next)
		tabRefs.current[next]?.focus()
	}

	const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
		switch (e.key) {
			case 'ArrowDown':
			case 'ArrowRight':
				e.preventDefault()
				focusTab(i + 1)
				break
			case 'ArrowUp':
			case 'ArrowLeft':
				e.preventDefault()
				focusTab(i - 1)
				break
			case 'Home':
				e.preventDefault()
				focusTab(0)
				break
			case 'End':
				e.preventDefault()
				focusTab(items.length - 1)
				break
		}
	}

	return (
		<section
			className="bg-canvas section-pad-medium overflow-hidden"
			{...moduleProps(props)}
		>
			<div className="mx-auto w-full max-w-xxlarge px-8 max-md:px-4">
				<ModuleHeader
					title={title}
					intro={intro}
					align="start"
					className="mx-0 max-w-xlarge gap-5"
				/>

				<div className="mt-6 grid grid-cols-1 items-start gap-12 md:gap-16 lg:grid-cols-2 lg:items-center">
					<div className="flex w-full flex-col">
						{cleanHeading && (
							<p
								id={`${reactId}-heading`}
								className="text-large text-ink pb-5 font-semibold leading-relaxed"
							>
								{cleanHeading}
							</p>
						)}

						<div
							role="tablist"
							aria-orientation="vertical"
							aria-labelledby={
								cleanHeading ? `${reactId}-heading` : undefined
							}
							className="flex flex-col"
						>
							{items.map((tab, index) => {
								const isActive = index === safeIndex
								const cleanTitle = stegaClean(tab.title ?? '').trim()
								const cleanSubtitle = stegaClean(tab.subtitle ?? '').trim()
								return (
									<div
										key={tab._key ?? index}
										ref={(el) => {
											tabContainerRefs.current[index] = el
										}}
										data-tab-index={index}
										className="w-full"
									>
										<div
											className={cn(
												'flex flex-col gap-4 border-l-4 py-4 pl-6',
												'transition-colors duration-150 motion-reduce:transition-none',
												isActive
													? 'border-ink'
													: 'border-canvas-muted',
											)}
										>
											<button
												ref={(el) => {
													tabRefs.current[index] = el
												}}
												type="button"
												role="tab"
												id={tabId(index)}
												aria-selected={isActive}
												aria-controls={panelId}
												tabIndex={isActive ? 0 : -1}
												onClick={() => setActiveIndex(index)}
												onKeyDown={(e) => onTabKeyDown(e, index)}
												className={cn(
													'block w-full text-start',
													'rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent',
												)}
											>
												<span className="flex flex-col gap-1 leading-relaxed">
													{cleanTitle && (
														<span className="text-medium text-ink font-semibold">
															{cleanTitle}
														</span>
													)}
													{cleanSubtitle && (
														<span className="text-regular text-ink font-normal">
															{cleanSubtitle}
														</span>
													)}
												</span>
											</button>

											<TabLink tab={tab} />
										</div>
									</div>
								)
							})}
						</div>
					</div>

					<div
						id={panelId}
						role="tabpanel"
						aria-labelledby={tabId(safeIndex)}
						tabIndex={0}
						className="relative w-full overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent rounded-sm max-md:hidden"
					>
						<TabMedia key={safeIndex} tab={activeTab} />
					</div>
				</div>
			</div>
		</section>
	)
}

function TabMedia({ tab }: { tab?: Tab }) {
	if (!tab) return null

	const videoUrl = stegaClean(tab.video?.asset?.url ?? '').trim()
	const videoMime = stegaClean(tab.video?.asset?.mimeType ?? '').trim()
	const hasImage = !!tab.image?.image?.asset

	if (videoUrl) {
		const posterUrl = hasImage
			? urlFor(tab.image!.image!).width(2000).auto('format').url()
			: undefined

		return (
			<video
				src={videoUrl}
				poster={posterUrl}
				autoPlay
				loop
				muted
				playsInline
				preload="metadata"
				aria-hidden
				className="anim-slide-from-r motion-reduce:animate-none block h-auto w-full object-contain"
			>
				{videoMime && <source src={videoUrl} type={videoMime} />}
			</video>
		)
	}

	if (hasImage) {
		return (
			<ResponsiveImg
				img={tab.image!}
				width={2000}
				className="anim-slide-from-r motion-reduce:animate-none block h-auto w-full object-contain"
			/>
		)
	}

	return null
}

function TabLink({ tab }: { tab: Tab }) {
	const link = tab.link
	const type = stegaClean(link?.type ?? '')

	if (type !== 'internal' && type !== 'external') return null

	const href =
		type === 'internal' && link?.internal
			? resolveUrl(link.internal, {
					base: false,
					params: link.params ?? undefined,
					language: stegaClean(link.internal.language ?? '') || undefined,
				})
			: type === 'external' && link?.external
				? stegaClean(link.external)
				: undefined

	if (!href) return null

	const label =
		stegaClean(tab.linkLabel ?? '').trim() ||
		stegaClean(link?.label ?? '').trim() ||
		stegaClean(link?.internal?.title ?? '').trim()

	if (!label) return null

	const className = cn(
		'group/link inline-flex items-center gap-1.5 self-start',
		'text-regular font-semibold text-accent-darker',
		'underline-offset-2 hover:underline',
		'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent rounded-sm',
	)

	const content = (
		<>
			<span>{label}</span>
			<ArrowRight />
		</>
	)

	if (type === 'external') {
		return (
			<a
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				className={className}
			>
				{content}
			</a>
		)
	}

	return (
		<Link href={href} className={className}>
			{content}
		</Link>
	)
}

function ArrowRight() {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			aria-hidden="true"
			className="shrink-0 transition-transform duration-150 group-hover/link:translate-x-0.5 motion-reduce:transition-none"
		>
			<path
				d="M4.16667 10H15.8333M15.8333 10L10 4.16667M15.8333 10L10 15.8333"
				stroke="currentColor"
				strokeWidth="1.67"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
