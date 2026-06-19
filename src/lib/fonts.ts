import localFont from 'next/font/local'

export const fraunces = localFont({
	variable: '--font-display',
	display: 'swap',
	src: [
		{
			path: './fonts/files/fraunces-roman-latin.woff2',
			weight: '400 700',
			style: 'normal',
		},
		{
			path: './fonts/files/fraunces-roman-latin-ext.woff2',
			weight: '400 700',
			style: 'normal',
		},
		{
			path: './fonts/files/fraunces-it-latin.woff2',
			weight: '400 700',
			style: 'italic',
		},
		{
			path: './fonts/files/fraunces-it-latin-ext.woff2',
			weight: '400 700',
			style: 'italic',
		},
	],
})

export const manrope = localFont({
	variable: '--font-body',
	display: 'swap',
	src: [
		{
			path: './fonts/files/manrope-roman-latin.woff2',
			weight: '400 800',
			style: 'normal',
		},
		{
			path: './fonts/files/manrope-roman-latin-ext.woff2',
			weight: '400 800',
			style: 'normal',
		},
	],
})
