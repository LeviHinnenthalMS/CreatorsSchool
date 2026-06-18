import { defineField, defineType } from 'sanity'
import { VscMail } from 'react-icons/vsc'

export default defineType({
	name: 'subscription',
	title: 'Subscription',
	icon: VscMail,
	type: 'document',
	readOnly: true,
	fields: [
		defineField({
			name: 'name',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'email',
			type: 'string',
			validation: (Rule) => Rule.required().email(),
		}),
		defineField({
			name: 'kind',
			title: 'Subscription type',
			type: 'string',
			options: {
				list: [{ value: 'newsletter', title: 'Newsletter signup' }],
			},
			initialValue: 'newsletter',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'source',
			title: 'Source',
			description: 'Where the subscription came from (page path, etc.).',
			type: 'string',
		}),
		defineField({
			name: 'language',
			type: 'string',
		}),
		defineField({
			name: 'createdAt',
			title: 'Submitted at',
			type: 'datetime',
		}),
	],
	orderings: [
		{
			title: 'Most recent first',
			name: 'createdAtDesc',
			by: [{ field: 'createdAt', direction: 'desc' }],
		},
	],
	preview: {
		select: {
			name: 'name',
			email: 'email',
			kind: 'kind',
			createdAt: 'createdAt',
		},
		prepare: ({ name, email, kind, createdAt }) => {
			const when = createdAt ? new Date(createdAt).toLocaleString() : ''
			return {
				title: `${name ?? ''} <${email ?? ''}>`,
				subtitle: [kind, when].filter(Boolean).join(' · '),
			}
		},
	},
})
