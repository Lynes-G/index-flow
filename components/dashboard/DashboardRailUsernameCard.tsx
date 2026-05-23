"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Copy, ExternalLink, Fingerprint } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { getBaseUrl } from "@/lib/getBaseUrl";

const DashboardRailUsernameCard = () => {
  const { user } = useUser();
  const currentSlug = useQuery(
    api.lib.usernames.getUserSlug,
    user?.id ? { userId: user.id } : "skip",
  );

  const resolvedSlug = currentSlug ?? user?.id ?? "";
  const publicUrl = resolvedSlug ? `${getBaseUrl()}/u/${resolvedSlug}` : null;
  const hasCustomUsername = Boolean(
    user?.id && currentSlug && currentSlug !== user.id,
  );

  return (
    <section className="space-y-4 rounded-[1.55rem] border border-slate-200/80 bg-white/88 p-4">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-500 uppercase">
          Username summary
        </p>
        <h2 className="font-['Sora',sans-serif] text-xl font-semibold tracking-[-0.04em] text-slate-900">
          Keep your identity easy to remember
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          A short, clear public URL works like a simple storefront sign: people
          can find it again without effort.
        </p>
      </div>

      <div className="rounded-[1.2rem] border border-slate-200/80 bg-slate-50/90 p-3">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-white p-2 text-slate-900 shadow-sm">
            <Fingerprint className="size-4" />
          </div>
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-semibold text-slate-900">
              {hasCustomUsername ? "Custom username active" : "Default ID active"}
            </p>
            <p className="truncate font-mono text-sm text-slate-600">
              /u/{resolvedSlug || "loading"}
            </p>
          </div>
        </div>
      </div>

      {publicUrl ? (
        <div className="grid gap-2 sm:grid-cols-2">
          <Link
            href={`/u/${resolvedSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <ExternalLink className="size-4" />
            Open page
          </Link>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(publicUrl);
              toast.success("Copied public URL.");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Copy className="size-4" />
            Copy URL
          </button>
        </div>
      ) : null}

      <p className="text-sm leading-6 text-slate-600">
        Changing the username updates the link you share in bios, messages, and
        social profiles.
      </p>
    </section>
  );
};

export default DashboardRailUsernameCard;
