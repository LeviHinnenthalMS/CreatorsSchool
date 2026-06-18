import Icon from '@/ui/Icon'
import { cn } from '@/lib/utils'
import type { SanityFeature } from '@/sanity/typeHelpers'

export type FeatureLayout = 'icon-top' | 'icon-left'

export default function FeatureList({
	features,
	layout = 'icon-top',
	cols = 2,
	className,
}: {
	features?: SanityFeature[] | null
	layout?: FeatureLayout
	cols?: 2 | 3
	className?: string
}) {
	if (!features?.length) return null

	return (
		<ul
			className={cn(
				'grid grid-cols-2 gap-x-8 gap-y-8 md:gap-y-8',
				cols === 2
					? 'md:grid-cols-2'
					: 'sm:grid-cols-2 lg:grid-cols-3',
				className,
			)}
		>
			{features.map((feature, key) => (
				<li
					key={feature._key ?? key}
					className={cn(
						'flex flex-col',
						layout === 'icon-top'
							? 'flex-col gap-4'
							: 'md:flex-row items-start gap-4',
					)}
				>
					{feature.icon && (
						<figure
							aria-hidden="true"
							className="bg-accent-lightest text-ink grid size-13 shrink-0 place-items-center rounded-full"
						>
							<div className="bg-accent-lighter grid size-10 place-items-center rounded-full">
								<Icon
									icon={{ ...feature.icon, size: '24px' }}
									className="size-6 object-contain"
								/>
							</div>
						</figure>
					)}
					<div
						className={cn(
							'flex flex-col gap-2',
							layout === 'icon-left' && 'min-w-0 flex-1',
						)}
					>
						{feature.title && (
							<h3 className="text-medium text-ink font-semibold">
								{feature.title}
							</h3>
						)}
						{feature.subtitle && (
							<p className="text-medium text-neutral-dark ">
								{feature.subtitle}
							</p>
						)}
					</div>
				</li>
			))}
		</ul>
	)
}
