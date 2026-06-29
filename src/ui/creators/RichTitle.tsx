import { PortableText, type PortableTextReactComponents } from '@portabletext/react'
import { cn } from '@/lib/utils'

type Tone = 'coral' | 'blush' | 'paper'

type Block = {
	_type?: string
	_key?: string
	children?: Array<{
		_key?: string
		_type?: string
		marks?: string[]
		text?: string
	}>
}

const accentToneClass: Record<Tone, string> = {
	coral: 'text-coral font-medium italic',
	blush: 'text-blush font-medium italic',
	paper: 'text-paper font-medium italic',
}

const pillToneClass: Record<Tone, string> = {
	coral:
		'bg-coral text-paper inline-block -rotate-[2deg] rounded-pill px-4 pb-1 font-semibold italic',
	blush:
		'bg-blush text-plum inline-block -rotate-[2deg] rounded-pill px-4 pb-1 font-semibold italic',
	paper:
		'bg-paper text-coral inline-block -rotate-[2deg] rounded-pill px-4 pb-1 font-semibold italic',
}

function buildComponents(tone: Tone): Partial<PortableTextReactComponents> {
	return {
		marks: {
			accent: ({ children }) => (
				<span className={accentToneClass[tone]}>{children}</span>
			),
			pill: ({ children }) => (
				<span className={pillToneClass[tone]}>{children}</span>
			),
		},
		block: {
			normal: ({ children }) => <span className="block">{children}</span>,
		},
	}
}

export default function RichTitle({
	title,
	tone = 'coral',
	as: Tag = 'h2',
	className,
}: {
	title?: Block[] | null
	tone?: Tone
	as?: 'h1' | 'h2' | 'h3' | 'div' | 'span'
	className?: string
}) {
	if (!title?.length) return null
	const hasText = title.some((b) =>
		b.children?.some((c) => c.text && c.text.trim() !== ''),
	)
	if (!hasText) return null

	return (
		<Tag className={cn('text-ink', className)}>
			<PortableText value={title as never} components={buildComponents(tone)} />
		</Tag>
	)
}

export function richTitlePlainText(title?: Block[] | null): string {
	if (!title?.length) return ''
	return title
		.map((b) => (b.children ?? []).map((c) => c.text ?? '').join(''))
		.join('\n')
		.trim()
}
