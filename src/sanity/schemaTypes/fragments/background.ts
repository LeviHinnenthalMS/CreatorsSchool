/**
 * Shared background-color option list used by section-level modules
 * (sliders, callouts, grids). Keep this single source of truth in sync with
 * the `Background` type unions and `SECTION_BG` lookup maps in
 * `src/ui/modules/*` consumers.
 */
export const BG_OPTIONS = [
	{ title: 'White', value: 'white' },
	{ title: 'Neutral lightest', value: 'neutral-lightest' },
	{ title: 'Transparent', value: 'transparent' },
] as const

export type BackgroundValue = (typeof BG_OPTIONS)[number]['value']
