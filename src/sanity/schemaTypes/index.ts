import { type SchemaTypeDefinition } from 'sanity'

// documents
import site from './documents/site'
import footer from './documents/footer'
import page from './documents/page'
import globalModule from './documents/global-module'
import blogPost from './documents/blog.post'
import navigation from './documents/navigation'
import redirect from './documents/redirect'

// miscellaneous
import announcement from './misc/announcement'
import logo from './misc/logo'
import person from './misc/person'
import testimonial from './misc/testimonial'
import subscription from './misc/subscription'

// objects
import cta from './objects/cta'
import feature from './objects/feature'
import icon from './objects/icon'
import img from './objects/img'
import link from './objects/link'
import linkNav from './objects/link.nav'
import linkList from './objects/link.list'
import linkGroup from './objects/link.group'
import localizedString from './objects/localized-string'
import metadata from './objects/metadata'
import moduleOptions from './objects/module-options'

// modules
import aboutStory from './modules/about-story'
import accordionList from './modules/accordion-list'
import blogOverview from './modules/blog-overview'
import blogPostContent from './modules/blog-post-content'
import breadcrumbs from './modules/breadcrumbs'
import callout from './modules/callout'
import centeredCta from './modules/centered-cta'
import comparisonCards from './modules/comparison-cards'
import customHtml from './modules/custom-html'
import featureMedia from './modules/feature-media'
import featureTabs from './modules/feature-tabs'
import heroSplit from './modules/hero.split'
import imageCallouts from './modules/image-callouts'
import meetTheFounder from './modules/meet-the-founder'
import meetTheTeam from './modules/meet-the-team'
import newsletterCta from './modules/newsletter-cta'
import personList from './modules/person-list'
import richtextModule from './modules/richtext-module'
import searchModule from './modules/search-module'
import socialProofLogos from './modules/social-proof.logos'
import statsGrid from './modules/stats-grid'
import styleGuide from './modules/style-guide'
import testimonialFeatured from './modules/testimonial.featured'
import testimonialGrid from './modules/testimonial.grid'
import videoWithText from './modules/video-with-text'

export const schemaTypes: SchemaTypeDefinition[] = [
	// documents
	site,
	footer,
	page,
	globalModule,
	blogPost,
	navigation,

	// storage items
	announcement,
	redirect,
	logo,
	person,
	testimonial,
	subscription,

	// objects
	localizedString,
	cta,
	feature,
	icon,
	img,
	link,
	linkNav,
	linkList,
	linkGroup,
	metadata,
	moduleOptions,

	// modules
	aboutStory,
	accordionList,
	blogOverview,
	blogPostContent,
	breadcrumbs,
	callout,
	centeredCta,
	comparisonCards,
	customHtml,
	featureMedia,
	featureTabs,
	heroSplit,
	imageCallouts,
	meetTheFounder,
	meetTheTeam,
	newsletterCta,
	personList,
	richtextModule,
	searchModule,
	socialProofLogos,
	statsGrid,
	styleGuide,
	testimonialFeatured,
	testimonialGrid,
	videoWithText,
]
