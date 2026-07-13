import { stegaClean } from 'next-sanity'
import moduleProps from '@/lib/moduleProps'
import { Img } from '@/ui/Img'
import Eyebrow from '@/ui/creators/Eyebrow'
import RichTitle from '@/ui/creators/RichTitle'
import { cn } from '@/lib/utils'
import type { SanityImage, SanityModule } from '@/sanity/typeHelpers'

type Person = {
	_id?: string
	name?: string | null
	role?: string | null
	badge?: string | null
	cardColor?: 'red' | 'coral' | 'gray' | 'ink' | null
	tags?: string[] | null
	image?: SanityImage | null
}

type Props = SanityModule & {
	eyebrow?: string | null
	title?: any
	tagline?: string | null
	people?: Person[]
}

const cardBg: Record<string, string> = {
	red: 'bg-coral',
	coral: 'bg-coral-soft',
	gray: 'bg-mute',
	ink: 'bg-ink',
}

const initialColor: Record<string, string> = {
	red: 'text-paper/20',
	coral: 'text-coral-deep/40',
	gray: 'text-ink/25',
	ink: 'text-paper/15',
}

export default function PersonList({ eyebrow, title, tagline, people, ...props }: Props) {
	return (
		<section {...moduleProps(props)} className="py-[clamp(60px,8vw,100px)]">
			<div className="wrap">
				{/* Section header */}
				{(eyebrow || title || tagline) && (
					<div className="mb-[clamp(2.5rem,5vw,3.75rem)] grid items-end gap-x-10 gap-y-4 md:grid-cols-[1.2fr_1fr]">
						<div>
							{eyebrow && <Eyebrow tone="coral">{eyebrow}</Eyebrow>}
							{title && (
								<RichTitle
									title={title}
									tone="neutral"
									as="h2"
									className="mt-3 h-section"
								/>
							)}
						</div>
						{tagline && (
							<p className="text-mute max-w-[50ch] text-[16px] leading-relaxed">
								{tagline}
							</p>
						)}
					</div>
				)}

				{/* Person cards */}
				<ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
					{people?.map((person, i) => {
						const color = stegaClean(person.cardColor ?? 'red') as string
						const initial = (person.name ?? ' ').charAt(0)
						const hasImage = !!person.image?.asset

						return (
							<li key={person._id ?? i}>
								<article className="overflow-hidden rounded-[22px] border border-line bg-paper shadow-sm transition-shadow duration-200 hover:shadow-md">
									{/* Coloured image area */}
									<div
										className={cn(
											'relative aspect-[4/3] overflow-hidden',
											cardBg[color] ?? 'bg-coral',
										)}
									>
										{/* Dot texture overlay */}
										<svg
											className="absolute inset-0 h-full w-full opacity-[0.12]"
											aria-hidden
										>
											<defs>
												<pattern
													id={`dots-${i}`}
													x="0"
													y="0"
													width="18"
													height="18"
													patternUnits="userSpaceOnUse"
												>
													<circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
												</pattern>
											</defs>
											<rect width="100%" height="100%" fill={`url(#dots-${i})`} />
										</svg>

										{/* Photo (if available) */}
										{hasImage && (
											<Img
												image={person.image}
												width={480}
												className="absolute inset-0 size-full object-cover object-top"
											/>
										)}

										{/* Role badge */}
										{person.badge && (
											<div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 shadow-sm">
												<span
													className="size-1.5 shrink-0 rounded-full bg-coral"
													aria-hidden
												/>
												<span className="text-[12px] font-semibold text-ink">
													{stegaClean(person.badge)}
												</span>
											</div>
										)}

										{/* Large initial letter */}
										{!hasImage && (
											<span
												className={cn(
													'font-display absolute -bottom-4 right-3 select-none text-[140px] font-bold leading-none',
													initialColor[color] ?? 'text-paper/20',
												)}
												aria-hidden
											>
												{initial}
											</span>
										)}
									</div>

									{/* Content */}
									<div className="px-5 py-4">
										<h3 className="font-display m-0 text-[18px] font-bold leading-tight text-ink">
											{person.name}
										</h3>
										{person.role && (
											<p className="m-0 mt-1 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-mute">
												{stegaClean(person.role)}
											</p>
										)}
										{!!person.tags?.length && (
											<div className="mt-3 flex flex-wrap gap-1.5">
												{person.tags.map((tag, j) => (
													<span
														key={j}
														className="rounded-full border border-line bg-paper-2 px-3 py-1 text-[12px] text-charcoal"
													>
														{tag}
													</span>
												))}
											</div>
										)}
									</div>
								</article>
							</li>
						)
					})}
				</ul>
			</div>
		</section>
	)
}
