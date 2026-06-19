import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'offering-list',
	title: 'Angebote-Liste',
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
			title: 'Tagline',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'bereich',
			title: 'Bereich-Filter',
			type: 'string',
			options: {
				list: [
					{ title: 'Alle', value: 'alle' },
					{ title: 'Nur Musik', value: 'musik' },
					{ title: 'Nur Tanz', value: 'tanz' },
				],
				layout: 'radio',
			},
			initialValue: 'alle',
		}),
		defineField({
			name: 'layout',
			title: 'Layout',
			type: 'string',
			options: {
				list: [
					{ title: 'Musik: 2 große Karten', value: 'musik-pair' },
					{ title: 'Tanz: 3er-Grid mit CTA-Tile', value: 'tanz-grid' },
					{ title: 'Übersicht (Prog-Cards 4er)', value: 'prog' },
				],
				layout: 'radio',
			},
			initialValue: 'prog',
		}),
		defineField({
			name: 'tinted',
			title: 'Warm-White Hintergrund',
			type: 'boolean',
			initialValue: false,
		}),
		defineField({
			name: 'ctaTileTitle',
			title: 'CTA-Tile · Titel',
			description: 'Nur sichtbar im Layout „Tanz: 3er-Grid mit CTA-Tile".',
			type: 'string',
		}),
		defineField({
			name: 'ctaTileText',
			title: 'CTA-Tile · Text',
			type: 'string',
		}),
		defineField({
			name: 'ctaTileLink',
			title: 'CTA-Tile · Link',
			type: 'link',
		}),
		defineField({
			name: 'ctaTileLinkLabel',
			title: 'CTA-Tile · Link-Label',
			type: 'string',
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		select: { accent: 'titleAccent', bereich: 'bereich' },
		prepare: ({ accent, bereich }) => ({
			title: accent || 'Angebote-Liste',
			subtitle: `Bereich: ${bereich || 'alle'}`,
		}),
	},
})
