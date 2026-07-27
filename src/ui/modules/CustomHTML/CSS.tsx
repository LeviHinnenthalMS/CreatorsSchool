'use client'

export default function CSS({ code }: { code?: string | null }) {
	if (!code) return null

	return (
		// styled-jsx intentionally uses the non-standard jsx attribute.
		// eslint-disable-next-line react/no-unknown-property
		<style jsx>{`
			${code}
		`}</style>
	)
}
