import { draftMode } from 'next/headers'
import { fetchSanityLive, SanityLive } from '@/sanity/lib/fetch'
import { GLOBAL_MODULES_QUERY } from '@/sanity/lib/queries'
import { VisualEditing } from 'next-sanity/visual-editing'
import DraftModeControls from './DraftModeControls'

export default async function VisualEditingControls() {
	const globalModules = await fetchSanityLive({
		query: GLOBAL_MODULES_QUERY,
	})

	return (
		<>
			<SanityLive />

			{(await draftMode()).isEnabled && (
				<>
					<VisualEditing />
					<DraftModeControls globalModules={globalModules} />
				</>
			)}
		</>
	)
}
