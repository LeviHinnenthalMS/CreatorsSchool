import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Row,
	Section,
	Text,
} from '@react-email/components'

type Props = {
	name: string
	contact: string
	message?: string
	interest?: string
	childAge?: string
	sourcePath?: string
}

export default function ContactNotification({ name, contact, message, interest, childAge, sourcePath }: Props) {
	return (
		<Html>
			<Head />
			<Preview>Neue Anfrage von {name}</Preview>
			<Body style={{ backgroundColor: '#f5f0f2', fontFamily: 'sans-serif' }}>
				<Container style={{ maxWidth: 560, margin: '40px auto', backgroundColor: '#ffffff', borderRadius: 12, overflow: 'hidden' }}>
					<Section style={{ backgroundColor: '#e8315a', padding: '24px 32px' }}>
						<Heading style={{ color: '#ffffff', margin: 0, fontSize: 20, fontWeight: 700 }}>
							Neue Kontaktanfrage
						</Heading>
					</Section>
					<Section style={{ padding: '28px 32px' }}>
						<Row>
							<Text style={label}>Name</Text>
							<Text style={value}>{name}</Text>
						</Row>
						<Hr style={divider} />
						<Row>
							<Text style={label}>Telefon / E-Mail</Text>
							<Text style={value}>{contact}</Text>
						</Row>
						{message && (
							<>
								<Hr style={divider} />
								<Row>
									<Text style={label}>Nachricht</Text>
									<Text style={{ ...value, whiteSpace: 'pre-wrap' }}>{message}</Text>
								</Row>
							</>
						)}
						{interest && (
							<>
								<Hr style={divider} />
								<Row>
									<Text style={label}>Angebot</Text>
									<Text style={value}>{interest}</Text>
								</Row>
							</>
						)}
						{childAge && (
							<>
								<Hr style={divider} />
								<Row>
									<Text style={label}>Alter des Kindes</Text>
									<Text style={value}>{childAge}</Text>
								</Row>
							</>
						)}
						{sourcePath && (
							<>
								<Hr style={divider} />
								<Row>
									<Text style={label}>Seite</Text>
									<Text style={{ ...value, color: '#888' }}>{sourcePath}</Text>
								</Row>
							</>
						)}
					</Section>
				</Container>
			</Body>
		</Html>
	)
}

const label: React.CSSProperties = { margin: '0 0 2px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#999' }
const value: React.CSSProperties = { margin: 0, fontSize: 15, color: '#1a0d12' }
const divider: React.CSSProperties = { borderColor: '#f0e8ec', margin: '14px 0' }
