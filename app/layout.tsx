import type { Metadata } from "next";
import "@/styles/globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  metadataBase: new URL("https://indexflow.app"),
  title: {
    default: "IndexFlow",
    template: "%s | IndexFlow",
  },
  description:
    "Create a polished link-in-bio page with custom themes, flexible links, and built-in analytics.",
  applicationName: "IndexFlow",
  icons: {
    icon: [
      { url: "/indexflow-dark-icon.svg", media: "(prefers-color-scheme: light)" },
      { url: "/indexflow-light-icon.svg", media: "(prefers-color-scheme: dark)" },
      { url: "/indexflow-dark-icon.svg" },
    ],
    shortcut: ["/indexflow-dark-icon.svg"],
    apple: ["/indexflow-dark-icon.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <ClerkProvider dynamic>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
