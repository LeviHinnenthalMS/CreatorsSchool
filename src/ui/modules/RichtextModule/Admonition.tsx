import { cn } from '@/lib/utils'
import { PortableText } from 'next-sanity'
import { VscInfo, VscLightbulb, VscReport, VscWarning } from 'react-icons/vsc'

export default function Admonition({
	value,
}: {
	value: Partial<{
		title: string
		content: any
		tone: 'note' | 'important' | 'tip' | 'warning' | 'caution'
	}>
}) {
	if (!value) return null

	const { title, content, tone } = value

	const color = tone
		? {
				note: 'border-info bg-info/5 [&_svg]:text-info',
				important: 'border-accent bg-accent/5 [&_svg]:text-accent',
				tip: 'border-success bg-success/5 [&_svg]:text-success',
				warning: 'border-warning bg-warning/5 [&_svg]:text-warning',
				caution: 'border-danger bg-danger/5 [&_svg]:text-danger',
			}[tone]
		: 'border-neutral-light bg-neutral/5'

	const Icon = tone
		? {
				note: VscInfo,
				important: VscReport,
				tip: VscLightbulb,
				warning: VscWarning,
				caution: VscWarning,
			}[tone]
		: null

	return (
		<dl className={cn('space-y-2 border-s-2 px-4 py-3', color)}>
			<dt className="flex items-center gap-2 font-bold">
				{Icon && <Icon className="size-5" />}
				<div>{title}</div>
			</dt>

			<dd>
				<PortableText value={content} />
			</dd>
		</dl>
	)
}
