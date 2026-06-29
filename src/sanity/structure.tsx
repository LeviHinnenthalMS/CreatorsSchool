import { structureTool } from 'sanity/structure'
import { singleton, group, languageList } from './lib/builders'
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
	VscMegaphone,
	VscCalendar,
	VscBriefcase,
	VscDeviceCamera,
} from 'react-icons/vsc'
import { GoPerson, GoNote } from 'react-icons/go'
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

				S.documentTypeListItem('global-module').title('Global modules'),
				S.divider(),

				// ── Creators School: domain content ───────────────────────
				group(S, 'Creators School', [
					languageList(S, 'offering', 'Offerings').icon(GoNote),
					languageList(S, 'scheduleSlot', 'Schedule').icon(VscCalendar),
					languageList(S, 'galleryImage', 'Gallery').icon(VscDeviceCamera),
					languageList(S, 'performance', 'Performances').icon(VscMegaphone),
					languageList(S, 'teacher', 'Teachers').icon(GoPerson),
					languageList(S, 'job', 'Jobs').icon(VscBriefcase),
				]),

				S.listItem()
					.title('Contact submissions')
					.icon(VscMail)
					.child(
						S.documentList()
							.id('contactSubmission.list')
							.title('Contact submissions')
							.apiVersion('2024-12-01')
							.filter('_type == "contactSubmission"')
							.defaultOrdering([
								{ field: 'submittedAt', direction: 'desc' },
							]),
					),

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
