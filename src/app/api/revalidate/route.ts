import { revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

/**
 * Sanity GROQ webhook endpoint. Configure in Sanity Studio:
 *   Trigger: Create/Update/Delete  |  Filter: _type in [...]
 *   URL: https://<your-domain>/api/revalidate
 *   Secret: SANITY_REVALIDATE_SECRET (set in Vercel env)
 */
export async function POST(req: NextRequest) {
	try {
		const { isValidSignature, body } = await parseBody<{ _type?: string }>(
			req,
			process.env.SANITY_REVALIDATE_SECRET,
		)

		if (!isValidSignature) {
			return new NextResponse('Invalid signature', { status: 401 })
		}

		if (!body?._type) {
			return new NextResponse('Missing _type', { status: 400 })
		}

		revalidateTag('sanity', 'max')
		revalidateTag(body._type, 'max')

		// `getCachedTranslations()` powers the proxy language lookup; any change
		// to a translatable document affects it.
		const translatable = ['page', 'blog.post', 'translation.metadata']
		if (translatable.includes(body._type)) {
			revalidateTag('translations', 'max')
		}

		return NextResponse.json({
			revalidated: true,
			type: body._type,
			now: Date.now(),
		})
	} catch (err) {
		console.error('[revalidate] error:', err)
		return new NextResponse('Internal error', { status: 500 })
	}
}
