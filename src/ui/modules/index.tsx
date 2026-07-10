import dynamic from 'next/dynamic'

// Above-the-fold / common modules: keep static-imported so they render in the
// initial server payload without an extra round-trip for client JS.
import Breadcrumbs from './Breadcrumbs'
import Callout from './Callout'
import CenteredCTA from './CenteredCTA'
import FeatureMedia from './FeatureMedia'
import HeroSplit from './HeroSplit'
import RichtextModule from './RichtextModule'
import SocialProofLogos from './SocialProofLogos'

// Creators School modules (above-the-fold / stage)
import HeroCreators from './HeroCreators'
import PageHeader from './PageHeader'

// Heavy / below-the-fold / page-specific modules: code-split with dynamic()
// so each page only ships the client JS it actually uses.
const AccordionList = dynamic(() => import('./AccordionList'))
const CustomHTML = dynamic(() => import('./CustomHTML'))
const PersonList = dynamic(() => import('./PersonList'))
const StyleGuide = dynamic(() => import('./StyleGuide'))

// Creators School modules (lazy)
const Marquee = dynamic(() => import('./Marquee'))
const FeatureGrid = dynamic(() => import('./FeatureGrid'))
const WeltenSplit = dynamic(() => import('./WeltenSplit'))
const OfferingList = dynamic(() => import('./OfferingList'))
const OfferingDetail = dynamic(() => import('./OfferingDetail'))
const PerformanceBanner = dynamic(() => import('./PerformanceBanner'))
const AboutStrip = dynamic(() => import('./AboutStrip'))
const CTABand = dynamic(() => import('./CTABand'))
const SchedulePreview = dynamic(() => import('./SchedulePreview'))
const ScheduleFull = dynamic(() => import('./ScheduleFull'))
const GalleryMasonry = dynamic(() => import('./GalleryMasonry'))
const InfoCards = dynamic(() => import('./InfoCards'))
const ContactForm = dynamic(() => import('./ContactForm'))
const JobsList = dynamic(() => import('./JobsList'))
const LocationCard = dynamic(() => import('./LocationCard'))
const TestimonialCards = dynamic(() => import('./TestimonialCards'))
const SvcSplit = dynamic(() => import('./SvcSplit'))
const SvcLearn = dynamic(() => import('./SvcLearn'))
const SvcFaq = dynamic(() => import('./SvcFaq'))
const SvcPanel = dynamic(() => import('./SvcPanel'))

import { createDataAttribute } from 'next-sanity'
import type { Module } from '@/sanity/typeHelpers'
import type { PAGE_QUERY_RESULT } from '@/sanity/types'

type ModuleComponent = React.ComponentType<Record<string, unknown>>

const MODULE_MAP = {
	'accordion-list': AccordionList,
	breadcrumbs: Breadcrumbs,
	callout: Callout,
	'centered-cta': CenteredCTA,
	'custom-html': CustomHTML,
	'feature-media': FeatureMedia,
	'hero.split': HeroSplit,
	'person-list': PersonList,
	'richtext-module': RichtextModule,
	'social-proof.logos': SocialProofLogos,
	'style-guide': StyleGuide,

	// Creators School modules
	'hero.creators': HeroCreators,
	'page-header': PageHeader,
	marquee: Marquee,
	'feature-grid': FeatureGrid,
	'welten-split': WeltenSplit,
	'offering-list': OfferingList,
	'offering-detail': OfferingDetail,
	'performance-banner': PerformanceBanner,
	'about-strip': AboutStrip,
	'cta-band': CTABand,
	'schedule-preview': SchedulePreview,
	'schedule-full': ScheduleFull,
	'gallery-masonry': GalleryMasonry,
	'info-cards': InfoCards,
	'contact-form': ContactForm,
	'jobs-list': JobsList,
	'location-card': LocationCard,
	'testimonial-cards': TestimonialCards,
	'svc-split': SvcSplit,
	'svc-learn': SvcLearn,
	'svc-faq': SvcFaq,
	'svc-panel': SvcPanel,
} as const satisfies Record<string, ModuleComponent>

type ModuleType = keyof typeof MODULE_MAP

const warnedTypes = new Set<string>()

export default function Modules({
	modules,
	page,
}: {
	modules?: Array<Module | null> | null
	page?: PAGE_QUERY_RESULT
}) {
	const getAdditionalProps = (module: Module) => {
		switch (module._type) {
			case 'breadcrumbs':
				return { currentPage: page }
			default:
				return {}
		}
	}

	return (
		<>
			{modules?.map((module) => {
				if (!module) return null

				const type = module._type as ModuleType
				const Component = MODULE_MAP[type] as ModuleComponent | undefined

				if (!Component) {
					if (
						process.env.NODE_ENV !== 'production' &&
						!warnedTypes.has(module._type)
					) {
						warnedTypes.add(module._type)
						console.warn(
							`[Modules] Unknown module _type: "${module._type}". ` +
								`Register it in src/ui/modules/index.tsx MODULE_MAP, or remove it from Sanity.`,
						)
					}
					return null
				}

				return (
					<Component
						{...module}
						{...getAdditionalProps(module)}
						data-sanity={
							!!page?._id &&
							createDataAttribute({
								id: page._id,
								type: page?._type,
								path: `page[_key == "${module._key}"]`,
							}).toString()
						}
						key={module._key}
					/>
				)
			})}
		</>
	)
}
