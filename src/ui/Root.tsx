'use client'

import useLang from '@/lib/useLang'
import { inter, interTight } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

export default function Root({ className, ...props }: ComponentProps<'html'>) {
	const lang = useLang()

	return (
		<html
			lang={lang}
			className={cn(inter.variable, interTight.variable, className)}
			suppressHydrationWarning
			{...props}
		/>
	)
}
