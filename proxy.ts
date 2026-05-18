import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
const isLocalHostname = (hostname: string) =>
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname === "::1" ||
  hostname === "[::1]";

export default clerkMiddleware(async (auth, req) => {
  const isDevPreview =
    process.env.NODE_ENV === "development" &&
    isLocalHostname(req.nextUrl.hostname) &&
    req.nextUrl.pathname === "/dashboard" &&
    req.nextUrl.searchParams.get("devPreview") === "1";

  if (isProtectedRoute(req) && !isDevPreview) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
