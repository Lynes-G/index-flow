export type DashboardPreviewLink = {
  id: string;
  title: string;
  url: string;
  order: number;
};

type BuildDashboardPreviewModelInput = {
  displayName?: string | null;
  currentSlug?: string | null;
  fallbackShareSlug?: string | null;
  userLinks: DashboardPreviewLink[];
  featuredLinkId?: string | null;
};

type DashboardPreviewModel = {
  displayName: string;
  shareSlug: string;
  selectedFeaturedLink: DashboardPreviewLink | null;
  previewLinks: DashboardPreviewLink[];
};

const fallbackPreviewLinks: DashboardPreviewLink[] = [
  {
    id: "demo-portfolio",
    title: "Portfolio",
    url: "https://example.com",
    order: 0,
  },
  {
    id: "demo-latest-work",
    title: "Latest Work",
    url: "https://example.com",
    order: 1,
  },
  {
    id: "demo-newsletter",
    title: "Newsletter",
    url: "https://example.com",
    order: 2,
  },
];

const normalizeText = (value?: string | null) => value?.trim() || null;

export const buildDashboardPreviewModel = ({
  displayName,
  currentSlug,
  fallbackShareSlug,
  userLinks,
  featuredLinkId,
}: BuildDashboardPreviewModelInput): DashboardPreviewModel => {
  const resolvedLinks = userLinks.length > 0 ? userLinks : fallbackPreviewLinks;
  const selectedFeaturedLink = featuredLinkId
    ? (resolvedLinks.find((link) => link.id === featuredLinkId) ?? null)
    : null;
  const previewLinks = selectedFeaturedLink
    ? resolvedLinks.filter((link) => link.id !== selectedFeaturedLink.id)
    : resolvedLinks;

  return {
    displayName: normalizeText(displayName) || "Your Name",
    shareSlug:
      normalizeText(currentSlug) ||
      normalizeText(fallbackShareSlug) ||
      "your-profile",
    selectedFeaturedLink,
    previewLinks,
  };
};
