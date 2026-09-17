import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscMegaphone } from 'react-icons/vsc'

export default defineType({
	name: 'performance',
	title: 'Performance',
	type: 'document',
	icon: VscMegaphone,
	groups: [
		{ name: 'content', title: 'Content', default: true },
		{ name: 'media', title: 'Media (after the event)' },
		{ name: 'seo', title: 'SEO' },
	],
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			group: 'content',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'year',
			title: 'Year',
			type: 'number',
			group: 'content',
		}),
		defineField({
			name: 'dates',
			title: 'Dates (display)',
			description: 'e.g. "5.–6. September 2026"',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'startDate',
			title: 'Start date',
			type: 'date',
			group: 'content',
		}),
		defineField({
			name: 'venue',
			title: 'Venue',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'bigNumber',
			title: 'Big number (date block)',
			description:
				'The large number(s) shown in the date block, e.g. "5 & 6". Leave empty to hide the date block.',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'monthLabel',
			title: 'Month label',
			description: 'Shown under the big number, e.g. "September 2026".',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text',
			rows: 4,
			group: 'content',
		}),
		defineField({
			name: 'lead',
			title: 'Lead sentence',
			description: 'e.g. "Two evenings, one school on stage."',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'ticketInfo',
			title: 'Ticket info',
			type: 'text',
			rows: 3,
			group: 'content',
		}),
		defineField({
			name: 'image',
			title: 'Image',
			type: 'image',
			group: 'content',
			options: { hotspot: true, metadata: ['lqip'] },
			fields: [
				defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
			],
		}),
		defineField({
			name: 'featured',
			title: 'Featured (header badge & home banner)',
			type: 'boolean',
			group: 'content',
			initialValue: false,
		}),
		defineField({
			name: 'badgeLabel',
			title: 'Badge label',
			description: 'e.g. "5.–6. Sep"',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'badgeSub',
			title: 'Badge sublabel',
			description: 'e.g. "Performance"',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'videoUrl',
			title: 'YouTube video URL',
			description:
				'Unlisted YouTube link to the full event recording. Shown at the top of the performance page.',
			type: 'url',
			group: 'media',
			validation: (Rule) =>
				Rule.uri({ scheme: ['http', 'https'] }).custom((value) => {
					if (!value) return true
					try {
						const url = new URL(value)
						const host = url.hostname.replace(/^www\./, '')
						if (host === 'youtu.be' || host.endsWith('youtube.com')) return true
						return 'Only YouTube URLs are supported.'
					} catch {
						return 'Not a valid URL.'
					}
				}),
		}),
		defineField({
			name: 'videoDownloadUrl',
			title: 'Video download URL (optional)',
			description:
				'External link (e.g. Google Drive, WeTransfer) if visitors should be able to download the raw video file.',
			type: 'url',
			group: 'media',
		}),
		defineField({
			name: 'photos',
			title: 'Photos',
			description:
				'Event photos shown in a masonry gallery below the video. Click opens a lightbox with keyboard navigation.',
			type: 'array',
			group: 'media',
			of: [
				defineArrayMember({
					name: 'eventPhoto',
					title: 'Photo',
					type: 'image',
					options: { hotspot: true, metadata: ['lqip'] },
					fields: [
						defineField({
							name: 'alt',
							title: 'Alt text',
							type: 'localizedString',
							description:
								'Describe the photo for screen readers. If left empty, the filename is used as a fallback — best to write a real description for accessibility.',
							validation: (Rule) =>
								Rule.warning(
									'Add alt text so screen readers describe this photo properly.',
								),
						}),
						defineField({
							name: 'caption',
							title: 'Caption (optional)',
							type: 'localizedString',
							description:
								'Shown under the photo in the lightbox. Leave empty if no caption is needed.',
						}),
						defineField({
							name: 'span',
							title: 'Grid span',
							description:
								'Tile size in the dense masonry grid (grid-auto-flow: dense).',
							type: 'string',
							options: {
								list: [
									{ title: 'Normal', value: 'normal' },
									{ title: 'Wide (2 columns)', value: 'wide' },
									{ title: 'Tall (2 rows)', value: 'tall' },
									{ title: 'Big (2×2)', value: 'big' },
								],
								layout: 'radio',
							},
							initialValue: 'normal',
						}),
					],
					preview: {
						select: {
							media: 'asset',
							altDe: 'alt.de',
							altEn: 'alt.en',
						},
						prepare: ({ media, altDe, altEn }) => ({
							title: altDe || altEn || 'Photo',
							media,
						}),
					},
				}),
			],
		}),
		defineField({
			name: 'photosZip',
			title: 'Photos ZIP (bulk download)',
			description:
				'Pre-built ZIP with all event photos. Shown as "Download all photos" at the bottom of the page.',
			type: 'file',
			group: 'media',
			options: { accept: '.zip,application/zip' },
		}),
		defineField({
			name: 'metadata',
			title: 'Metadata',
			type: 'metadata',
			group: 'seo',
		}),
		defineField({
			name: 'language',
			type: 'string',
			readOnly: true,
			hidden: true,
		}),
	],
	orderings: [
		{
			name: 'date',
			title: 'By date',
			by: [{ field: 'startDate', direction: 'desc' }],
		},
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'dates',
			media: 'image',
			language: 'language',
		},
		prepare: ({ title, subtitle, media, language }) => ({
			title,
			subtitle: [language && `[${language}]`, subtitle].filter(Boolean).join(' · '),
			media,
		}),
	},
})
