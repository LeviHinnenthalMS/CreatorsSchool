import Script from 'next/script'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? ''
const COOKIEYES_SRC = process.env.NEXT_PUBLIC_COOKIEYES_SRC ?? ''

// Consent Mode v2 defaults + GTM loader.
// Bundled into a single inline script so the consent defaults are guaranteed
// to run before GTM, regardless of async ordering between separate <script> tags.
export function GTMScript() {
	if (!GTM_ID) return null
	return (
		<Script
			id="gtm-consent"
			strategy="afterInteractive"
			dangerouslySetInnerHTML={{
				__html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_personalization: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
			}}
		/>
	)
}

// CookieYes CMP — fires consent updates after user choice
export function CookieYesScript() {
	if (!COOKIEYES_SRC) return null
	return (
		<Script
			id="cookieyes"
			strategy="afterInteractive"
			src={COOKIEYES_SRC}
		/>
	)
}

export function GTMNoScript() {
	if (!GTM_ID) return null
	return (
		<noscript>
			<iframe
				src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
				height="0"
				width="0"
				style={{ display: 'none', visibility: 'hidden' }}
				title="Google Tag Manager"
			/>
		</noscript>
	)
}
