import {
    RiCodeFill,
    RiFacebookFill,
    RiMailLine,
    RiTwitterXFill,
    RiInstagramLine,
    RiTiktokLine
} from "@remixicon/react"


export const SocialLinksData = (user_id: string) => {

    const profileUrl = `https://paza-social.com/share/${user_id}`

    const socialLinks = [
        {
            title: "Embed Code",
            icon: <RiCodeFill size={16} aria-hidden="true" />,
            href: "#",
        },
        {
            title: "Instagram",
            icon: <RiInstagramLine size={16} aria-hidden="true" />,
            href: `https://www.instagram.com/?url=${encodeURIComponent(profileUrl)}`,
        },
        {
            title: "TikTok",
            icon: <RiTiktokLine size={16} aria-hidden="true" />,
            href: `https://www.tiktok.com/share?url=${encodeURIComponent(profileUrl)}`,
        },
        {
            title: "Twitter / X",
            icon: <RiTwitterXFill size={16} aria-hidden="true" />,
            href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(profileUrl)}&text=Check%20this%20out!`,
        },
        {
            title: "Facebook",
            icon: <RiFacebookFill size={16} aria-hidden="true" />,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
        },
        {
            title: "Email",
            icon: <RiMailLine size={16} aria-hidden="true" />,
            href: `mailto:?subject=Check%20this%20profile&body=${encodeURIComponent(profileUrl)}`,
        },
    ]


    return { socialLinks, profileUrl }
}
