import CustomizationForm, {
  CustomizationDesktopPreviewRail,
  CustomizationPreviewProvider,
} from "@/components/dashboard/appearance/CustomizationForm";
import DashboardDevPreviewNotice from "@/components/dashboard/shell/DashboardDevPreviewNotice";
import { DashboardContextRail } from "@/components/dashboard/shell/DashboardContextRail";
import DashboardShell from "@/components/dashboard/shell/DashboardShell";
import DashboardSidebar from "@/components/dashboard/shell/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { ExternalLink, Eye } from "lucide-react";
import Link from "next/link";
import { getAppUrl } from "@/lib/server/appUrl";
import { getDashboardShellAccess } from "@/lib/server/dashboardShellAccess";

const resolvePublicPageMeta = (slug: string) => ({
  href: `/u/${slug}`,
  label: `${getAppUrl()}/u/${slug}`,
});

const DashboardAppearancePage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { isDevPreview, userId } = await getDashboardShellAccess({
    pathname: "/dashboard/appearance",
    searchParams,
  });

  const currentSlug = userId
    ? await fetchQuery(api.lib.usernames.getUserSlug, {
        userId,
      })
    : null;
  const resolvedSlug = currentSlug ?? userId ?? "your-profile";
  const publicPage = resolvePublicPageMeta(resolvedSlug);

  return (
    <CustomizationPreviewProvider>
      <DashboardShell
        sidebar={<DashboardSidebar currentTask="appearance" />}
        rail={
          <DashboardContextRail className="space-y-4 sm:space-y-5">
            {/* The rail mirrors the public page so appearance changes stay visible
                while the editor remains in the main working column. */}
            <CustomizationDesktopPreviewRail />
          </DashboardContextRail>
        }
        title="Shape your public page"
        description="Start with identity basics, then refine layout, media, and profile details once the page feels like you."
        actions={
          <Button asChild size="sm">
            <Link
              href={publicPage.href}
              target="_blank"
              rel="noopener noreferrer"
              title={publicPage.label}
            >
              <Eye className="size-4" />
              Open live page
              <ExternalLink className="size-4" />
            </Link>
          </Button>
        }
      >
        {isDevPreview ? (
          <div className="space-y-3.5 sm:space-y-5">
            <DashboardDevPreviewNotice description="Appearance is read-only in preview mode." />
          </div>
        ) : (
          <CustomizationForm shellMode="appearance" />
        )}
      </DashboardShell>
    </CustomizationPreviewProvider>
  );
};

export default DashboardAppearancePage;
