import { PortableText } from 'next-sanity'
import AnchoredHeading from './AnchoredHeading'
import { cn } from '@/lib/utils'

import Image from './Image'
import Code from './Code'
import Admonition from './Admonition'
import CustomHTML from '@/ui/modules/CustomHTML'
import BlogVideo from '@/ui/blog/Video'

export default function Content({
	value,
	className,
	children,
}: { value: any } & React.ComponentProps<'div'>) {
	return (
		<div
			className={cn(
				'richtext mx-auto w-full space-y-6 [&>:first-child]:!mt-0',
				className,
			)}
		>
			<PortableText
				value={value}
				components={{
					block: {
						h2: (node) => <AnchoredHeading as="h2" {...node} />,
						h3: (node) => <AnchoredHeading as="h3" {...node} />,
						h4: (node) => <AnchoredHeading as="h4" {...node} />,
						h5: (node) => <AnchoredHeading as="h5" {...node} />,
						h6: (node) => <AnchoredHeading as="h6" {...node} />,
					},
					types: {
						image: Image,
						admonition: Admonition,
						code: Code,
						'blog.video': BlogVideo,
						'custom-html': ({ value }) => (
							<CustomHTML
								className="has-[table]:md:[grid-column:bleed] has-[table]:md:mx-auto"
								{...value}
							/>
						),
					},
					marks: {
						link: ({ children, value }) => {
							const href = value?.href || '#'
							const external = /^https?:\/\//.test(href)
							return (
								<a
									href={href}
									target={external ? '_blank' : undefined}
									rel={external ? 'noopener noreferrer' : undefined}
								>
									{children}
								</a>
							)
						},
					},
				}}
			/>

			{children}
		</div>
	)
}
