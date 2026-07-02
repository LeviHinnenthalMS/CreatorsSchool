import { getSite, getFooter } from '@/sanity/lib/queries'
import getServerLang from '@/lib/getServerLang'
import { DEFAULT_LANG } from '@/lib/i18n'
import Link from 'next/link'
import { Img } from '@/ui/Img'
import CTA from '@/ui/CTA'
import Newsletter from './Newsletter'
import SocialIcon from './SocialIcon'
import Wrapper from './Wrapper'
import { stegaClean } from 'next-sanity'
import type { SanityCTA } from '@/sanity/typeHelpers'

type FooterLink = NonNullable<SanityCTA['link']>

type FooterColumnInput = {
	title?: string | null
	links?: Array<FooterLink | null> | null
}

export default async function Footer() {
	const lang = await getServerLang()
	const [{ title, logo }, footer] = await Promise.all([
		getSite(),
		getFooter(lang),
	])

	const logoImage =
		logo?.image?.light || logo?.image?.dark || logo?.image?.default
	const homeHref = lang && lang !== DEFAULT_LANG ? `/${lang}` : '/'

	const year = new Date().getFullYear()
	const copyrightText =
		(stegaClean(footer?.copyright) || '').replace('{year}', String(year)) ||
		`© ${year}`

	const bottomLinks = footer?.bottomLinks ?? []
	const socials = footer?.socials ?? []

	return (
		<Wrapper className="bg-ink text-canvas">
			<div className="mx-auto max-w-[1440px] px-4 pt-12 pb-8 md:px-8 md:pt-16 md:pb-12">
				{footer?.newsletter && (
					<div className="mb-12 md:mb-20">
						<Newsletter {...footer.newsletter} />
					</div>
				)}

				<div className="grid grid-cols-2 gap-10 md:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))] md:gap-12">
					<div className="col-span-2 flex flex-col items-start gap-4 max-md:text-center md:col-span-1">
						<Link href={homeHref} aria-label={logo?.name || title} className="block">
							{logoImage ? (
								<Img
									className="h-10 w-auto"
									image={logoImage}
									alt={logo?.name || title}
								/>
							) : (
								<span className="text-h4 font-bold tracking-tight">
									{title}
								</span>
							)}
						</Link>
						{footer?.tagline && (
							<p className="text-left text-canvas/70 max-w-sm text-small leading-5 whitespace-pre-line md:text-small md:leading-6">
								{footer.tagline}
							</p>
						)}
					</div>

					{footer?.columns?.map((column, key) => (
						<FooterColumn
							key={key}
							column={{
								...column,
								links: column?.links ?? null,
							}}
						/>
					))}
				</div>

				<hr className="border-canvas/15 mt-12 md:mt-16" />

				<div className="mt-6 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-4">
					<div className="text-canvas/70 flex flex-wrap items-start md:items-center justify-center gap-x-3 gap-y-1 text-small leading-5">
						<span>{copyrightText}</span>
						{!!bottomLinks.length && (
							<>
								<span aria-hidden className="max-md:hidden">
									-
								</span>
								<ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
									{bottomLinks.map((link, i, arr) => (
										<li
											key={i}
											className="flex items-center gap-3"
										>
											<CTA
												className="hover:text-canvas underline-offset-4 hover:underline"
												link={link}
											/>
											{i < arr.length - 1 && (
												<span aria-hidden className="text-canvas/30">
													|
												</span>
											)}
										</li>
									))}
								</ul>
							</>
						)}
					</div>

					{!!socials.length && (
						<ul className="flex flex-wrap items-center justify-center gap-1">
							{socials.map((link, key) => (
								<li key={key}>
									<CTA
										className="text-canvas/70 hover:text-canvas hover:bg-canvas/10 inline-flex size-9 items-center justify-center rounded-sm transition-colors"
										link={link}
										aria-label={link.label}
									>
										<SocialIcon link={link} />
									</CTA>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</Wrapper>
	)
}

function FooterColumn({ column }: { column: FooterColumnInput }) {
	if (!column?.title && !column?.links?.length) return null

	return (
		<div className="space-y-4 max-md:text-center">
			{column.title && (
				<p className="text-canvas text-regular leading-6 font-semibold w-fit">
					{column.title}
				</p>
			)}
			{!!column.links?.length && (
				<ul className="space-y-3">
					{column.links.map((link, key) => (
						<li className='w-fit' key={key}>
							<CTA
								className="text-canvas/70 hover:text-canvas text-small leading-5 transition-colors md:text-small md:leading-6"
								link={link}
							/>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
