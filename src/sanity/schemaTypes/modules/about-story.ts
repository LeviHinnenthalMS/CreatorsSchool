import { defineField, defineType } from 'sanity'
import { LuBookOpen } from 'react-icons/lu'
import { richTitleField } from '../fragments/rich-title'

export default defineType({
	name: 'about-story',
	title: 'About story',
	icon: LuBookOpen,
	type: 'object',
	groups: [
		{ name: 'content', default: true },
		{ name: 'photo', title: 'Photo card' },
		{ name: 'signature', title: 'Signature' },
		{ name: 'options' },
	],
	fields: [
		defineField({ name: 'options', type: 'module-options', group: 'options' }),

		defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string', group: 'content' }),
		defineField({
			name: 'title',
			title: 'Headline',
			...richTitleField(),
			group: 'content',
		}),
		defineField({
			name: 'body',
			title: 'Body paragraphs',
			type: 'array',
			of: [
				{
					type: 'block',
					styles: [{ title: 'Normal', value: 'normal' }],
					lists: [],
					marks: { decorators: [], annotations: [] },
				},
			],
			group: 'content',
		}),

		// Photo card
		defineField({
			name: 'image',
			title: 'Photo',
			type: 'image',
			options: { hotspot: true, metadata: ['lqip'] },
			fields: [
				defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
				defineField({ name: 'caption', title: 'Caption (bold)', type: 'string' }),
				defineField({ name: 'captionSub', title: 'Caption subtitle', type: 'string' }),
			],
			group: 'photo',
		}),
		defineField({
			name: 'video',
			title: 'YouTube video URL',
			description: 'If set, replaces the photo. Use a standard youtube.com or youtu.be URL.',
			type: 'url',
			group: 'photo',
		}),

		// Signature block
		defineField({
			name: 'signatureName',
			title: 'Signature name (italic accent)',
			description: 'Short first name shown in italic red after the dash, e.g. "Miriam"',
			type: 'string',
			group: 'signature',
		}),
		defineField({
			name: 'personName',
			title: 'Full name',
			type: 'string',
			group: 'signature',
		}),
		defineField({
			name: 'personRole',
			title: 'Role / title',
			description: 'Shown in small-caps below the name, e.g. "INHABERIN & PÄDAGOGISCHE LEITUNG"',
			type: 'string',
			group: 'signature',
		}),
	],
	preview: {
		select: { eyebrow: 'eyebrow', personName: 'personName' },
		prepare: ({ eyebrow, personName }) => ({
			title: eyebrow || personName || 'About story',
			subtitle: 'About story',
		}),
	},
})
