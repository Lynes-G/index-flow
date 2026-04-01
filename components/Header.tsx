"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Authenticated, Unauthenticated } from "convex/react";
import { CreditCard, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const Header = ({ isFixed = false }: { isFixed?: boolean }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches);
    };

    handleChange(mediaQuery);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  return (
    <header
      className={cn(
        "w-full bg-white/80 shadow-sm backdrop-blur-sm dark:bg-gray-900/80",
        isFixed && "fixed top-0 z-50",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:py-4 xl:px-2">
        <Link
          href="/dashboard"
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          IndexFlow
        </Link>
        <Authenticated>
          <div className="flex flex-nowrap items-center gap-2 rounded-lg border border-white/20 bg-white/50 p-2 backdrop-blur-sm">
            <Link
              href="/dashboard/new-link"
              className="hidden min-h-10 items-center gap-1 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 px-2.5 py-2 text-xs font-semibold text-white transition-all duration-200 hover:from-blue-600 hover:to-purple-700 sm:inline-flex sm:min-h-11 sm:px-3 sm:text-sm"
            >
              <Plus className="size-4" />
              Add Link
            </Link>
            <Button
              asChild
              variant="outline"
              className="hidden min-h-10 border-purple-600 px-2.5 text-xs text-purple-600 transition-all duration-200 hover:border-purple-700 hover:bg-purple-600 hover:text-white sm:inline-flex sm:min-h-11 sm:px-3 sm:text-sm"
            >
              <Link href="/dashboard/billing">Billing</Link>
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
                    label="Billing"
                    labelIcon={<CreditCard className="size-4" />}
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
              className="min-h-10 border-purple-600 px-2.5 text-xs text-purple-600 transition-all duration-200 hover:border-purple-700 hover:bg-purple-600 hover:text-white sm:min-h-11 sm:px-3 sm:text-sm"
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
