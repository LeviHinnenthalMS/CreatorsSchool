import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Text,
} from '@react-email/components'

type Props = {
	name: string
}

export default function ContactConfirmation({ name }: Props) {
	return (
		<Html>
			<Head />
			<Preview>Danke für deine Anfrage bei Creators School</Preview>
			<Body style={{ backgroundColor: '#f5f0f2', fontFamily: 'sans-serif' }}>
				<Container style={{ maxWidth: 560, margin: '40px auto', backgroundColor: '#ffffff', borderRadius: 12, overflow: 'hidden' }}>
					<Section style={{ backgroundColor: '#e8315a', padding: '24px 32px' }}>
						<Heading style={{ color: '#ffffff', margin: 0, fontSize: 20, fontWeight: 700 }}>
							Danke für deine Nachricht!
						</Heading>
					</Section>
					<Section style={{ padding: '28px 32px' }}>
						<Text style={paragraph}>Hallo {name},</Text>
						<Text style={paragraph}>
							vielen Dank für deine Anfrage bei Creators School. Wir haben deine Nachricht
							erhalten und melden uns so schnell wie möglich bei dir zurück – in der Regel
							innerhalb von ein bis zwei Werktagen.
						</Text>
						<Text style={paragraph}>
							Bis dahin, herzliche Grüße
							<br />
							dein Team von Creators School
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	)
}

const paragraph: React.CSSProperties = { margin: '0 0 14px', fontSize: 15, lineHeight: 1.6, color: '#1a0d12' }
