import { defineField, defineType } from 'sanity'
import { iconField } from '../fragments/icon-field'
import { VscBriefcase } from 'react-icons/vsc'

export default defineType({
	name: 'job',
	title: 'Job',
	type: 'document',
	icon: VscBriefcase,
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField(iconField),
		defineField({
			name: 'type',
			title: 'Employment type',
			description: 'e.g. Part-time, Freelance',
			type: 'string',
		}),
		defineField({
			name: 'location',
			title: 'Location',
			type: 'string',
		}),
		defineField({
			name: 'summary',
			title: 'Summary',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'description',
			title: 'Full description',
			type: 'array',
			of: [{ type: 'block' }],
		}),
		defineField({
			name: 'applyEmailSubject',
			title: 'Mail subject for application',
			description:
				'Inserted into the mailto link. e.g. "Application for Dance teacher".',
			type: 'string',
		}),
		defineField({
			name: 'active',
			title: 'Active (show on site)',
			type: 'boolean',
			initialValue: true,
		}),
		defineField({
			name: 'order',
			title: 'Sort order',
			type: 'number',
		}),
		defineField({
			name: 'language',
			type: 'string',
			readOnly: true,
			hidden: true,
		}),
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'type',
			language: 'language',
		},
		prepare: ({ title, subtitle, language }) => ({
			title,
			subtitle: [language && `[${language}]`, subtitle].filter(Boolean).join(' · '),
		}),
	},
})
