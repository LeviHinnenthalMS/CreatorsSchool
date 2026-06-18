import errors from './errors'

export const dev = process.env.NODE_ENV === 'development'

export const vercelPreview = process.env.VERCEL_ENV === 'preview'

if (!process.env.NEXT_PUBLIC_BASE_URL) {
	throw new Error(errors.missingBaseUrl)
}

const rawBaseUrl = dev
	? 'http://localhost:3000'
	: process.env.NEXT_PUBLIC_BASE_URL!

export const BASE_URL = /^https?:\/\//i.test(rawBaseUrl)
	? rawBaseUrl.replace(/\/$/, '')
	: `https://${rawBaseUrl.replace(/\/$/, '')}`

export const BLOG_DIR = 'blog'
