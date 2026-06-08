"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { ArrowUpDown, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import ManageLinks from "@/components/dashboard/links/ManageLinks";
import UsernameForm from "@/components/dashboard/links/UsernameForm";
import DashboardLinksPreview from "@/components/dashboard/links/DashboardLinksPreview";
import DashboardShell from "@/components/dashboard/shell/DashboardShell";
import DashboardSidebar from "@/components/dashboard/shell/DashboardSidebar";
import { DashboardContextRail } from "@/components/dashboard/shell/DashboardContextRail";
import DashboardDevPreviewNotice from "@/components/dashboard/shell/DashboardDevPreviewNotice";
import DashboardRailProfileCard from "@/components/dashboard/rail/DashboardRailProfileCard";
import DashboardRailUsernameCard from "@/components/dashboard/rail/DashboardRailUsernameCard";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const linksRailCards = [
  {
    description:
      "Keep the first link aligned with the main action you want visitors to take.",
    icon: ArrowUpDown,
    title: "Reorder with intent",
  },
  {
    description:
      "After your core links are in place, move to Appearance to shape the page around them.",
    icon: Sparkles,
    title: "Appearance comes next",
  },
] as const;

type DashboardLinksWorkspaceProps = {
  isDevPreview: boolean;
  preloadedLinks: Preloaded<typeof api.lib.links.getLinksByUserId> | null;
  publicPageHref: string;
  publicPageLabel: string;
  userId: string | null;
};

const haveSameIds = (left: Id<"links">[], right: Id<"links">[]) =>
  left.length === right.length &&
  left.every((id, index) => id === right[index]);

const DashboardLinksRailCards = () => (
  <>
    <DashboardRailProfileCard />
    <DashboardRailUsernameCard />
    <div className="grid gap-2.5 xl:gap-3">
      {linksRailCards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-lg border border-slate-200/80 bg-slate-50/90 p-3 xl:rounded-lg xl:p-4"
          >
            <div className="flex items-start gap-3">
              <Icon className="mt-0.5 size-4 text-slate-500" />
              <div className="space-y-1">
                <p className="text-[13px] font-semibold text-slate-900 sm:text-sm">
                  {card.title}
                </p>
                <p className="text-[13px] leading-5 text-slate-600 sm:text-sm">
                  {card.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </>
);

const DashboardLinksWorkspaceLive = ({
  isDevPreview,
  preloadedLinks,
  publicPageLabel,
}: DashboardLinksWorkspaceProps & {
  preloadedLinks: Preloaded<typeof api.lib.links.getLinksByUserId>;
}) => {
  const links = usePreloadedQuery(preloadedLinks);

  const [items, setItems] = useState<Id<"links">[]>(() =>
    links.map((link) => link._id),
  );

  useEffect(() => {
    const nextItems = links.map((link) => link._id);

    setItems((currentItems) =>
      haveSameIds(currentItems, nextItems) ? currentItems : nextItems,
    );
  }, [links]);

  const rail = (
    <DashboardContextRail className="space-y-5">
      <DashboardLinksRailCards />
    </DashboardContextRail>
  );

  return (
    <DashboardShell
      sidebar={<DashboardSidebar currentTask="links" />}
      rail={rail}
      title="Build your public profile"
      description="Claim your public URL, add the links that matter most, and shape the order visitors see first."
    >
      <div className="space-y-6">
        {isDevPreview ? (
          <div className="space-y-3.5 sm:space-y-5">
            <DashboardDevPreviewNotice description="Profile editing is disabled in preview mode." />
            <div className="dashboard-warm-panel p-3.5 sm:p-5">
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                Sample public URL
              </p>
              <p className="mt-2 font-mono text-sm break-all text-slate-800">
                {publicPageLabel}
              </p>
            </div>
          </div>
        ) : (
          <UsernameForm />
        )}
        <ManageLinks
          links={links}
          items={items}
          setItems={setItems}
          accentColor={null}
          isReadOnly={isDevPreview}
        />
      </div>
    </DashboardShell>
  );
};

const DashboardLinksWorkspace = ({
  isDevPreview,
  preloadedLinks,
  publicPageHref,
  publicPageLabel,
  userId,
}: DashboardLinksWorkspaceProps) => {
  if (preloadedLinks) {
    return (
      <DashboardLinksWorkspaceLive
        isDevPreview={isDevPreview}
        preloadedLinks={preloadedLinks}
        publicPageHref={publicPageHref}
        publicPageLabel={publicPageLabel}
        userId={userId}
      />
    );
  }

  return (
    <DashboardShell
      sidebar={<DashboardSidebar currentTask="links" />}
      rail={
        <DashboardContextRail className="space-y-5">
          <DashboardLinksRailCards />
        </DashboardContextRail>
      }
      title="Build your public profile"
      description="Claim your public URL, add the links that matter most, and shape the order visitors see first."
    >
      <DashboardLinksPreview />
    </DashboardShell>
  );
};

export default DashboardLinksWorkspace;
