// Client-side data that get sent from the browser
import { Geo } from "@vercel/functions";

export interface ClientTrackingData {
  profileUsername: string;
  linkId: string;
  eventType?: "link_click" | "qr_scan";
}

// Complete server-side tracking event with additional data
// Note: use profileUserId for queries as username can change
export interface ServerTrackingEvent extends ClientTrackingData {
  linkTitle: string;
  linkUrl: string;
  profileUserId: string;
  location: Geo;
  timestamp: string;
  eventType: "link_click" | "qr_scan";
  userAgent: string;
  referrer: string;
}
