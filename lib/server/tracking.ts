import { z } from "zod";

const trackingEventSchema = z.object({
  profileUsername: z.string().trim().min(1).max(100),
  linkId: z.string().trim().min(1).max(128),
  eventType: z.literal("link_click").optional(),
});

export const validateTrackingEventPayload = (payload: unknown) =>
  trackingEventSchema.parse(payload);
