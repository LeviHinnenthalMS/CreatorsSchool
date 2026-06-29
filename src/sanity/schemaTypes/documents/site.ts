import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'site',
	title: 'Site settings',
	type: 'document',
	groups: [
		{ name: 'branding', title: 'Branding', default: true },
		{ name: 'seo', title: 'SEO' },
		{ name: 'contact', title: 'Contact' },
		{ name: 'badge', title: 'Header badge' },
		{ name: 'info', title: 'Info' },
		{ name: 'cta', title: 'CTA' },
	],
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (Rule) => Rule.required(),
			group: 'branding',
		}),
		defineField({
			name: 'tagline',
			title: 'Tagline',
			description: 'Shown under the logo in the footer.',
			type: 'text',
			rows: 2,
			group: 'branding',
		}),
		defineField({
			name: 'logo',
			title: 'Logo',
			type: 'logo',
			group: 'branding',
		}),
		defineField({
			name: 'ogimage',
			title: 'Default social sharing image (OG image)',
			description:
				'Shown in link previews on social networks and chat apps for every page that does not set its own override. Recommended size: 1200×630.',
			type: 'image',
			options: {
				hotspot: true,
				metadata: ['lqip'],
			},
			group: 'seo',
			validation: (Rule) =>
				Rule.required().warning(
					'No default OG image set — link previews will fall back to a generated image.',
				),
		}),

		defineField({
			name: 'phone',
			title: 'Phone (display)',
			description: 'Display format, e.g. "01520 / 89 93 894"',
			type: 'string',
			group: 'contact',
		}),
		defineField({
			name: 'phoneTel',
			title: 'Phone (tel: link)',
			description: 'International format without spaces, e.g. "+4915208993894"',
			type: 'string',
			group: 'contact',
		}),
		defineField({
			name: 'whatsapp',
			title: 'WhatsApp number',
			description: 'Digits only (with country code), e.g. "4915208993894"',
			type: 'string',
			group: 'contact',
		}),
		defineField({
			name: 'email',
			title: 'Email',
			type: 'string',
			group: 'contact',
		}),
		defineField({
			name: 'addressLines',
			title: 'Address (multi-line)',
			type: 'array',
			of: [{ type: 'string' }],
			group: 'contact',
		}),
		defineField({
			name: 'addressLabel',
			title: 'Address label',
			description: 'e.g. "Wittekindsweg 10, 49324 Melle"',
			type: 'string',
			group: 'contact',
		}),
		defineField({
			name: 'mapLink',
			title: 'Maps link',
			type: 'url',
			group: 'contact',
		}),
		defineField({
			name: 'hours',
			title: 'Opening hours / notes',
			type: 'text',
			rows: 3,
			group: 'contact',
		}),

		defineField({
			name: 'eventBadge',
			title: 'Header event badge',
			description:
				'Pill next to the nav links ("5.–6. Sep · Performance"). Links to the featured performance.',
			type: 'object',
			group: 'badge',
			fields: [
				defineField({
					name: 'active',
					title: 'Show',
					type: 'boolean',
					initialValue: true,
				}),
				defineField({ name: 'label', title: 'Label (top)', type: 'string' }),
				defineField({ name: 'sub', title: 'Sub-label', type: 'string' }),
				defineField({ name: 'link', title: 'Link', type: 'link' }),
			],
		}),

		defineField({
			name: 'announcements',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'announcement' }] }],
			group: 'info',
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-action (global)',
			description: 'Typically used in the header and/or footer.',
			type: 'array',
			of: [{ type: 'cta' }],
			group: 'cta',
		}),
	],
	preview: {
		prepare: () => ({
			title: 'Site settings',
		}),
	},
})
