import { defineField, defineType } from 'sanity'
import { richTitleField } from '../fragments/rich-title'

export default defineType({
	name: 'cta-band',
	title: 'CTA band (coral)',
	type: 'object',
	fields: [
		defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
		defineField({
			name: 'title',
			title: 'Headline',
			...richTitleField(),
		}),
		defineField({ name: 'text', title: 'Text', type: 'text', rows: 3 }),
		defineField({
			name: 'showPhone',
			title: 'Show large phone number (from site settings)',
			type: 'boolean',
			initialValue: true,
		}),
		defineField({
			name: 'showWhatsapp',
			title: 'Show WhatsApp button',
			type: 'boolean',
			initialValue: true,
		}),
		defineField({
			name: 'showEmail',
			title: 'Show email button',
			type: 'boolean',
			initialValue: true,
		}),
		defineField({
			name: 'whatsappLabel',
			title: 'WhatsApp button label',
			type: 'string',
		}),
		defineField({
			name: 'emailLabel',
			title: 'Email button label',
			type: 'string',
		}),
		defineField({
			name: 'extraCtas',
			title: 'Extra CTAs (outline)',
			type: 'array',
			of: [{ type: 'cta' }],
		}),
		defineField({ name: 'options', type: 'module-options' }),
	],
	preview: {
		select: { eyebrow: 'eyebrow' },
		prepare: ({ eyebrow }) => ({ title: eyebrow || 'CTA band', subtitle: 'CTA band (coral)' }),
	},
})
