import { VscMenu, VscClose } from 'react-icons/vsc'

export default function Toggle() {
	return (
		<label
			className="text-ink hover:bg-canvas-muted -m-2 flex size-12 cursor-pointer items-center justify-center rounded-sm transition-colors [grid-area:toggle] lg:hidden"
			aria-label="Toggle menu"
		>
			<input id="header-toggle" type="checkbox" hidden />
			<VscMenu className="size-6 header-open:hidden" aria-hidden />
			<VscClose className="size-6 header-closed:hidden" aria-hidden />
			<span className="sr-only header-open:not-sr-only header-open:hidden">
				Open menu
			</span>
		</label>
	)
}
