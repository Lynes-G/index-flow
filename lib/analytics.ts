import { ClientTrackingData } from "@/lib/types";

const trackLinkClick = async (event: ClientTrackingData) => {
  try {
    // In production, you'd send this to Tinybird ingest endpoint
    // For now, we'll log it and setup webhook later
    const trackingData = {
      profileUsername: event.profileUsername,
      linkId: event.linkId,
      linkTitle: event.linkTitle,
      linkUrl: event.linkUrl,
      eventType: event.eventType || "link_click",
      userAgent: event.userAgent || navigator.userAgent,
      referrer: event.referrer || document.referrer || "direct",
    };
    console.log("Tracking link click:", trackingData);

    // Send to your API endpoint which forwards to Tinybird
    await fetch("/api/track-click", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trackingData),
    });

    return trackingData;
  } catch (err) {
    console.error("Failed to track link click:", err);
  }
};

export { trackLinkClick };
