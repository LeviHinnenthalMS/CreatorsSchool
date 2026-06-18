'use client'

import {
	useEffect,
	useRef,
	useState,
	useTransition,
	type ComponentProps,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { CgChevronDown } from 'react-icons/cg'
import { DEFAULT_LANG, supportedLanguages } from '@/lib/i18n'
import { setLangCookie } from './actions'
import Flag from './Flag'
import { cn } from '@/lib/utils'
import type { TranslationDoc } from '@/sanity/typeHelpers'

export default function Switcher({
	translations: T,
	className,
	...props
}: {
	translations: TranslationDoc[]
} & ComponentProps<'div'>) {
	const router = useRouter()
	const pathname = usePathname()
	const [open, setOpen] = useState(false)
	const [, startTransition] = useTransition()
	const rootRef = useRef<HTMLDivElement>(null)
	const triggerRef = useRef<HTMLButtonElement>(null)

	useEffect(() => setOpen(false), [pathname])

	useEffect(() => {
		if (!open) return

		const onPointerDown = (e: PointerEvent) => {
			if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
		}
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setOpen(false)
				// Restore focus to the trigger so the user doesn't lose their place.
				triggerRef.current?.focus()
			}
		}

		document.addEventListener('pointerdown', onPointerDown)
		document.addEventListener('keydown', onKeyDown)
		return () => {
			document.removeEventListener('pointerdown', onPointerDown)
			document.removeEventListener('keydown', onKeyDown)
		}
	}, [open])

	const available = T.find((t) =>
		[
			t.slug,
			...(t.translations?.flatMap((p) => [p?.slug, p?.slugBlogAlt]) ?? []),
		].includes(pathname),
	)

	const firstSegment = pathname.split('/').filter(Boolean)[0]
	const currentLangId =
		supportedLanguages.find(
			(s) => s.id !== DEFAULT_LANG && s.id === firstSegment,
		)?.id ?? DEFAULT_LANG

	const items = supportedLanguages.map((s) => {
		const found = available?.translations?.find((t) => t?.language === s.id)
		const { slug, slugBlogAlt, language } = found ?? {}
		const value =
			language === DEFAULT_LANG
				? (available?.slug ?? undefined)
				: (slugBlogAlt ?? slug ?? undefined)
		return {
			id: s.id,
			title: s.title,
			value: value ?? undefined,
			language: language ?? undefined,
		}
	})

	const onSelect = (value?: string, language?: string) => {
		if (!value) return
		setOpen(false)
		startTransition(async () => {
			await setLangCookie(language)
			router.push(value)
		})
	}

	return (
		<div
			ref={rootRef}
			className={cn('relative', className)}
			{...props}
		>
			<button
				ref={triggerRef}
				type="button"
				onClick={() => setOpen((v) => !v)}
				aria-haspopup="listbox"
				aria-expanded={open}
				aria-label="Change language"
				className="hover:bg-canvas-muted text-ink flex items-center gap-1.5 rounded-sm px-2 py-1 text-regular leading-6 font-semibold transition-colors"
			>
				<Flag lang={currentLangId} className="size-6 shrink-0" />
				<span className="px-0.5">{currentLangId.toUpperCase()}</span>
				<CgChevronDown
					className={cn(
						'size-4 shrink-0 transition-transform',
						open && '-rotate-180',
					)}
					aria-hidden
				/>
			</button>

			{open && (
				<ul
					role="listbox"
					className="anim-fade-to-b border-border bg-canvas absolute top-full right-0 z-20 mt-2 w-fit rounded-md border p-1 shadow-md"
				>
					{items.map((item) => (
						<li key={item.id}>
							<button
								type="button"
								role="option"
								aria-selected={item.id === currentLangId}
								disabled={!item.value}
								onClick={() => onSelect(item.value, item.language)}
								className={cn(
									'flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-regular leading-6 font-semibold',
									'hover:bg-canvas-muted text-ink disabled:opacity-50',
								)}
							>
								<Flag lang={item.id} className="size-5 shrink-0" />
								<span>{item.id.toUpperCase()}</span>
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
