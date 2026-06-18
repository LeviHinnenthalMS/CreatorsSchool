import type { ComponentProps } from 'react'

const flags: Record<string, React.ReactNode> = {
	de: (
		<>
			<rect width="24" height="8" y="0" fill="#0B0C0D" />
			<rect width="24" height="8" y="8" fill="#D80027" />
			<rect width="24" height="8" y="16" fill="#FFDA44" />
		</>
	),
	en: (
		<>
			{/* White field */}
			<rect width="24" height="24" fill="#FFFFFF" />
			{/* 7 red stripes (13 stripes total, every other one painted) */}
			<rect width="24" y="0" height="1.85" fill="#BF0A30" />
			<rect width="24" y="3.69" height="1.85" fill="#BF0A30" />
			<rect width="24" y="7.38" height="1.85" fill="#BF0A30" />
			<rect width="24" y="11.08" height="1.85" fill="#BF0A30" />
			<rect width="24" y="14.77" height="1.85" fill="#BF0A30" />
			<rect width="24" y="18.46" height="1.85" fill="#BF0A30" />
			<rect width="24" y="22.15" height="1.85" fill="#BF0A30" />
			{/* Blue canton */}
			<rect width="10" height="12.92" fill="#002868" />
			{/* Simplified stars */}
			<g fill="#FFFFFF">
				<circle cx="2" cy="2.5" r="0.55" />
				<circle cx="5" cy="2.5" r="0.55" />
				<circle cx="8" cy="2.5" r="0.55" />
				<circle cx="3.5" cy="4.5" r="0.55" />
				<circle cx="6.5" cy="4.5" r="0.55" />
				<circle cx="2" cy="6.5" r="0.55" />
				<circle cx="5" cy="6.5" r="0.55" />
				<circle cx="8" cy="6.5" r="0.55" />
				<circle cx="3.5" cy="8.5" r="0.55" />
				<circle cx="6.5" cy="8.5" r="0.55" />
				<circle cx="2" cy="10.5" r="0.55" />
				<circle cx="5" cy="10.5" r="0.55" />
				<circle cx="8" cy="10.5" r="0.55" />
			</g>
		</>
	),
}

export default function Flag({
	lang,
	className,
	...props
}: { lang: string } & ComponentProps<'svg'>) {
	const content = flags[lang] ?? flags.en
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={24}
			height={24}
			role="img"
			aria-hidden
			className={className}
			{...props}
		>
			<defs>
				<clipPath id={`flag-clip-${lang}`}>
					<circle cx="12" cy="12" r="12" />
				</clipPath>
			</defs>
			<g clipPath={`url(#flag-clip-${lang})`}>{content}</g>
		</svg>
	)
}
