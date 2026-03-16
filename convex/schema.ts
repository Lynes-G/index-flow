import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  usernames: defineTable({
    userId: v.string(), // Clerk user ID
    username: v.string(), // Custom username (Unique)
  })
    .index("by_user_id", ["userId"])
    .index("by_username", ["username"]),

  links: defineTable({
    userId: v.string(), // Clerk user ID
    title: v.string(), // Display name of the link
    url: v.string(), // Destination URL of the link
    order: v.number(), // Sort order
  })
    .index("by_user", ["userId"])
    .index("by_user_and_order", ["userId", "order"]),

  userCustomizations: defineTable({
    userId: v.string(), // Clerk user ID
    profilePictureStorageId: v.optional(v.id("_storage")), // Convex storage ID for profile picture
    description: v.optional(v.string()), // Custom description
    accentColor: v.optional(v.string()), // Custom accent color
    themePreset: v.optional(v.string()),
    fontFamily: v.optional(v.string()),
    layoutStyle: v.optional(v.string()),
    linkStyle: v.optional(v.string()),
    backgroundType: v.optional(v.string()),
    backgroundValue: v.optional(v.string()),
    backgroundImageStorageId: v.optional(v.id("_storage")),
    bannerImageStorageId: v.optional(v.id("_storage")),
    avatarShape: v.optional(v.string()),
    socialLinks: v.optional(
      v.array(
        v.object({
          platform: v.string(),
          url: v.string(),
        }),
      ),
    ),
  }).index("by_user_id", ["userId"]),
});
