import { api } from "@/convex/_generated/api";
import { Preloaded } from "convex/react";

export interface PublicPageContentProps {
  username: string;
  preloadedLinks: Preloaded<typeof api.lib.links.getLinksByUserId>;
  preloadedCustomization: Preloaded<
    typeof api.lib.userCustomization.getUserCustomizations
  >;
}
