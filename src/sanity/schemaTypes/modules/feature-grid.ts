import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
	name: 'feature-grid',
	title: 'Feature-Grid · 4 Karten',
	type: 'object',
	fields: [
		defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
		defineField({
			name: 'titleBefore',
			title: 'Headline · vor Akzent',
			type: 'string',
		}),
		defineField({
			name: 'titleAccent',
			title: 'Headline · Akzent',
			type: 'string',
		}),
		defineField({
			name: 'titleAfter',
			title: 'Headline · nach Akzent',
			type: 'string',
		}),
		defineField({
			name: 'tagline',
			title: 'Tagline (rechts neben Headline)',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'features',
			title: 'Features',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'featureCard',
					fields: [
						defineField({
							name: 'tint',
							title: 'Tönung',
							type: 'string',
							options: {
								list: [
									{ title: 'Coral (Blush)', value: 'coral' },
									{ title: 'Warm-White', value: 'soft' },
								],
								layout: 'radio',
							},
							initialValue: 'soft',
						}),
						defineField({ name: 'icon', title: 'Icon-Key', type: 'string' }),
						defineField({ name: 'title', type: 'string' }),
						defineField({ name: 'text', type: 'text', rows: 3 }),
					],
					preview: { select: { title: 'title', subtitle: 'text' } },
				}),
			],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		prepare: () => ({ title: 'Feature-Grid' }),
	},
})
