"use client";

import CreateLinkPanel from "@/components/CreateLinkPanel";
import {
  CREATE_LINK_SHEET_QUERY_KEY,
  DASHBOARD_PATH,
  shouldOpenCreateLinkSheet,
} from "@/lib/linkCreationSheet";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type LinkCreationSheetContextValue = {
  openCreateLinkSheet: () => void;
};

const LinkCreationSheetContext =
  createContext<LinkCreationSheetContextValue | null>(null);

const LinkCreationSheetProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!shouldOpenCreateLinkSheet(searchParams)) {
      return;
    }

    setOpen(true);

    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.delete(CREATE_LINK_SHEET_QUERY_KEY);

    const nextQuery = nextSearchParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }, [pathname, router, searchParams]);

  const handleSuccess = async () => {
    setOpen(false);
    router.push(DASHBOARD_PATH);
    router.refresh();
  };

  return (
    <LinkCreationSheetContext.Provider
      value={{
        openCreateLinkSheet: () => setOpen(true),
      }}
    >
      {children}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="overflow-y-auto">
          <SheetHeader className="sr-only">
            <SheetTitle>Create a new link</SheetTitle>
            <SheetDescription>
              Add a destination to your public page without leaving the
              dashboard.
            </SheetDescription>
          </SheetHeader>
          <CreateLinkPanel onSuccess={handleSuccess} />
        </SheetContent>
      </Sheet>
    </LinkCreationSheetContext.Provider>
  );
};

const useLinkCreationSheet = () => {
  const context = useOptionalLinkCreationSheet();

  if (!context) {
    throw new Error(
      "useLinkCreationSheet must be used within LinkCreationSheetProvider",
    );
  }

  return context;
};

const useOptionalLinkCreationSheet = () => useContext(LinkCreationSheetContext);

export {
  LinkCreationSheetProvider,
  useLinkCreationSheet,
  useOptionalLinkCreationSheet,
};
