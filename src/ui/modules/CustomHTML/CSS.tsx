'use client'

export default function CSS({ code }: { code?: string | null }) {
	if (!code) return null

	return (
		<style jsx>{`
			${code}
		`}</style>
	)
}
