import { llmsResponse, renderLlms } from '@/lib/llms'
import { getDiscoveryContent } from '@/sanity/lib/discovery'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET() {
	return llmsResponse(renderLlms(await getDiscoveryContent(), true))
}
