import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { isDashboardDevPreviewBypass } from "@/lib/server/clerkMiddleware";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const isDevPreview = isDashboardDevPreviewBypass({
    hostname: req.nextUrl.hostname,
    pathname: req.nextUrl.pathname,
    searchParams: req.nextUrl.searchParams,
    nodeEnv: process.env.NODE_ENV,
  });

  if (!isProtectedRoute(req) || isDevPreview) {
    return;
  }

  const { isAuthenticated, redirectToSignIn } = await auth();

  if (!isAuthenticated) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
