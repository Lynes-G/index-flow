"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Copy, Fingerprint } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import {
  DashboardRailCard,
  DashboardRailHeader,
  DashboardRailPanel,
} from "@/components/dashboard/rail/shared";
import { Button } from "@/components/ui/button";
import { getBaseUrl } from "@/lib/frontend/shared/getBaseUrl";

const resolveUsernameSummary = ({
  currentSlug,
  userId,
}: {
  currentSlug?: string | null;
  userId?: string | null;
}) => {
  const resolvedSlug = currentSlug ?? userId ?? "";

  return {
    resolvedSlug,
    publicUrl: resolvedSlug ? `${getBaseUrl()}/u/${resolvedSlug}` : null,
    hasCustomUsername: Boolean(userId && currentSlug && currentSlug !== userId),
  };
};

const DashboardRailUsernameCard = () => {
  const { user } = useUser();
  const currentSlug = useQuery(
    api.lib.usernames.getUserSlug,
    user?.id ? { userId: user.id } : "skip",
  );
  const { resolvedSlug, publicUrl, hasCustomUsername } = resolveUsernameSummary(
    {
      currentSlug,
      userId: user?.id,
    },
  );

  return (
    <DashboardRailCard>
      <DashboardRailHeader
        eyebrow="Username summary"
        title="Keep it easy to remember"
        description="Keep your public URL short and clear."
      />

      <DashboardRailPanel>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-white p-2 text-slate-900 shadow-sm sm:rounded-lg">
            <Fingerprint className="size-4" />
          </div>
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-semibold text-slate-900">
              {hasCustomUsername
                ? "Custom username active"
                : "Default ID active"}
            </p>
            <p className="font-mono text-sm break-all text-slate-600">
              /u/{resolvedSlug || "loading"}
            </p>
          </div>
        </div>
      </DashboardRailPanel>

      {publicUrl ? (
        <div>
          <Button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(publicUrl);
              toast.success("Copied public URL.");
            }}
            size="sm"
            className="w-full text-xs font-black uppercase"
          >
            <Copy className="size-4" />
            Copy URL
          </Button>
        </div>
      ) : null}

      <p className="hidden text-sm leading-6 text-slate-600 sm:block">
        Changing this updates your shared profile link.
      </p>
    </DashboardRailCard>
  );
};

export default DashboardRailUsernameCard;
