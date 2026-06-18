import { defineField, defineType } from 'sanity'
import { VscLayoutPanelLeft } from 'react-icons/vsc'

export default defineType({
	name: 'footer',
	title: 'Footer',
	icon: VscLayoutPanelLeft,
	type: 'document',
	groups: [
		{ name: 'identity', title: 'Identity', default: true },
		{ name: 'newsletter', title: 'Newsletter' },
		{ name: 'navigation', title: 'Navigation' },
		{ name: 'legal', title: 'Legal' },
	],
	fields: [
		defineField({
			name: 'tagline',
			title: 'Tagline',
			description: 'Short mission statement under the logo.',
			type: 'text',
			rows: 3,
			group: 'identity',
		}),

		defineField({
			name: 'newsletter',
			title: 'Newsletter',
			type: 'object',
			group: 'newsletter',
			fields: [
				defineField({ name: 'title', type: 'string' }),
				defineField({ name: 'description', type: 'text', rows: 2 }),
				defineField({
					name: 'namePlaceholder',
					title: 'Name field placeholder',
					type: 'string',
				}),
				defineField({
					name: 'emailPlaceholder',
					title: 'Email field placeholder',
					type: 'string',
				}),
				defineField({
					name: 'buttonLabel',
					title: 'Submit button label',
					type: 'string',
				}),
				defineField({
					name: 'formAction',
					title: 'Form action URL',
					description:
						'POST endpoint that receives { name, email }. Leave empty to disable the form.',
					type: 'url',
					validation: (Rule) =>
						Rule.uri({ scheme: ['https'], allowRelative: true }),
				}),
				defineField({
					name: 'successMessage',
					title: 'Success message',
					type: 'string',
				}),
				defineField({
					name: 'errorMessage',
					title: 'Error message',
					type: 'string',
				}),
			],
		}),

		defineField({
			name: 'columns',
			title: 'Columns',
			description: 'Each column shows a title and a list of links.',
			type: 'array',
			of: [{ type: 'link.group' }],
			group: 'navigation',
		}),

		defineField({
			name: 'socials',
			title: 'Social icons',
			description:
				'Icon links shown at the very bottom (YouTube, Instagram, etc.). The icon for each link is taken from its own Icon (SVG) field — fall back is automatic by URL when no icon is uploaded.',
			type: 'array',
			of: [{ type: 'link' }],
			group: 'navigation',
		}),

		defineField({
			name: 'privacyPolicy',
			title: 'Privacy policy link',
			description:
				'Used in newsletter consent text (e.g. "By submitting you agree to our privacy policy").',
			type: 'link',
			group: 'legal',
		}),
		defineField({
			name: 'bottomLinks',
			title: 'Bottom links',
			description:
				'Inline legal links shown next to the copyright (e.g. Datenschutz, Impressum).',
			type: 'array',
			of: [{ type: 'link' }],
			group: 'legal',
		}),

		defineField({
			name: 'copyright',
			title: 'Copyright text',
			description: 'Use {year} for the current year.',
			type: 'string',
			placeholder: '© {year} Alle Rechte vorbehalten',
			group: 'legal',
		}),

		defineField({
			name: 'language',
			type: 'string',
			readOnly: true,
			hidden: true,
		}),
	],
	preview: {
		select: { tagline: 'tagline', language: 'language' },
		prepare: ({ tagline, language }) => ({
			title: language ? `Footer [${language}]` : 'Footer',
			subtitle: tagline?.slice(0, 80),
		}),
	},
})
