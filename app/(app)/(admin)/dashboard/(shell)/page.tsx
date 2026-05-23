import ManageLinks from "@/components/ManageLinks";
import { DashboardContextRail } from "@/components/dashboard/DashboardContextRail";
import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ArrowUpDown, Link2, Plus, Sparkles } from "lucide-react";
import { getCreateLinkSheetHref } from "@/lib/linkCreationSheet";
import Link from "next/link";
import { redirect } from "next/navigation";

const DashboardLinksPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const preloadedLinks = await preloadQuery(api.lib.links.getLinksByUserId, {
    userId,
  });

  return (
    <DashboardShell
      sidebar={<DashboardSidebar currentTask="links" />}
      rail={
        <DashboardContextRail className="space-y-5">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.24em] text-slate-500 uppercase">
              Link flow
            </p>
            <div className="space-y-2">
              <h2 className="font-['Sora',sans-serif] text-2xl font-semibold tracking-[-0.05em] text-slate-900">
                Keep your page easy to scan
              </h2>
              <p className="text-sm leading-6 text-slate-600">
                Put your most important destination first, then stack the rest
                in the order visitors are most likely to tap.
              </p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/88 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-slate-900 p-2.5 text-white">
                <Plus className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  Add your next destination
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  Open the create-link sheet without leaving this workspace.
                </p>
              </div>
            </div>
            <Link
              href={getCreateLinkSheetHref()}
              scroll={false}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <Plus className="size-4" />
              Add link
            </Link>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[1.35rem] border border-slate-200/80 bg-slate-50/90 p-4">
              <div className="flex items-start gap-3">
                <ArrowUpDown className="mt-0.5 size-4 text-slate-500" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900">
                    Reorder with intent
                  </p>
                  <p className="text-sm leading-6 text-slate-600">
                    Think of the top slot like the front door of a shop: it
                    should lead to the action you want most.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.35rem] border border-slate-200/80 bg-slate-50/90 p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 size-4 text-slate-500" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900">
                    Appearance comes next
                  </p>
                  <p className="text-sm leading-6 text-slate-600">
                    Once the order feels right, hop to Appearance to style how
                    the full list presents on your public page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DashboardContextRail>
      }
      title="Build and organize your links"
      description="This is your links workspace for adding destinations, reordering them, and keeping the path visitors follow simple and intentional."
      actions={
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600">
          <Link2 className="size-4" />
          Links workspace
        </span>
      }
    >
      <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/92 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.06)] sm:p-6">
        <ManageLinks preloadedLinks={preloadedLinks} />
      </div>
    </DashboardShell>
  );
};

export default DashboardLinksPage;
