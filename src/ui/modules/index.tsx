import dynamic from 'next/dynamic'

// Above-the-fold / common modules: keep static-imported so they render in the
// initial server payload without an extra round-trip for client JS.
import AboutStory from './AboutStory'
import Breadcrumbs from './Breadcrumbs'
import Callout from './Callout'
import CenteredCTA from './CenteredCTA'
import ComparisonCards from './ComparisonCards'
import FeatureMedia from './FeatureMedia'
import HeroSplit from './HeroSplit'
import ImageCallouts from './ImageCallouts'
import MeetTheFounder from './MeetTheFounder'
import MeetTheTeam from './MeetTheTeam'
import RichtextModule from './RichtextModule'
import SocialProofLogos from './SocialProofLogos'
import StatsGrid from './StatsGrid'
import TestimonialFeatured from './TestimonialFeatured'
import VideoWithText from './VideoWithText'

// Heavy / below-the-fold / page-specific modules: code-split with dynamic()
// so each page only ships the client JS it actually uses.
const AccordionList = dynamic(() => import('./AccordionList'))
const BlogOverview = dynamic(() => import('./blog/BlogOverview'))
const BlogPostContent = dynamic(() => import('./blog/PostContent'))
const CustomHTML = dynamic(() => import('./CustomHTML'))
const FeatureTabs = dynamic(() => import('./FeatureTabs'))
const NewsletterCTA = dynamic(() => import('./NewsletterCTA'))
const PersonList = dynamic(() => import('./PersonList'))
const SearchModule = dynamic(() => import('./SearchModule'))
const StyleGuide = dynamic(() => import('./StyleGuide'))
const TestimonialGrid = dynamic(() => import('./TestimonialGrid'))

import { createDataAttribute } from 'next-sanity'
import type { Module } from '@/sanity/typeHelpers'
import type {
	PAGE_QUERY_RESULT,
	BLOG_POST_QUERY_RESULT,
} from '@/sanity/types'

type ModuleComponent = React.ComponentType<Record<string, unknown>>

const MODULE_MAP = {
	'about-story': AboutStory,
	'accordion-list': AccordionList,
	'blog-overview': BlogOverview,
	'blog-post-content': BlogPostContent,
	breadcrumbs: Breadcrumbs,
	callout: Callout,
	'centered-cta': CenteredCTA,
	'comparison-cards': ComparisonCards,
	'custom-html': CustomHTML,
	'feature-media': FeatureMedia,
	'feature-tabs': FeatureTabs,
	'hero.split': HeroSplit,
	'image-callouts': ImageCallouts,
	'meet-the-founder': MeetTheFounder,
	'meet-the-team': MeetTheTeam,
	'newsletter-cta': NewsletterCTA,
	'person-list': PersonList,
	'richtext-module': RichtextModule,
	'search-module': SearchModule,
	'social-proof.logos': SocialProofLogos,
	'stats-grid': StatsGrid,
	'style-guide': StyleGuide,
	'testimonial.featured': TestimonialFeatured,
	'testimonial.grid': TestimonialGrid,
	'video-with-text': VideoWithText,
} as const satisfies Record<string, ModuleComponent>

type ModuleType = keyof typeof MODULE_MAP

const warnedTypes = new Set<string>()

export default function Modules({
	modules,
	page,
	post,
}: {
	modules?: Array<Module | null> | null
	page?: PAGE_QUERY_RESULT
	post?: BLOG_POST_QUERY_RESULT
}) {
	const getAdditionalProps = (module: Module) => {
		switch (module._type) {
			case 'blog-post-content':
				return { post }
			case 'breadcrumbs':
				return { currentPage: post || page }
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
