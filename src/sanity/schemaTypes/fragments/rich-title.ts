import type { ArrayOfType } from 'sanity'

/**
 * Reusable Portable Text field for headlines.
 *
 * Editors get a single text input where they can:
 * - Press Enter for a new line (each block renders as its own line).
 * - Select text and mark it `accent` → italic, coral (or blush on dark surfaces).
 * - Select text and mark it `pill` → wrapped in a rotated coral pill.
 *
 * Renderer: `<RichTitle title={value} tone="coral" />` in src/ui/creators.
 */
export function richTitleField(): {
	type: 'array'
	of: ArrayOfType[]
} {
	return {
		type: 'array',
		of: [
			{
				type: 'block',
				styles: [{ title: 'Normal', value: 'normal' }],
				lists: [],
				marks: {
					decorators: [
						{ title: 'Accent (italic)', value: 'accent' },
						{ title: 'Pill (highlight)', value: 'pill' },
					],
					annotations: [],
				},
			},
		],
	}
}
