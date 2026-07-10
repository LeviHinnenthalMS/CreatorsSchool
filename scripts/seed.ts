// Run: pnpm seed
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2024-12-01',
	useCdn: false,
})

// ── helpers ──────────────────────────────────────────────────────────

let _k = 0
const k = () => `k${++_k}`

function rt(text: string) {
	const parts = text.split(/(\*[^*]+\*)/)
	return [{
		_type: 'block', _key: k(), style: 'normal', markDefs: [],
		children: parts.filter(Boolean).map(p =>
			p[0] === '*' && p.at(-1) === '*'
				? { _type: 'span', _key: k(), text: p.slice(1, -1), marks: ['accent'] }
				: { _type: 'span', _key: k(), text: p, marks: [] },
		),
	}]
}

function bl(text: string) {
	return [{ _type: 'block', _key: k(), style: 'normal', markDefs: [],
		children: [{ _type: 'span', _key: k(), text, marks: [] }] }]
}

function imgRef(assetId: string) {
	return { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
}

function linkInt(label: string, ref: string) {
	return { _type: 'link', label, type: 'internal', internal: { _type: 'reference', _ref: ref } }
}

function linkExt(label: string, url: string) {
	return { _type: 'link', label, type: 'external', external: url }
}

function cta(label: string, type: 'int' | 'ext', target: string, variant = 'primary', size = 'medium') {
	return {
		_key: k(), _type: 'cta', active: true, variant, size,
		link: type === 'int' ? linkInt(label, target) : linkExt(label, target),
	}
}

function navLink(label: string, desc: string, ref: string) {
	return { _key: k(), _type: 'link.nav', label, description: desc, type: 'internal', internal: { _type: 'reference', _ref: ref } }
}

function ctaBand(heading: string, body: string) {
	return {
		_key: k(), _type: 'cta-band',
		eyebrow: 'Anmeldung',
		title: rt(heading),
		text: body,
		showPhone: true, showWhatsapp: true, showEmail: true,
		whatsappLabel: 'WhatsApp schreiben',
		emailLabel: 'E-Mail schreiben',
		extraCtas: [cta('Kontakt', 'int', P.kontakt, 'secondary')],
	}
}

// ── IDs ──────────────────────────────────────────────────────────────

const P = {
	home: 'page-home',
	angebote: 'page-angebote',
	stundenplan: 'page-stundenplan',
	galerie: 'page-galerie',
	ueberUns: 'page-ueber-uns',
	jobs: 'page-jobs',
	kontakt: 'page-kontakt',
	auffuehrungen: 'page-auffuehrungen',
	impressum: 'page-impressum',
	datenschutz: 'page-datenschutz',
	barrierefreiheit: 'page-barrierefreiheit',
	aMFrue: 'page-angebot-musikalische-fruehfoerderung',
	aEKK: 'page-angebot-eltern-kind-kurs',
	aTFrue: 'page-angebot-taenzerische-fruehfoerderung',
	aBallett: 'page-angebot-ballett',
	aJazz: 'page-angebot-jazz-musicaldance',
	aHochzeit: 'page-angebot-hochzeitsgesang',
	aInstrument: 'page-angebot-instrumentalunterricht',
	aKita: 'page-angebot-kindergarten-projekte',
}

const O = {
	mFrue: 'offering-musikalische-fruehfoerderung',
	ekk: 'offering-eltern-kind-kurs',
	tFrue: 'offering-taenzerische-fruehfoerderung',
	ballett: 'offering-ballett',
	jazz: 'offering-jazz-musicaldance',
	hochzeit: 'offering-hochzeitsgesang',
	instrument: 'offering-instrumentalunterricht',
	kita: 'offering-kindergarten-projekte',
}

const TS = {
	sandra: 'testimonial-sandra',
	jara: 'testimonial-jara',
	anna: 'testimonial-anna',
}

const PERF = 'performance-sept-2026'

// ── image assets ─────────────────────────────────────────────────────

async function uploadAssets() {
	const assetsDir = '/tmp/cs-handoff/creators-school/project/creators-school-handoff/reference/assets'

	// Upload logo
	const logoPath = path.join(assetsDir, 'logo.png')
	const logoAsset = await client.assets.upload('image', fs.createReadStream(logoPath), {
		filename: 'logo.png', contentType: 'image/png',
	})
	console.log('✓ logo uploaded:', logoAsset._id)

	// Upload hero
	const heroPath = path.join(assetsDir, 'hero-drum.jpg')
	const heroAsset = await client.assets.upload('image', fs.createReadStream(heroPath), {
		filename: 'hero-drum.jpg', contentType: 'image/jpeg',
	})
	console.log('✓ hero-drum uploaded:', heroAsset._id)

	// Find placeholder image already in media library, fall back to hero
	const placeholder = await client.fetch<{ _id: string } | null>(
		`*[_type == "sanity.imageAsset" && originalFilename match "Musical Early Education*"][0]{ _id }`,
	)
	const phId = placeholder?._id ?? heroAsset._id
	console.log(placeholder ? `✓ placeholder found: ${phId}` : `⚠ placeholder not found, using hero-drum as fallback`)

	return { logoId: logoAsset._id, heroId: heroAsset._id, phId }
}

// ── document builders ─────────────────────────────────────────────────

function buildSite(logoId: string, phId: string) {
	return {
		_id: 'site', _type: 'site',
		title: 'Creators School',
		tagline: 'Musik- und Tanzschule in Melle. Seit 2002 — von den ersten Klangerlebnissen der Kleinsten bis zur Bühne für jedes Alter.',
		logo: {
			_type: 'logo', name: 'Creators School',
			image: {
				default: imgRef(logoId),
				light: imgRef(logoId),
				dark: imgRef(logoId),
			},
		},
		ogimage: imgRef(phId),
		phone: '01520 / 89 93 894',
		phoneTel: '+4915208993894',
		whatsapp: '4915208993894',
		email: 'info@creators-school.de',
		addressLines: ['Wittekindsweg 10', '49324 Melle'],
		addressLabel: 'Wittekindsweg 10, 49324 Melle',
		hours: 'Mo–Fr 09–20 Uhr · Sa 10–14 Uhr · Büro/Telefon Mo–Fr 09–18 Uhr',
		eventBadge: {
			active: true, label: '5.–6. Sep', sub: 'Aufführung',
			link: linkInt('Aufführungen', P.auffuehrungen),
		},
		ctas: [cta('Probestunde', 'int', P.kontakt)],
	}
}

function buildPerformance(phId: string) {
	return {
		_id: PERF, _type: 'performance', language: 'de',
		title: 'Aufführungen im Schauspielhaus Melle · September 2026',
		year: 2026,
		dates: '5.–6. September 2026',
		startDate: '2026-09-05',
		venue: 'Schauspielhaus Melle',
		bigNumber: '5 & 6',
		monthLabel: 'September 2026',
		lead: 'Zwei Abende, eine Schule auf der Bühne.',
		description: 'Unsere Tänzer:innen aller Altersstufen zeigen, was Ausdruck bedeutet. Über 500 Plätze pro Abend. Generalprobe am 4. September für Geladene.',
		featured: true,
		badgeLabel: '5.–6. Sep',
		badgeSub: 'Aufführung',
		image: { ...imgRef(phId), alt: 'Aufführungen Creators School' },
		metadata: { _type: 'metadata', slug: { _type: 'slug', current: 'auffuehrungen' } },
	}
}

function buildTeachers(phId: string) {
	const teachers = [
		{ id: 'teacher-miriam-schulte', name: 'Miriam Schulte', role: 'Gründerin · Pädagogische Leitung · Musicaldarstellerin', order: 1 },
		{ id: 'teacher-charlotte-berg', name: 'Charlotte Berg', role: 'Ballett · Choreografie', order: 2 },
		{ id: 'teacher-tobias-linde', name: 'Tobias Linde', role: 'Gitarre · Bass · Schlagzeug', order: 3 },
		{ id: 'teacher-lena-voss', name: 'Lena Voss', role: 'Eltern-Kind-Kurs · Tänzerische Früherziehung', order: 4 },
		{ id: 'teacher-marlene-otten', name: 'Marlene Otten', role: 'Jazz · Musicaldance', order: 5 },
		{ id: 'teacher-jakob-heinemann', name: 'Jakob Heinemann', role: 'Klavier · Musiktheorie', order: 6 },
		{ id: 'teacher-anneke-friese', name: 'Anneke Friese', role: 'Violine · Viola', order: 7 },
		{ id: 'teacher-elisa-hartmann', name: 'Elisa Hartmann', role: 'Stimmbildung · Hochzeitsgesang', order: 8 },
	]
	return teachers.map(t => ({
		_id: t.id, _type: 'teacher', language: 'de',
		name: t.name, role: t.role, order: t.order,
		photo: { ...imgRef(phId), alt: t.name },
	}))
}

function buildTestimonials(phId: string) {
	return [
		{
			_id: TS.sandra, _type: 'testimonial', language: 'de', highlight: true,
			content: bl('Unsere Lena geht jeden Mittwoch strahlend zum Eltern-Kind-Kurs. Miriam holt jedes Kind dort ab, wo es steht — wir sind unendlich dankbar.'),
			author: { name: 'Sandra Kuhlmann', role: 'Mama von Lena (2) · Eltern-Kind-Kurs', image: imgRef(phId) },
		},
		{
			_id: TS.jara, _type: 'testimonial', language: 'de', highlight: false,
			content: bl('Im Moderndance arbeiten wir auf die Aufführung im September hin. Es fordert, es trägt, und am Ende stehen wir wirklich auf der Bühne.'),
			author: { name: 'Jara Meyer', role: '16 · Moderndance ab 15 · Melle', image: imgRef(phId) },
		},
		{
			_id: TS.anna, _type: 'testimonial', language: 'de', highlight: false,
			content: bl('Ich hatte 20 Jahre nicht mehr getanzt. Moderndance ab 30 hat mir meinen Ausdruck zurückgegeben — ohne Druck, ohne Schamgefühl.'),
			author: { name: 'Anna Krüger', role: '38 · Moderndance ab 30 · Melle', image: imgRef(phId) },
		},
	]
}

function faq(items: [string, string][]) {
	return items.map(([q, a]) => ({ _key: k(), _type: 'qa', q, a }))
}

function facts(items: [string, string][]) {
	return items.map(([key, value]) => ({ _key: k(), _type: 'fact', key, value }))
}

function forWho(items: [string, string][]) {
	return items.map(([title, text]) => ({ _key: k(), _type: 'audience', title, text }))
}

function learnCards(items: [string, string, string][]) {
	return items.map(([icon, title, text]) => ({ _key: k(), _type: 'learnCard', icon, title, text }))
}

function detailRows(items: [string, string][]) {
	return items.map(([key, value]) => ({ _key: k(), _type: 'detailRow', key, value }))
}

function buildOfferings(phId: string) {
	const hero = { ...imgRef(phId), alt: '' }

	return [
		{
			_id: O.mFrue, _type: 'offering', language: 'de', order: 1,
			title: 'Musikalische Frühförderung', bereich: 'musik',
			slug: { _type: 'slug', current: 'musikalische-fruehfoerderung' },
			eyebrow: 'Bereich Musik · Frühförderung',
			lede: 'Singen, Tanzen, Hören. Erstes Notenverständnis, Rhythmus und elementares Instrumentenspiel — in liebevoll betreuten Kleingruppen von maximal sechs Kindern.',
			heroImage: hero,
			facts: facts([['Alter', '4–6 Jahre'], ['Dauer', '45 Min / Woche'], ['Gruppe', 'Max. 6 Kinder'], ['Preis', 'ab €18']]),
			forWhoTitle: rt('Für Neugier und erste *Töne*.'),
			forWhoLead: 'Musikalische Frühförderung begleitet Kinder im Vorschulalter auf ihrem ersten musikalischen Weg — spielerisch, liebevoll und mit echter pädagogischer Tiefe.',
			forWho: forWho([
				['Kinder von vier bis sechs Jahren', 'Die Neugier auf Klang, Rhythmus und Bewegung steht im Mittelpunkt — ganz ohne Vorkenntnisse.'],
				['Eltern, die früh fördern möchten', 'Musik stärkt kognitive Fähigkeiten, Kreativität und soziales Bewusstsein — ideal vor der Einschulung.'],
				['Kinder mit Freude am Gemeinsamen', 'In der Kleingruppe lernen Kinder Rücksicht, Zuhören und Zusammenspiel.'],
			]),
			learnTitle: rt('Von ersten Tönen zur *Musik*.'),
			learn: learnCards([
				['music', 'Notenverständnis', 'Erste Buchstaben der Musiksprache — spielerisch erarbeitet mit Symbolen und Bewegung.'],
				['movement', 'Rhythmus & Körper', 'Klatschen, Stampfen, Tanzen — der Körper wird zum ersten Instrument.'],
				['sparkle', 'Instrumentenspiel', 'Klangstäbe, Handtrommeln und einfache Melodieinstrumente zum Ausprobieren.'],
			]),
			detailsTitle: rt('Der Kurs auf einen *Blick*.'),
			priceLabel: 'ab', priceCurrency: '€', priceValue: '18', priceUnit: '/ Kind',
			detailRows: detailRows([['Dauer', '45 Min / Woche'], ['Gruppe', 'Max. 6 Kinder'], ['Unterricht', 'Wöchentlich'], ['Probestunde', 'Kostenlos']]),
			faqTitle: rt('Gut zu *wissen*.'),
			faq: faq([
				['Ab welchem Alter ist Musikalische Frühförderung sinnvoll?', 'Ab vier Jahren können Kinder mitmachen — mit Freude an Musik und Bewegung, ganz ohne Vorkenntnisse.'],
				['Was brauche ich für die erste Stunde?', 'Nichts außer Neugier und bequemer Kleidung. Instrumente stellen wir bereit. Die erste Stunde ist kostenlos und unverbindlich.'],
				['Gibt es Aufführungen?', 'Ja — unsere Früherziehungsgruppen treten einmal im Jahr vor Publikum auf. Eltern sind herzlich willkommen.'],
			]),
			metadata: { _type: 'metadata', slug: { _type: 'slug', current: 'angebote/musikalische-fruehfoerderung' } },
		},
		{
			_id: O.ekk, _type: 'offering', language: 'de', order: 2,
			title: 'Eltern-Kind-Kurs', bereich: 'musik',
			slug: { _type: 'slug', current: 'eltern-kind-kurs' },
			eyebrow: 'Bereich Musik · Eltern-Kind',
			lede: 'Eltern-Kind-Gruppe mit Liedern, Reimen und Bewegung. Die ersten musikalischen Erlebnisse zu zweit — Bindung und Klang in einem.',
			heroImage: hero,
			facts: facts([['Alter', '1,5–3 Jahre'], ['Dauer', '30 Min / Woche'], ['Gruppe', 'Max. 8 Familien'], ['Preis', '€14 / Familie']]),
			forWhoTitle: rt('Für die Allerkleinsten — und ihre *Eltern*.'),
			forWhoLead: 'Der Eltern-Kind-Kurs ist das erste musikalische Erlebnis — gemeinsam, entspannt und ohne jede Erwartung.',
			forWho: forWho([
				['Babys und Kleinkinder ab 1,5 Jahren', 'Zu zweit mit Mama oder Papa — in einer sicheren, warmen Atmosphäre.'],
				['Eltern, die Zeit für ihr Kind schaffen möchten', 'Ohne Ablenkung — eine halbe Stunde Musik und Verbindung.'],
				['Neugierige Kleine ohne Vorerfahrung', 'Kein Kind ist zu jung für Klang. Wir beginnen da, wo das Kind steht.'],
			]),
			learnTitle: rt('Erste *Klangerlebnisse*.'),
			learn: learnCards([
				['heart', 'Bindung durch Musik', 'Lieder, Reime und Bewegung stärken die Eltern-Kind-Bindung auf natürliche Weise.'],
				['music', 'Erste Instrumente', 'Kleine Rasseln, Klangstäbe und Trommeln für die winzigen Hände.'],
				['movement', 'Rhythmus & Bewegung', 'Tanzen, Schaukeln, Klatschen — der Körper entdeckt Musik.'],
			]),
			detailsTitle: rt('Der Kurs auf einen *Blick*.'),
			priceLabel: '', priceCurrency: '€', priceValue: '14', priceUnit: '/ Familie',
			detailRows: detailRows([['Dauer', '30 Min / Woche'], ['Gruppe', 'Max. 8 Familien'], ['Unterricht', 'Wöchentlich'], ['Probestunde', 'Kostenlos']]),
			faqTitle: rt('Gut zu *wissen*.'),
			faq: faq([
				['Ab welchem Alter kann mein Kind mitmachen?', 'Ab eineinhalb Jahren. Wir haben Kinder bis drei Jahre in der Gruppe.'],
				['Muss ich Musik können?', 'Nein. Der Kurs richtet sich an Eltern, nicht an Musiker:innen. Alles, was zählt, ist die Freude an gemeinsamer Zeit.'],
				['Können auch Väter mitmachen?', 'Selbstverständlich. Jedes Elternteil ist herzlich willkommen — Mama, Papa, Oma oder Opa.'],
			]),
			metadata: { _type: 'metadata', slug: { _type: 'slug', current: 'angebote/eltern-kind-kurs' } },
		},
		{
			_id: O.tFrue, _type: 'offering', language: 'de', order: 3,
			title: 'Tänzerische Früherziehung', bereich: 'tanz',
			slug: { _type: 'slug', current: 'taenzerische-fruehfoerderung' },
			eyebrow: 'Bereich Tanz · Früherziehung',
			lede: 'Körpergefühl, Rhythmus, Raum. Spielerische Hinführung an die Sprache des Tanzes — bevor der erste Ballett-Schritt kommt.',
			heroImage: hero,
			facts: facts([['Alter', '3–5 Jahre'], ['Dauer', '45 Min / Woche'], ['Gruppe', 'Max. 8 Kinder'], ['Preis', '€16 / Kind']]),
			forWhoTitle: rt('Für erste Schritte und *große Träume*.'),
			forWhoLead: 'Tänzerische Früherziehung führt Kinder spielerisch in die Welt des Tanzes ein — ohne Druck, ohne feste Form, mit viel Freude.',
			forWho: forWho([
				['Kinder von drei bis fünf Jahren', 'Entdeckungsfreude an Bewegung, Musik und Raum — ohne Technik, nur Spiel.'],
				['Kinder vor dem Ballett', 'Eine ideale Vorbereitung für den Übergang ins Ballett ab sechs Jahren.'],
				['Alle mit Freude am Tanzen', 'Keine Vorerfahrung nötig — jedes Kind ist willkommen.'],
			]),
			learnTitle: rt('Spielen, bewegen, *ausdrücken*.'),
			learn: learnCards([
				['movement', 'Körperbewusstsein', 'Kinder entdecken, was ihr Körper kann — strecken, rollen, springen, wirbeln.'],
				['music', 'Rhythmusgefühl', 'Musik und Bewegung werden als Einheit erlebt — der erste Schritt zu echter Musikalität.'],
				['sparkle', 'Ausdruck & Phantasie', 'Improvisation und kleine Geschichten formen das erste kreative Erleben.'],
			]),
			detailsTitle: rt('Der Kurs auf einen *Blick*.'),
			priceLabel: '', priceCurrency: '€', priceValue: '16', priceUnit: '/ Kind',
			detailRows: detailRows([['Dauer', '45 Min / Woche'], ['Gruppe', 'Max. 8 Kinder'], ['Unterricht', 'Wöchentlich'], ['Probestunde', 'Kostenlos']]),
			faqTitle: rt('Gut zu *wissen*.'),
			faq: faq([
				['Braucht mein Kind Tanzerfahrung?', 'Nein — tänzerische Früherziehung ist der Einstieg. Vorerfahrung ist weder nötig noch erwartet.'],
				['Was zieht mein Kind an?', 'Bequeme Kleidung, in der es sich frei bewegen kann. Ballettschläppchen sind empfehlenswert, aber keine Pflicht.'],
				['Wie geht es nach der Früherziehung weiter?', 'Die meisten Kinder wechseln ab sechs Jahren ins Kinderballett. Wir beraten euch gern.'],
			]),
			metadata: { _type: 'metadata', slug: { _type: 'slug', current: 'angebote/taenzerische-fruehfoerderung' } },
		},
		{
			_id: O.ballett, _type: 'offering', language: 'de', order: 4,
			title: 'Ballett — klassisch', bereich: 'tanz',
			slug: { _type: 'slug', current: 'ballett' },
			eyebrow: 'Bereich Tanz · Klassik',
			lede: 'Klassische Technik, Haltung und Anmut. Vom Kinderballett bis zur fortgeschrittenen Klasse — in mehreren Stufen, mit Spitzenschuhtraining für ältere Schüler:innen und einer großen Aufführung pro Jahr.',
			heroImage: hero,
			facts: facts([['Alter', 'ab 6 Jahren'], ['Dauer', '60 Min / Woche'], ['Niveaus', '4 Stufen'], ['Preis', 'ab €22']]),
			forWhoTitle: rt('Für Haltung und *Hingabe*.'),
			forWhoLead: 'Ballett verbindet Disziplin mit Ausdruck. Wer hier tanzt, baut Technik geduldig auf — und wächst Schritt für Schritt auf die Bühne zu.',
			forWho: forWho([
				['Kinder ab sechs Jahren', 'Mit Freude an Form, Musik und konzentriertem Üben.'],
				['Tänzer:innen mit Erfahrung', 'Die ihre Technik vertiefen und Spitze erarbeiten wollen.'],
				['Alle mit Bühnentraum', 'Jedes Jahr steht eine echte Aufführung am Ende des Weges.'],
			]),
			learnTitle: rt('Vom ersten Plié zur *Bühne*.'),
			learn: learnCards([
				['sparkle', 'Technik & Haltung', 'Positionen, Barre-Arbeit und gezielte Körperspannung.'],
				['music', 'Musikalität', 'Bewegung im Einklang mit Musik, Phrasierung und Tempo.'],
				['stage', 'Bühne', 'Choreografie und Vorbereitung für die jährliche Aufführung.'],
			]),
			detailsTitle: rt('Der Kurs auf einen *Blick*.'),
			priceLabel: 'ab', priceCurrency: '€', priceValue: '22', priceUnit: '/ Kind',
			detailRows: detailRows([['Dauer', '60 Min / Woche'], ['Niveaus', '4 Stufen'], ['Aufführung', 'Jährlich'], ['Spitzenschuhe', 'Ab fortgeschritten'], ['Probestunde', 'Kostenlos']]),
			faqTitle: rt('Gut zu *wissen*.'),
			faq: faq([
				['Ab welchem Alter Spitzenschuhe?', 'Erst nach ausreichender Technik und Kraft — in der Regel ab etwa 11 bis 12 Jahren und nach Einschätzung der Lehrkraft.'],
				['Welche Stufe passt zu meinem Kind?', 'Wir ordnen nach Alter und Erfahrung ein. Die kostenlose Probestunde hilft bei der richtigen Einschätzung.'],
				['Gibt es eine Aufführung?', 'Ja — einmal im Jahr auf einer echten Bühne, mit Kostümen und Bühnenbild.'],
			]),
			metadata: { _type: 'metadata', slug: { _type: 'slug', current: 'angebote/ballett' } },
		},
		{
			_id: O.jazz, _type: 'offering', language: 'de', order: 5,
			title: 'Jazz & Musicaldance', bereich: 'tanz',
			slug: { _type: 'slug', current: 'jazz-musicaldance' },
			eyebrow: 'Bereich Tanz · Jazz & Musical',
			lede: 'Energie, Ausdruck, Choreografie. Bühnentanz für Jugendliche und Erwachsene — von Broadway-Klassikern bis zu modernen Pop-Choreografien.',
			heroImage: hero,
			facts: facts([['Alter', 'ab 8 Jahren'], ['Dauer', '60 Min / Woche'], ['Levels', '3 Niveaus'], ['Preis', '€24 / Person']]),
			forWhoTitle: rt('Für die, die *Energie* auf die Bühne bringen wollen.'),
			forWhoLead: 'Jazz & Musicaldance verbindet technische Präzision mit showreifem Ausdruck — für alle, die tanzen und dabei strahlen wollen.',
			forWho: forWho([
				['Jugendliche ab 8 Jahren', 'Mit Freude an Choreografie, Musik und Showcharakter.'],
				['Teens und Erwachsene', 'Drei Levels — von Einsteiger bis fortgeschritten. Vorerfahrung hilfreich, aber keine Pflicht.'],
				['Alle mit Bühnendrang', 'Regelmäßige Auftritte und die Vorbereitung auf unsere Jahresaufführung.'],
			]),
			learnTitle: rt('Technik trifft *Showtime*.'),
			learn: learnCards([
				['movement', 'Jazz-Technik', 'Isolationen, Synkopen und die typische Energie des Jazz Dance.'],
				['sparkle', 'Musicaldance', 'Broadway-Stile, Charakterarbeit und das Spiel mit Raum und Ausdruck.'],
				['stage', 'Bühne & Performance', 'Choreografien für unsere Jahresaufführung — mit echtem Bühnenbild.'],
			]),
			detailsTitle: rt('Der Kurs auf einen *Blick*.'),
			priceLabel: '', priceCurrency: '€', priceValue: '24', priceUnit: '/ Person',
			detailRows: detailRows([['Dauer', '60 Min / Woche'], ['Niveaus', '3'], ['Unterricht', 'Wöchentlich'], ['Probestunde', 'Kostenlos']]),
			faqTitle: rt('Gut zu *wissen*.'),
			faq: faq([
				['Brauche ich Tanzerfahrung?', 'Im Einstiegskurs nicht. Wir starten von Grundpositionen. Für Fortgeschrittene gibt es separate Gruppen.'],
				['Was ist der Unterschied zu Ballett?', 'Jazz ist freier, moderner und auf Ausdruck und Show ausgerichtet. Kein Spitzenschuh, viel Energie.'],
				['Gibt es Auftritte?', 'Ja — mehrmals im Jahr, darunter unsere große Jahresaufführung im Schauspielhaus Melle.'],
			]),
			metadata: { _type: 'metadata', slug: { _type: 'slug', current: 'angebote/jazz-musicaldance' } },
		},
		{
			_id: O.hochzeit, _type: 'offering', language: 'de', order: 6,
			title: 'Hochzeitsgesang', bereich: 'musik',
			slug: { _type: 'slug', current: 'hochzeitsgesang' },
			eyebrow: 'Bereich Musik · Gesang',
			lede: 'Ein Lied für den schönsten Tag. Persönliche Beratung bei der Liedauswahl, gemeinsame Probe und Begleitung — auch außerhalb von Melle.',
			heroImage: hero,
			facts: facts([['Format', 'Auf Anfrage'], ['Verfügbarkeit', 'Bundesweit'], ['Begleitung', 'Persönlich'], ['Preis', 'ab €350']]),
			forWhoTitle: rt('Für den *unvergesslichen* Moment.'),
			forWhoLead: 'Hochzeitsgesang ist kein Kurs — es ist eine persönliche Dienstleistung. Wir begleiten Sie von der Liedwahl bis zum Auftritt.',
			forWho: forWho([
				['Brautpaare und Familien', 'Die sich einen professionellen Sologesang für ihre Trauung oder Feier wünschen.'],
				['Freunde und Verwandte', 'Die selbst singen möchten und eine erfahrene Stimmpädagogin als Begleitung suchen.'],
				['Standesamtliche und kirchliche Trauungen', 'Wir sind flexibel — und reisen auch außerhalb von Melle an.'],
			]),
			learnTitle: rt('Unser Angebot für *Ihren Tag*.'),
			learn: learnCards([
				['heart', 'Liedberatung', 'Gemeinsame Auswahl des passenden Lieds — klassisch, modern oder etwas ganz Persönliches.'],
				['voice', 'Proben & Vorbereitung', 'Intensive Vorbereitung mit Ihrer Stimmpädagogin bis zum Tag der Trauung.'],
				['stage', 'Auftritt', 'Live-Gesang bei Ihrer Trauung — mit Erfahrung, Profil und echter Bühnenpräsenz.'],
			]),
			detailsTitle: rt('Das Angebot auf einen *Blick*.'),
			priceLabel: 'ab', priceCurrency: '€', priceValue: '350', priceUnit: '/ Anlass',
			detailRows: detailRows([['Format', 'Individuell & persönlich'], ['Verfügbarkeit', 'Bundesweit'], ['Erstgespräch', 'Kostenlos & unverbindlich']]),
			faqTitle: rt('Gut zu *wissen*.'),
			faq: faq([
				['Wie lange im Voraus sollte ich anfragen?', 'Möglichst drei bis sechs Monate vor der Hochzeit. Bei kurzfristigen Anfragen geben wir unser Bestes.'],
				['Welche Stile sind möglich?', 'Von klassisch-kirchlich bis Pop, Schlager oder etwas ganz Eigenes — wir passen uns Ihrem Wunsch an.'],
				['Kommt Elisa Hartmann auch zu uns in die Kirche?', 'Ja. Wir reisen bundesweit an — ob standesamtliche Trauung, kirchliche Feier oder privates Dinner.'],
			]),
			metadata: { _type: 'metadata', slug: { _type: 'slug', current: 'angebote/hochzeitsgesang' } },
		},
		{
			_id: O.instrument, _type: 'offering', language: 'de', order: 7,
			title: 'Instrumentalunterricht', bereich: 'musik',
			slug: { _type: 'slug', current: 'instrumentalunterricht' },
			eyebrow: 'Bereich Musik · Instrumental',
			lede: 'Klavier · Gitarre · Schlagzeug · Gesang · Streicher · Blasinstrumente. Einzeln oder zu zweit, 30 oder 45 Minuten. Von Anfang an oder fortgeschritten.',
			heroImage: hero,
			facts: facts([['Alter', 'Jedes Alter'], ['Dauer', '30 oder 45 Min'], ['Format', 'Einzel / Duo'], ['Preis', 'ab €28 / 30 Min.']]),
			forWhoTitle: rt('Für alle, die ein Instrument *lernen möchten*.'),
			forWhoLead: 'Instrumentalunterricht bei uns ist persönlich, flexibel und auf jeden Lernstand zugeschnitten — für Kinder, Jugendliche und Erwachsene.',
			forWho: forWho([
				['Kinder ab sechs Jahren', 'Vom ersten Ton zum ersten Lied — aufgebaut auf dem richtigen Fundament.'],
				['Jugendliche und Erwachsene', 'Neue Starters genauso willkommen wie Fortgeschrittene, die ihre Technik ausbauen wollen.'],
				['Wiedereinsteiger:innen', 'Es ist nie zu spät, wieder ein Instrument zur Hand zu nehmen — versprochen.'],
			]),
			learnTitle: rt('Mehr als nur *Noten*.'),
			learn: learnCards([
				['music', 'Technik & Theorie', 'Spieltechnik, Noten lesen, Harmonielehre — je nach Alter und Ziel.'],
				['sparkle', 'Repertoire', 'Klassik, Pop, Rock, Jazz — wir spielen, was dir Freude macht.'],
				['stage', 'Auftritte & Konzerte', 'Wer möchte, spielt bei unseren Konzerten mit — vor Publikum und mit echter Bühnenerfahrung.'],
			]),
			detailsTitle: rt('Der Unterricht auf einen *Blick*.'),
			priceLabel: 'ab', priceCurrency: '€', priceValue: '28', priceUnit: '/ 30 Min.',
			detailRows: detailRows([['Instrumente', 'Klavier, Gitarre, Schlagzeug, Gesang, Streicher, Bläser'], ['Dauer', '30 oder 45 Minuten'], ['Format', 'Einzelunterricht oder Duo'], ['Probestunde', 'Kostenlos']]),
			faqTitle: rt('Gut zu *wissen*.'),
			faq: faq([
				['Welche Instrumente unterrichtet ihr?', 'Klavier, Gitarre, Schlagzeug, Gesang, Violine, Viola und diverse Blasinstrumente. Frag uns — wir finden eine Lösung.'],
				['Ab welchem Alter ist Einzelunterricht sinnvoll?', 'Ab etwa sechs Jahren. Für jüngere Kinder empfehlen wir zunächst die musikalische Frühförderung.'],
				['Kann ich als Erwachsener ein neues Instrument lernen?', 'Absolut. Viele unserer beliebtesten Schüler:innen sind Erwachsene, die als Anfänger starten. Es ist nie zu spät.'],
			]),
			metadata: { _type: 'metadata', slug: { _type: 'slug', current: 'angebote/instrumentalunterricht' } },
		},
		{
			_id: O.kita, _type: 'offering', language: 'de', order: 8,
			title: 'Kindergarten-Projekte', bereich: 'musik',
			slug: { _type: 'slug', current: 'kindergarten-projekte' },
			eyebrow: 'Bereich Musik · Kooperation',
			lede: 'Musikalische Angebote direkt in Ihrer Kindertagesstätte. Wir bringen Klang, Bewegung und Lieder ins Haus — wöchentlich oder als Projektwoche.',
			heroImage: hero,
			facts: facts([['Format', 'Bei Ihnen vor Ort'], ['Häufigkeit', 'Wöchentlich oder Projekt'], ['Alter', 'Kitakinder'], ['Preis', 'Auf Anfrage']]),
			forWhoTitle: rt('Für Kitas, die *Musik* erleben möchten.'),
			forWhoLead: 'Wir kommen zu Ihnen — keine Anreise, kein Aufwand für die Eltern, und die Kinder erleben Musik in ihrer vertrauten Umgebung.',
			forWho: forWho([
				['Kindertagesstätten in Melle und Umgebung', 'Wir kooperieren seit 2002 mit Kitas in der Region — zuverlässig und pädagogisch fundiert.'],
				['Gruppen aller Altersstufen', 'Vom Krippenalter bis zur Vorschule — wir passen das Programm der Gruppe an.'],
				['Einrichtungen mit Musikwunsch', 'Flexible Modelle — wöchentlich oder als einmalige Projektwoche.'],
			]),
			learnTitle: rt('Was wir *mitbringen*.'),
			learn: learnCards([
				['music', 'Lieder & Reime', 'Altersgerechtes Liedgut, Reime und Klatschspiele — direkt ins Gruppengeschehen integriert.'],
				['movement', 'Bewegungsmusik', 'Musik und Bewegung kombiniert — für Körperbewusstsein und Rhythmusgefühl.'],
				['sparkle', 'Instrumente zum Anfassen', 'Handtrommeln, Klangstäbe und kleine Melodieinstrumente für alle Hände.'],
			]),
			detailsTitle: rt('Das Angebot auf einen *Blick*.'),
			priceLabel: '', priceCurrency: '', priceValue: 'Auf Anfrage', priceUnit: '',
			detailRows: detailRows([['Format', 'Wöchentlich oder Projektwoche'], ['Ort', 'Bei Ihnen in der Einrichtung'], ['Region', 'Melle und Umgebung'], ['Erstgespräch', 'Kostenlos & unverbindlich']]),
			faqTitle: rt('Gut zu *wissen*.'),
			faq: faq([
				['Wie läuft die Zusammenarbeit ab?', 'Wir vereinbaren ein kostenloses Erstgespräch, lernen Ihre Gruppe kennen — und schneidern dann das Angebot.'],
				['Müssen wir Instrumente kaufen?', 'Nein. Wir bringen alles nötige Material mit — von kleinen Instrumenten bis zum Konzept.'],
				['In welchem Umkreis seid ihr tätig?', 'Primär in Melle und dem Kreis Osnabrück. Bei größeren Projekten sprechen wir gern über weitere Entfernungen.'],
			]),
			metadata: { _type: 'metadata', slug: { _type: 'slug', current: 'angebote/kindergarten-projekte' } },
		},
	]
}

// ── pages ─────────────────────────────────────────────────────────────

function buildPages(heroId: string, phId: string) {
	const ph = imgRef(phId)

	// shared cta-band
	const defaultCtaBand = ctaBand(
		'Bereit für deine *erste Stunde*?',
		'Wir beraten dich gern persönlich — zu Musik und Tanz, Stundenplan, Gruppen und Preisen. Eine Probestunde ist unverbindlich und der schönste Weg, uns kennenzulernen.',
	)

	// ── Home ──────────────────────────────────────────────────────────
	const home: Record<string, unknown> = {
		_id: P.home, _type: 'page', language: 'de',
		title: 'Home',
		metadata: { _type: 'metadata', slug: { _type: 'slug', current: 'index' }, title: 'Creators School — Musik & Tanz in Melle', description: 'Pädagogische Frühförderung für die Kleinsten. Künstlerische Tanzausbildung für alle, die ihren Ausdruck auf die Bühne bringen wollen.' },
		stage: [{
			_key: k(), _type: 'hero.creators',
			eyebrow: 'Musik & Tanz · Melle, seit 2002',
			title: rt('Wo Musik & Tanz zu *Ausdruck* werden.'),
			sub: 'Pädagogische Frühförderung für die Kleinsten. Künstlerische Tanzausbildung für alle, die ihren Ausdruck auf die Bühne bringen wollen.',
			image: { ...imgRef(heroId), alt: 'Schlagzeug-Unterricht bei der Creators School Melle' },
			tags: [
				{ _key: k(), label: 'Angebote', value: '08', position: 'top-left' },
				{ _key: k(), label: 'In Melle seit', value: '2002', position: 'top-right' },
				{ _key: k(), label: 'Auf der Bühne', value: '5.–6. Sep', position: 'bottom-right' },
			],
			reviewTitle: 'Aktive Schüler:innen jeden Alters',
			reviewSubtitle: 'In 8 Angeboten · Musik & Tanz aus Melle & Umgebung',
			ctas: [
				cta('Probestunde buchen', 'int', P.kontakt),
				cta('Unsere Angebote ansehen', 'int', P.angebote, 'secondary'),
			],
		}],
		modules: [
			{
				_key: k(), _type: 'marquee',
				items: ['Eltern-Kind-Kurs', 'Frühförderung', 'Ballett', 'Moderndance', 'Ausdruck', 'Bühne', 'Musik', 'Tanz']
					.map(text => ({ _key: k(), _type: 'object', text })),
				durationSeconds: 30,
			},
			{
				_key: k(), _type: 'performance-banner',
				performance: { _type: 'reference', _ref: PERF },
				eyebrow: 'Bühne frei',
				title: rt('5. und 6. September · *Aufführungen* im Schauspielhaus Melle.'),
				ctas: [
					cta('Karten anfragen', 'int', P.auffuehrungen),
					cta('Mehr über die Aufführungen', 'int', P.auffuehrungen, 'secondary'),
				],
			},
			{
				_key: k(), _type: 'feature-grid',
				eyebrow: 'Was uns besonders macht',
				title: rt('Eine Schule, kein *Massenbetrieb*.'),
				tagline: 'Vom ersten Klangerlebnis mit 1,5 Jahren bis zur Bühne mit 30+. Wir arbeiten in kleinen Gruppen, mit Tiefe und echter Beziehung.',
				features: [
					{ _key: k(), _type: 'featureCard', tint: 'soft', title: 'Persönlich unterrichtet', text: 'Miriam und ihre Lehrkräfte kennen jeden Schüler beim Namen. Keine Massenschule, sondern echte Beziehung.' },
					{ _key: k(), _type: 'featureCard', tint: 'coral', title: 'Probestunde kostenlos', text: 'Unverbindlich kennenlernen. Eine erste Stunde ohne Anmeldung, ohne Verpflichtung. Bevor du dich entscheidest.' },
					{ _key: k(), _type: 'featureCard', tint: 'soft', title: 'Kleine Gruppen', text: 'Maximal 6 Schüler:innen pro Gruppe. Individuelle Förderung statt anonymer Massenunterricht.' },
					{ _key: k(), _type: 'featureCard', tint: 'coral', title: 'Mit Tiefe und Bühne', text: 'Wir arbeiten über den ganzen Körper, alle Sinne. Konzerte, Aufführungen, echte Bühnenerfahrung.' },
				],
			},
			{
				_key: k(), _type: 'welten-split',
				eyebrow: 'Zwei Bereiche, eine Idee',
				title: rt('Such dir deinen *Weg*.'),
				tagline: 'Musik und Tanz unter einem Dach — beide mit demselben Ziel: dir helfen, deinen Ausdruck zu finden und zu entwickeln.',
				cards: [
					{
						_key: k(), _type: 'object',
						eyebrow: 'Bereich Musik',
						title: 'Musik erleben.',
						subtitle: 'Pädagogische Förderung für die Kleinsten.',
						text: 'Eltern-Kind-Kurse und musikalische Frühförderung. Für Kinder ab 1,5 Jahren, gemeinsam mit Mama oder Papa, oder ab 4 Jahren in der Gruppe.',
						link: linkInt('Zum Musik-Bereich', P.angebote),
						linkLabel: 'Zum Musik-Bereich',
					},
					{
						_key: k(), _type: 'object',
						eyebrow: 'Bereich Tanz',
						title: 'Tanz auf die Bühne.',
						subtitle: 'Künstlerische Ausbildung für jedes Alter.',
						text: 'Tänzerische Frühförderung ab 3 Jahren. Ballett, Moderndance bis ins Erwachsenenalter. Mit echten Aufführungen, echtem Bühnenbild, echter Energie.',
						link: linkInt('Zum Tanz-Bereich', P.angebote),
						linkLabel: 'Zum Tanz-Bereich',
					},
				],
			},
			{
				_key: k(), _type: 'offering-list',
				eyebrow: 'Bereich Musik',
				title: rt('Musik · Zwei Wege, anzu*fangen*.'),
				tagline: 'Singen, Tanzen, Hören. Die ersten Klangerlebnisse prägen ein Leben lang — liebevoll begleitet, in kleinen Gruppen.',
				bereich: 'musik',
				layout: 'cards',
			},
			{
				_key: k(), _type: 'offering-list',
				eyebrow: 'Bereich Tanz',
				title: rt('Tanz · Von den ersten Schritten bis zur *Bühne*.'),
				tagline: 'Sieben Stufen, ein Weg. Vom spielerischen Anfang mit drei Jahren bis zum künstlerischen Erwachsenentanz — alle mit echter Aufführungsperspektive.',
				bereich: 'tanz',
				layout: 'cards',
				ctaTileTitle: 'Noch unsicher, was passt?',
				ctaTileText: 'Komm in eine kostenlose Probestunde und finde es heraus.',
				ctaTileLink: linkInt('Termin finden', P.kontakt),
				ctaTileLinkLabel: 'Termin finden',
			},
			{
				_key: k(), _type: 'testimonial-cards',
				eyebrow: 'Stimmen aus der Schule',
				title: rt('Was unsere Familien *erleben*.'),
				tagline: 'Eltern der Kleinsten in der Musik. Jugendliche, die auf die Bühne wachsen. Erwachsene, die ihren Ausdruck wiederfinden.',
				testimonials: [
					{ _key: k(), _type: 'reference', _ref: TS.sandra },
					{ _key: k(), _type: 'reference', _ref: TS.jara },
					{ _key: k(), _type: 'reference', _ref: TS.anna },
				],
			},
			// schedule-preview hidden for now; add back when Stundenplan goes live
			{
				_key: k(), _type: 'about-strip',
				eyebrow: 'Über uns',
				title: rt('Eine Schule, in der Musik & Tanz *erlebbar* werden.'),
				body: 'Seit 2002 fördern wir Musik und Tanz in all ihren Formen. Dabei liegt uns besonders die musikalische und tänzerische Frühförderung am Herzen, denn Musik fördert Kreativität, kognitive Fähigkeiten und Bewusstsein. Es ist nie zu spät, sich mit Musik und Tanz zu umgeben.',
				stats: [
					{ _key: k(), _type: 'stat', value: 'Seit 2002', label: 'In Melle' },
					{ _key: k(), _type: 'stat', value: '08', label: 'Angebote' },
					{ _key: k(), _type: 'stat', value: 'max. 6', label: 'pro Gruppe' },
				],
				ctas: [cta('Unsere Geschichte', 'int', P.ueberUns, 'secondary')],
				profile: {
					tags: ['Inhaberin', 'Pädagogische Leitung', 'Musicaldarstellerin'],
					firstName: 'Miriam',
					lastName: 'Schulte',
					role: 'Gründerin · Pädagogische Leitung · Musicaldarstellerin',
					quote: 'Musik macht uns zu aktiven, kommunikativen und fröhlichen Menschen, und weckt in uns die verschiedensten Begabungen.',
				},
			},
			defaultCtaBand,
		],
	}

	// ── Angebote overview ─────────────────────────────────────────────
	const angebote: Record<string, unknown> = {
		_id: P.angebote, _type: 'page', language: 'de',
		title: 'Angebote',
		metadata: { _type: 'metadata', slug: { _type: 'slug', current: 'angebote' }, title: 'Unsere Angebote — Creators School', description: 'Von der musikalischen Frühförderung mit eineinhalb Jahren bis zum Instrumentalunterricht für Erwachsene — acht Disziplinen.' },
		stage: [{
			_key: k(), _type: 'page-header',
			eyebrow: 'Unsere Angebote · 08 Disziplinen',
			title: rt('Musik, Tanz & Bühne *für alle*.'),
			lede: 'Von der musikalischen Frühförderung mit eineinhalb Jahren bis zum Instrumentalunterricht für Erwachsene — acht Disziplinen, individuell auf Alter und Erfahrungsstand zugeschnitten.',
			ctas: [cta('Probestunde buchen', 'int', P.kontakt), cta('Stundenplan ansehen', 'int', P.stundenplan, 'secondary')],
		}],
		modules: [
			{ _key: k(), _type: 'offering-list', bereich: null, layout: 'list' },
			{
				_key: k(), _type: 'feature-grid',
				eyebrow: 'So funktioniert\'s',
				title: rt('In vier Schritten zur ersten *Stunde*.'),
				tagline: 'Vom ersten Anruf bis zum festen Termin im Stundenplan — wir machen es Ihnen so einfach wie möglich.',
				features: [
					{ _key: k(), _type: 'featureCard', tint: 'soft', title: '01 · Kontakt', text: 'Per Telefon, E-Mail oder Kontaktformular. Wir melden uns innerhalb von 24 Stunden zurück.' },
					{ _key: k(), _type: 'featureCard', tint: 'soft', title: '02 · Beratung', text: 'Wir besprechen Alter, Interessen und Vorerfahrung — und schlagen das passende Programm vor.' },
					{ _key: k(), _type: 'featureCard', tint: 'coral', title: '03 · Probestunde', text: 'Eine kostenlose Probestunde, bevor Sie sich entscheiden. Ohne Vertrag, ohne Verpflichtung.' },
					{ _key: k(), _type: 'featureCard', tint: 'soft', title: '04 · Loslegen', text: 'Wenn es passt, sichern wir Ihrem Kind einen festen wöchentlichen Termin im Stundenplan.' },
				],
			},
			{
				_key: k(), _type: 'svc-faq',
				eyebrow: 'Häufige Fragen',
				title: rt('Antworten auf die häufigsten *Fragen*.'),
				ctas: [cta('Kontakt aufnehmen', 'int', P.kontakt, 'secondary')],
				items: faq([
					['Wie alt müssen Kinder für die Frühförderung sein?', 'Unser Eltern-Kind-Kurs nimmt Kinder ab 1,5 Jahren mit einem Elternteil auf. Die Musikalische Frühförderung beginnt mit vier Jahren.'],
					['Was kostet der Unterricht?', 'Die Preise variieren je nach Angebot zwischen €14 (Eltern-Kind-Kurs) und €28 (Instrumental-Einzelstunde). Für Geschwister gibt es Rabatte.'],
					['Wie funktioniert die Probestunde?', 'Rufen Sie uns an oder schreiben Sie eine E-Mail. Wir vereinbaren einen unverbindlichen Termin — Sie zahlen nichts, gehen keine Verpflichtung ein.'],
					['Gibt es feste Vertragslaufzeiten?', 'Wir arbeiten mit Halbjahresverträgen, die sich automatisch verlängern und mit sechs Wochen Frist kündbar sind.'],
					['Was passiert in den Ferien?', 'In den Schulferien Niedersachsens pausiert der Unterricht. Die Beitragspauschale ist auf 38 Unterrichtswochen pro Jahr kalkuliert.'],
					['Können auch Erwachsene Unterricht nehmen?', 'Absolut. Instrumentalunterricht, Gesang, Jazz- und Musicaldance richten sich an jedes Alter. Es ist nie zu spät.'],
				]),
			},
			defaultCtaBand,
		],
	}

	// ── Offering detail pages ─────────────────────────────────────────
	const offeringPages = [
		{ id: P.aMFrue, ref: O.mFrue, slug: 'angebote/musikalische-fruehfoerderung', title: 'Musikalische Frühförderung' },
		{ id: P.aEKK, ref: O.ekk, slug: 'angebote/eltern-kind-kurs', title: 'Eltern-Kind-Kurs' },
		{ id: P.aTFrue, ref: O.tFrue, slug: 'angebote/taenzerische-fruehfoerderung', title: 'Tänzerische Früherziehung' },
		{ id: P.aBallett, ref: O.ballett, slug: 'angebote/ballett', title: 'Ballett — klassisch' },
		{ id: P.aJazz, ref: O.jazz, slug: 'angebote/jazz-musicaldance', title: 'Jazz & Musicaldance' },
		{ id: P.aHochzeit, ref: O.hochzeit, slug: 'angebote/hochzeitsgesang', title: 'Hochzeitsgesang' },
		{ id: P.aInstrument, ref: O.instrument, slug: 'angebote/instrumentalunterricht', title: 'Instrumentalunterricht' },
		{ id: P.aKita, ref: O.kita, slug: 'angebote/kindergarten-projekte', title: 'Kindergarten-Projekte' },
	].map(({ id, ref, slug, title }) => ({
		_id: id, _type: 'page', language: 'de', title,
		metadata: { _type: 'metadata', slug: { _type: 'slug', current: slug } },
		stage: [],
		modules: [{
			_key: k(), _type: 'offering-detail',
			offering: { _type: 'reference', _ref: ref },
			breadcrumbHomeLabel: 'Home',
			breadcrumbParentLabel: 'Angebote',
			breadcrumbParentHref: '/angebote',
			backLinkLabel: '← Alle Angebote',
			backLinkHref: '/angebote',
			ctas: [cta('Probestunde buchen', 'int', P.kontakt), cta('Alle Angebote ansehen', 'int', P.angebote, 'secondary')],
			panelCtas: [cta('Probestunde buchen', 'int', P.kontakt)],
		}],
	}))

	// ── Stundenplan ───────────────────────────────────────────────────
	const stundenplan: Record<string, unknown> = {
		_id: P.stundenplan, _type: 'page', language: 'de',
		title: 'Stundenplan',
		metadata: { _type: 'metadata', slug: { _type: 'slug', current: 'stundenplan' }, title: 'Stundenplan — Creators School Melle' },
		stage: [{
			_key: k(), _type: 'page-header',
			eyebrow: 'Schuljahr 2025 / 26 · Halbjahr 2',
			title: rt('Diese *Woche* in der *Schule*.'),
			lede: 'Alle wöchentlichen Gruppentermine auf einen Blick. Instrumentalunterricht und Hochzeitsgesang werden individuell vereinbart und sind hier nicht aufgeführt.',
		}],
		modules: [
			{
				_key: k(), _type: 'schedule-full',
				filterLabels: { all: 'Alle', musik: 'Musik', tanz: 'Tanz', frueh: 'Frühförderung', erwachsene: 'Erwachsene' },
				statusLabels: { open: 'Plätze frei', few: 'Wenige Plätze', full: 'Warteliste' },
				noteTitle: 'Instrumentalunterricht nach Vereinbarung',
				noteText: 'Klavier, Gitarre, Schlagzeug, Streicher und Gesang werden als 30- oder 45-minütiger Einzelunterricht angeboten — Termine vereinbaren wir individuell. Rufen Sie uns einfach an.',
				emptyText: 'Keine Termine für diesen Filter gefunden.',
			},
			{
				_key: k(), _type: 'cta-band',
				eyebrow: 'Platz nicht dabei?',
				title: rt('Wir richten *neue Gruppen* ein.'),
				text: 'Wenn Ihr Wunschtermin nicht passt oder Ihre Altersgruppe fehlt — melden Sie sich. Bei genügend Anfragen eröffnen wir neue Klassen.',
				showPhone: true, showWhatsapp: true, showEmail: true,
				whatsappLabel: 'WhatsApp schreiben',
				emailLabel: 'E-Mail schreiben',
			},
		],
	}

	// ── Galerie ───────────────────────────────────────────────────────
	const galerie: Record<string, unknown> = {
		_id: P.galerie, _type: 'page', language: 'de',
		title: 'Galerie',
		metadata: { _type: 'metadata', slug: { _type: 'slug', current: 'galerie' }, title: 'Galerie — Creators School Melle' },
		stage: [{
			_key: k(), _type: 'page-header',
			eyebrow: 'Galerie · Impressionen',
			title: rt('Momente aus Musik *&* Tanz.'),
			lede: 'Aufführungen, Proben und der Alltag in unseren Sälen.',
		}],
		modules: [
			{ _key: k(), _type: 'gallery-masonry' },
			ctaBand('Bereit für eine *Probestunde*?', 'Schau dir an, was in unserer Schule passiert — und komm dann einfach vorbei.'),
		],
	}

	// ── Über uns ─────────────────────────────────────────────────────
	const ueberUns: Record<string, unknown> = {
		_id: P.ueberUns, _type: 'page', language: 'de',
		title: 'Über uns',
		metadata: { _type: 'metadata', slug: { _type: 'slug', current: 'ueber-uns' }, title: 'Über uns — Creators School Melle', description: 'Seit 2002 fördern wir Musik und Tanz in Melle. Eine inhabergeführte Schule, in der jede:r beim Namen genannt wird.' },
		stage: [{
			_key: k(), _type: 'page-header',
			eyebrow: 'Seit 2002 in Melle',
			title: rt('Eine kleine Schule mit *großem Herz*.'),
			lede: 'Wir sind keine Filiale, keine Kette, keine Marke. Wir sind eine inhabergeführte Musikschule, in der jede:r Schüler:in beim Namen genannt wird — und in der Musik nicht nur unterrichtet, sondern gelebt wird.',
		}],
		modules: [
			{
				_key: k(), _type: 'about-story',
				content: [
					{ _type: 'block', _key: k(), style: 'normal', markDefs: [], children: [{ _type: 'span', _key: k(), text: 'Vor mehr als zwanzig Jahren gründete Miriam Schulte die Creators School in Melle, aus dem Forum Musaik Melle, das 2024 umbenannt wurde. Was als kleine Frühförderungsgruppe begann, ist heute eine Schule mit acht Disziplinen, einem festen Team und über 500 aktiven Schüler:innen.', marks: [] }] },
					{ _type: 'block', _key: k(), style: 'normal', markDefs: [], children: [{ _type: 'span', _key: k(), text: 'Geblieben ist die Idee: Jedes Kind soll die Erfahrung machen, dass Musik mehr ist als Technik. Sie ist Ausdruck, Gemeinschaft, Bewegung — und manchmal einfach Glück.', marks: [] }] },
				],
				timeline: [
					{ _key: k(), _type: 'milestone', year: '2002', image: { ...ph, alt: 'Gründung 2002' } },
					{ _key: k(), _type: 'milestone', year: '2011', image: { ...ph, alt: 'Erstes Schulhaus 2011' } },
					{ _key: k(), _type: 'milestone', year: '2015', image: { ...ph, alt: 'Team 2015' } },
					{ _key: k(), _type: 'milestone', year: '2019', image: { ...ph, alt: 'Kita-Kooperationen 2019' } },
					{ _key: k(), _type: 'milestone', year: '2024', image: { ...ph, alt: 'Creators School 2024' } },
					{ _key: k(), _type: 'milestone', year: '2026', image: { ...ph, alt: 'Heute 2026' } },
				],
			},
			{
				_key: k(), _type: 'feature-grid',
				eyebrow: 'Unsere Werte',
				title: rt('Vier Überzeugungen, die uns *leiten*.'),
				tagline: 'Was uns von Anfang an wichtig war …',
				features: [
					{ _key: k(), _type: 'featureCard', tint: 'coral', title: '01 · Jedes Kind zählt', text: 'Kleine Gruppen, persönliche Förderung. Wir kennen jedes Kind, jedes Talent, jede Hürde — und nehmen uns Zeit.' },
					{ _key: k(), _type: 'featureCard', tint: 'soft', title: '02 · Freude vor Leistung', text: 'Technik ist wichtig. Aber wer keine Freude an Musik hat, hört irgendwann auf. Wir setzen die richtigen Prioritäten.' },
					{ _key: k(), _type: 'featureCard', tint: 'soft', title: '03 · Geduld und Zeit', text: 'Lernen braucht Wiederholung, Rückschritte, Pausen. Wir geben unseren Schüler:innen den Raum, den sie brauchen.' },
					{ _key: k(), _type: 'featureCard', tint: 'coral', title: '04 · Bühne als Ziel', text: 'Jährliche Aufführungen, Konzerte, Wettbewerbe. Musik wird erst lebendig, wenn sie geteilt wird — wir machen Mut.' },
				],
			},
			{
				_key: k(), _type: 'person-list',
				intro: [{ _type: 'block', _key: k(), style: 'normal', markDefs: [], children: [{ _type: 'span', _key: k(), text: 'Zwölf Lehrkräfte, drei Säle, eine pädagogische Linie — und immer noch eine Schule, in der man sich beim Namen kennt.', marks: [] }] }],
				layout: 'grid',
				people: [
					{ _key: k(), _type: 'reference', _ref: 'person-miriam-schulte' },
					{ _key: k(), _type: 'reference', _ref: 'person-charlotte-berg' },
					{ _key: k(), _type: 'reference', _ref: 'person-tobias-linde' },
					{ _key: k(), _type: 'reference', _ref: 'person-lena-voss' },
					{ _key: k(), _type: 'reference', _ref: 'person-marlene-otten' },
					{ _key: k(), _type: 'reference', _ref: 'person-jakob-heinemann' },
					{ _key: k(), _type: 'reference', _ref: 'person-anneke-friese' },
					{ _key: k(), _type: 'reference', _ref: 'person-elisa-hartmann' },
				],
			},
			{
				_key: k(), _type: 'location-card',
				title: rt('Am *Wittekindsweg* in Melle.'),
				text: 'Drei Säle, ein gemütlicher Wartebereich, Parkplätze direkt vor der Tür. Zentral gelegen, gut erreichbar mit Bus und Bahn — und mitten in der Natur.',
				directions: [
					{ _key: k(), _type: 'direction', icon: 'map-pin', title: 'Adresse', text: 'Wittekindsweg 10, 49324 Melle' },
					{ _key: k(), _type: 'direction', icon: 'clock', title: 'Öffnungszeiten', text: 'Mo–Fr 09–20 Uhr · Sa 10–14 Uhr' },
					{ _key: k(), _type: 'direction', icon: 'phone', title: 'Erreichbarkeit', text: 'Telefonisch Mo–Fr 09–18 Uhr' },
				],
				mapLink: linkExt('In Google Maps öffnen', 'https://maps.google.com/?q=Wittekindsweg+10,+49324+Melle'),
				mapLinkLabel: 'In Google Maps öffnen',
			},
			ctaBand('Kommen Sie *vorbei*.', 'Wir freuen uns auf Sie — egal ob Sie anrufen, eine E-Mail schicken oder einfach vorbeikommen.'),
		],
	}

	// ── Jobs ─────────────────────────────────────────────────────────
	const jobs: Record<string, unknown> = {
		_id: P.jobs, _type: 'page', language: 'de',
		title: 'Jobs',
		metadata: { _type: 'metadata', slug: { _type: 'slug', current: 'jobs' }, title: 'Jobs — Werde Teil des Teams der Creators School' },
		stage: [{
			_key: k(), _type: 'page-header',
			eyebrow: 'Jobs · Team Creators School',
			title: rt('Werde Teil unseres *Teams*.'),
			lede: 'Wir suchen Menschen, die Musik und Tanz lieben und weitergeben möchten — mit Herz, in kleinen Gruppen, mit echtem Gestaltungsspielraum. Auch Initiativbewerbungen sind jederzeit willkommen.',
			ctas: [
				cta('Jetzt bewerben', 'ext', 'mailto:info@creators-school.de'),
				cta('Kurz per WhatsApp fragen', 'ext', 'https://wa.me/4915208993894', 'secondary'),
			],
		}],
		modules: [
			{
				_key: k(), _type: 'jobs-list',
				eyebrow: 'Offene Stellen',
				title: rt('Aktuell *gesucht*.'),
				applyLabel: 'Bewerben',
				emptyText: 'Aktuell keine offenen Stellen — aber Initiativbewerbungen sind immer willkommen!',
				tinted: true,
			},
			{
				_key: k(), _type: 'info-cards',
				cards: [
					{ _key: k(), _type: 'infoCard', variant: 'coral', icon: 'mail', label: 'E-Mail', value: 'info@creators-school.de', link: linkExt('E-Mail schreiben', 'mailto:info@creators-school.de') },
					{ _key: k(), _type: 'infoCard', variant: 'neutral', icon: 'phone', label: 'Telefon', value: '01520 / 89 93 894', link: linkExt('Anrufen', 'tel:+4915208993894') },
					{ _key: k(), _type: 'infoCard', variant: 'neutral', icon: 'map-pin', label: 'Ort', value: 'Melle, Niedersachsen' },
				],
			},
			defaultCtaBand,
		],
	}

	// ── Kontakt ───────────────────────────────────────────────────────
	const kontakt: Record<string, unknown> = {
		_id: P.kontakt, _type: 'page', language: 'de',
		title: 'Kontakt',
		metadata: { _type: 'metadata', slug: { _type: 'slug', current: 'kontakt' }, title: 'Kontakt — Creators School Melle', description: 'Wir melden uns innerhalb von 24 Stunden zurück.' },
		stage: [{
			_key: k(), _type: 'page-header',
			eyebrow: 'Wir freuen uns auf Sie',
			title: rt('Schreiben Sie, rufen Sie an, kommen Sie *vorbei*.'),
			lede: 'Wir melden uns innerhalb von 24 Stunden zurück — meistens schneller. Sie erreichen uns telefonisch zu den Bürozeiten oder jederzeit per E-Mail.',
		}],
		modules: [
			{ _key: k(), _type: 'contact-form' },
			{
				_key: k(), _type: 'location-card',
				title: rt('Mitten in *Melle* — gut erreichbar.'),
				text: 'Direkt am Wittekindsweg, fünf Minuten vom Bahnhof, mit eigenen Parkplätzen vor der Tür. Wir freuen uns auf Ihren Besuch.',
				directions: [
					{ _key: k(), _type: 'direction', icon: 'map-pin', title: 'Adresse', text: 'Wittekindsweg 10, 49324 Melle' },
					{ _key: k(), _type: 'direction', icon: 'clock', title: 'Bürozeiten', text: 'Mo–Fr 09–18 Uhr (telefonisch)' },
					{ _key: k(), _type: 'direction', icon: 'clock', title: 'Unterricht', text: 'Mo–Fr bis 20 Uhr · Sa 10–14 Uhr' },
				],
				mapLink: linkExt('In Google Maps öffnen', 'https://maps.google.com/?q=Wittekindsweg+10,+49324+Melle'),
				mapLinkLabel: 'Route planen',
			},
			{
				_key: k(), _type: 'info-cards',
				cards: [
					{ _key: k(), _type: 'infoCard', variant: 'coral', icon: 'phone', label: 'Telefon', value: '01520 / 89 93 894', small: 'Mo–Fr 09–18 Uhr', link: linkExt('Jetzt anrufen', 'tel:+4915208993894') },
					{ _key: k(), _type: 'infoCard', variant: 'neutral', icon: 'message', label: 'WhatsApp', value: 'Jetzt schreiben', link: linkExt('WhatsApp', 'https://wa.me/4915208993894') },
					{ _key: k(), _type: 'infoCard', variant: 'neutral', icon: 'mail', label: 'E-Mail', value: 'info@creators-school.de', link: linkExt('E-Mail schreiben', 'mailto:info@creators-school.de') },
				],
			},
		],
	}

	// ── Aufführungen ──────────────────────────────────────────────────
	const auffuehrungen: Record<string, unknown> = {
		_id: P.auffuehrungen, _type: 'page', language: 'de',
		title: 'Aufführungen 2026',
		metadata: { _type: 'metadata', slug: { _type: 'slug', current: 'auffuehrungen' }, title: 'Aufführungen September 2026 — Creators School im Schauspielhaus Melle' },
		stage: [{
			_key: k(), _type: 'page-header',
			eyebrow: 'Bühne frei · September 2026',
			title: rt('Zwei Abende, eine ganze Schule auf der *Bühne*.'),
			lede: 'Schauspielhaus Melle · 5. & 6. September 2026 · Beginn jeweils am Abend.',
			ctas: [
				cta('WhatsApp schreiben', 'ext', 'https://wa.me/4915208993894'),
				cta('Karten per E-Mail', 'ext', 'mailto:info@creators-school.de?subject=Karten Aufführung 2026', 'secondary'),
			],
		}],
		modules: [
			{
				_key: k(), _type: 'performance-banner',
				performance: { _type: 'reference', _ref: PERF },
			},
			{
				_key: k(), _type: 'feature-grid',
				eyebrow: 'Das erwartet euch',
				title: rt('Ein Abend voller *Ausdruck*.'),
				features: [
					{ _key: k(), _type: 'featureCard', tint: 'soft', title: 'Alle Gruppen auf einer Bühne', text: 'Von der Tänzerischen Früherziehung bis zu den Erwachsenengruppen — die ganze Schule in einer Show.' },
					{ _key: k(), _type: 'featureCard', tint: 'coral', title: 'Echtes Bühnenbild', text: 'Kostüme, Licht, Bühnenbild — wie eine echte Theaterproduktion, mit allem, was dazugehört.' },
					{ _key: k(), _type: 'featureCard', tint: 'soft', title: 'Über 500 Plätze pro Abend', text: 'Das Schauspielhaus Melle bietet ausreichend Platz für Familien, Freunde und alle Fans.' },
				],
			},
			{
				_key: k(), _type: 'accordion-list',
				intro: bl('Fr · 4. Sep — Generalprobe · Sa · 5. Sep — Premierenabend · So · 6. Sep — Zweiter Abend'),
				items: [
					{ _key: k(), _type: 'object', summary: 'Fr · 4. Sep — Generalprobe', content: 'Letzter Feinschliff auf der Bühne — für geladene Gäste und Familien.', open: true },
					{ _key: k(), _type: 'object', summary: 'Sa · 5. Sep — Premierenabend', content: 'Der große Auftakt. Alle Gruppen zeigen ihre Choreografien vor vollem Haus.' },
					{ _key: k(), _type: 'object', summary: 'So · 6. Sep — Zweiter Abend', content: 'Noch einmal die volle Bühne — für alle, die am Samstag keinen Platz mehr bekommen haben.' },
				],
			},
			{
				_key: k(), _type: 'svc-faq',
				eyebrow: 'Häufige Fragen',
				title: rt('Gut zu *wissen*.'),
				lead: 'Fragen zu Karten oder Ablauf? Schreib uns am schnellsten per WhatsApp.',
				ctas: [cta('Per WhatsApp fragen', 'ext', 'https://wa.me/4915208993894', 'secondary')],
				items: faq([
					['Wie bekomme ich Karten?', 'Karten gibt es auf Anfrage — per WhatsApp, E-Mail oder telefonisch. Wir melden uns mit allen Details zu Platz und Preis.'],
					['Wo finden die Aufführungen statt?', 'Im Schauspielhaus Melle. Die genaue Anfahrt und Einlasszeit teilen wir mit der Kartenbestätigung mit.'],
					['Können beide Abende besucht werden?', 'Ja. Der 5. und 6. September zeigen dasselbe Programm — wählt einfach den Abend, der besser passt.'],
				]),
			},
			ctaBand('Karten für die *Aufführungen* sichern.', 'Schreib uns — wir antworten schnell und reservieren deinen Platz persönlich.'),
		],
	}

	// ── Legal ─────────────────────────────────────────────────────────
	const legalPages = [
		{ id: P.impressum, slug: 'impressum', title: 'Impressum', eyebrow: 'Rechtliches', heading: '*Impressum*' },
		{ id: P.datenschutz, slug: 'datenschutz', title: 'Datenschutz', eyebrow: 'Rechtliches', heading: '*Datenschutzerklärung*' },
		{ id: P.barrierefreiheit, slug: 'barrierefreiheit', title: 'Barrierefreiheit', eyebrow: 'Rechtliches', heading: 'Erklärung zur *Barrierefreiheit*' },
	].map(({ id, slug, title, eyebrow, heading }) => ({
		_id: id, _type: 'page', language: 'de', title,
		metadata: { _type: 'metadata', slug: { _type: 'slug', current: slug } },
		stage: [{
			_key: k(), _type: 'page-header',
			eyebrow,
			title: rt(heading),
			lede: 'Bitte füge hier den rechtlichen Inhalt ein.',
		}],
		modules: [],
	}))

	// Order matters: create leaf pages (no outbound refs) before pages that reference them
	return [kontakt, auffuehrungen, stundenplan, ...legalPages, galerie, ueberUns, jobs, angebote, ...offeringPages, home]
}

// ── navigation ────────────────────────────────────────────────────────

function buildNavigation() {
	return {
		_id: 'navigation-de', _type: 'navigation', language: 'de',
		title: 'Header Navigation (de)',
		type: 'header',
		items: [
			{ _key: k(), _type: 'link', label: 'Home', type: 'internal', internal: { _type: 'reference', _ref: P.home } },
			{
				_key: k(), _type: 'link.list',
				link: { _type: 'link', label: 'Angebote', type: 'internal', internal: { _type: 'reference', _ref: P.angebote } },
				links: [
					navLink('Alle ansehen', 'Übersicht aller acht Angebote', P.angebote),
					navLink('Musikalische Frühförderung', '4–6 Jahre · Kleingruppe', P.aMFrue),
					navLink('Eltern-Kind-Kurs', '1,5–3 Jahre · mit Mama/Papa', P.aEKK),
					navLink('Tänzerische Früherziehung', '3–5 Jahre · Bewegung & Tanz', P.aTFrue),
					navLink('Ballett', 'ab 6 Jahren · klassische Technik', P.aBallett),
					navLink('Jazz & Musicaldance', 'ab 8 Jahren · Bühne & Show', P.aJazz),
					navLink('Hochzeitsgesang', 'Auf Anfrage · bundesweit', P.aHochzeit),
					navLink('Instrumentalunterricht', 'Alle Altersgruppen · Einzel/Duo', P.aInstrument),
					navLink('Kindergarten-Projekte', 'Kita-Kooperation · bei Ihnen vor Ort', P.aKita),
				],
			},
			{ _key: k(), _type: 'link', label: 'Galerie', type: 'internal', internal: { _type: 'reference', _ref: P.galerie } },
			{ _key: k(), _type: 'link', label: 'Über uns', type: 'internal', internal: { _type: 'reference', _ref: P.ueberUns } },
			// Stundenplan nav link hidden for now
			{ _key: k(), _type: 'link', label: 'Jobs', type: 'internal', internal: { _type: 'reference', _ref: P.jobs } },
			{ _key: k(), _type: 'link', label: 'Kontakt', type: 'internal', internal: { _type: 'reference', _ref: P.kontakt } },
			cta('Probestunde', 'int', P.kontakt),
		],
	}
}

// ── footer ────────────────────────────────────────────────────────────

function buildFooter() {
	function footerLink(label: string, ref: string) {
		return { _key: k(), _type: 'link', label, type: 'internal', internal: { _type: 'reference', _ref: ref } }
	}
	function footerLinkExt(label: string, url: string) {
		return { _key: k(), _type: 'link', label, type: 'external', external: url }
	}

	return {
		_id: 'footer-de', _type: 'footer', language: 'de',
		tagline: 'Musik- und Tanzschule in Melle. Seit 2002 — von den ersten Klangerlebnissen der Kleinsten bis zur Bühne für jedes Alter.',
		columns: [
			{
				_key: k(), _type: 'link.group', title: 'Angebote',
				links: [
					footerLink('Eltern-Kind-Kurs', P.aEKK),
					footerLink('Musikalische Frühförderung', P.aMFrue),
					footerLink('Tänzerische Frühförderung', P.aTFrue),
					footerLink('Ballett', P.aBallett),
					footerLink('Jazz & Musicaldance', P.aJazz),
					footerLink('Aufführungen', P.auffuehrungen),
				],
			},
			{
				_key: k(), _type: 'link.group', title: 'Schule',
				links: [
					footerLink('Über uns', P.ueberUns),
					footerLink('Stundenplan', P.stundenplan),
					footerLink('Kontakt', P.kontakt),
					footerLink('Aufführungen 2026', P.auffuehrungen),
				],
			},
			{
				_key: k(), _type: 'link.group', title: 'Kontakt',
				links: [
					footerLinkExt('01520 / 89 93 894', 'tel:+4915208993894'),
					footerLinkExt('info@creators-school.de', 'mailto:info@creators-school.de'),
					footerLinkExt('Wittekindsweg 10, 49324 Melle', 'https://maps.google.com/?q=Wittekindsweg+10,+49324+Melle'),
				],
			},
		],
		socials: [
			footerLinkExt('Instagram', 'https://www.instagram.com/creators.school.melle'),
			footerLinkExt('Facebook', 'https://www.facebook.com/creatorssschool'),
			footerLinkExt('YouTube', 'https://www.youtube.com/@creators-school-melle'),
		],
		bottomLinks: [
			footerLink('Datenschutz', P.datenschutz),
			footerLink('Impressum', P.impressum),
			footerLink('Erklärung zur Barrierefreiheit', P.barrierefreiheit),
		],
		copyright: '© {year} Creators School · Inh. Miriam Schulte · Alle Rechte vorbehalten',
	}
}

// ── jobs ──────────────────────────────────────────────────────────────

function buildJobs() {
	return [
		{
			_id: 'job-tanzlehrerin', _type: 'job', language: 'de',
			title: 'Tanzlehrer:in',
			description: 'Ballett oder Moderndance, für Kinder, Jugendliche oder Erwachsene. Auf Honorarbasis, Tag flexibel.',
			active: true,
		},
		{
			_id: 'job-musikpaedagogin', _type: 'job', language: 'de',
			title: 'Musikpädagog:in',
			description: 'Für Frühförderung, Eltern-Kind-Kurs oder Instrumentalunterricht. Teilzeit oder Honorarbasis.',
			active: true,
		},
		{
			_id: 'job-initiativbewerbung', _type: 'job', language: 'de',
			title: 'Initiativbewerbung',
			description: 'Du brennst für Musik oder Tanz, findest aber keine passende Stelle? Schreib uns trotzdem — wir freuen uns.',
			active: true,
		},
	]
}

// ── schedule slots ────────────────────────────────────────────────────

function buildScheduleSlots() {
	const teacherMap: Record<string, string> = {
		'Lena Voss': 'teacher-lena-voss',
		'Miriam Schulte': 'teacher-miriam-schulte',
		'Charlotte Renk': 'teacher-charlotte-berg',
		'Marlene Ott': 'teacher-marlene-otten',
	}
	const dayMap: Record<string, { key: string; order: number }> = {
		Montag:    { key: 'mo', order: 0 },
		Dienstag:  { key: 'di', order: 1 },
		Mittwoch:  { key: 'mi', order: 2 },
		Donnerstag:{ key: 'do', order: 3 },
		Freitag:   { key: 'fr', order: 4 },
		Samstag:   { key: 'sa', order: 5 },
	}
	const TAGE = [
		{ name: 'Montag', termine: [
			{ z:'09:30', d:'30 min', n:'Mini-Musaik · Krabbelgruppe', a:'1,5–3 J.', raum:'Saal B', lk:'Lena Voss', s:'few',  b:'musik', cats:['frueh'] },
			{ z:'15:30', d:'45 min', n:'Musikalische Frühförderung', a:'4–6 J.',  raum:'Saal A',  lk:'Miriam Schulte', s:'open', b:'musik', cats:['frueh'] },
			{ z:'16:45', d:'60 min', n:'Ballett ab 6', a:'ab 6 J.',               raum:'Tanzsaal', lk:'Charlotte Renk', s:'open', b:'tanz',  cats:[] },
			{ z:'18:00', d:'75 min', n:'Moderndance ab 15', a:'ab 15 J.',         raum:'Tanzsaal', lk:'Marlene Ott',    s:'few',  b:'tanz',  cats:[] },
			{ z:'19:30', d:'75 min', n:'Moderndance ab 30', a:'ab 30 J.',         raum:'Tanzsaal', lk:'Miriam Schulte', s:'open', b:'tanz',  cats:['erwachsene'] },
		]},
		{ name: 'Dienstag', termine: [
			{ z:'09:30', d:'30 min', n:'Mini-Musaik · Krabbelgruppe', a:'1,5–3 J.', raum:'Saal B', lk:'Lena Voss',     s:'open', b:'musik', cats:['frueh'] },
			{ z:'15:00', d:'45 min', n:'Tänzerische Frühförderung', a:'ab 3 J.',    raum:'Tanzsaal', lk:'Charlotte Renk', s:'few', b:'tanz', cats:['frueh'] },
			{ z:'16:15', d:'60 min', n:'Ballett ab 9', a:'ab 9 J.',                 raum:'Tanzsaal', lk:'Charlotte Renk', s:'open', b:'tanz', cats:[] },
			{ z:'17:30', d:'60 min', n:'Moderndance ab 10', a:'ab 10 J.',           raum:'Tanzsaal', lk:'Marlene Ott',    s:'full', b:'tanz', cats:[] },
			{ z:'19:00', d:'75 min', n:'Moderndance ab 18', a:'ab 18 J.',           raum:'Tanzsaal', lk:'Marlene Ott',    s:'open', b:'tanz', cats:['erwachsene'] },
		]},
		{ name: 'Mittwoch', termine: [
			{ z:'10:00', d:'30 min', n:'Mini-Musaik · Krabbelgruppe', a:'1,5–3 J.', raum:'Saal B', lk:'Lena Voss',     s:'few',  b:'musik', cats:['frueh'] },
			{ z:'15:30', d:'45 min', n:'Musikalische Frühförderung', a:'4–6 J.',    raum:'Saal A',  lk:'Miriam Schulte', s:'open', b:'musik', cats:['frueh'] },
			{ z:'16:45', d:'45 min', n:'Tänzerische Frühförderung', a:'ab 3 J.',    raum:'Tanzsaal', lk:'Charlotte Renk', s:'open', b:'tanz', cats:['frueh'] },
			{ z:'18:00', d:'60 min', n:'Ballett ab 9', a:'ab 9 J.',                 raum:'Tanzsaal', lk:'Charlotte Renk', s:'few',  b:'tanz', cats:[] },
			{ z:'19:30', d:'75 min', n:'Moderndance ab 18', a:'ab 18 J.',           raum:'Tanzsaal', lk:'Marlene Ott',    s:'open', b:'tanz', cats:['erwachsene'] },
		]},
		{ name: 'Donnerstag', termine: [
			{ z:'15:00', d:'60 min', n:'Ballett ab 6', a:'ab 6 J.',        raum:'Tanzsaal', lk:'Charlotte Renk', s:'open', b:'tanz', cats:[] },
			{ z:'16:15', d:'60 min', n:'Moderndance ab 10', a:'ab 10 J.', raum:'Tanzsaal', lk:'Marlene Ott',    s:'few',  b:'tanz', cats:[] },
			{ z:'17:30', d:'75 min', n:'Moderndance ab 15', a:'ab 15 J.', raum:'Tanzsaal', lk:'Marlene Ott',    s:'open', b:'tanz', cats:[] },
			{ z:'19:00', d:'75 min', n:'Moderndance ab 30', a:'ab 30 J.', raum:'Tanzsaal', lk:'Miriam Schulte', s:'full', b:'tanz', cats:['erwachsene'] },
		]},
		{ name: 'Freitag', termine: [
			{ z:'09:30', d:'30 min', n:'Mini-Musaik · Krabbelgruppe', a:'1,5–3 J.', raum:'Saal B', lk:'Lena Voss',     s:'open', b:'musik', cats:['frueh'] },
			{ z:'15:30', d:'45 min', n:'Musikalische Frühförderung', a:'4–6 J.',    raum:'Saal A',  lk:'Miriam Schulte', s:'few',  b:'musik', cats:['frueh'] },
			{ z:'16:45', d:'45 min', n:'Tänzerische Frühförderung', a:'ab 3 J.',    raum:'Tanzsaal', lk:'Charlotte Renk', s:'open', b:'tanz', cats:['frueh'] },
			{ z:'18:00', d:'75 min', n:'Moderndance ab 18', a:'ab 18 J.',           raum:'Tanzsaal', lk:'Marlene Ott',    s:'open', b:'tanz', cats:['erwachsene'] },
		]},
		{ name: 'Samstag', termine: [
			{ z:'10:00', d:'60 min', n:'Ballett ab 6', a:'ab 6 J.',        raum:'Tanzsaal', lk:'Charlotte Renk', s:'open', b:'tanz', cats:[] },
			{ z:'11:15', d:'60 min', n:'Ballett ab 9', a:'ab 9 J.',        raum:'Tanzsaal', lk:'Charlotte Renk', s:'few',  b:'tanz', cats:[] },
			{ z:'12:30', d:'75 min', n:'Moderndance ab 15', a:'ab 15 J.', raum:'Tanzsaal', lk:'Marlene Ott',    s:'open', b:'tanz', cats:[] },
		]},
	]

	const slots: unknown[] = []
	let idx = 0
	for (const day of TAGE) {
		const { key: weekday, order: weekdayOrder } = dayMap[day.name]
		for (const t of day.termine) {
			idx++
			const teacherId = teacherMap[t.lk]
			slots.push({
				_id: `schedule-slot-${String(idx).padStart(3, '0')}`,
				_type: 'scheduleSlot',
				language: 'de',
				weekday,
				weekdayOrder,
				time: t.z,
				duration: t.d,
				name: t.n,
				ageRange: t.a,
				room: t.raum,
				...(teacherId ? { teacher: { _type: 'reference', _ref: teacherId } } : {}),
				status: t.s,
				bereich: t.b,
				categories: t.cats,
			})
		}
	}
	return slots
}

// ── persons (for person-list on Über uns) ─────────────────────────────

function buildPersons(phId: string) {
	const team = [
		{ id: 'person-miriam-schulte',   name: 'Miriam Schulte',   role: 'Gründerin · Pädagogische Leitung · Musicaldarstellerin', bio: 'Frühförderung, Klavier, Gesang' },
		{ id: 'person-charlotte-berg',   name: 'Charlotte Berg',    role: 'Ballett · Choreografie', bio: 'Klassisches Ballett, Spitzentanz' },
		{ id: 'person-tobias-linde',     name: 'Tobias Linde',      role: 'Gitarre · Bass · Schlagzeug', bio: 'Gitarre, E-Bass, Drums' },
		{ id: 'person-lena-voss',        name: 'Lena Voss',         role: 'Mini-Musaik · Tänzerische Früherziehung', bio: 'Eltern-Kind, Bewegung' },
		{ id: 'person-marlene-otten',    name: 'Marlene Otten',     role: 'Jazz · Musicaldance', bio: 'Jazz Dance, Musical' },
		{ id: 'person-jakob-heinemann',  name: 'Jakob Heinemann',   role: 'Klavier · Musiktheorie', bio: 'Klavier, Klassik & Pop' },
		{ id: 'person-anneke-friese',    name: 'Anneke Friese',     role: 'Violine · Viola', bio: 'Violine, Kammermusik' },
		{ id: 'person-elisa-hartmann',   name: 'Elisa Hartmann',    role: 'Stimmbildung · Hochzeitsgesang', bio: 'Gesang, Bühne' },
	]
	return team.map(t => ({
		_id: t.id, _type: 'person', language: 'de',
		name: t.name, role: t.role, bio: t.bio,
		image: { ...imgRef(phId), alt: t.name },
	}))
}

// ── main ──────────────────────────────────────────────────────────────

async function main() {
	console.log('🌱 Starting seed…\n')

	// 1. Assets
	const { logoId, heroId, phId } = await uploadAssets()

	// 2. Build all docs — order matters (leaf docs before docs that reference them)
	const docs = [
		buildPerformance(phId),
		...buildTeachers(phId),
		...buildPersons(phId),     // person docs for person-list on Über uns
		...buildTestimonials(phId),
		...buildOfferings(phId),
		...buildScheduleSlots(),   // 26 schedule slot docs for Stundenplan
		...buildPages(heroId, phId),
		buildSite(logoId, phId),   // after page-auffuehrungen
		...buildJobs(),
		buildNavigation(),         // after all offering pages
		buildFooter(),             // after all offering pages
	]

	// 3. Write
	let ok = 0, fail = 0
	for (const doc of docs) {
		try {
			await client.createOrReplace(doc as never)
			console.log(`  ✓ ${doc._id}`)
			ok++
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : String(e)
			console.error(`  ✗ ${doc._id}: ${msg}`)
			fail++
		}
	}

	console.log(`\n✅ Done — ${ok} created/updated, ${fail} failed.`)
}

main().catch(err => { console.error(err); process.exit(1) })
