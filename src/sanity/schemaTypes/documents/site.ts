import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'site',
	title: 'Site settings',
	type: 'document',
	groups: [
		{ name: 'branding', default: true },
		{ name: 'seo' },
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
