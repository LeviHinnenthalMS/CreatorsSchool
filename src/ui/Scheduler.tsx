'use client'

import { useEffect, useState } from 'react'

export default function Scheduler({
	start,
	end,
	children,
}: Partial<{
	start: string
	end: string
	children: React.ReactNode
}>) {
	const hasWindow = !!(start || end)

	const [isActive, setIsActive] = useState(() => {
		const now = new Date()
		return (!start || new Date(start) < now) && (!end || new Date(end) > now)
	})

	useEffect(() => {
		if (!hasWindow) return
		const check = () => {
			const now = new Date()
			setIsActive(
				(!start || new Date(start) < now) && (!end || new Date(end) > now),
			)
		}
		const interval = setInterval(check, 1000)
		return () => clearInterval(interval)
	}, [start, end, hasWindow])

	if (!hasWindow) return children
	if (!isActive) return null
	return children
}
