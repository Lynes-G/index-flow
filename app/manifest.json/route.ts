import { siteManifest } from "@/lib/server/siteMetadata";

export function GET() {
  return Response.json(siteManifest, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
