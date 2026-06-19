import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
	name: 'hero.creators',
	title: 'Hero · Creators',
	type: 'object',
	fields: [
		defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
		defineField({
			name: 'pretitle',
			title: 'Headline · Anfang',
			description: 'z. B. „Wo Musik & Tanz"',
			type: 'string',
		}),
		defineField({
			name: 'titleBefore',
			title: 'Headline · vor dem Akzent',
			description: 'z. B. „zu "',
			type: 'string',
		}),
		defineField({
			name: 'titleAccent',
			title: 'Headline · Akzent (kursiv, coral)',
			description: 'z. B. „Ausdruck"',
			type: 'string',
		}),
		defineField({
			name: 'titleAfter',
			title: 'Headline · nach dem Akzent',
			description: 'z. B. „ werden."',
			type: 'string',
		}),
		defineField({
			name: 'sub',
			title: 'Subline',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'image',
			title: 'Hero-Foto',
			type: 'image',
			options: { hotspot: true, metadata: ['lqip'] },
			fields: [
				defineField({
					name: 'alt',
					title: 'Alt-Text',
					type: 'string',
					validation: (Rule) => Rule.required(),
				}),
			],
		}),
		defineField({
			name: 'tags',
			title: 'Schwebende Tags (max. 3)',
			type: 'array',
			validation: (Rule) => Rule.max(3),
			of: [
				defineArrayMember({
					type: 'object',
					name: 'photoTag',
					fields: [
						defineField({
							name: 'position',
							title: 'Position',
							type: 'string',
							options: {
								list: [
									{ title: 'Oben rechts', value: 't1' },
									{ title: 'Mitte links', value: 't2' },
									{ title: 'Unten rechts', value: 't3' },
								],
								layout: 'radio',
							},
						}),
						defineField({
							name: 'style',
							title: 'Style',
							type: 'string',
							options: {
								list: [
									{ title: 'Coral', value: 'coral' },
									{ title: 'Neutral', value: 'neutral' },
									{ title: 'Ink', value: 'ink' },
								],
								layout: 'radio',
							},
							initialValue: 'neutral',
						}),
						defineField({
							name: 'icon',
							title: 'Icon-Key',
							type: 'string',
						}),
						defineField({ name: 'label', type: 'string' }),
						defineField({ name: 'value', type: 'string' }),
					],
					preview: {
						select: { title: 'label', subtitle: 'value' },
					},
				}),
			],
		}),
		defineField({
			name: 'ctas',
			title: 'CTAs',
			type: 'array',
			of: [{ type: 'cta' }],
		}),
		defineField({
			name: 'reviewTitle',
			title: 'Review-Zeile · Headline',
			type: 'string',
		}),
		defineField({
			name: 'reviewSubtitle',
			title: 'Review-Zeile · Unterzeile',
			type: 'string',
		}),
		defineField({
			name: 'reviewAvatars',
			title: 'Review-Avatare (max. 3 Initialen)',
			type: 'array',
			of: [{ type: 'string' }],
			validation: (Rule) => Rule.max(3),
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		select: { eyebrow: 'eyebrow', title: 'titleAccent' },
		prepare: ({ eyebrow, title }) => ({
			title: title || 'Hero',
			subtitle: eyebrow || 'hero.creators',
		}),
	},
})
