// Run with: pnpm apply-miriam-tone
import { createClient } from '@sanity/client'

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2024-12-01',
	useCdn: false,
})

type Changes = Record<string, string>

const documents: Record<string, Changes> = {
	site: {
		tagline:
			'Musik- und Tanzschule in Melle. Seit 2002 geben wir Menschen jeden Alters Raum, Musik und Tanz zu erleben und ihren eigenen Ausdruck zu entdecken.',
		ctaBandText:
			'Wir beraten dich persönlich und schauen gemeinsam, welches Angebot wirklich zu dir oder deinem Kind passt. Eine unverbindliche Probestunde gibt Zeit, die Schule, die Gruppe und das eigene Gefühl kennenzulernen.',
	},
	'page-home': {
		'stage[_key=="k426"].sub':
			'Von den ersten Klangerlebnissen bis zur eigenen Präsenz auf der Bühne: Wir verbinden pädagogische Frühförderung mit künstlerischer Ausbildung und geben jedem Menschen Raum für seinen Ausdruck.',
		'modules[_key=="k452"].tagline':
			'Vom ersten Klangerlebnis mit 1,5 Jahren bis zur Bühne im Erwachsenenalter: In kleinen Gruppen begleiten wir Menschen aufmerksam, persönlich und mit Raum für ihren eigenen Ausdruck.',
		'modules[_key=="k452"].features[_key=="k457"].text':
			'In kleinen Gruppen entsteht echte Beziehung. Miriam und ihr Team kennen die Schüler:innen, nehmen ihre Entwicklung wahr und begleiten sie persönlich.',
		'modules[_key=="k452"].features[_key=="k458"].text':
			'Eine Probestunde gibt Zeit zum Ankommen und Kennenlernen — ohne Anmeldung und ohne Verpflichtung.',
		'modules[_key=="k452"].features[_key=="k459"].text':
			'Mit höchstens sechs Schüler:innen bleibt Raum für das eigene Tempo, persönliche Fragen und individuelle Entwicklung.',
		'modules[_key=="k452"].features[_key=="k460"].text':
			'Musik und Tanz werden mit dem ganzen Körper erlebt. Konzerte und Aufführungen machen Mut, den eigenen Ausdruck mit anderen zu teilen.',
		'modules[_key=="k478"].tagline':
			'Eltern erleben die ersten musikalischen Schritte ihrer Kinder. Jugendliche wachsen in ihre Bühnenpräsenz hinein. Erwachsene entdecken neu, was sie ausdrücken möchten.',
		'modules[_key=="k461"].tagline':
			'Musik und Tanz gehören für uns zusammen. Beide geben Menschen die Möglichkeit, sich selbst zu spüren und den eigenen Ausdruck weiterzuentwickeln.',
		'modules[_key=="k461"].cards[_key=="k466"].text':
			'In Eltern-Kind-Kursen und musikalischer Frühförderung erleben Kinder Klang, Rhythmus und Bewegung. Ab 1,5 Jahren gemeinsam mit einer Bezugsperson, ab vier Jahren in der Gruppe.',
		'modules[_key=="k461"].cards[_key=="k467"].text':
			'Von der tänzerischen Frühförderung ab drei Jahren über Ballett und Moderndance bis ins Erwachsenenalter. Mit Unterricht, der Entwicklung begleitet und auf echte Bühnenerfahrungen vorbereitet.',
		'modules[_key=="k468"].tagline':
			'Singen, hören, bewegen und ausprobieren: In kleinen Gruppen bekommen die ersten musikalischen Impulse Zeit, sich zu entfalten.',
		'modules[_key=="k473"].tagline':
			'Vom spielerischen Anfang mit drei Jahren bis zum künstlerischen Tanz im Erwachsenenalter. Jede Stufe stärkt Technik, Ausdruck und den Mut zur Bühne.',
		'modules[_key=="609302752e69"].body[_key=="7b9b023175fa"].children[_key=="b1eba56434a5"].text':
			'2018 übernahm Miriam Schulte die Musikschule Forum Musaik. Aus ihr wurde 2024 die Creators School. Was einmal mit musikalischer Frühförderung begann, ist heute eine Schule mit acht Disziplinen, einem festen Team und über 500 aktiven Schüler:innen.',
		'modules[_key=="609302752e69"].body[_key=="5a078e6f097e"].children[_key=="db6d1fe59ef7"].text':
			'Geblieben ist die Überzeugung, dass Kunst mehr ist als Technik oder Talent. Sie kann Menschen verbinden, ihnen Halt geben und sichtbar machen, was bereits in ihnen steckt.',
		'modules[_key=="k486"].body':
			'Seit 2002 hat künstlerische Bildung in unserer Schule einen festen Platz. Besonders die musikalische und tänzerische Frühförderung liegt uns am Herzen: Kinder bringen Neugier, Lebendigkeit und Ausdruckskraft bereits mit. Wir möchten ihnen Raum geben, all das zu bewahren und weiterzuentwickeln. Und auch später ist es nie zu spät, Musik und Tanz neu für sich zu entdecken.',
		'modules[_key=="k420"].text':
			'Wir beraten dich persönlich und schauen gemeinsam, welches Angebot wirklich zu dir oder deinem Kind passt. Eine unverbindliche Probestunde gibt Zeit, die Schule, die Gruppe und das eigene Gefühl kennenzulernen.',
	},
	'page-angebote': {
		'stage[_key=="k495"].lede':
			'Von der musikalischen Frühförderung ab 1,5 Jahren bis zum Instrumentalunterricht für Erwachsene: Unsere Angebote begleiten unterschiedliche Lebensphasen, Erfahrungen und Formen des persönlichen Ausdrucks.',
		'modules[_key=="k503"].tagline':
			'Ein guter Anfang entsteht im Gespräch. Wir hören zu, lernen Interessen und Erfahrungen kennen und finden gemeinsam einen Platz, der wirklich passt.',
		'modules[_key=="k503"].features[_key=="k509"].text':
			'Wir sprechen über Alter, Interessen und Vorerfahrung. So entsteht eine Empfehlung, die zum Menschen passt — nicht nur zum Stundenplan.',
		'modules[_key=="k503"].features[_key=="k510"].text':
			'In einer kostenlosen Probestunde darf in Ruhe erlebt werden, ob Unterricht, Gruppe und Atmosphäre stimmig sind.',
		'modules[_key=="k420"].text':
			'Wir beraten dich persönlich und schauen gemeinsam, welches Angebot wirklich zu dir oder deinem Kind passt. Eine unverbindliche Probestunde gibt Zeit, die Schule, die Gruppe und das eigene Gefühl kennenzulernen.',
	},
	'page-ueber-uns': {
		'stage[_key=="k581"].lede':
			'Die Creators School ist eine inhabergeführte Musik- und Tanzschule. Wir kennen unsere Schüler:innen beim Namen und möchten einen Ort schaffen, an dem Kunst nicht nur gelernt, sondern erlebt und als eigener Ausdruck entdeckt wird.',
		'modules[_key=="k586"].body[_key=="asb1"].children[_key=="asb1a"].text':
			'2018 übernahm Miriam Schulte die Musikschule Forum Musaik. Aus ihr wurde 2024 die Creators School. Was einmal mit musikalischer Frühförderung begann, ist heute eine Schule mit acht Disziplinen, einem festen Team und über 500 aktiven Schüler:innen.',
		'modules[_key=="k586"].body[_key=="asb2"].children[_key=="asb2a"].text':
			'Geblieben ist die Überzeugung, dass Kunst mehr ist als Technik oder Talent. Sie kann Menschen verbinden, ihnen Halt geben und sichtbar machen, was bereits in ihnen steckt.',
		'modules[_key=="tl001"].intro':
			'Eine Schule wächst nicht nur durch Räume und Angebote. Sie wächst mit den Menschen, ihren Ideen und dem Mut, immer wieder etwas Neues entstehen zu lassen.',
		'modules[_key=="tl001"].items[_key=="tl-i1"].text':
			'Das Forum Musaik beginnt mit musikalischer Frühförderung in angemieteten Räumen. Die erste Gruppe: vier Kinder, ein Klavier und viel Begeisterung.',
		'modules[_key=="k597"].tagline':
			'Unsere pädagogische Haltung ist bewusst: Kinder und Erwachsene bringen bereits etwas Eigenes mit. Wir möchten es wahrnehmen, stärken und ihm Raum geben.',
		'modules[_key=="k597"].features[_key=="k602"].text':
			'Kleine Gruppen geben uns die Zeit, genau hinzusehen. Wir begleiten nicht nur Leistungen, sondern den Menschen mit seinem eigenen Tempo und Ausdruck.',
		'modules[_key=="k597"].features[_key=="k603"].text':
			'Technik schafft Möglichkeiten, ist aber nicht das Ziel. Entscheidend ist, dass Freude, Neugier und die Verbindung zur Kunst lebendig bleiben.',
		'modules[_key=="k597"].features[_key=="k604"].text':
			'Lernen verläuft nicht geradlinig. Wiederholungen, Pausen und neue Anläufe gehören dazu — Entwicklung braucht Zeit und Vertrauen.',
		'modules[_key=="k597"].features[_key=="k605"].text':
			'Bei Aufführungen, Konzerten und Wettbewerben wird Kunst geteilt. Wir bereiten sorgfältig vor und machen Mut, den eigenen Ausdruck sichtbar werden zu lassen.',
		'modules[_key=="k606"].tagline':
			'Unser Team verbindet pädagogische Fachlichkeit mit eigener Bühnenerfahrung. Dabei bleibt der Blick immer bei dem Menschen, der gerade lernt.',
		'modules[_key=="k606"].intro[_key=="k607"].children[_key=="k608"].text':
			'Zwölf Lehrkräfte gestalten gemeinsam einen Ort, an dem unterschiedliche Kunstformen zusammenfinden und jede Entwicklung aufmerksam begleitet wird.',
	},
	'page-jobs': {
		'stage[_key=="k631"].lede':
			'Wir suchen Menschen, die Musik oder Tanz nicht nur beherrschen, sondern mit Überzeugung weitergeben möchten. Menschen, die aufmerksam begleiten, eigene Ideen einbringen und Entwicklung wichtiger finden als Perfektion.',
		'modules[_key=="warum-wir"].lead':
			'Bei uns unterrichtest du in kleinen Gruppen und kennst deine Schüler:innen persönlich. Du bringst deine künstlerische Erfahrung ein und gestaltest Unterricht in einem Team, das miteinander denkt und füreinander da ist.',
		'modules[_key=="warum-wir"].items[_key=="wi1"].text':
			'Maximal sechs Schüler:innen geben dir Zeit, jede Entwicklung aufmerksam zu begleiten.',
		'modules[_key=="warum-wir"].items[_key=="wi2"].text':
			'Deine Ideen dürfen Form annehmen — im Unterricht, im Team und auf der Bühne.',
		'modules[_key=="warum-wir"].items[_key=="wi3"].text':
			'Verlässliche Planung, faire Vergütung und ein Team, das Verantwortung gemeinsam trägt.',
		'modules[_key=="k643"].tagline':
			'Schick uns ein paar persönliche Zeilen zu dir, deiner Erfahrung und dem, was du weitergeben möchtest. Alles Weitere besprechen wir in Ruhe miteinander.',
	},
	'page-auffuehrungen': {
		'modules[_key=="k673"].features[_key=="k678"].text':
			'Von der tänzerischen Früherziehung bis zum Erwachsenentanz zeigen die Gruppen, was im Laufe des Jahres gewachsen ist — technisch, künstlerisch und gemeinsam.',
		'modules[_key=="k673"].features[_key=="k679"].text':
			'Licht, Kostüme und die Atmosphäre des Schauspielhauses machen die Bühne zu einem Ort, an dem der eigene Ausdruck sichtbar werden darf.',
		'modules[_key=="kPD01"].rows[_key=="kPD06"].text':
			'Beim letzten Feinschliff lernen die Gruppen die Bühne, das Licht und den Raum kennen — begleitet von ihren Familien und geladenen Gästen.',
		'modules[_key=="kPD01"].rows[_key=="kPD07"].text':
			'Der erste große Abend: Alle Gruppen bringen ihre Choreografien auf die Bühne und teilen, woran sie gemeinsam gearbeitet haben.',
		'modules[_key=="kPD01"].rows[_key=="kPD08"].text':
			'Ein zweiter Abend voller Musik, Bewegung und Ausdruck — mit demselben Programm für alle, die am Samstag nicht dabei sein können.',
	},
	'page-galerie': {
		'stage[_key=="k569"].lede':
			'Momente aus Proben, Aufführungen und unserem Alltag — dort, wo aus ersten Impulsen gemeinsamer Ausdruck entsteht.',
	},
	'page-kontakt': {
		'stage[_key=="k647"].lede':
			'Erzähl uns, wonach du suchst und was dir wichtig ist. Wir melden uns innerhalb von 24 Stunden zurück — meistens schneller — und nehmen uns Zeit für eine persönliche Beratung.',
	},
	'page-stundenplan': {
		'modules[_key=="k564"].text':
			'Wenn dein Wunschtermin nicht passt oder deine Altersgruppe fehlt, sprich uns an. Wo genügend Interesse entsteht, prüfen wir, ob eine neue Klasse wachsen kann.',
	},
	'performance-sept-2026': {
		lead: 'Zwei Abende, an denen eine ganze Schule ihren Ausdruck teilt.',
		description:
			'Tänzer:innen aller Altersstufen bringen auf die Bühne, was im Laufe des Jahres gewachsen ist. Pro Abend stehen über 500 Plätze zur Verfügung. Die Generalprobe am 4. September ist für geladene Gäste vorgesehen.',
	},
	'job-initiativbewerbung': {
		description:
			'Du möchtest Musik oder Tanz mit Überzeugung weitergeben, findest aber gerade keine passende Ausschreibung? Schreib uns trotzdem und erzähl uns, was dich bewegt.',
	},
	'job-musikpaedagogin': {
		description:
			'Für musikalische Frühförderung, Eltern-Kind-Kurse oder Instrumentalunterricht suchen wir Menschen, die Fachlichkeit mit aufmerksamem Begleiten verbinden. Teilzeit oder Honorarbasis.',
	},
	'job-tanzlehrerin': {
		description:
			'Für Ballett oder Moderndance mit Kindern, Jugendlichen oder Erwachsenen suchen wir eine Lehrkraft, die Technik, Ausdruck und Freude am Tanzen miteinander verbindet. Auf Honorarbasis, Tag flexibel.',
	},
}

const offerings: Record<string, Changes> = {
	'offering-musikalische-fruehfoerderung': {
		lede: 'Kinder entdecken Musik mit Stimme, Bewegung und ersten Instrumenten. In Gruppen von höchstens sechs Kindern bekommen Neugier, Rhythmusgefühl und eigener Ausdruck Raum.',
		forWhoLead:
			'Kinder bringen Neugier auf Klang und Bewegung bereits mit. In der musikalischen Frühförderung darf daraus spielerisch ein erstes Verständnis für Musik entstehen.',
		'forWho[_key=="k14"].text':
			'Singen, hören, bewegen und ausprobieren — ohne Vorkenntnisse und ohne frühen Leistungsdruck.',
		'forWho[_key=="k15"].text':
			'Musik spricht Körper, Wahrnehmung und Fantasie zugleich an und schafft eine wertvolle Grundlage vor der Einschulung.',
		'forWho[_key=="k16"].text':
			'Beim gemeinsamen Musizieren erleben Kinder, wie Zuhören, Rücksicht und Zusammenspiel eine Gruppe tragen.',
		'learn[_key=="k21"].text':
			'Mit Bildern, Symbolen und Bewegung werden erste Zeichen der Musiksprache verständlich und erlebbar.',
		'learn[_key=="k22"].text':
			'Beim Klatschen, Stampfen und Tanzen wird der eigene Körper zum ersten Instrument.',
		'learn[_key=="k23"].text':
			'Klangstäbe, Handtrommeln und einfache Melodieinstrumente laden zum Hören, Ausprobieren und gemeinsamen Gestalten ein.',
	},
	'offering-eltern-kind-kurs': {
		lede: 'Lieder, Reime und Bewegung schaffen gemeinsame musikalische Momente für Kind und Bezugsperson. Ohne Erwartungsdruck, aber mit viel Raum für Nähe, Klang und Entdeckung.',
		forWhoLead:
			'Kinder begegnen Musik lange bevor sie Worte dafür haben. Im Eltern-Kind-Kurs erleben sie Klang und Bewegung gemeinsam mit einem vertrauten Menschen.',
		'forWho[_key=="k46"].text':
			'Gemeinsam mit Mama, Papa oder einer anderen Bezugsperson entsteht ein geschützter Raum für erste musikalische Erfahrungen.',
		'forWho[_key=="k47"].text':
			'Eine halbe Stunde, in der gemeinsames Singen, Bewegen und Wahrnehmen im Mittelpunkt steht.',
		'forWho[_key=="k48"].text':
			'Jedes Kind darf in seinem Tempo hören, beobachten, mitmachen und die eigene Neugier zeigen.',
		'learn[_key=="k53"].text':
			'Lieder, Reime und Bewegung schaffen Nähe und geben der gemeinsamen Zeit einen eigenen Rhythmus.',
		'learn[_key=="k54"].text':
			'Rasseln, Klangstäbe und Trommeln machen Klänge für kleine Hände unmittelbar erfahrbar.',
		'learn[_key=="k55"].text':
			'Beim Tanzen, Schaukeln und Klatschen entdeckt der Körper, wie Musik sich anfühlen kann.',
	},
	'offering-taenzerische-fruehfoerderung': {
		lede: 'Kinder entdecken ihren Körper, den Raum und den Rhythmus der Musik. Geschichten und freie Bewegung geben ihnen einen spielerischen Zugang zur Sprache des Tanzes.',
		forWhoLead:
			'Kinder bringen Freude an Bewegung und eine ganz eigene Ausdruckskraft mit. Die tänzerische Früherziehung bewahrt diese Lebendigkeit und gibt ihr Raum.',
		'forWho[_key=="k79"].text':
			'Bewegung, Musik und Raum werden spielerisch entdeckt — noch ohne feste Technik oder Leistungsdruck.',
		'forWho[_key=="k80"].text':
			'Körpergefühl, Musikalität und gemeinsames Bewegen bereiten behutsam auf den späteren Ballettunterricht vor.',
		'forWho[_key=="k81"].text':
			'Vorerfahrung ist nicht nötig. Entscheidend sind Neugier und Freude daran, sich zu bewegen.',
		'learn[_key=="k86"].text':
			'Beim Strecken, Rollen, Springen und Wirbeln erleben Kinder, was ihr Körper bereits kann.',
		'learn[_key=="k87"].text':
			'Musik wird nicht nur gehört, sondern im ganzen Körper erlebt — als Tempo, Dynamik und Bewegung.',
		'learn[_key=="k88"].text':
			'Improvisation und kleine Geschichten laden dazu ein, eigene Ideen in Bewegung sichtbar zu machen.',
	},
	'offering-ballett': {
		lede: 'Klassisches Ballett verbindet sorgfältig aufgebaute Technik mit Musikalität und Ausdruck. Vom Kinderballett bis zur fortgeschrittenen Klasse wächst jede Stufe auf die jährliche Aufführung hin.',
		forWhoLead:
			'Ballett braucht Konzentration und Geduld. Gleichzeitig entsteht etwas sehr Persönliches: Haltung, Musikalität und der Mut, den eigenen Ausdruck auf die Bühne zu bringen.',
		'forWho[_key=="k112"].text':
			'Für Kinder, die Freude an Musik, klaren Formen und konzentriertem Üben entwickeln möchten.',
		'forWho[_key=="k113"].text':
			'Für Tänzer:innen, die ihre Technik vertiefen und sich behutsam an den Spitzentanz heranarbeiten möchten.',
		'forWho[_key=="k114"].text':
			'Die jährliche Aufführung gibt dem gemeinsamen Lernen ein Ziel und macht Entwicklung auf der Bühne sichtbar.',
		'learn[_key=="k119"].text':
			'Positionen, Arbeit an der Stange und Körperspannung werden klar, geduldig und altersgerecht aufgebaut.',
		'learn[_key=="k120"].text':
			'Bewegung verbindet sich mit Phrasierung, Tempo und Dynamik der Musik.',
		'learn[_key=="k121"].text':
			'Choreografien werden gemeinsam entwickelt und sorgfältig für die jährliche Aufführung vorbereitet.',
	},
	'offering-jazz-musicaldance': {
		lede: 'Jazz und Musicaldance verbinden Energie, Technik und Bühnenausdruck. Jugendliche und Erwachsene erleben unterschiedliche Stile — von Broadway bis zu moderner Pop-Choreografie.',
		forWhoLead:
			'Hier darf Tanz sichtbar, lebendig und charaktervoll werden. Technik schafft die Grundlage, damit Persönlichkeit und Ausdruck auf der Bühne Raum bekommen.',
		'forWho[_key=="k146"].text':
			'Für alle, die Musik, Choreografie und den besonderen Ausdruck des Bühnentanzes lieben.',
		'forWho[_key=="k147"].text':
			'Drei Levels geben Einsteiger:innen und Fortgeschrittenen den passenden Raum, um sich weiterzuentwickeln.',
		'forWho[_key=="k148"].text':
			'Regelmäßige Auftritte machen Ensemblearbeit und die Vorbereitung auf eine große Bühne unmittelbar erlebbar.',
		'learn[_key=="k153"].text':
			'Isolationen, Synkopen und dynamische Bewegungsqualitäten bilden die technische Grundlage des Jazz Dance.',
		'learn[_key=="k154"].text':
			'Broadway-Stile und Charakterarbeit zeigen, wie Bewegung, Raum und Persönlichkeit zusammenspielen.',
		'learn[_key=="k155"].text':
			'Choreografien wachsen im Ensemble und werden mit Bühnenbild und Licht für die Jahresaufführung vorbereitet.',
	},
	'offering-hochzeitsgesang': {
		lede: 'Ein Lied kann einem besonderen Moment eine eigene Stimme geben. Wir beraten Sie persönlich, proben gemeinsam und begleiten Ihre Trauung auch außerhalb von Melle.',
		forWhoLead:
			'Hochzeitsgesang ist kein Unterrichtsformat, sondern eine persönliche Begleitung. Von der Liedauswahl bis zum Auftritt entsteht etwas, das zu Ihrer Geschichte und Ihrer Feier passt.',
		'forWho[_key=="k179"].text':
			'Für Brautpaare und Familien, die ihrer Trauung oder Feier mit professionellem Sologesang eine persönliche Stimme geben möchten.',
		'forWho[_key=="k180"].text':
			'Für Menschen, die selbst singen möchten und sich dabei eine erfahrene stimmpädagogische Begleitung wünschen.',
		'forWho[_key=="k181"].text':
			'Ob standesamtlich oder kirchlich: Wir planen den musikalischen Moment passend zum Ort und reisen auch außerhalb von Melle an.',
		'learn[_key=="k186"].text':
			'Gemeinsam finden wir ein Lied, das zur Feier, zur Stimme und zu Ihrer persönlichen Geschichte passt.',
		'learn[_key=="k187"].text':
			'In den Proben entsteht Sicherheit, damit Musik und Ausdruck am Tag der Trauung frei werden können.',
		'learn[_key=="k188"].text':
			'Der Live-Gesang wird professionell vorbereitet und mit Ruhe, Erfahrung und Bühnenpräsenz gestaltet.',
	},
	'offering-instrumentalunterricht': {
		lede: 'Klavier, Gitarre, Schlagzeug, Gesang, Streicher oder Blasinstrumente: Im Einzel- oder Zweierunterricht entsteht ein Lernweg, der zum Alter, zum Stand und zur eigenen musikalischen Neugier passt.',
		forWhoLead:
			'Instrumentalunterricht beginnt nicht bei einem starren Lehrplan, sondern bei dem Menschen, der lernen möchte. Ziele, Tempo und Repertoire entwickeln wir gemeinsam.',
		'forWho[_key=="k211"].text':
			'Vom ersten Ton bis zum ersten eigenen Stück entsteht Schritt für Schritt ein tragfähiges musikalisches Fundament.',
		'forWho[_key=="k212"].text':
			'Anfänger:innen sind ebenso willkommen wie Fortgeschrittene, die Technik und Ausdruck weiterentwickeln möchten.',
		'forWho[_key=="k213"].text':
			'Wer zu einem Instrument zurückkehrt, darf an frühere Erfahrungen anknüpfen und Musik neu für sich entdecken.',
		'learn[_key=="k218"].text':
			'Spieltechnik, Notenlesen und Harmonielehre werden passend zu Alter, Erfahrung und persönlichem Ziel vermittelt.',
		'learn[_key=="k219"].text':
			'Von Klassik über Pop und Rock bis Jazz: Das Repertoire darf zur eigenen Neugier und musikalischen Persönlichkeit passen.',
		'learn[_key=="k220"].text':
			'Wer möchte, kann bei Konzerten mitwirken und erleben, wie aus Unterricht gemeinsames Musizieren auf der Bühne wird.',
		'faq[_key=="k235"].a':
			'Ja. Viele Erwachsene beginnen bei uns ganz neu oder kehren nach einer Pause zu einem Instrument zurück. Für Musik ist es nie zu spät.',
	},
	'offering-kindergarten-projekte': {
		lede: 'Wir bringen Lieder, Rhythmus, Bewegung und erste Instrumente direkt in die Kindertagesstätte — regelmäßig oder als Projektwoche.',
		forWhoLead:
			'Kinder können Musik besonders frei erleben, wenn sie in ihrer vertrauten Umgebung bleiben. Deshalb kommen wir in die Einrichtung und entwickeln ein Angebot, das zur Gruppe passt.',
		'forWho[_key=="k244"].text':
			'Seit 2002 arbeiten wir mit Kindertagesstätten in Melle und Umgebung verlässlich und pädagogisch fundiert zusammen.',
		'forWho[_key=="k245"].text':
			'Vom Krippenalter bis zur Vorschule werden Inhalte, Tempo und Materialien aufmerksam auf die Gruppe abgestimmt.',
		'forWho[_key=="k246"].text':
			'Ob wöchentlich oder als Projektwoche: Das Format richtet sich nach dem Alltag und den Möglichkeiten der Einrichtung.',
		'learn[_key=="k251"].text':
			'Lieder, Reime und Klatschspiele werden altersgerecht in den vertrauten Gruppenalltag eingebunden.',
		'learn[_key=="k252"].text':
			'Musik und Bewegung werden gemeinsam erlebt und stärken Körperwahrnehmung und Rhythmusgefühl.',
		'learn[_key=="k253"].text':
			'Handtrommeln, Klangstäbe und kleine Melodieinstrumente laden alle Kinder zum eigenen Ausprobieren ein.',
	},
	'offering-ballett-ab-9': {
		lede: 'Im Juniorballett werden Grundlagen vertieft und Bewegungen präziser. Technik, Musikalität und Ausdruck wachsen gemeinsam auf die ersten Ensemble-Erfahrungen auf der Bühne hin.',
		forWhoLead:
			'Das Juniorballett knüpft an vorhandene Grundlagen an. Mit Geduld und wachsender Eigenverantwortung entwickeln die Tänzer:innen Technik und Bühnenausdruck weiter.',
		'forWho[_key=="k277"].text':
			'Der nächste Schritt nach dem Kinderballett: technisch differenzierter und mit einem stärkeren Blick auf die Bühne.',
		'forWho[_key=="k278"].text':
			'Im Ensemble lernen die Tänzer:innen, eine Choreografie gemeinsam zu tragen und für die Jahresaufführung zu gestalten.',
		'learn[_key=="k283"].text':
			'Arbeit an der Stange, Positionen und Körperspannung werden auf einem höheren Niveau weiterentwickelt.',
		'learn[_key=="k284"].text':
			'Phrasierung, Dynamik und Tempo werden bewusster wahrgenommen und in Bewegung übersetzt.',
		'learn[_key=="k285"].text':
			'Choreografie und Bühnenpräsenz werden Schritt für Schritt für die Jahresaufführung vorbereitet.',
	},
	'offering-moderndance-ab-10': {
		lede: 'Kinder lernen erste Techniken des modernen Tanzes kennen und entwickeln daraus Choreografien im Ensemble. Rhythmus, Freude und eigener Ausdruck gehören dabei zusammen.',
		forWhoLead:
			'Kinder bringen Bewegungsideen und Ausdruck bereits mit. Der Unterricht gibt ihnen Technik, Orientierung und den Raum, daraus etwas Eigenes zu gestalten.',
		'forWho[_key=="k308"].text':
			'Für Kinder, die moderne Musik mögen und ihre Freude an Bewegung in Choreografien weiterentwickeln möchten.',
		'forWho[_key=="k309"].text':
			'Vorerfahrung ist nicht nötig. Die technischen Grundlagen entstehen gemeinsam in der Gruppe.',
		'learn[_key=="k314"].text':
			'Isolationen, Synkopen und dynamische Bewegungen schaffen eine erste technische Grundlage.',
		'learn[_key=="k315"].text':
			'Aus einzelnen Impulsen entstehen Bewegungsfolgen, die gemeinsam im Ensemble gestaltet werden.',
		'learn[_key=="k316"].text':
			'Die Gruppe sammelt Bühnenerfahrung und bereitet sich gemeinsam auf die Jahresaufführung vor.',
	},
	'offering-moderndance-ab-15': {
		lede: 'Jugendliche vertiefen ihre Technik und entwickeln einen bewussteren künstlerischen Ausdruck. Anspruchsvolle Choreografien und Bühnenarbeit gehören fest zum Unterricht.',
		forWhoLead:
			'Moderndance ab 15 richtet sich an Jugendliche, die nicht nur Schritte lernen, sondern Bewegung bewusst gestalten und ihren eigenen Ausdruck weiterentwickeln möchten.',
		'forWho[_key=="k338"].text':
			'Für Jugendliche mit ersten Erfahrungen oder erkennbarem Bewegungstalent, die konzentriert und künstlerisch arbeiten möchten.',
		'forWho[_key=="k339"].text':
			'Regelmäßige Auftritte geben ein Ziel und machen die gemeinsame Entwicklung im Ensemble sichtbar.',
		'learn[_key=="k344"].text':
			'Komplexere Sequenzen, Improvisation und Raumgestaltung erweitern Technik und Bewegungsbewusstsein.',
		'learn[_key=="k345"].text':
			'Choreografien werden präzise erarbeitet, ohne Persönlichkeit und eigenen Ausdruck zu verlieren.',
		'learn[_key=="k346"].text':
			'Auftritte stärken Präsenz, Verlässlichkeit im Ensemble und den Mut, Bewegung mit anderen zu teilen.',
	},
	'offering-moderndance-ab-18': {
		lede: 'Zeitgenössische Technik, Improvisation und freie künstlerische Arbeit verbinden sich zu einem Unterricht, in dem junge Erwachsene ihren eigenen Bewegungsausdruck vertiefen können.',
		forWhoLead:
			'Moderndance ab 18 gibt Technik und freier Gestaltung denselben Raum. So kann aus Bewegung eine persönliche künstlerische Sprache entstehen.',
		'forWho[_key=="k368"].text':
			'Mit oder ohne Vorerfahrung: Inhalte und Anspruch werden auf die Menschen in der Gruppe abgestimmt.',
		'forWho[_key=="k369"].text':
			'Improvisation, Ensemblearbeit und Auftritte schaffen Raum für eigene Ideen und gemeinsame Bühnenmomente.',
		'learn[_key=="k374"].text':
			'Zeitgenössische Techniken, Improvisation und Körperwahrnehmung erweitern das eigene Bewegungsrepertoire.',
		'learn[_key=="k375"].text':
			'Eigene Bewegungsideen dürfen entstehen, geprüft und gemeinsam im Ensemble weiterentwickelt werden.',
		'learn[_key=="k376"].text':
			'Bei Auftritten wächst die Fähigkeit, präsent zu sein und den eigenen Ausdruck mit einem Publikum zu teilen.',
	},
	'offering-moderndance-ab-30': {
		lede: 'Tanz darf fordern, Freude machen und eine Auszeit vom Alltag sein. Ohne Leistungsdruck entdecken Erwachsene Bewegung, Ausdruck und Gemeinschaft neu.',
		forWhoLead:
			'Hier geht es nicht um Vergleich oder Perfektion. Der Unterricht gibt Erwachsenen Raum, den eigenen Körper bewusst zu erleben und Tanz als persönliche Ausdrucksform zu entdecken.',
		'forWho[_key=="k398"].text':
			'Wiedereinsteiger:innen und absolute Anfänger:innen sind gleichermaßen willkommen und dürfen im eigenen Tempo ankommen.',
		'forWho[_key=="k399"].text':
			'Tanz verbindet Menschen, wenn Konkurrenz keinen Platz einnimmt und gemeinsames Erleben wichtiger wird.',
		'learn[_key=="k404"].text':
			'Bewegung schafft Abstand zum Alltag und stärkt das körperliche und geistige Wohlbefinden.',
		'learn[_key=="k405"].text':
			'Gut zugängliche Schritte entwickeln Rhythmus und Koordination, ohne den Körper zu überfordern.',
		'learn[_key=="k406"].text':
			'In kleinen Choreografien wird Bewegung zu etwas Eigenem, das sich stimmig anfühlt und sichtbar werden darf.',
	},
}

async function main() {
	const transaction = client.transaction()

	for (const [id, changes] of Object.entries({ ...documents, ...offerings })) {
		transaction.patch(id, (patch) => patch.set(changes))
	}

	const result = await transaction.commit()
	console.log(`Applied Miriam tone to ${result.documentIds.length} documents.`)
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
