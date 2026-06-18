import {
	FaBluesky,
	FaFacebookF,
	FaGithub,
	FaInstagram,
	FaLinkedinIn,
	FaTiktok,
	FaXTwitter,
	FaYoutube,
} from 'react-icons/fa6'
import { IoIosLink } from 'react-icons/io'

const fallbacks: { match: (url?: string) => boolean; Icon: React.ElementType }[] = [
	{ match: (u) => !!u?.includes('bsky.app'), Icon: FaBluesky },
	{ match: (u) => !!u?.includes('facebook.com'), Icon: FaFacebookF },
	{ match: (u) => !!u?.includes('github.com'), Icon: FaGithub },
	{ match: (u) => !!u?.includes('instagram.com'), Icon: FaInstagram },
	{ match: (u) => !!u?.includes('linkedin.com'), Icon: FaLinkedinIn },
	{ match: (u) => !!u?.includes('tiktok.com'), Icon: FaTiktok },
	{
		match: (u) => !!u?.includes('twitter.com') || !!u?.includes('x.com'),
		Icon: FaXTwitter,
	},
	{ match: (u) => !!u?.includes('youtube.com'), Icon: FaYoutube },
]

export default function SocialIcon({
	link,
}: {
	link?: { external?: string | null } | null
}) {
	const url = link?.external ?? undefined
	const match = fallbacks.find((f) => f.match(url))
	const Icon = match?.Icon || IoIosLink
	return <Icon className="size-5" aria-hidden />
}
