'use client'

import { useEffect, useRef } from 'react'

export default function FooterMeasure({
	children,
	className,
}: React.ComponentProps<'footer'>) {
	const ref = useRef<HTMLElement>(null)

	useEffect(() => {
		if (typeof window === 'undefined') return

		const setHeight = () => {
			if (!ref.current) return
			document.documentElement.style.setProperty(
				'--footer-height',
				`${ref.current.offsetHeight ?? 0}px`,
			)
		}
		setHeight()

		const ro =
			'ResizeObserver' in window ? new ResizeObserver(setHeight) : null
		if (ro && ref.current) ro.observe(ref.current)
		window.addEventListener('resize', setHeight)

		return () => {
			window.removeEventListener('resize', setHeight)
			ro?.disconnect()
		}
	}, [])

	return (
		<footer ref={ref} className={className} role="contentinfo">
			{children}
		</footer>
	)
}
