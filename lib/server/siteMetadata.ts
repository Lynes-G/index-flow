import type { MetadataRoute } from "next";

export const siteManifest = {
  name: "IndexFlow",
  short_name: "IndexFlow",
  description:
    "Create a polished link-in-bio page with custom themes, flexible links, and built-in analytics.",
  start_url: "/",
  scope: "/",
  display: "standalone",
  background_color: "#fff8e6",
  theme_color: "#b1407f",
  icons: [
    {
      src: "/indexflow-icon.svg",
      sizes: "any",
      type: "image/svg+xml",
      purpose: "maskable",
    },
  ],
} satisfies MetadataRoute.Manifest;
