import { defineField, defineType } from 'sanity'
import { GoPeople } from 'react-icons/go'

export default defineType({
	name: 'meet-the-team',
	title: 'Meet the Team',
	icon: GoPeople,
	type: 'object',
	fields: [
		defineField({
			name: 'title',
			title: 'Heading',
			description: 'Use line breaks (Enter) for manual wrapping. This version is shown on desktop.',
			type: 'text',
			rows: 2,
		}),
		defineField({
			name: 'titleMobile',
			title: 'Heading (Mobile, optional)',
			description: 'If set, shown instead of the main heading on mobile. Useful for different line breaks on small screens.',
			type: 'text',
			rows: 2,
		}),
		defineField({
			name: 'intro',
			title: 'Intro text',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'image',
			title: 'Team map image',
			description: 'Upload the map graphic with all team members already on it.',
			type: 'image',
			options: { hotspot: false },
		}),
		defineField({
			name: 'mobileImage',
			title: 'Mobile image (optional)',
			description: 'If set, shown instead of the main image on mobile. Leave empty to use the main image on all sizes.',
			type: 'image',
			options: { hotspot: false },
		}),
	],
	preview: {
		select: { title: 'title' },
		prepare: ({ title }) => ({
			title: title || 'Meet the Team',
			subtitle: 'Team map',
		}),
	},
})
