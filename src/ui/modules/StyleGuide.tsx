import Button, {
	type ButtonVariant,
	type ButtonSize,
} from '@/ui/Button'
import { stegaClean } from 'next-sanity'
import type { ComponentProps } from 'react'

const variants: ButtonVariant[] = ['primary', 'secondary', 'tertiary']
const sizes: ButtonSize[] = ['medium', 'large']

function Section({
	title,
	children,
	...rest
}: { title: string } & ComponentProps<'section'>) {
	return (
		<section className="space-y-6" {...rest}>
			<h2 className="h5 border-border border-b pb-2">{title}</h2>
			{children}
		</section>
	)
}

function Subsection({
	label,
	children,
}: {
	label: string
	children: React.ReactNode
}) {
	return (
		<div className="space-y-3">
			<p className="text-ink-muted text-small leading-5 font-medium tracking-wide uppercase">
				{label}
			</p>
			{children}
		</div>
	)
}

// Cube placeholder icon mirroring Figma's Relume placeholder. Lives here
// because the style guide is the only consumer and we don't want to add a
// public/ asset just for a preview.
const PREVIEW_ICON =
	"data:image/svg+xml;utf8," +
	encodeURIComponent(
		"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'><path d='M21 7L12 2 3 7v10l9 5 9-5V7zm-9 13.5l-7-3.89V8.61l7 3.89v8zm0-9.78L5 6.83l7-3.89 7 3.89-7 3.89zm7 5.89l-5 2.78v-8l5-2.78v8z'/></svg>",
	)

function ButtonRow({
	variant,
	size,
}: {
	variant: ButtonVariant
	size: ButtonSize
}) {
	return (
		<div className="flex flex-wrap items-start gap-5">
			<Button variant={variant} size={size}>
				Button
			</Button>
			<Button variant={variant} size={size} icon={PREVIEW_ICON}>
				Button
			</Button>
		</div>
	)
}

export default function StyleGuide({
	title,
	...rest
}: Partial<{ title: string }>) {
	return (
		<section
			className="section space-y-12"
			{...(rest as ComponentProps<'section'>)}
		>
			<header className="space-y-2">
				<h1 className="h2">{stegaClean(title) || 'Style guide'}</h1>
				<p className="text-ink-muted text-medium">
					Reference for the project&rsquo;s UI primitives. Edit values in{' '}
					<code className="bg-canvas-muted rounded-sm px-1">
						src/styles/app.css
					</code>{' '}
					and the underlying components.
				</p>
			</header>

			<Section title="Typography — Headings" id="headings">
				<div className="space-y-3">
					<h1 className="h1">Heading 1 / The quick brown fox</h1>
					<h2 className="h2">Heading 2 / The quick brown fox</h2>
					<h3 className="h3">Heading 3 / The quick brown fox</h3>
					<h4 className="h4">Heading 4 / The quick brown fox</h4>
					<h5 className="h5">Heading 5 / The quick brown fox</h5>
					<h6 className="h6">Heading 6 / The quick brown fox</h6>
				</div>
			</Section>

			<Section title="Typography — Body" id="body">
				<div className="max-w-2xl space-y-4">
					<p className="text-large">
						Large body. The quick brown fox jumps over the lazy dog.
					</p>
					<p className="text-medium">
						Medium body. The quick brown fox jumps over the lazy dog.
					</p>
					<p className="text-regular">
						Regular body. The quick brown fox jumps over the lazy dog.
					</p>
					<p className="text-small">
						Small body. The quick brown fox jumps over the lazy dog.
					</p>
					<p className="text-tiny">
						Tiny body. The quick brown fox jumps over the lazy dog.
					</p>
				</div>
			</Section>

			<Section title="Buttons" id="buttons">
				{variants.map((variant) => (
					<div key={variant} className="space-y-5">
						<h3 className="h6 capitalize">{variant}</h3>
						{sizes.map((size) => (
							<Subsection key={size} label={size}>
								<ButtonRow variant={variant} size={size} />
							</Subsection>
						))}
					</div>
				))}
				<p className="text-ink-muted text-small">
					Hover any button to preview the hover state. Buttons accept an SVG
					icon URL via the <code>icon</code> prop (mask-based, takes the
					button&rsquo;s text color).
				</p>
			</Section>

			<Section title="Colors" id="colors">
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
					{[
						['Canvas', 'bg-canvas border-border-strong border'],
						['Canvas muted', 'bg-canvas-muted'],
						['Ink', 'bg-ink text-ink-inverse'],
						['Ink muted', 'bg-ink-muted text-ink-inverse'],
						['Accent', 'bg-accent text-ink-inverse'],
						['Border', 'bg-border'],
						['Border strong', 'bg-border-strong'],
					].map(([label, classes]) => (
						<div
							key={label}
							className={`flex h-24 items-end rounded-md p-3 text-small leading-5 font-semibold ${classes}`}
						>
							{label}
						</div>
					))}
				</div>
			</Section>
		</section>
	)
}
