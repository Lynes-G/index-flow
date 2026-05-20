import CustomizationForm from "@/components/CustomizationForm";
import DashboardMetrics from "@/components/DashboardMetrics";
import DashboardMetricsSkeleton from "@/components/DashboardMetricsSkeleton";
import ManageLinks from "@/components/ManageLinks";
import UsernameForm from "@/components/UsernameForm";
import { AdminPageShell } from "@/components/dashboard/AdminShell";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Eye, Lock } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { checkTinybirdConnection } from "@/lib/checkTinybirdConnection";
import type { AnalyticsData } from "@/lib/fetchAnalytics";
import { fetchAnalytics } from "@/lib/fetchAnalytics";
import { getCreateLinkSheetHref } from "@/lib/linkCreationSheet";
import { getCurrentUserEntitlements } from "@/lib/server/entitlements";

const emptyAnalytics: AnalyticsData = {
  totalClicks: 0,
  uniqueVisitors: 0,
  countriesReached: 0,
  totalLinksClicked: 0,
  qrScans: 0,
  topLinkTitle: null,
  topReferrer: null,
  firstClick: null,
  lastClick: null,
};

const isLocalHostname = (hostname: string) =>
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname === "::1" ||
  hostname === "[::1]";

const DashboardPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ devPreview?: string }>;
}) => {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const isDev = process.env.NODE_ENV === "development";
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host");
  const rawHost = forwardedHost || requestHeaders.get("host") || "";
  const hostname = rawHost.split(":")[0];
  const isDevPreview =
    isDev &&
    isLocalHostname(hostname) &&
    resolvedSearchParams?.devPreview === "1";
  const { userId } = await auth();

  if (!userId && !isDevPreview) {
    redirect("/sign-in");
  }

  const preloadedLinks = userId
    ? await preloadQuery(api.lib.links.getLinksByUserId, {
        userId,
      })
    : null;

  const entitlements = userId
    ? await getCurrentUserEntitlements()
    : {
        canAccessAnalytics: true,
        canAccessUltraFeatures: false,
      };
  const analytics = userId ? await fetchAnalytics(userId) : emptyAnalytics;
  const tinybirdStatus =
    isDev && userId ? await checkTinybirdConnection(userId) : null;
  const sectionContainerClass = "mx-auto max-w-7xl px-3 sm:px-4 lg:px-8";

  const headerSection = (
    <AdminPageShell className={sectionContainerClass}>
      <div className="dashboard-shell dashboard-shell-inner">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.24em] text-slate-500 uppercase">
              Dashboard workspace
            </p>
            <h1 className="mt-3 font-['Sora',sans-serif] text-3xl leading-tight font-semibold tracking-[-0.05em] text-slate-900 sm:text-4xl">
              Shape your public page, links, and performance from one place.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Update the pieces visitors see, keep your links in order, and
              check how your page is performing without leaving this workspace.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5">
              Links
            </span>
            <span className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5">
              Styling
            </span>
            <span className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5">
              Analytics
            </span>
          </div>
        </div>
        {isDevPreview ? (
          <div className="dashboard-section-divider mt-6 pt-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-900">
              <Eye className="size-3.5" />
              Dev preview mode
            </div>
          </div>
        ) : null}
      </div>
    </AdminPageShell>
  );

  const analyticsSection = entitlements.canAccessAnalytics ? (
    <Suspense fallback={<DashboardMetricsSkeleton />}>
      <DashboardMetrics
        analytics={analytics}
        canAccessUltraFeatures={entitlements.canAccessUltraFeatures}
      />
    </Suspense>
  ) : (
    <AdminPageShell className={sectionContainerClass}>
      <div className="dashboard-shell dashboard-shell-inner">
        <div className="space-y-4">
          <p className="text-[11px] font-semibold tracking-[0.24em] text-[color:var(--brand-purple)] uppercase">
            Analytics
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="rounded-2xl bg-slate-900 p-3 text-white shadow-sm shadow-slate-900/10">
              <Lock className="size-6" />
            </div>
            <div className="space-y-2">
              <h2 className="font-['Sora',sans-serif] text-2xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-3xl">
                Analytics are paused for this workspace
              </h2>
              <p className="text-sm leading-6 text-slate-600 sm:text-base">
                Detailed analytics unlock on Pro and above, but billing is
                currently paused.
              </p>
            </div>
          </div>
        </div>
        <div className="dashboard-section-divider mt-6 pt-6">
          <div className="rounded-[1.4rem] border border-slate-200/80 bg-white/72 p-4 sm:p-5">
            <p className="text-sm leading-6 text-slate-600">
              New accounts stay on Free by default. Pro and Ultra access
              currently come from admin-issued invites rather than direct
              checkout.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                Top links
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                Referrers
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                Countries
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminPageShell>
  );

  const tinybirdSection =
    isDev && tinybirdStatus ? (
      <AdminPageShell className={sectionContainerClass}>
        <div
          className={`dashboard-shell dashboard-shell-inner text-sm ${
            tinybirdStatus.ok
              ? "border-emerald-200 bg-emerald-50/90 text-emerald-900"
              : "border-amber-200 bg-amber-50/90 text-amber-900"
          }`}
        >
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase opacity-80">
            Tinybird status
          </p>
          <p className="mt-2 text-sm font-semibold">
            {tinybirdStatus.ok ? "Connected" : "Needs attention"}
          </p>
          <p className="mt-1 text-xs leading-5 opacity-80">
            {tinybirdStatus.message}
          </p>
        </div>
      </AdminPageShell>
    ) : null;

  const usernameSection = (
    <AdminPageShell className={sectionContainerClass}>
      <div className="dashboard-shell dashboard-shell-inner">
        {userId ? (
          <UsernameForm />
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[color:var(--brand-purple)] uppercase">
                Username
              </p>
              <h3 className="font-['Sora',sans-serif] text-2xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-[1.75rem]">
                Customize your public link
              </h3>
              <p className="text-sm leading-6 text-slate-600 sm:text-base">
                Preview the username section layout without connecting it to a
                real account.
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-emerald-200/80 bg-emerald-50/85 px-4 py-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold tracking-[0.18em] text-emerald-700 uppercase">
                    Current username
                  </p>
                  <p className="font-mono text-sm text-emerald-950">
                    your-profile
                  </p>
                </div>
                <span className="inline-flex h-11 items-center rounded-full border border-emerald-200 bg-white/80 px-4 text-sm font-medium text-emerald-900">
                  Preview mode
                </span>
              </div>
            </div>
            <div className="rounded-[1.25rem] border border-slate-200/80 bg-white/78 p-3 sm:p-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                Public URL
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className="min-w-0 flex-1 truncate rounded-xl bg-slate-50 px-3 py-2 font-mono text-sm text-slate-800">
                  http://localhost:3000/u/your-profile
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500">
                  Copy
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
                Edit
              </div>
              <div className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white">
                Save Username
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPageShell>
  );

  const customizationSection = (
    <AdminPageShell className={sectionContainerClass}>
      <CustomizationForm />
    </AdminPageShell>
  );

  const manageLinksSection = (
    <AdminPageShell className={sectionContainerClass}>
      <div className="dashboard-shell dashboard-shell-inner">
        <div className="space-y-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[color:var(--brand-purple)] uppercase">
              Links
            </p>
            <h2 className="mt-2 font-['Sora',sans-serif] text-2xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-[1.75rem]">
              Manage your links
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              Organize and customize your link-in-bio page. Drag and drop to
              reorder, edit details, or remove links that are no longer needed.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-slate-600">
            <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1">
              Drag & drop
            </span>
            <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1">
              Realtime updates
            </span>
            <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1">
              Click tracking
            </span>
          </div>
        </div>
        <div className="dashboard-section-divider mt-8 pt-8">
          {preloadedLinks ? (
            <ManageLinks preloadedLinks={preloadedLinks} />
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                {["Portfolio", "Newsletter", "Book a call"].map((title) => (
                  <div
                    key={title}
                    className="flex flex-col gap-4 rounded-[1.35rem] border border-slate-200/80 bg-white/92 p-4 shadow-sm shadow-slate-900/5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg p-1 text-slate-400">⋮⋮</div>
                      <div>
                        <p className="text-base font-semibold text-slate-900">
                          {title}
                        </p>
                        <p className="text-sm text-slate-600">
                          https://example.com/
                          {title.toLowerCase().replace(/\s+/g, "-")}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500">
                        Stats
                      </span>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500">
                        Edit
                      </span>
                      <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs text-rose-600">
                        Delete
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href={getCreateLinkSheetHref()}
                className="block w-full rounded-2xl border border-slate-200 bg-white/78 px-4 py-3 text-center text-sm font-medium text-slate-600"
                scroll={false}
              >
                Add New Link
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminPageShell>
  );

  const defaultSections = [
    analyticsSection,
    tinybirdSection,
    usernameSection,
    customizationSection,
    manageLinksSection,
  ];

  return (
    <div className="space-y-6 pb-10 sm:space-y-7">
      {headerSection}
      {defaultSections.map(
        (section, index) =>
          section && <Suspense key={index}>{section}</Suspense>,
      )}
    </div>
  );
};

export default DashboardPage;
