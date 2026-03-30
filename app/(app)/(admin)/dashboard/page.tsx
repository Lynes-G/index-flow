import CustomizationForm from "@/components/CustomizationForm";
import DashboardMetrics from "@/components/DashboardMetrics";
import DashboardMetricsSkeleton from "@/components/DashboardMetricsSkeleton";
import ManageLinks from "@/components/ManageLinks";
import UsernameForm from "@/components/UsernameForm";
import { api } from "@/convex/_generated/api";
import { fetchAnalytics } from "@/lib/fetchAnalytics";
import { checkTinybirdConnection } from "@/lib/checkTinybirdConnection";
import { Protect } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { Lock } from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";

const DashboardPage = async () => {
  const user = await currentUser();

  const preloadedLinks = await preloadQuery(api.lib.links.getLinksByUserId, {
    userId: user!.id,
  });

  const [analytics, tinybirdStatus] = await Promise.all([
    fetchAnalytics(user!.id),
    checkTinybirdConnection(user!.id),
  ]);

  return (
    <div className="space-y-8">
      {/* Analytics metrics */}
      <Protect
        feature="analytics"
        fallback={
          <div className="rounded-3xl bg-slate-50/80 p-4 lg:p-8">
            <div className="mx-auto max-w-7xl">
              <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-gray-400 p-3">
                    <Lock className="size-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Analytics Overview
                    </h2>
                    <p className="text-gray-600">
                      Upgrade your plan to access detailed analytics and
                      insights about your link performance.
                    </p>
                  </div>
                </div>
                <div className="mt-4 rounded-lg bg-gray-50 p-4">
                  <p className="text-gray-600">
                    Get detailed analytics including total clicks, unique
                    visitors, top links, and more by upgrading your plan.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
                    <span className="rounded-full border border-gray-200 bg-white px-3 py-1">
                      Top links
                    </span>
                    <span className="rounded-full border border-gray-200 bg-white px-3 py-1">
                      Referrers
                    </span>
                    <span className="rounded-full border border-gray-200 bg-white px-3 py-1">
                      Countries
                    </span>
                  </div>
                  <div className="mt-5">
                    <Link
                      href="/dashboard/billing"
                      className="inline-flex items-center justify-center rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                    >
                      Upgrade plan
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      >
        <Suspense fallback={<DashboardMetricsSkeleton />}>
          <DashboardMetrics analytics={analytics} />
        </Suspense>
      </Protect>
      {/* Tinybird status (Dev only) */}
      {process.env.NODE_ENV === "development" && (
        <div className="rounded-3xl bg-slate-50/80 p-4 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div
              className={`rounded-2xl border p-6 text-sm shadow-sm ${
                tinybirdStatus.ok
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-amber-200 bg-amber-50 text-amber-900"
              }`}
            >
              <p className="font-semibold">
                Tinybird status: {tinybirdStatus.ok ? "Connected" : "Check"}
              </p>
              <p className="mt-1 text-xs opacity-80">
                {tinybirdStatus.message}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Customize links url form */}
      <div className="rounded-3xl bg-slate-50/80 p-4 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-200/70 bg-white/95 p-8 shadow-sm">
            <UsernameForm />
          </div>
        </div>
      </div>
      {/* Page customization section*/}
      <div className="rounded-3xl bg-slate-50/80 p-4 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <CustomizationForm />
        </div>
      </div>
      {/* Manage links section */}
      <div className="min-h-screen rounded-3xl bg-slate-50/80 p-4 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
            {/* Left side - Title & Description */}
            <div className="lg:sticky lg:top-8 lg:w-2/5">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-semibold text-gray-900 lg:text-4xl">
                    Manage Your Links
                  </h2>
                </div>
                <p className="text-lg leading-relaxed text-gray-600">
                  Organize and customize your link-in-bio page. Drag and drop to
                  reorder, edit details, or remove links that are no longer
                  needed
                </p>

                <div className="flex flex-wrap gap-3 pt-2 text-sm text-gray-600">
                  <span className="rounded-full border border-gray-200 bg-white px-3 py-1">
                    Drag & drop
                  </span>
                  <span className="rounded-full border border-gray-200 bg-white px-3 py-1">
                    Realtime updates
                  </span>
                  <span className="rounded-full border border-gray-200 bg-white px-3 py-1">
                    Click tracking
                  </span>
                </div>
              </div>
            </div>

            {/* Right side - Links Management */}
            <div className="lg:w-3/5">
              <div className="rounded-2xl border border-slate-200/70 bg-white/95 p-8 shadow-sm">
                <div className="mb-6">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Your Links
                  </h3>
                  <p className="text-gray-500">
                    Drag to reorder, click to edit, or delete unwanted links
                  </p>
                </div>
                <ManageLinks preloadedLinks={preloadedLinks} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
