import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'site',
	title: 'Site settings',
	type: 'document',
	groups: [
		{ name: 'branding', default: true },
		{ name: 'seo' },
		{ name: 'contact', title: 'Kontakt' },
		{ name: 'badge', title: 'Header-Badge' },
		{ name: 'info' },
		{ name: 'cta' },
	],
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			validation: (Rule) => Rule.required(),
			group: 'branding',
		}),
		defineField({
			name: 'tagline',
			title: 'Tagline',
			description: 'Wird im Footer unter dem Logo angezeigt.',
			type: 'text',
			rows: 2,
			group: 'branding',
		}),
		defineField({
			name: 'logo',
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
			title: 'Telefon',
			description: 'Anzeige-Format, z. B. „01520 / 89 93 894"',
			type: 'string',
			group: 'contact',
		}),
		defineField({
			name: 'phoneTel',
			title: 'Telefon (tel: Link)',
			description: 'Internationales Format ohne Leerzeichen, z. B. „+4915208993894"',
			type: 'string',
			group: 'contact',
		}),
		defineField({
			name: 'whatsapp',
			title: 'WhatsApp-Nummer',
			description: 'Nur Ziffern (mit Ländervorwahl), z. B. „4915208993894"',
			type: 'string',
			group: 'contact',
		}),
		defineField({
			name: 'email',
			title: 'E-Mail',
			type: 'string',
			group: 'contact',
		}),
		defineField({
			name: 'addressLines',
			title: 'Adresse (mehrzeilig)',
			type: 'array',
			of: [{ type: 'string' }],
			group: 'contact',
		}),
		defineField({
			name: 'addressLabel',
			title: 'Adress-Label',
			description: 'z. B. „Wittekindsweg 10, 49324 Melle"',
			type: 'string',
			group: 'contact',
		}),
		defineField({
			name: 'mapLink',
			title: 'Routen-Link (Maps)',
			type: 'url',
			group: 'contact',
		}),
		defineField({
			name: 'hours',
			title: 'Öffnungszeiten / Hinweise',
			type: 'text',
			rows: 3,
			group: 'contact',
		}),

		defineField({
			name: 'eventBadge',
			title: 'Header-Event-Badge',
			description:
				'Pille rechts neben den Nav-Links („5.–6. Sep · Aufführung"). Verlinkt auf die hervorgehobene Aufführung.',
			type: 'object',
			group: 'badge',
			fields: [
				defineField({
					name: 'active',
					title: 'Anzeigen',
					type: 'boolean',
					initialValue: true,
				}),
				defineField({ name: 'label', title: 'Label (oben)', type: 'string' }),
				defineField({ name: 'sub', title: 'Unter-Label', type: 'string' }),
				defineField({
					name: 'link',
					title: 'Link',
					type: 'link',
				}),
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
