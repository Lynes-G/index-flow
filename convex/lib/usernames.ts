import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

// 🔍 Get username/slug for a given user ID (returns custom username or fallsback to clerk ID)
export const getUserSlug = query({
  args: { userId: v.string() },
  returns: v.string(),
  handler: async ({ db }, args) => {
    const usernameRecord = await db
      .query("usernames")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .unique();
    return usernameRecord?.username || args.userId;
  },
});

export const checkUsernameAvailability = query({
  args: { username: v.string() },
  returns: v.object({ available: v.boolean(), error: v.optional(v.string()) }),
  handler: async ({ db }, args) => {
    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(args.username)) {
      return {
        available: false,
        error: "Username can only contain letters, numbers, and underscores",
      };
    }
    if (args.username.length < 3 || args.username.length > 30) {
      return {
        available: false,
        error: "Username must be between 3 and 30 characters long",
      };
    }
    // Check if username already taken
    const existingUsername = await db
      .query("usernames")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    return { available: !existingUsername };
  },
});
// 🔪 Set or update the username for the authenticated user
export const setUsername = mutation({
  args: { username: v.string() },
  returns: v.object({ success: v.boolean(), error: v.optional(v.string()) }),
  handler: async ({ db, auth }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(args.username)) {
      return {
        success: false,
        error: "Username can only contain letters, numbers, and underscores",
      };
    }
    if (args.username.length < 3 || args.username.length > 30) {
      return {
        success: false,
        error: "Username must be between 3 and 30 characters long",
      };
    }

    // Check if username already taken by another user
    const existingUsername = await db
      .query("usernames")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    if (existingUsername && existingUsername.userId !== identity.subject) {
      return { success: false, error: "Username is already taken" };
    }

    // Checl if user already has a username record
    const currentRecord = await db
      .query("usernames")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .unique();
    if (currentRecord) {
      // Update existing record
      await db.patch(currentRecord._id, { username: args.username });
    } else {
      // Create new record
      await db.insert("usernames", {
        userId: identity.subject,
        username: args.username,
      });
    }
    return { success: true };
  },
});

export const getUserIdBySlug = query({
  args: { slug: v.string() },
  returns: v.union(v.string(), v.null()),
  handler: async ({ db }, args) => {
    // First, try to find a username record matching the slug
    const usernameRecord = await db
      .query("usernames")
      .withIndex("by_username", (q) => q.eq("username", args.slug))
      .unique();

    if (usernameRecord) return usernameRecord.userId;

    // If no custom username found, treat slug as clerk user ID
    // We'll need to verify this user actaully exists by checking for links
    const links = await db
      .query("links")
      .withIndex("by_user_and_order", (q) => q.eq("userId", args.slug))
      .first();

    return links ? args.slug : null;
  },
});
