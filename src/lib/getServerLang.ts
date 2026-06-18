import 'server-only'
import { headers } from 'next/headers'
import { DEFAULT_LANG, languages, type Lang } from './i18n'

export default async function getServerLang(): Promise<Lang> {
	const pathname = (await headers()).get('x-pathname') || '/'
	const segment = pathname.split('/').filter(Boolean)[0]
	return (languages as readonly string[]).includes(segment)
		? (segment as Lang)
		: DEFAULT_LANG
}
