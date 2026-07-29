import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscDeviceCamera } from 'react-icons/vsc'

const categories = [
	{ title: 'Music', value: 'musik' },
	{ title: 'Dance', value: 'tanz' },
	{ title: 'Stage', value: 'buehne' },
	{ title: 'School', value: 'schule' },
]

export default defineType({
	name: 'gallery',
	title: 'Gallery',
	type: 'document',
	icon: VscDeviceCamera,
	fields: [
		defineField({
			name: 'images',
			title: 'Media',
			description:
				'Add images or uploaded videos and drag them into the order they should appear on the website.',
			type: 'array',
			of: [
				defineArrayMember({
					name: 'galleryImage',
					title: 'Gallery image',
					type: 'image',
					options: {
						hotspot: true,
						metadata: ['lqip'],
					},
					fields: [
						defineField({
							name: 'caption',
							title: 'Alt text',
							type: 'localizedString',
							description:
								'Describe the image for screen readers. This text is not shown on the website.',
							validation: (Rule) =>
								Rule.required().error(
									'Alt text is required for accessibility.',
								),
						}),
						defineField({
							name: 'bereich',
							title: 'Category',
							type: 'string',
							options: { list: categories },
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
				}),
				defineArrayMember({
					name: 'galleryVideo',
					title: 'Gallery video',
					type: 'file',
					options: {
						accept: 'video/*',
					},
					fields: [
						defineField({
							name: 'poster',
							title: 'Poster image',
							description:
								'Optional but recommended. Shown before the visitor starts the video.',
							type: 'image',
							options: {
								hotspot: true,
								metadata: ['lqip'],
							},
						}),
						defineField({
							name: 'caption',
							title: 'Caption',
							type: 'localizedString',
							description:
								'Describe the video. This is shown as its caption and used in the play-button label.',
							validation: (Rule) =>
								Rule.required().error('Caption is required for accessibility.'),
						}),
						defineField({
							name: 'bereich',
							title: 'Category',
							type: 'string',
							options: { list: categories },
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
				}),
			],
		}),
	],
	preview: {
		select: {
			images: 'images',
		},
		prepare: ({ images }) => ({
			title: 'Gallery',
			subtitle: `${images?.length ?? 0} ${
				images?.length === 1 ? 'item' : 'items'
			}`,
			media: images?.[0],
		}),
	},
})
