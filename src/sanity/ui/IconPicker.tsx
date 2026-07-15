'use client'
import { set, unset } from 'sanity'
import type { StringInputProps } from 'sanity'
import {
	Music, Sparkles, Monitor, Users, Clock, Calendar, Mic, Heart,
	Star, Activity, MapPin, Phone, Mail, Smile, Piano, Leaf,
	Car, Bus, Bike, Train, type LucideIcon,
} from 'lucide-react'

const ICONS: { key: string; label: string; Icon: LucideIcon }[] = [
	{ key: 'music',    label: 'Musik',     Icon: Music },
	{ key: 'piano',    label: 'Klavier',   Icon: Piano },
	{ key: 'voice',    label: 'Gesang',    Icon: Mic },
	{ key: 'sparkle',  label: 'Funkeln',   Icon: Sparkles },
	{ key: 'star',     label: 'Stern',     Icon: Star },
	{ key: 'heart',    label: 'Herz',      Icon: Heart },
	{ key: 'smile',    label: 'Lächeln',   Icon: Smile },
	{ key: 'dance',    label: 'Tanz',      Icon: Activity },
	{ key: 'movement', label: 'Bewegung',  Icon: Activity },
	{ key: 'stage',    label: 'Bühne',     Icon: Monitor },
	{ key: 'people',   label: 'Gruppe',    Icon: Users },
	{ key: 'clock',    label: 'Uhrzeit',   Icon: Clock },
	{ key: 'calendar', label: 'Kalender',  Icon: Calendar },
	{ key: 'leaf',     label: 'Natur',     Icon: Leaf },
	{ key: 'pin',      label: 'Ort',       Icon: MapPin },
	{ key: 'phone',    label: 'Telefon',   Icon: Phone },
	{ key: 'mail',     label: 'E-Mail',    Icon: Mail },
	{ key: 'car',      label: 'Auto',      Icon: Car },
	{ key: 'bus',      label: 'Bus',       Icon: Bus },
	{ key: 'bike',     label: 'Fahrrad',   Icon: Bike },
	{ key: 'train',    label: 'Zug',       Icon: Train },
	{ key: 'wedding',  label: 'Hochzeit',  Icon: Heart },
]

export function IconPicker({ value, onChange }: StringInputProps) {
	return (
		<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(76px, 1fr))', gap: 8 }}>
			{ICONS.map(({ key, label, Icon }) => {
				const selected = value === key
				return (
					<button
						key={key}
						type="button"
						onClick={() => onChange(selected ? unset() : set(key))}
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 6,
							padding: '12px 8px',
							borderRadius: 8,
							border: `2px solid ${selected ? '#cf1c20' : '#e2e2e2'}`,
							background: selected ? '#fff0f0' : 'transparent',
							cursor: 'pointer',
							color: selected ? '#cf1c20' : '#555',
						}}
					>
						<Icon size={22} strokeWidth={1.8} />
						<span style={{ fontSize: 11, fontWeight: 500, textAlign: 'center', lineHeight: 1.2 }}>
							{label}
						</span>
					</button>
				)
			})}
		</div>
	)
}
