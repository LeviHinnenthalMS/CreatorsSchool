import { defineCliConfig } from 'sanity/cli'
import { projectId, dataset } from '@/sanity/lib/env'

export default defineCliConfig({
	api: {
		projectId,
		dataset,
	},
	typegen: {
		path: './src/**/*.{ts,tsx}',
		schema: './schema.json',
		generates: './src/sanity/types.ts',
		overloadClientMethods: false,
	},
})
