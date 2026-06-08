type PublicLink = {
  _id: string;
  title: string;
  url: string;
  order: number;
};

export const splitPublicProfileLinks = (
  links: PublicLink[],
  featuredLinkId?: string,
) => {
  if (!featuredLinkId) {
    return {
      featuredLink: null,
      remainingLinks: links,
    };
  }

  const featuredLink =
    links.find((link) => link._id === featuredLinkId) ?? null;

  if (!featuredLink) {
    return {
      featuredLink: null,
      remainingLinks: links,
    };
  }

  return {
    featuredLink,
    remainingLinks: links.filter((link) => link._id !== featuredLinkId),
  };
};
