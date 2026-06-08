"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/frontend/shared/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

const sheetOverlayClassName = [
  "fixed inset-0 z-50 bg-slate-950/38 backdrop-blur-[2px]",
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
].join(" ");

const sheetCloseClassName = [
  "absolute top-4 right-4 rounded-full border border-slate-200/80 bg-white/80 p-2 text-slate-500 sm:top-5 sm:right-5",
  "transition-colors hover:border-slate-300 hover:bg-white hover:text-slate-900",
  "focus-visible:ring-2 focus-visible:ring-slate-900/15 focus-visible:outline-none",
  "disabled:pointer-events-none",
].join(" ");

const sheetContentPaddingClassName = "p-6 pr-16 sm:p-8 sm:pr-20";

const sheetHeaderClassName = "flex flex-col gap-2 text-left";

const sheetFooterClassName =
  "mt-auto flex flex-col-reverse gap-3 sm:flex-row sm:justify-end";

const sheetTitleClassName = "text-lg font-semibold text-slate-900";

const sheetDescriptionClassName = "text-sm leading-6 text-slate-600";

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    data-slot="sheet-overlay"
    className={cn(sheetOverlayClassName, className)}
    {...props}
  />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

const sheetVariants = cva(
  [
    "fixed z-50 flex flex-col gap-4 border border-slate-200/80",
    "bg-[rgba(255,253,248,0.97)] text-slate-950 shadow-[0_28px_80px_rgba(15,23,42,0.18)]",
    "backdrop-blur-xl transition ease-in-out",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:duration-300 data-[state=open]:duration-500",
  ],
  {
    variants: {
      side: {
        top: [
          "inset-x-0 top-0 border-b rounded-b-3xl",
          "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        ],
        bottom: [
          "inset-x-0 bottom-0 border-t rounded-t-3xl",
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        ],
        left: [
          "inset-y-0 left-0 h-full w-full border-r sm:max-w-xl",
          "rounded-r-3xl data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        ],
        right: [
          "inset-y-0 right-0 h-full w-full border-l sm:max-w-xl",
          "rounded-l-3xl data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        ],
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      data-slot="sheet-content"
      className={cn(
        sheetVariants({ side }),
        sheetContentPaddingClassName,
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className={sheetCloseClassName}>
        <X className="size-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = DialogPrimitive.Content.displayName;

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn(sheetHeaderClassName, className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(sheetFooterClassName, className)}
      {...props}
    />
  );
}

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    data-slot="sheet-title"
    className={cn(sheetTitleClassName, className)}
    {...props}
  />
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    data-slot="sheet-description"
    className={cn(sheetDescriptionClassName, className)}
    {...props}
  />
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
