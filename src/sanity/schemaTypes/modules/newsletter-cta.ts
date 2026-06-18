import { defineField, defineType } from 'sanity'
import { TfiEmail } from 'react-icons/tfi'

export default defineType({
	name: 'newsletter-cta',
	title: 'Newsletter CTA',
	icon: TfiEmail,
	type: 'object',
	groups: [{ name: 'content', default: true }, { name: 'options' }],
	fields: [
		defineField({
			name: 'options',
			title: 'Module options',
			type: 'module-options',
			group: 'options',
		}),
		defineField({
			name: 'eyebrowImage',
			title: 'Eyebrow image',
			description:
				'Small image shown to the left of the eyebrow text (e.g. flag composite).',
			type: 'img',
			group: 'content',
		}),
		defineField({
			name: 'eyebrowText',
			title: 'Eyebrow text',
			description:
				'Short label shown above the heading (e.g. “+6.458 Mitglieder”). Rendered uppercase.',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'title',
			title: 'Title (H2)',
			description:
				'Main headline. Rendered as <h2>. Use line breaks for multi-line layouts.',
			type: 'text',
			rows: 3,
			validation: (Rule) => Rule.required(),
			group: 'content',
		}),
		defineField({
			name: 'image',
			title: 'Image',
			description:
				'Composite image shown on the right of the form (e.g. devices/screens mockup).',
			type: 'img',
			validation: (Rule) => Rule.required(),
			group: 'content',
		}),
		defineField({
			name: 'firstNameLabel',
			title: 'First name — accessible label',
			description:
				'Label read by screen readers. The placeholder below is the visible text.',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'firstNamePlaceholder',
			title: 'First name — placeholder',
			description: 'Leave empty to hide the first-name input entirely.',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'emailLabel',
			title: 'Email — accessible label',
			type: 'string',
			validation: (Rule) => Rule.required(),
			group: 'content',
		}),
		defineField({
			name: 'emailPlaceholder',
			title: 'Email — placeholder',
			type: 'string',
			validation: (Rule) => Rule.required(),
			group: 'content',
		}),
		defineField({
			name: 'submitLabel',
			title: 'Submit button label',
			type: 'string',
			validation: (Rule) => Rule.required(),
			group: 'content',
		}),
		defineField({
			name: 'privacyNote',
			title: 'Privacy note',
			description: 'Small helper copy shown below the submit button.',
			type: 'array',
			of: [{ type: 'block', styles: [{ title: 'Normal', value: 'normal' }] }],
			group: 'content',
		}),
		defineField({
			name: 'formAction',
			title: 'Form endpoint URL',
			description:
				'POST endpoint that receives `firstName` (optional) and `email` as form fields. Leave empty to use the default `/api/subscribe` endpoint (which also handles ActiveCampaign sync).',
			type: 'url',
			validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
			group: 'content',
		}),
		defineField({
			name: 'activeCampaignTag',
			title: 'ActiveCampaign tag',
			description:
				'Tag applied in ActiveCampaign to people who subscribe through this form (e.g. "sbc2026"). Only used when Form endpoint URL is empty (i.e. when posting to the default endpoint). Leave empty to skip ActiveCampaign.',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'successMessage',
			title: 'Success message',
			description: 'Replaces the form after a successful submission.',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'content',
		}),
		defineField({
			name: 'errorMessage',
			title: 'Error message',
			description: 'Shown inline if the submission fails.',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'benefits',
			title: 'Benefit items',
			description:
				'Short benefit labels shown below the form, each prefixed by a check icon.',
			type: 'array',
			of: [{ type: 'string' }],
			group: 'content',
		}),
	],
	preview: {
		select: {
			title: 'title',
			eyebrowText: 'eyebrowText',
			media: 'image.image',
		},
		prepare: ({ title, eyebrowText, media }) => ({
			title: title || eyebrowText || 'Newsletter CTA',
			subtitle: 'Newsletter CTA',
			media,
		}),
	},
})
