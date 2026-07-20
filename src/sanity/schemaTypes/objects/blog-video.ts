import { defineField, defineType } from 'sanity'
import { VscPlayCircle } from 'react-icons/vsc'

export default defineType({
	name: 'blog.video',
	title: 'Video',
	type: 'object',
	icon: VscPlayCircle,
	fields: [
		defineField({
			name: 'url',
			title: 'Video URL',
			description:
				'Paste a YouTube or Vimeo URL, or a direct link to a video file.',
			type: 'url',
		}),
		defineField({
			name: 'file',
			title: 'Or upload a video',
			type: 'file',
			options: { accept: 'video/*' },
		}),
		defineField({
			name: 'caption',
			title: 'Caption',
			type: 'string',
		}),
	],
	validation: (Rule) =>
		Rule.custom((value) => {
			const video = value as
				| { url?: string; file?: { asset?: { _ref?: string } } }
				| undefined
			return video?.url || video?.file?.asset?._ref
				? true
				: 'Add a video URL or upload a video file.'
		}),
	preview: {
		select: { title: 'caption', url: 'url' },
		prepare: ({ title, url }) => ({
			title: title || 'Video',
			subtitle: url,
			media: VscPlayCircle,
		}),
	},
})
