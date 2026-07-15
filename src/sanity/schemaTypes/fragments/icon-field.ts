import { IconPicker } from '../../ui/IconPicker'

export const iconField = {
	name: 'icon',
	title: 'Icon',
	type: 'string' as const,
	components: { input: IconPicker },
}
