"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { ExternalLink, Globe, UserRound } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { getBaseUrl } from "@/lib/getBaseUrl";

const DashboardRailProfileCard = () => {
  const { user } = useUser();
  const currentSlug = useQuery(
    api.lib.usernames.getUserSlug,
    user?.id ? { userId: user.id } : "skip",
  );

  const resolvedSlug = currentSlug ?? user?.id ?? "";
  const displayName = user?.fullName || user?.firstName || "Your profile";
  const email = user?.primaryEmailAddress?.emailAddress ?? "Signed-in account";
  const hasCustomUsername = Boolean(
    user?.id && currentSlug && currentSlug !== user.id,
  );
  const publicUrl = resolvedSlug ? `${getBaseUrl()}/u/${resolvedSlug}` : null;

  return (
    <section className="space-y-4 rounded-[1.55rem] border border-slate-200/80 bg-white/88 p-4">
      <div className="flex items-start gap-3">
        {user?.imageUrl ? (
          <div
            aria-hidden="true"
            className="size-14 rounded-2xl bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${user.imageUrl})` }}
          />
        ) : (
          <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <UserRound className="size-6" />
          </div>
        )}

        <div className="min-w-0 space-y-1">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-500 uppercase">
            Profile snapshot
          </p>
          <h2 className="truncate font-semibold text-slate-900">
            {displayName}
          </h2>
          <p className="truncate text-sm text-slate-600">{email}</p>
        </div>
      </div>

      <div className="rounded-[1.2rem] border border-slate-200/80 bg-slate-50/90 p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
              Public identity
            </p>
            <p className="mt-1 truncate font-mono text-sm text-slate-900">
              /u/{resolvedSlug || "loading"}
            </p>
          </div>
          <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
            {hasCustomUsername ? "Custom URL" : "Default URL"}
          </span>
        </div>
      </div>

      {publicUrl ? (
        <Link
          href={`/u/${resolvedSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Globe className="size-4" />
          Open public page
          <ExternalLink className="size-4" />
        </Link>
      ) : null}
    </section>
  );
};

export default DashboardRailProfileCard;
