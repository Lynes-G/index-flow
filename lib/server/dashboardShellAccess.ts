import "server-only";

import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { isDashboardDevPreviewRequest } from "@/lib/server/clerkMiddleware";

type DashboardShellSearchParams = Record<string, string | string[] | undefined>;

export async function getDashboardShellAccess({
  pathname,
  searchParams,
}: {
  pathname: string;
  searchParams:
    | DashboardShellSearchParams
    | Promise<DashboardShellSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const hostHeader = (await headers()).get("host");
  const { userId } = await auth();
  const isDevPreview = isDashboardDevPreviewRequest({
    hostHeader,
    pathname,
    searchParams: resolvedSearchParams,
    nodeEnv: process.env.NODE_ENV,
  });

  if (!userId && !isDevPreview) {
    redirect("/sign-in");
  }

  return {
    isDevPreview,
    userId,
  };
}
