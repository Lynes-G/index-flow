import { ClientTrackingData } from "@/lib/types";

const trackLinkClick = async (event: ClientTrackingData) => {
  try {
    const trackingData = {
      profileUsername: event.profileUsername,
      linkId: event.linkId,
      eventType: event.eventType || "link_click",
    };

    await fetch("/api/track-click", {
      method: "POST",
      cache: "no-store",
      keepalive: true,
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
