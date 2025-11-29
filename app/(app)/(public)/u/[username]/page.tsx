import PublicPageContent from "@/components/PublicPageContent";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";

const PublicLinkInBioPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const [preloadedLinks, preloadedCustomization] = await Promise.all([
    preloadQuery(api.lib.links.getLinksBySlug, { slug: username }),
    preloadQuery(api.lib.userCustomization.getCustomizationBySlug, {
      slug: username,
    }),
  ]);

  return (
    <PublicPageContent
      username={username}
      preloadedLinks={preloadedLinks}
      preloadedCustomization={preloadedCustomization}
    />
  );
};

export default PublicLinkInBioPage;
