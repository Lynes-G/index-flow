import type { MetadataRoute } from "next";

import { getAppUrl } from "@/lib/server/appUrl";
import { siteManifest } from "@/lib/server/siteMetadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    ...siteManifest,
    start_url: getAppUrl(),
  };
}
