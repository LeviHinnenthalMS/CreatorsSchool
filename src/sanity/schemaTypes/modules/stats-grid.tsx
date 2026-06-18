import { defineArrayMember, defineField, defineType } from 'sanity'
import { TfiStatsUp } from 'react-icons/tfi'
import { getBlockText, count } from '@/lib/utils'

export default defineType({
	name: 'stats-grid',
	title: 'Stats grid',
	icon: TfiStatsUp,
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
			name: 'title',
			title: 'Title (H2)',
			description:
				'Main headline. Rendered as <h2>. Use line breaks for multi-line layouts.',
			type: 'text',
			rows: 3,
			group: 'content',
		}),
		defineField({
			name: 'intro',
			title: 'Subtitle',
			description: 'Optional supporting copy shown below the headline.',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'content',
		}),
		defineField({
			name: 'stats',
			title: 'Stats',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'stat',
					fields: [
						defineField({
							name: 'icon',
							type: 'icon',
						}),
						defineField({
							name: 'value',
							title: 'Value',
							description: 'e.g. "10Mio+", "290K+", "10 Jahre".',
							type: 'string',
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: 'label',
							title: 'Label',
							description: 'Short description shown below the value.',
							type: 'string',
						}),
					],
					preview: {
						select: {
							value: 'value',
							label: 'label',
							ic0n: 'icon.ic0n',
							image: 'icon.image',
						},
						prepare: ({ value, label, ic0n, image }) => ({
							title: value,
							subtitle: label,
							media: ic0n ? <img src={`https://ic0n.dev/${ic0n}`} /> : image,
						}),
					},
				}),
			],
			group: 'content',
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-actions',
			type: 'array',
			of: [{ type: 'cta' }],
			group: 'content',
		}),
	],
	preview: {
		select: {
			title: 'title',
			intro: 'intro',
			stats: 'stats',
		},
		prepare: ({ title, intro, stats }) => ({
			title: title || getBlockText(intro) || count(stats, 'stat'),
			subtitle: 'Stats grid',
		}),
	},
})
