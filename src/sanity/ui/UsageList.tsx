'use client'

import { useEffect, useState } from 'react'
import { useClient, useFormValue } from 'sanity'
import { IntentLink } from 'sanity/router'
import { Badge, Card, Flex, Spinner, Stack, Text } from '@sanity/ui'
import { VscLinkExternal } from 'react-icons/vsc'

type ReferencingDoc = {
	_id: string
	_type: string
	displayTitle?: string
	slug?: string
	language?: string
}

const DOC_TYPE_LABELS: Record<string, string> = {
	page: 'Page',
	'blog.post': 'Blog post',
	'landing-page': 'Landing page',
	'global-module': 'Global module',
	navigation: 'Navigation',
	footer: 'Footer',
}

export default function UsageList(_props?: unknown) {
	const docId = useFormValue(['_id']) as string | undefined
	const client = useClient({ apiVersion: '2024-01-01' })
	const [docs, setDocs] = useState<ReferencingDoc[] | null>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!docId) return
		const publishedId = docId.replace(/^drafts\./, '')

		let cancelled = false
		setError(null)
		setDocs(null)

		client
			.fetch<ReferencingDoc[]>(
				`*[references($id) || references($draftId)] | order(_type asc, title asc) {
					_id,
					_type,
					language,
					'displayTitle': coalesce(title, name, author.name),
					'slug': metadata.slug.current
				}`,
				{ id: publishedId, draftId: `drafts.${publishedId}` },
			)
			.then((result) => {
				if (cancelled) return
				const seen = new Set<string>()
				const unique = result.filter((d) => {
					const base = d._id.replace(/^drafts\./, '')
					if (seen.has(base)) return false
					seen.add(base)
					return true
				})
				setDocs(unique)
			})
			.catch((err) => {
				if (cancelled) return
				setError(err?.message ?? 'Failed to load usage')
			})

		return () => {
			cancelled = true
		}
	}, [client, docId])

	if (!docId) {
		return (
			<Card padding={3} radius={2} tone="transparent" border>
				<Text size={1} muted>
					Save the document to see where it&rsquo;s used.
				</Text>
			</Card>
		)
	}

	if (error) {
		return (
			<Card padding={3} radius={2} tone="critical" border>
				<Text size={1}>Couldn&rsquo;t load usage: {error}</Text>
			</Card>
		)
	}

	if (!docs) {
		return (
			<Flex padding={3} align="center" gap={3}>
				<Spinner muted />
				<Text size={1} muted>
					Looking for places that use this&hellip;
				</Text>
			</Flex>
		)
	}

	if (!docs.length) {
		return (
			<Card padding={3} radius={2} tone="transparent" border>
				<Text size={1} muted>
					Not used on any page yet.
				</Text>
			</Card>
		)
	}

	return (
		<Stack space={2}>
			{docs.map((d) => {
				const typeLabel = DOC_TYPE_LABELS[d._type] ?? d._type

				return (
					<IntentLink
						key={d._id}
						intent="edit"
						params={{ id: d._id, type: d._type }}
						style={{ textDecoration: 'none', color: 'inherit' }}
					>
						<Card padding={3} radius={2} shadow={1}>
							<Flex align="center" gap={3} justify="space-between">
								<Stack space={2} flex={1}>
									<Text weight="medium">
										{d.displayTitle || '(Untitled)'}
									</Text>
									<Flex gap={2} align="center" wrap="wrap">
										<Badge tone="primary" fontSize={0}>
											{typeLabel}
										</Badge>
										{d.language && (
											<Badge fontSize={0}>{d.language}</Badge>
										)}
										{d.slug && (
											<Text size={1} muted>
												/{d.slug}
											</Text>
										)}
									</Flex>
								</Stack>
								<Text muted>
									<VscLinkExternal />
								</Text>
							</Flex>
						</Card>
					</IntentLink>
				)
			})}
		</Stack>
	)
}
