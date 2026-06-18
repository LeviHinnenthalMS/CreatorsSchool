import { PortableText, stegaClean } from 'next-sanity'
import { Suspense } from 'react'
import SearchForm from './SearchForm'
import type { SearchScope } from './store'
import CTAList from '@/ui/CTAList'
import moduleProps from '@/lib/moduleProps'
import type { SanityCTA } from '@/sanity/typeHelpers'

export default function SearchModule({
	intro,
	ctas,
	scope,
	path,
	...props
}: Partial<{
	intro: any
	ctas: SanityCTA[]
	scope: SearchScope
	path: string
}>) {
	return (
		<section className="section space-y-8" {...moduleProps(props)}>
			{intro && (
				<header className="richtext text-center">
					<PortableText value={intro} />
				</header>
			)}

			<div className="mx-auto max-w-screen-sm">
				<Suspense fallback={<div className="skeleton-[calc(1lh+.5rem+2px)]" />}>
					<SearchForm scope={stegaClean(scope)} path={stegaClean(path)} />
				</Suspense>
			</div>

			<CTAList className="justify-center" ctas={ctas} />
		</section>
	)
}
