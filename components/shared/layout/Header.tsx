"use client";

import { useOptionalLinkCreationSheet } from "@/components/dashboard/links/LinkCreationSheetProvider";
import { api } from "@/convex/_generated/api";
import {
  DASHBOARD_PATH,
  DASHBOARD_NEW_LINK_PATH,
  getCreateLinkSheetHref,
} from "@/lib/frontend/dashboard/linkCreationSheet";
import { getBaseUrl } from "@/lib/frontend/shared/getBaseUrl";
import { authModalClerkAppearance } from "@/lib/frontend/auth/authClerkAppearance";
import { cn } from "@/lib/frontend/shared/utils";
import { BrandIcon, BrandLogo } from "@/components/shared/brand/BrandLogo";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Authenticated, Unauthenticated } from "convex/react";
import { ExternalLink, Globe, ShieldCheck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const Header = ({
  isFixed = false,
  logoHref = "/dashboard",
  logoVariant = "full",
  pillExpandsOnScroll = false,
}: {
  isFixed?: boolean;
  logoHref?: string;
  logoVariant?: "full" | "icon";
  pillExpandsOnScroll?: boolean;
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useUser();
  const linkCreationSheet = useOptionalLinkCreationSheet();
  const pathname = usePathname();
  const currentSlug = useQuery(
    api.lib.usernames.getUserSlug,
    user?.id ? { userId: user.id } : "skip",
  );
  const resolvedSlug = currentSlug ?? user?.id ?? "";
  const publicPageHref = resolvedSlug ? `/u/${resolvedSlug}` : null;
  const isAnalyticsPage = pathname === "/dashboard/analytics";
  const shouldShowPublicPageEntry =
    pathname === DASHBOARD_PATH ||
    pathname.startsWith("/dashboard/link/") ||
    pathname === "/dashboard/appearance" ||
    pathname === "/dashboard/username" ||
    pathname === "/dashboard/billing";
  const shouldShowCreateEntries = isAnalyticsPage;
  const createLinkHref = linkCreationSheet
    ? getCreateLinkSheetHref()
    : DASHBOARD_NEW_LINK_PATH;
  const publicPageLabel = publicPageHref
    ? `${getBaseUrl()}${publicPageHref}`
    : null;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    type LegacyMediaQueryList = MediaQueryList & {
      addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
    };
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches);
    };

    handleChange(mediaQuery);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    const legacyMediaQuery = mediaQuery as LegacyMediaQueryList;

    legacyMediaQuery.addListener?.(handleChange);
    return () => legacyMediaQuery.removeListener?.(handleChange);
  }, []);

  useEffect(() => {
    if (!isFixed || !pillExpandsOnScroll) {
      setIsScrolled(false);
      return;
    }

    const updateScrolledState = () => {
      setIsScrolled(window.scrollY > 12);
    };

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });

    return () => window.removeEventListener("scroll", updateScrolledState);
  }, [isFixed, pillExpandsOnScroll]);

  return (
    <header
      className={cn(
        "w-full border-b-2 border-(--brand-eggplant) bg-(--brand-sand) transition-colors duration-300",
        isFixed &&
          "shadow-brand-purple-soft fixed top-3 left-1/2 z-50 mx-auto w-[calc(100vw-1rem)] -translate-x-1/2 transform rounded-lg border-2 border-(--brand-eggplant) transition-[max-width,background-color,border-color,box-shadow] duration-300 ease-out sm:top-4 sm:w-[calc(100vw-2rem)]",
        isFixed && !pillExpandsOnScroll && "max-w-7xl",
        isFixed &&
          pillExpandsOnScroll &&
          !isScrolled &&
          "shadow-brand-purple max-w-4xl",
        isFixed && pillExpandsOnScroll && isScrolled && "max-w-6xl",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-4 sm:py-4 lg:px-8">
        <Link
          href={logoHref}
          className="flex items-center"
          aria-label="IndexFlow home"
        >
          {logoVariant === "icon" ? (
            <BrandIcon
              tone="light"
              width={32}
              height={32}
              className="size-8 md:size-9"
              priority
            />
          ) : (
            <BrandLogo
              tone="light"
              width={150}
              height={28}
              className="h-5 w-auto md:h-6"
              priority
            />
          )}
        </Link>
        <Authenticated>
          <div className="shadow-brand-neon-md flex flex-nowrap items-center gap-2 rounded-none border-2 border-(--brand-eggplant) bg-white/90 p-2 backdrop-blur-sm">
            {shouldShowPublicPageEntry && publicPageHref ? (
              <Button
                asChild
                size="sm"
                className="hidden text-xs font-black sm:inline-flex sm:text-sm"
              >
                <Link
                  href={publicPageHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={publicPageLabel ?? undefined}
                >
                  <Globe className="size-4" />
                  Open public page
                  <ExternalLink className="size-4" />
                </Link>
              </Button>
            ) : null}
            {shouldShowCreateEntries ? (
              linkCreationSheet ? (
                <Button
                  type="button"
                  onClick={linkCreationSheet.openCreateLinkSheet}
                  size="sm"
                  className="hidden text-xs font-black sm:inline-flex sm:text-sm"
                >
                  <Plus className="size-4" />
                  Add Link
                </Button>
              ) : (
                <Button
                  asChild
                  size="sm"
                  className="hidden text-xs font-black sm:inline-flex sm:text-sm"
                >
                  <Link href={DASHBOARD_NEW_LINK_PATH}>
                    <Plus className="size-4" />
                    Add Link
                  </Link>
                </Button>
              )
            ) : null}
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="hidden text-xs font-black sm:inline-flex sm:text-sm"
            >
              <Link href="/dashboard/billing">Billing</Link>
            </Button>

            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "!size-8 sm:!size-9",
                },
              }}
            >
              <UserButton.MenuItems>
                {isMobile && shouldShowPublicPageEntry && publicPageHref && (
                  <UserButton.Link
                    href={publicPageHref}
                    label="Open public page"
                    labelIcon={<Globe className="size-4" />}
                  />
                )}
                {isMobile && shouldShowCreateEntries && (
                  <UserButton.Link
                    href={createLinkHref}
                    label="Add Link"
                    labelIcon={<Plus className="size-4" />}
                  />
                )}
                {isMobile && (
                  <UserButton.Link
                    href="/dashboard/billing"
                    label="Billing"
                    labelIcon={<ShieldCheck className="size-4" />}
                  />
                )}
              </UserButton.MenuItems>
            </UserButton>
          </div>
        </Authenticated>

        <Unauthenticated>
          <SignInButton mode="modal" appearance={authModalClerkAppearance}>
            <Button
              variant="secondary"
              size="sm"
              className="text-xs font-black sm:text-sm"
            >
              Sign In
            </Button>
          </SignInButton>
        </Unauthenticated>
      </div>
    </header>
  );
};

export default Header;

// shadow-[0_6px_0_color-mix(in_srgb,var(--brand-purple)_18%,transparent)]
