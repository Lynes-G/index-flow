"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { UserRound } from "lucide-react";

import { api } from "@/convex/_generated/api";
import {
  DashboardRailCard,
  DashboardRailPanel,
} from "@/components/dashboard/rail/shared";

const resolveProfileIdentity = ({
  currentSlug,
  userId,
}: {
  currentSlug?: string | null;
  userId?: string | null;
}) => {
  const resolvedSlug = currentSlug ?? userId ?? "";

  return {
    resolvedSlug,
    hasCustomUsername: Boolean(userId && currentSlug && currentSlug !== userId),
  };
};

const DashboardRailProfileCard = () => {
  const { user } = useUser();
  const currentSlug = useQuery(
    api.lib.usernames.getUserSlug,
    user?.id ? { userId: user.id } : "skip",
  );

  const displayName = user?.fullName || user?.firstName || "Your profile";
  const email = user?.primaryEmailAddress?.emailAddress ?? "Signed-in account";
  const { resolvedSlug, hasCustomUsername } = resolveProfileIdentity({
    currentSlug,
    userId: user?.id,
  });

  return (
    <DashboardRailCard>
      <div className="flex items-start gap-3">
        {user?.imageUrl ? (
          <div
            aria-hidden="true"
            className="size-12 rounded-lg bg-cover bg-center bg-no-repeat sm:size-14 sm:rounded-lg"
            style={{ backgroundImage: `url(${user.imageUrl})` }}
          />
        ) : (
          <div className="flex size-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500 sm:size-14 sm:rounded-lg">
            <UserRound className="size-6" />
          </div>
        )}

        <div className="min-w-0 space-y-1">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-500 uppercase">
            Profile snapshot
          </p>
          <h2 className="truncate font-['Sora',sans-serif] text-lg font-semibold tracking-[-0.04em] text-slate-900 sm:text-xl">
            {displayName}
          </h2>
          <p className="truncate text-sm text-slate-600">{email}</p>
        </div>
      </div>

      <DashboardRailPanel>
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
              Public identity
            </p>
            <p className="mt-1 font-mono text-sm break-all text-slate-900">
              /u/{resolvedSlug || "loading"}
            </p>
          </div>
          <span className="inline-flex w-fit rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600">
            {hasCustomUsername ? "Custom URL" : "Default URL"}
          </span>
        </div>
      </DashboardRailPanel>
    </DashboardRailCard>
  );
};

export default DashboardRailProfileCard;
