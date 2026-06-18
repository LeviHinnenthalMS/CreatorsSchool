'use client'

import { ComponentProps, useEffect, useRef, useState } from 'react'
import moduleProps from '@/lib/moduleProps'
import type { SanityModule } from '@/sanity/typeHelpers'

/**
 * @description If the code includes a <script> tag, ensure the script is re-run on each render
 */
export default function WithScript({
	code,
	className,
	...props
}: {
	code?: string | null
} & SanityModule &
	ComponentProps<'section'>) {
	const ref = useRef<HTMLElement>(null)
	const [firstRender, setFirstRender] = useState(true)

	useEffect(() => {
		if (!code) return
		if (firstRender) {
			setFirstRender(false)
			return
		}
		const parsed = document.createRange().createContextualFragment(code)
		ref.current?.appendChild(parsed)
	}, [code, firstRender])

	if (!code) return null

	return <section ref={ref} className={className} {...moduleProps(props)} />
}
