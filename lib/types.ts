// Client-side data that get sent from the browser
import { Geo } from "@vercel/functions";

export interface ClientTrackingData {
  profileUsername: string;
  linkId?: string;
  eventType?: "link_click" | "profile_view" | "qr_scan";
  visitorId?: string;
}

// Complete server-side tracking event with additional data
// Note: use profileUserId for queries as username can change
export interface ServerTrackingEvent extends ClientTrackingData {
  linkId: string;
  linkTitle: string;
  linkUrl: string;
  profileUserId: string;
  visitorId: string;
  location: Geo;
  timestamp: string;
  eventType: "link_click" | "profile_view" | "qr_scan";
  userAgent: string;
  referrer: string;
}
