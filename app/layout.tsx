import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import ConvexClientProvider from "@/components/shared/runtime/ConvexClientProvider";
import DevelopmentServiceWorkerCleanup from "@/components/shared/runtime/DevelopmentServiceWorkerCleanup";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { appearanceGoogleFontsHref } from "@/lib/frontend/appearance/appearanceFonts";
import { getAppUrl } from "@/lib/server/appUrl";

export const metadata: Metadata = {
  metadataBase: new URL(getAppUrl()),
  title: {
    default: "IndexFlow",
    template: "%s | IndexFlow",
  },
  description:
    "Create a polished link-in-bio page with custom themes, flexible links, and built-in analytics.",
  applicationName: "IndexFlow",
  icons: {
    icon: [{ url: "/indexflow-favicon.svg" }],
    shortcut: [{ url: "/indexflow-favicon.svg" }],
    apple: [{ url: "/indexflow-favicon.svg" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="stylesheet" href={appearanceGoogleFontsHref} />
      </head>
      <body suppressHydrationWarning={true}>
        <ClerkProvider dynamic>
          <ConvexClientProvider>
            <DevelopmentServiceWorkerCleanup />
            {children}
          </ConvexClientProvider>
        </ClerkProvider>
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
