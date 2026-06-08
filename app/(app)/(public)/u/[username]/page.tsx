import PublicPageContent from "@/components/public-profile/PublicPageContent";
import NotFoundPageView from "@/components/shared/layout/NotFoundPageView";
import { api } from "@/convex/_generated/api";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { notFound } from "next/navigation";

const preloadPublicPageData = async (userId: string) =>
  Promise.all([
    preloadQuery(api.lib.links.getLinksByUserId, { userId }),
    preloadQuery(api.lib.userCustomization.getUserCustomizations, {
      userId,
    }),
  ]);

const PublicProfileUnavailable = ({ username }: { username: string }) => (
  <NotFoundPageView
    badge="Profile unavailable"
    title="Profile temporarily unavailable."
    description={`We found the route for ${username}, but the profile data could not load right now. This is usually temporary, like a dashboard briefly losing its data feed.`}
    primaryAction={{
      href: `/u/${username}`,
      label: "Try again",
    }}
    secondaryAction={{
      href: "/",
      label: "Explore IndexFlow",
    }}
    helperTitle="What happened"
    helperDescription="IndexFlow keeps the public page online even when the profile data service is having a rough moment."
    helperItems={[
      "Refresh the page in a few seconds.",
      "Check that the username in the URL is spelled correctly.",
      "If this keeps happening, the creator may need to review their profile settings.",
    ]}
  />
);

const PublicLinkInBioPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  let userId: string | null;

  try {
    userId = await fetchQuery(api.lib.usernames.getUserIdBySlug, {
      slug: username,
    });
  } catch (error) {
    console.error("Public profile lookup failed:", error);
    return <PublicProfileUnavailable username={username} />;
  }

  if (!userId) {
    notFound();
  }

  let preloadedLinks: Awaited<ReturnType<typeof preloadPublicPageData>>[0];
  let preloadedCustomization: Awaited<
    ReturnType<typeof preloadPublicPageData>
  >[1];

  try {
    [preloadedLinks, preloadedCustomization] =
      await preloadPublicPageData(userId);
  } catch (error) {
    console.error("Public profile preload failed:", error);
    return <PublicProfileUnavailable username={username} />;
  }

  return (
    // Keep the route thin: fetch data here, delegate UI composition to the page component.
    <PublicPageContent
      username={username}
      preloadedLinks={preloadedLinks}
      preloadedCustomization={preloadedCustomization}
    />
  );
};

export default PublicLinkInBioPage;
