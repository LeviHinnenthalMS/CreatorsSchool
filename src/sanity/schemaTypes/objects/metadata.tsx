import { defineField, defineType } from 'sanity'
import { defineQuery, groq } from 'next-sanity'
import { CharacterCount } from '@/sanity/ui/CharacterCount'
import PreviewOG from '@/sanity/ui/PreviewOG'

const SLUG_CONFLICT_QUERY = defineQuery(groq`*[
	_type == $type
	&& !(_id in [$draft, $published])
	&& metadata.slug.current == $slug
	&& coalesce(language, null) == $language
][0]._id`)

export default defineType({
	name: 'metadata',
	title: 'Metadata',
	description: 'For search engines',
	type: 'object',
	fields: [
		defineField({
			name: 'slug',
			type: 'slug',
			description: 'URL path or permalink — keine führenden / (z.B. "videos/job" nicht "/videos/job")',
			options: {
				source: (doc: any) =>
					doc.title ||
					doc.titel ||
					doc.name ||
					doc.metadata?.title,
				slugify: (input: string) =>
					input
						.toLowerCase()
						.trim()
						.replace(/\s+/g, '-')
						.replace(/[^\w-/]/g, '')
						.replace(/^\/+/, ''), // strip leading slashes
				// Scope uniqueness by language so `index` (and any slug) can be
				// reused once per translation. Without this, Sanity rejects
				// duplicate slugs across translated documents and editors are
				// forced to invent placeholders like `de-index`/`en-index`.
				isUnique: async (slug, context) => {
					const { document, getClient } = context
					if (!document?._type || !document._id) return true

					const client = getClient({ apiVersion: '2024-01-01' })
					const id = document._id.replace(/^drafts\./, '')
					const language = (document as { language?: string }).language ?? null

					const conflictId = await client.fetch<string | null>(
						SLUG_CONFLICT_QUERY,
						{
							type: document._type,
							draft: `drafts.${id}`,
							published: id,
							slug,
							language,
						},
					)

					return !conflictId
				},
			},
			validation: (Rule) =>
				Rule.required().custom((slug) => {
					if (!slug?.current) return true
					if (/^\//.test(slug.current))
						return 'Slug darf nicht mit "/" beginnen — führendes Slash entfernen'
					return true
				}),
		}),
		defineField({
			name: 'title',
			type: 'string',
			description:
				'Headline shown by search engines and social cards. Keep under 60 characters so it does not get truncated.',
			validation: (Rule) => [
				Rule.required().warning(
					'SEO title is missing — search engines will fall back to the page heading.',
				),
				Rule.max(60).warning('SEO title should be under 60 characters.'),
			],
			components: {
				input: (props) => (
					<CharacterCount max={60} {...(props as any)}>
						<PreviewOG title={props.elementProps.value} />
					</CharacterCount>
				),
			},
		}),
		defineField({
			name: 'description',
			type: 'text',
			description:
				'1–2 sentence summary shown by search engines and social cards. Keep under 160 characters.',
			validation: (Rule) => [
				Rule.required().warning(
					'SEO description is missing — search engines may show a snippet from the page body instead.',
				),
				Rule.max(160).warning(
					'SEO description should be under 160 characters.',
				),
			],
			components: {
				input: (props) => (
					<CharacterCount as="textarea" max={160} {...(props as any)} />
				),
			},
		}),
		defineField({
			name: 'image',
			title: 'Social sharing image (override)',
			description:
				'Optional. Overrides the global OG image set on Site settings for this page only. Leave empty in almost all cases — the global OG image is used by default.',
			type: 'image',
			options: {
				hotspot: true,
				metadata: ['lqip'],
			},
		}),
		defineField({
			name: 'noIndex',
			description: 'Prevent search engines from indexing this page',
			type: 'boolean',
			initialValue: false,
		}),
	],
})
