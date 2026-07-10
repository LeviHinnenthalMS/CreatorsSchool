import { type SchemaTypeDefinition } from 'sanity'

// documents
import site from './documents/site'
import footer from './documents/footer'
import page from './documents/page'
import globalModule from './documents/global-module'
import navigation from './documents/navigation'
import redirect from './documents/redirect'

// Creators School domain documents
import offering from './documents/offering'
import teacher from './documents/teacher'
import performance from './documents/performance'
import scheduleSlot from './documents/scheduleSlot'
import galleryImage from './documents/galleryImage'
import job from './documents/job'
import contactSubmission from './documents/contactSubmission'

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
import accordionList from './modules/accordion-list'
import breadcrumbs from './modules/breadcrumbs'
import callout from './modules/callout'
import centeredCta from './modules/centered-cta'
import customHtml from './modules/custom-html'
import featureMedia from './modules/feature-media'
import heroSplit from './modules/hero.split'
import personList from './modules/person-list'
import richtextModule from './modules/richtext-module'
import socialProofLogos from './modules/social-proof.logos'
import styleGuide from './modules/style-guide'

// Creators School modules
import heroCreators from './modules/hero.creators'
import pageHeader from './modules/page-header'
import marquee from './modules/marquee'
import featureGrid from './modules/feature-grid'
import weltenSplit from './modules/welten-split'
import offeringList from './modules/offering-list'
import offeringDetail from './modules/offering-detail'
import performanceBanner from './modules/performance-banner'
import aboutStrip from './modules/about-strip'
import ctaBand from './modules/cta-band'
import schedulePreview from './modules/schedule-preview'
import scheduleFull from './modules/schedule-full'
import galleryMasonry from './modules/gallery-masonry'
import infoCards from './modules/info-cards'
import contactForm from './modules/contact-form'
import jobsList from './modules/jobs-list'
import locationCard from './modules/location-card'
import testimonialCards from './modules/testimonial-cards'
import svcSplit from './modules/svc-split'
import svcLearn from './modules/svc-learn'
import svcFaq from './modules/svc-faq'
import svcPanel from './modules/svc-panel'

export const schemaTypes: SchemaTypeDefinition[] = [
	// documents
	site,
	footer,
	page,
	globalModule,
	navigation,

	// Creators School domain documents
	offering,
	teacher,
	performance,
	scheduleSlot,
	galleryImage,
	job,
	contactSubmission,

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
	accordionList,
	breadcrumbs,
	callout,
	centeredCta,
	customHtml,
	featureMedia,
	heroSplit,
	personList,
	richtextModule,
	socialProofLogos,
	styleGuide,

	// Creators School modules
	heroCreators,
	pageHeader,
	marquee,
	featureGrid,
	weltenSplit,
	offeringList,
	offeringDetail,
	performanceBanner,
	aboutStrip,
	ctaBand,
	schedulePreview,
	scheduleFull,
	galleryMasonry,
	infoCards,
	contactForm,
	jobsList,
	locationCard,
	testimonialCards,
	svcSplit,
	svcLearn,
	svcFaq,
	svcPanel,
]
