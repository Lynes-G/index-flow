import type {
  AvatarShape,
  LayoutStyle,
  LinkStyle,
} from "@/lib/frontend/appearance/themePresets";

export type PageTemplate = {
  key: string;
  label: string;
  audience: string;
  summary: string;
  themePreset: string;
  layoutStyle: LayoutStyle;
  linkStyle: LinkStyle;
  avatarShape: AvatarShape;
  suggestedDescription: string;
  suggestedLinks: string[];
  featuredLinkStrategy: "first-link" | "none";
};

export const pageTemplates: PageTemplate[] = [
  {
    key: "creator-launch",
    label: "Creator Launch",
    audience: "Creators and personal brands",
    summary:
      "A bold hero with one strong featured action followed by a clean stack.",
    themePreset: "Sunset Glow",
    layoutStyle: "spotlight",
    linkStyle: "pill",
    avatarShape: "circle",
    suggestedDescription:
      "I share new drops, behind-the-scenes updates, and the best place to start following my work.",
    suggestedLinks: ["Start here", "Latest release", "Newsletter or community"],
    featuredLinkStrategy: "first-link",
  },
  {
    key: "portfolio-studio",
    label: "Portfolio Studio",
    audience: "Designers, developers, and freelancers",
    summary:
      "An editorial layout that makes your work feel curated instead of crowded.",
    themePreset: "Mono Ink",
    layoutStyle: "editorial",
    linkStyle: "outline",
    avatarShape: "rounded",
    suggestedDescription:
      "I design and build thoughtful digital experiences. Explore selected work, services, and ways to get in touch.",
    suggestedLinks: ["Selected work", "Services", "Book a call"],
    featuredLinkStrategy: "first-link",
  },
  {
    key: "storefront-grid",
    label: "Storefront Grid",
    audience: "Small shops and product-led pages",
    summary:
      "A wider grid that helps multiple offers feel organized at a glance.",
    themePreset: "Citrus Pop",
    layoutStyle: "grid",
    linkStyle: "shadow",
    avatarShape: "rounded",
    suggestedDescription:
      "Shop the latest collection, browse featured picks, and find the quickest path to what you need.",
    suggestedLinks: [
      "Shop new arrivals",
      "Best sellers",
      "Contact and support",
    ],
    featuredLinkStrategy: "first-link",
  },
  {
    key: "speaker-briefing",
    label: "Speaker Briefing",
    audience: "Speakers, consultants, and experts",
    summary:
      "A polished spotlight layout that leads visitors into one flagship offer and supporting proof.",
    themePreset: "Studio Warmth",
    layoutStyle: "spotlight",
    linkStyle: "rounded",
    avatarShape: "square",
    suggestedDescription:
      "I help teams make sense of complex ideas through talks, workshops, and practical frameworks.",
    suggestedLinks: ["Book a keynote", "Watch a talk", "Download speaker kit"],
    featuredLinkStrategy: "first-link",
  },
  {
    key: "brutalist",
    label: "Brutalist",
    audience: "Artists, studios, and bold personal brands",
    summary:
      "A hard-edged editorial page with assertive blocks and zero softness.",
    themePreset: "Brutalist",
    layoutStyle: "editorial",
    linkStyle: "brutalist",
    avatarShape: "square",
    suggestedDescription:
      "Sharp work, direct offers, and no decorative fluff. Pick a path and move.",
    suggestedLinks: ["Manifesto", "Selected work", "Contact"],
    featuredLinkStrategy: "first-link",
  },
  {
    key: "glass-effect",
    label: "Glass Effect",
    audience: "Creators, product launches, and polished modern profiles",
    summary:
      "A luminous frosted layout with layered surfaces and soft motion energy.",
    themePreset: "Glass Effect",
    layoutStyle: "spotlight",
    linkStyle: "glass",
    avatarShape: "rounded",
    suggestedDescription:
      "A calm, premium page with one clear path forward and a lighter visual touch.",
    suggestedLinks: ["Start here", "Featured drop", "Join the waitlist"],
    featuredLinkStrategy: "first-link",
  },
];

export const pageTemplateMap = new Map(
  pageTemplates.map((template) => [template.key, template]),
);

export const findMatchingPageTemplateKey = ({
  avatarShape,
  layoutStyle,
  linkStyle,
  themePreset,
}: {
  avatarShape: AvatarShape;
  layoutStyle: LayoutStyle;
  linkStyle: LinkStyle;
  themePreset: string;
}) =>
  pageTemplates.find(
    (template) =>
      template.avatarShape === avatarShape &&
      template.layoutStyle === layoutStyle &&
      template.linkStyle === linkStyle &&
      template.themePreset === themePreset,
  )?.key ?? null;
