import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'cta-band',
	title: 'CTA-Band (coral)',
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
			title: 'Headline · Akzent (blush)',
			type: 'string',
		}),
		defineField({
			name: 'titleAfter',
			title: 'Headline · nach Akzent',
			type: 'string',
		}),
		defineField({ name: 'text', title: 'Text', type: 'text', rows: 3 }),
		defineField({
			name: 'showPhone',
			title: 'Telefonnummer groß zeigen (aus Site-Settings)',
			type: 'boolean',
			initialValue: true,
		}),
		defineField({
			name: 'showWhatsapp',
			title: 'WhatsApp-Button zeigen',
			type: 'boolean',
			initialValue: true,
		}),
		defineField({
			name: 'showEmail',
			title: 'E-Mail-Button zeigen',
			type: 'boolean',
			initialValue: true,
		}),
		defineField({
			name: 'whatsappLabel',
			title: 'WhatsApp-Label',
			type: 'string',
		}),
		defineField({
			name: 'emailLabel',
			title: 'E-Mail-Label',
			type: 'string',
		}),
		defineField({
			name: 'extraCtas',
			title: 'Weitere CTAs (Outline)',
			type: 'array',
			of: [{ type: 'cta' }],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		prepare: () => ({ title: 'CTA-Band' }),
	},
})
