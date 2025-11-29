"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Authenticated, Unauthenticated } from "convex/react";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { SignInButton, UserButton } from "@clerk/nextjs";

const Header = ({ isFixed = false }: { isFixed?: boolean }) => {
  return (
    <header
      className={cn(
        "w-full bg-white/80 shadow-sm backdrop-blur-sm dark:bg-gray-900/80",
        isFixed && "fixed top-0 z-50",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 xl:px-2">
        <Link
          href="/dashboard"
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          IndexFlow
        </Link>
        <Authenticated>
          <div className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/50 p-2 backdrop-blur-sm">
            <Link
              href="/dashboard/new-link"
              className="inline-flex items-center gap-1 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 px-3 py-2 font-medium text-white transition-all duration-200 hover:from-blue-600 hover:to-purple-700"
            >
              <Plus className="size-4" />
              Add Link
            </Link>
            <Button
              asChild
              variant="outline"
              className="border-purple-600 text-purple-600 transition-all duration-200 hover:border-purple-700 hover:bg-purple-600 hover:text-white"
            >
              <Link href="/dashboard/billing">Billing</Link>
            </Button>

            <UserButton />
          </div>
        </Authenticated>

        <Unauthenticated>
          <SignInButton mode="modal">
            <Button
              variant="outline"
              className="border-purple-600 text-purple-600 transition-all duration-200 hover:border-purple-700 hover:bg-purple-600 hover:text-white"
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
