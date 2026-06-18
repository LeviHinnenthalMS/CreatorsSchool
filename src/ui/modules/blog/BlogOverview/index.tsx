'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { PortableText, stegaClean } from 'next-sanity'
import { useQueryState, parseAsInteger } from 'nuqs'
import { LuSearch, LuArrowUpRight, LuChevronDown, LuArrowLeft, LuArrowRight } from 'react-icons/lu'
import { Img } from '@/ui/Img'
import moduleProps from '@/lib/moduleProps'
import resolveUrl from '@/lib/resolveUrl'
import { cn } from '@/lib/utils'
import type { Person } from '@/sanity/types'
import type { SanityImage, SanityModule } from '@/sanity/typeHelpers'

type TopicRef = {
	_id?: string
	name?: string | null
}

type OverviewPost = {
	_id: string
	_type?: string
	publishDate?: string | null
	featured?: boolean | null
	language?: string | null
	metadata?: {
		title?: string | null
		description?: string | null
		slug?: { current?: string | null } | null
		image?: SanityImage | null
	} | null
	authors?: Array<Person | null> | null
	topics?: Array<TopicRef | null> | null
}

type SortMode = 'recent' | 'oldest'

type Props = Partial<{
	title: string
	intro: any
	itemsPerPage: number
	searchPlaceholder: string
	viewAllLabel: string
	mostRecentLabel: string
	oldestFirstLabel: string
	sortAriaLabel: string
	emptyLabel: string
	previousLabel: string
	nextLabel: string
	posts: OverviewPost[]
	topics: TopicRef[]
}> &
	SanityModule

export default function BlogOverview({
	title,
	intro,
	itemsPerPage = 9,
	searchPlaceholder = 'Search',
	viewAllLabel = 'View all',
	mostRecentLabel = 'Most recent',
	oldestFirstLabel = 'Oldest first',
	sortAriaLabel = 'Sort posts',
	emptyLabel = 'No posts found.',
	previousLabel = 'Previous',
	nextLabel = 'Next',
	posts = [],
	topics = [],
	...props
}: Props) {
	const [topic, setTopic] = useQueryState('topic', { defaultValue: 'all' })
	const [search, setSearch] = useState('')
	const [sort, setSort] = useQueryState('sort', { defaultValue: 'recent' })
	const [page, setPage] = useQueryState(
		'page',
		parseAsInteger.withDefault(1),
	)

	const activeTopic = stegaClean(topic) || 'all'
	const activeSort: SortMode =
		stegaClean(sort) === 'oldest' ? 'oldest' : 'recent'

	const usedTopicIds = useMemo(() => {
		const ids = new Set<string>()
		posts.forEach((p) =>
			p.topics?.forEach((t) => t?._id && ids.add(t._id)),
		)
		return ids
	}, [posts])

	const visibleTopics = useMemo(
		() => topics.filter((t) => t._id && usedTopicIds.has(t._id)),
		[topics, usedTopicIds],
	)

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase()
		const matched = posts.filter((post) => {
			if (activeTopic !== 'all') {
				const match = post.topics?.some((t) => t?._id === activeTopic)
				if (!match) return false
			}
			if (q) {
				const haystack = [
					post.metadata?.title,
					post.metadata?.description,
				]
					.filter(Boolean)
					.join(' ')
					.toLowerCase()
				if (!haystack.includes(q)) return false
			}
			return true
		})
		matched.sort((a, b) => {
			const da = a.publishDate ? new Date(a.publishDate).getTime() : 0
			const db = b.publishDate ? new Date(b.publishDate).getTime() : 0
			return activeSort === 'oldest' ? da - db : db - da
		})
		return matched
	}, [posts, activeTopic, search, activeSort])

	const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
	const safePage = Math.min(Math.max(1, page), totalPages)
	const paginated = filtered.slice(
		itemsPerPage * (safePage - 1),
		itemsPerPage * safePage,
	)

	function scrollToGrid() {
		document
			.getElementById('blog-overview-grid')
			?.scrollIntoView({ behavior: 'smooth', block: 'start' })
	}

	return (
		<section
			className="bg-canvas section-pad-medium"
			{...moduleProps(props)}
		>
			<div className="mx-auto w-full max-w-xxlarge px-8 max-md:px-4">
				<div className="mx-auto flex max-w-large flex-col items-center gap-6 text-balance md:gap-8">
					<div className="flex w-full flex-col items-center gap-2 text-center md:gap-5">
						{title && (
							<h1 className="h1 whitespace-pre-line">{title}</h1>
						)}
						{intro && (
							<div className="text-accent-dark text-medium md:text-large">
								<PortableText value={intro} />
							</div>
						)}
					</div>

					<label className="relative w-full max-w-xxsmall">
						<span className="sr-only">{searchPlaceholder}</span>
						<LuSearch
							aria-hidden
							className="text-ink-muted pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2"
						/>
						<input
							type="search"
							value={search}
							onChange={(e) => {
								setSearch(e.target.value)
								setPage(1)
							}}
							placeholder={searchPlaceholder}
							className="border-border bg-canvas text-ink placeholder:text-ink-muted w-full rounded-md border py-3 pr-3.5 pl-10 text-regular leading-6 shadow-xs transition-[border-color,box-shadow] duration-150 outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30 motion-reduce:transition-none"
						/>
					</label>
				</div>
			</div>

			<div className="mx-auto w-full max-w-xxlarge px-8 pt-12 max-md:px-4 md:pt-16">
				<div className="flex flex-col gap-module-gap">
					<div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
						<TabRow
							topics={visibleTopics}
							activeTopic={activeTopic}
							viewAllLabel={viewAllLabel}
							onChange={(id) => {
								setTopic(id)
								setPage(1)
							}}
						/>

						<SortSelect
							value={activeSort}
							ariaLabel={sortAriaLabel}
							mostRecentLabel={mostRecentLabel}
							oldestFirstLabel={oldestFirstLabel}
							onChange={(next) => {
								setSort(next)
								setPage(1)
							}}
						/>
					</div>

					<ul
						id="blog-overview-grid"
						className="flex flex-wrap gap-x-8 gap-y-12 scroll-mt-[calc(var(--header-height)+1rem)]"
					>
						{paginated.length === 0 && (
							<li className="text-ink-muted w-full py-12 text-center">
								{emptyLabel}
							</li>
						)}
						{paginated.map((post) => (
							<li
								key={post._id}
								className="anim-fade flex min-w-80 flex-[1_0_320px] basis-[calc(50%-1rem)] flex-col lg:basis-[calc(33.333%-1.334rem)]"
							>
								<PostCard post={post} />
							</li>
						))}
					</ul>

					{totalPages > 1 && (
						<Pagination
							page={safePage}
							totalPages={totalPages}
							previousLabel={previousLabel}
							nextLabel={nextLabel}
							onChange={(next) => {
								setPage(next)
								scrollToGrid()
							}}
						/>
					)}
				</div>
			</div>
		</section>
	)
}

function TabRow({
	topics,
	activeTopic,
	viewAllLabel,
	onChange,
}: {
	topics: TopicRef[]
	activeTopic: string
	viewAllLabel: string
	onChange: (id: string) => void
}) {
	return (
		<div
			role="tablist"
			aria-label="Filter posts by topic"
			className="bg-canvas-muted border-canvas-muted -mx-4 flex gap-1 self-start py-1 overflow-x-auto rounded-md border px-4 md:mx-0 md:px-1"
		>
			<TabButton
				active={activeTopic === 'all'}
				onClick={() => onChange('all')}
				label={viewAllLabel}
			/>
			{topics.map((t) => (
				<TabButton
					key={t._id}
					active={activeTopic === t._id}
					onClick={() => t._id && onChange(t._id)}
					label={t.name ?? ''}
				/>
			))}
		</div>
	)
}

function TabButton({
	active,
	onClick,
	label,
}: {
	active: boolean
	onClick: () => void
	label: string
}) {
	return (
		<button
			type="button"
			role="tab"
			aria-selected={active}
			onClick={onClick}
			className={cn(
				'flex h-11 shrink-0 items-center justify-center rounded-md px-3 py-2 text-regular leading-normal whitespace-nowrap outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent/30',
				active
					? 'bg-canvas border-border text-ink border shadow-xs'
					: 'text-ink-muted hover:text-ink',
			)}
		>
			{label}
		</button>
	)
}

function SortSelect({
	value,
	ariaLabel,
	mostRecentLabel,
	oldestFirstLabel,
	onChange,
}: {
	value: SortMode
	ariaLabel: string
	mostRecentLabel: string
	oldestFirstLabel: string
	onChange: (next: SortMode) => void
}) {
	return (
		<label className="bg-canvas border-border focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30 relative flex h-11 w-full cursor-pointer items-center gap-2 rounded-md border px-3.5 py-2.5 shadow-xs transition-[border-color,box-shadow] duration-150 motion-reduce:transition-none md:w-42">
			<span className="sr-only">{ariaLabel}</span>
			<select
				value={value}
				onChange={(e) => onChange(e.target.value as SortMode)}
				className="text-ink flex-1 cursor-pointer appearance-none bg-transparent text-regular leading-normal outline-none"
			>
				<option value="recent">{mostRecentLabel}</option>
				<option value="oldest">{oldestFirstLabel}</option>
			</select>
			<LuChevronDown
				aria-hidden
				className="text-ink-muted pointer-events-none size-5 shrink-0"
			/>
		</label>
	)
}

function PostCard({ post }: { post: OverviewPost }) {
	const href = resolveUrl(post, {
		base: false,
		language: stegaClean(post.language ?? '') || undefined,
	})
	const primaryTopic = post.topics?.find((t) => t?.name)
	const author = post.authors?.[0] ?? undefined

	return (
		<article className="group flex h-full flex-col gap-4">
			<Link
				href={href}
				className="bg-canvas-muted relative block aspect-[384/256] overflow-hidden rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
				tabIndex={-1}
				aria-hidden
			>
				<Img
					image={post.metadata?.image}
					width={800}
					alt={post.metadata?.title ?? undefined}
					className="absolute inset-0 size-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
				/>
			</Link>

			<div className="flex flex-1 flex-col gap-5">
				<div className="flex flex-col gap-2">
					{primaryTopic?.name && (
						<span className="text-accent text-small font-semibold leading-normal">
							{primaryTopic.name}
						</span>
					)}

					<div className="flex flex-col gap-2">
						<h3 className="font-display flex items-start justify-between gap-4 text-h6 leading-tight">
							<Link
								href={href}
								className="text-ink rounded-xs outline-none after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
							>
								{post.metadata?.title}
							</Link>
							<LuArrowUpRight
								aria-hidden
								className="text-ink-muted group-hover:text-ink mt-1 size-6 shrink-0 transition-colors"
							/>
						</h3>

						{post.metadata?.description && (
							<p className="text-ink-muted text-regular leading-relaxed line-clamp-2">
								{post.metadata.description}
							</p>
						)}
					</div>
				</div>

				{author && (
					<div className="flex items-center gap-2">
						<div className="bg-canvas-muted relative size-10 shrink-0 overflow-hidden rounded-full ring-1 ring-black/8">
							{author.image ? (
								<Img
									image={author.image}
									width={80}
									alt={author.name}
									className="size-full object-cover"
								/>
							) : null}
						</div>
						<div className="flex flex-col text-small leading-normal">
							<span className="text-ink font-semibold">
								{author.name}
							</span>
							{post.publishDate && (
								<time
									dateTime={post.publishDate}
									className="text-ink-muted"
								>
									{formatDate(post.publishDate)}
								</time>
							)}
						</div>
					</div>
				)}
			</div>
		</article>
	)
}

function Pagination({
	page,
	totalPages,
	previousLabel,
	nextLabel,
	onChange,
}: {
	page: number
	totalPages: number
	previousLabel: string
	nextLabel: string
	onChange: (next: number) => void
}) {
	const numbers = paginationRange(page, totalPages)

	return (
		<nav
			aria-label="Pagination"
			className="border-canvas-muted flex items-center justify-center gap-3 border-t pt-5"
		>
			<div className="flex min-w-0 flex-1 items-center">
				<button
					type="button"
					onClick={() => onChange(page - 1)}
					disabled={page === 1}
					className="text-ink-muted hover:text-ink inline-flex items-center gap-1 rounded-md py-1 text-small font-semibold leading-normal transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-40"
				>
					<LuArrowLeft aria-hidden className="size-5" />
					<span>{previousLabel}</span>
				</button>
			</div>

			<ol className="flex items-start gap-0.5">
				{numbers.map((n, i) =>
					typeof n === 'number' ? (
						<li key={`${n}-${i}`}>
							<button
								type="button"
								onClick={() => onChange(n)}
								aria-current={n === page ? 'page' : undefined}
								className={cn(
									'flex size-10 items-center justify-center rounded-full text-small leading-normal outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent/30',
									n === page
										? 'bg-canvas-muted text-ink-muted font-medium'
										: 'text-ink-muted hover:bg-canvas-muted/60 font-medium',
								)}
							>
								{n}
							</button>
						</li>
					) : (
						<li
							key={`gap-${i}`}
							aria-hidden
							className="text-ink-muted flex size-10 items-center justify-center text-small leading-5 font-medium"
						>
							…
						</li>
					),
				)}
			</ol>

			<div className="flex min-w-0 flex-1 items-center justify-end">
				<button
					type="button"
					onClick={() => onChange(page + 1)}
					disabled={page === totalPages}
					className="text-ink-muted hover:text-ink inline-flex items-center gap-1 rounded-md py-1 text-small font-semibold leading-normal transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-40"
				>
					<span>{nextLabel}</span>
					<LuArrowRight aria-hidden className="size-5" />
				</button>
			</div>
		</nav>
	)
}

function paginationRange(
	current: number,
	total: number,
): Array<number | 'gap'> {
	if (total <= 7) {
		return Array.from({ length: total }, (_, i) => i + 1)
	}
	const range: Array<number | 'gap'> = [1]
	const left = Math.max(2, current - 1)
	const right = Math.min(total - 1, current + 1)

	if (left > 2) range.push('gap')
	for (let i = left; i <= right; i++) range.push(i)
	if (right < total - 1) range.push('gap')

	range.push(total)
	return range
}

function formatDate(value: string) {
	return new Date(value + 'T00:00:00').toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	})
}
