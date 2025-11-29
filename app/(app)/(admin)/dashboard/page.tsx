import CustomizationForm from "@/components/CustomizationForm";
import DashboardMetrics from "@/components/DashboardMetrics";
import ManageLinks from "@/components/ManageLinks";
import UsernameForm from "@/components/UsernameForm";
import { api } from "@/convex/_generated/api";
import { fetchAnalytics } from "@/lib/fetchAnalytics";
import { Protect } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { Lock } from "lucide-react";

const DashboardPage = async () => {
  const user = await currentUser();

  const preloadedLinks = await preloadQuery(api.lib.links.getLinksByUserId, {
    userId: user!.id,
  });

  const analytics = await fetchAnalytics(user!.id);

  console.log(analytics);

  return (
    <div>
      {/* Analytics metrics */}
      <Protect
        feature="analytics"
        fallback={
          <div className="mb-8 bg-linear-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
            <div className="mx-auto max-w-7xl">
              <div className="rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl shadow-gray-200/50 backdrop-blur-sm">
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
                <div className="mt-4 flex items-center">
                  <div className="w-full rounded-lg bg-gray-100 p-4 text-center">
                    <p className="text-gray-500">
                      Get detailed analytics including total clicks, unique
                      visitors, top links, and more by upgrading your plan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      >
        <DashboardMetrics analytics={analytics} />
      </Protect>

      {/* Customize links url form */}

      <div className="mb-8 bg-linear-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl shadow-gray-200/50 backdrop-blur-sm">
            <UsernameForm />
          </div>
        </div>
      </div>

      {/* Page customization section*/}
      <div className="mb-8 bg-linear-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <CustomizationForm />
        </div>
      </div>

      {/* Manage links section */}
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
            {/* Left side - Title & Description */}
            <div className="lg:sticky lg:top-8 lg:w-2/5">
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl leading-tight font-bold text-gray-900 lg:text-5xl">
                    Manage Your Links
                  </h1>
                  <div className="mt-4 h-1 w-20 rounded-full bg-linear-to-r from-blue-500 to-purple-600" />
                </div>
                <p className="text-lg leading-relaxed text-gray-600">
                  Organize and customize your link-in-bio page. Drag and drop to
                  reorder, edit details, or remove links that are no longer
                  needed
                </p>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-blue-500" />
                    <span className="text-gray-600">
                      Drag & drop to reorder
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-purple-500" />
                    <span className="text-gray-600">Realtime updates</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-green-500" />
                    <span className="text-gray-600">
                      Click tracking analytics
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Links Management */}
            <div className="lg:w-3/5">
              <div className="rounded-xl border border-white/20 bg-white/80 p-8 shadow-xl shadow-gray-200/50 backdrop-blur-sm">
                <div className="mb-6">
                  <h2 className="mb-2 text-xl font-semibold text-gray-900">
                    Your Links
                  </h2>
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
