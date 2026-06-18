import { structureTool } from 'sanity/structure'
import { singleton, group, directory, languageList } from './lib/builders'
import {
	VscFiles,
	VscServerProcess,
	VscEdit,
	VscMap,
	VscPin,
	VscVerified,
	VscHome,
	VscLayoutPanelLeft,
	VscMail,
} from 'react-icons/vsc'
import { GoPerson } from 'react-icons/go'
import { GrBlockQuote } from 'react-icons/gr'

export const structure = structureTool({
	structure: (S) =>
		S.list()
			.title('Content')
			.items([
				singleton(S, 'site', 'Site settings').icon(VscServerProcess),
				languageList(S, 'footer', 'Footer').icon(VscLayoutPanelLeft),
				languageList(S, 'navigation', 'Navigation').icon(VscMap),
				S.documentTypeListItem('redirect').title('Redirects'),
				S.divider(),

				languageList(S, 'page', 'Homepage', {
					id: 'page.home',
					extraFilter: 'metadata.slug.current == "index"',
				}).icon(VscHome),
				languageList(S, 'page', 'Pages', {
					id: 'page.nonHome',
					extraFilter: 'metadata.slug.current != "index"',
				}).icon(VscFiles),
				group(S, 'Directories', [
					directory(S, 'docs', { maxLevel: 1 }).title('Docs'),
					directory(S, 'docs/modules').title('Docs › Modules'),
				]),

				S.documentTypeListItem('global-module').title('Global modules'),
				S.divider(),

				languageList(S, 'blog.post', 'Blog Posts').icon(VscEdit),
				S.divider(),

				// ── Social Proof ──────────────────────────────────────────
				group(S, 'Social Proof', [
					languageList(S, 'testimonial', 'Testimonials').icon(GrBlockQuote),
					languageList(S, 'logo', 'Logos').icon(VscVerified),
				]),

				// ── People & Announcements ────────────────────────────────
				group(S, 'People', [
					languageList(S, 'person', 'People').icon(GoPerson),
					languageList(S, 'announcement', 'Announcements').icon(VscPin),
				]),

				// ── Subscriptions ────────────────────────────────────────
				S.listItem()
					.title('Newsletter subscribers')
					.icon(VscMail)
					.child(
						S.documentList()
							.id('subscription.newsletter')
							.title('Newsletter subscribers')
							.apiVersion('2024-12-01')
							.filter('_type == "subscription" && kind == "newsletter"')
							.defaultOrdering([
								{ field: 'createdAt', direction: 'desc' },
							]),
					),
			]),
})
