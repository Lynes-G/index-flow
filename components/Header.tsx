"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Authenticated, Unauthenticated } from "convex/react";
import { ShieldCheck, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const Header = ({
  isFixed = false,
  logoHref = "/dashboard",
}: {
  isFixed?: boolean;
  logoHref?: string;
}) => {
  const [isMobile, setIsMobile] = useState(false);

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
  return (
    <header
      className={cn(
        "w-full border-b border-slate-200/80 bg-[rgba(255,253,248,0.88)] shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl",
        isFixed && "fixed top-0 z-50",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:py-4 lg:px-8">
        <Link
          href={logoHref}
          className="flex items-center"
          aria-label="IndexFlow home"
        >
          <Image
            src="/indexflow-light.svg"
            alt="IndexFlow"
            width={150}
            height={34}
            className="h-5 w-auto"
            priority
          />
        </Link>
        <Authenticated>
          <div className="flex flex-nowrap items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 p-2 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm">
            <Link
              href="/dashboard/new-link"
              className="hidden min-h-10 items-center gap-1 rounded-full bg-[color:var(--brand-accent)] px-3 py-2 text-xs font-semibold text-[#111216] shadow-[0_14px_24px_rgba(251,176,59,0.3)] transition-all duration-200 hover:bg-[#ffc868] sm:inline-flex sm:min-h-11 sm:px-4 sm:text-sm"
            >
              <Plus className="size-4" />
              Add Link
            </Link>
            <Button
              asChild
              variant="outline"
              className="hidden min-h-10 rounded-full border-slate-200 bg-white px-3 text-xs text-slate-700 transition-all duration-200 hover:border-[color:var(--brand-accent)] hover:bg-[rgba(251,176,59,0.08)] hover:text-slate-900 sm:inline-flex sm:min-h-11 sm:px-4 sm:text-sm"
            >
              <Link href="/dashboard/billing">Access</Link>
            </Button>

            <UserButton
              appearance={{
                elements: { userButtonAvatarBox: "h-11 w-11 sm:h-9 sm:w-9" },
              }}
            >
              <UserButton.MenuItems>
                {isMobile && (
                  <UserButton.Link
                    href="/dashboard/new-link"
                    label="Add Link"
                    labelIcon={<Plus className="size-4" />}
                  />
                )}
                {isMobile && (
                  <UserButton.Link
                    href="/dashboard/billing"
                    label="Access"
                    labelIcon={<ShieldCheck className="size-4" />}
                  />
                )}
              </UserButton.MenuItems>
            </UserButton>
          </div>
        </Authenticated>

        <Unauthenticated>
          <SignInButton mode="modal">
            <Button
              variant="outline"
              className="min-h-10 rounded-full border-slate-200 bg-white px-3 text-xs text-slate-700 transition-all duration-200 hover:border-[color:var(--brand-accent)] hover:bg-[rgba(251,176,59,0.08)] hover:text-slate-900 sm:min-h-11 sm:px-4 sm:text-sm"
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
