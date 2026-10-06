import 'server-only'
import { DEFAULT_LANG, type Lang } from './i18n'

// The site currently publishes only German. Reading request headers here made
// every page using the shared header/footer dynamic and prevented HTML caching.
// If more languages are enabled, pass their URL params into server components
// instead of reintroducing request headers into the shared layout.
export default async function getServerLang(): Promise<Lang> {
	return DEFAULT_LANG
}
