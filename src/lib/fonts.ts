import { Inter, Inter_Tight } from 'next/font/google'

export const inter = Inter({
	subsets: ['latin', 'latin-ext'],
	display: 'swap',
	variable: '--font-inter',
})

export const interTight = Inter_Tight({
	subsets: ['latin', 'latin-ext'],
	display: 'swap',
	variable: '--font-inter-tight',
})
