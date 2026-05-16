import LinkAnalytics from "@/components/LinkAnalytics";
import { fetchLinkAnalytics } from "@/lib/fetchLinkAnalytics";
import { getCurrentUserEntitlements } from "@/lib/server/entitlements";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/dist/client/components/navigation";

interface LinkAnalyticsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const LinkAnalyticsPage = async ({ params }: LinkAnalyticsPageProps) => {
  const { id } = await params;
  const user = await currentUser();

  if (!user) notFound();

  const entitlements = await getCurrentUserEntitlements();
  const analytics = await fetchLinkAnalytics(user.id, id);

  if (!analytics) {
    const emptyAnalytics = {
      linkId: id,
      linkTitle: "This link has no analytics",
      linkUrl: "Please wait for analytics to generate or check back later.",
      totalClicks: 0,
      uniqueUsers: 0,
      countriesReached: 0,
      dailyData: [],
      countryData: [],
    };
    return (
      <LinkAnalytics
        analytics={emptyAnalytics}
        canAccessAnalytics={entitlements.canAccessAnalytics}
        canAccessUltraFeatures={entitlements.canAccessUltraFeatures}
      />
    );
  }

  return (
    <LinkAnalytics
      analytics={analytics}
      canAccessAnalytics={entitlements.canAccessAnalytics}
      canAccessUltraFeatures={entitlements.canAccessUltraFeatures}
    />
  );
};

export default LinkAnalyticsPage;
