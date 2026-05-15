import {
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaTwitch,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

export type SocialPlatform =
  | "Instagram"
  | "TikTok"
  | "YouTube"
  | "X"
  | "LinkedIn"
  | "GitHub"
  | "Twitch"
  | "Facebook"
  | "WhatsApp"
  | "Website";

export const socialPlatforms: SocialPlatform[] = [
  "Instagram",
  "TikTok",
  "YouTube",
  "X",
  "LinkedIn",
  "GitHub",
  "Twitch",
  "Facebook",
  "WhatsApp",
  "Website",
];

export const socialPlatformIcons = {
  Instagram: FaInstagram,
  TikTok: FaTiktok,
  YouTube: FaYoutube,
  X: FaXTwitter,
  LinkedIn: FaLinkedin,
  GitHub: FaGithub,
  Twitch: FaTwitch,
  Facebook: FaFacebook,
  WhatsApp: FaWhatsapp,
  Website: FaGlobe,
} satisfies Record<SocialPlatform, React.ComponentType<{ className?: string }>>;

export const getSocialPlatformIcon = (platform: string) =>
  socialPlatformIcons[platform as SocialPlatform] || FaGlobe;
