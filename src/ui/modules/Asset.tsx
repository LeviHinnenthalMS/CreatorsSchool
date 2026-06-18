import { ResponsiveImg } from '@/ui/Img'
import Code from './RichtextModule/Code'
import CustomHTML from './CustomHTML'
import type {
	SanityCode,
	SanityCustomHTML,
	SanityImg,
} from '@/sanity/typeHelpers'

type AssetType = SanityImg | SanityCode | SanityCustomHTML

export default function Asset({ asset }: { asset?: AssetType }) {
	if (!asset || !asset._type) return null

	const Component = ASSET_MAP[asset._type as keyof typeof ASSET_MAP] as
		| React.ComponentType<{ asset: AssetType }>
		| undefined

	return Component ? <Component asset={asset} /> : null
}

const ASSET_MAP = {
	img: ({ asset }: { asset: SanityImg }) => (
		<ResponsiveImg
			img={asset}
			className="mx-auto block h-auto max-h-full w-auto max-w-full object-contain"
			width={1200}
		/>
	),
	code: ({ asset }: { asset: SanityCode }) => (
		<Code
			className="richtext [&_.inner]:max-h-[20lh] [&_.inner]:overflow-auto"
			value={asset}
		/>
	),
	'custom-html': ({ asset }: { asset: SanityCustomHTML }) => (
		<CustomHTML {...asset} />
	),
} as const
