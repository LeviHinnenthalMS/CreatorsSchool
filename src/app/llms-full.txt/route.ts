import { llmsResponse, renderLlms } from '@/lib/llms'
import { getDiscoveryContent } from '@/sanity/lib/discovery'

export async function GET() {
	return llmsResponse(renderLlms(await getDiscoveryContent(), true))
}
