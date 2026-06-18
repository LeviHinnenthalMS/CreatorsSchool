import sanityConfig from '@sanity/eslint-config-studio/eslint.config.js'

export default [
	{
		ignores: [
			'.next/**',
			'node_modules/**',
			'public/**',
			'.vercel/**',
			'schema.json',
			'src/sanity/types.ts',
			'next-env.d.ts',
		],
	},
	...sanityConfig,
]
