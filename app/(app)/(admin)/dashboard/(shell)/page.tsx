import { api } from "@/convex/_generated/api";
import DashboardLinksWorkspace from "@/components/dashboard/links/DashboardLinksWorkspace";
import { getDashboardShellAccess } from "@/lib/server/dashboardShellAccess";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { getAppUrl } from "@/lib/server/appUrl";

const DashboardLinksPage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { isDevPreview, userId } = await getDashboardShellAccess({
    pathname: "/dashboard",
    searchParams,
  });

  const preloadedLinks = userId
    ? await preloadQuery(api.lib.links.getLinksByUserId, {
        userId,
      })
    : null;
  const currentSlug = userId
    ? await fetchQuery(api.lib.usernames.getUserSlug, {
        userId,
      })
    : null;
  const resolvedSlug = currentSlug ?? userId ?? "your-profile";

  return (
    <DashboardLinksWorkspace
      isDevPreview={isDevPreview}
      preloadedLinks={preloadedLinks}
      publicPageHref={`/u/${resolvedSlug}`}
      publicPageLabel={`${getAppUrl()}/u/${resolvedSlug}`}
      userId={userId}
    />
  );
};

export default DashboardLinksPage;
