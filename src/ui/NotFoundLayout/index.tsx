import Image from 'next/image'
import Button from '@/ui/Button'
import GoBackButton from './GoBackButton'
import getServerLang from '@/lib/getServerLang'
import { DEFAULT_LANG } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n'

type Copy = {
	badge: string
	heading: string
	body: string
	goBack: string
	goHome: string
}

const copy: Record<string, Copy> = {
	de: {
		badge: '404 Fehler',
		heading: 'Seite nicht gefunden',
		body: 'Die gesuchte Seite existiert leider nicht.\nHier sind einige hilfreiche Links:',
		goBack: 'Zurück',
		goHome: 'Zur Startseite',
	},
	en: {
		badge: '404 error',
		heading: 'Page not found',
		body: "Sorry, the page you are looking for doesn't exist.\nHere are some helpful links:",
		goBack: 'Go back',
		goHome: 'Go home',
	},
}

export default async function NotFoundLayout() {
	const lang = (await getServerLang()) as Lang
	const t = copy[lang] ?? copy[DEFAULT_LANG] ?? copy.en
	const homeHref = lang === DEFAULT_LANG ? '/' : `/${lang}`

	return (
		<section
			className="mx-auto flex w-full max-w-xxlarge flex-col gap-10 px-4 py-12 md:gap-12 md:px-8 md:py-16 lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-8 lg:h-auto"
			aria-labelledby="not-found-heading"
		>
			<div className="flex w-full max-w-medium flex-col items-start gap-10 md:gap-12 lg:justify-center lg:self-stretch">
				<div className="flex w-full flex-col items-start gap-6">
					<div className="flex w-full flex-col items-start gap-4">
						<span className="border-border bg-canvas inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 shadow-xs">
							<span
								aria-hidden
								className="inline-block size-1.5 rounded-full bg-accent-button"
							/>
							<span className="text-neutral-dark text-small font-medium leading-5">
								{t.badge}
							</span>
						</span>

						<h1
							id="not-found-heading"
							className="text-ink h-base text-[clamp(2.5rem,6vw,3.75rem)] leading-tight tracking-[-0.012em]"
						>
							{t.heading}
						</h1>
					</div>

					<p className="text-neutral-dark max-w-small text-medium leading-normal whitespace-pre-line">
						{t.body}
					</p>
				</div>

				<div className="flex flex-col-reverse gap-3 self-stretch sm:flex-row sm:self-auto">
					<GoBackButton label={t.goBack} />
					<Button variant="primary" size="large" href={homeHref}>
						{t.goHome}
					</Button>
				</div>
			</div>

			<div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg max-md:h-60 max-md:aspect-auto md:h-96 md:aspect-auto lg:h-full lg:w-full lg:aspect-auto">
				<Image
					src="/404.jpg"
					alt=""
					fill
					priority
					sizes="(min-width: 1024px) 50vw, 100vw"
					className="object-cover object-center"
				/>
			</div>
		</section>
	)
}
