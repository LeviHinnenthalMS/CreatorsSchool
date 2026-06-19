import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
	name: 'location-card',
	title: 'Anfahrts-Karte',
	type: 'object',
	fields: [
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
			name: 'text',
			title: 'Text',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'directions',
			title: 'Anfahrt-Punkte',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'direction',
					fields: [
						defineField({ name: 'icon', title: 'Icon-Key', type: 'string' }),
						defineField({ name: 'title', type: 'string' }),
						defineField({ name: 'text', type: 'string' }),
					],
					preview: { select: { title: 'title', subtitle: 'text' } },
				}),
			],
		}),
		defineField({
			name: 'mapImage',
			title: 'Karten-Bild (Screenshot oder Statik-Karte)',
			type: 'image',
			options: { hotspot: true, metadata: ['lqip'] },
			fields: [
				defineField({
					name: 'alt',
					title: 'Alt-Text',
					type: 'string',
				}),
			],
		}),
		defineField({
			name: 'mapLink',
			title: 'Link auf Maps',
			type: 'link',
		}),
		defineField({
			name: 'mapLinkLabel',
			title: 'Maps-Button-Label',
			type: 'string',
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		prepare: () => ({ title: 'Anfahrts-Karte' }),
	},
})
