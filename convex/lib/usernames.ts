import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

const usernamePattern = /^[a-z0-9_]+$/;
const reservedUsernames = new Set([
  "admin",
  "api",
  "app",
  "billing",
  "dashboard",
  "help",
  "invite",
  "login",
  "logout",
  "q",
  "settings",
  "sign-in",
  "sign-up",
  "signup",
  "signin",
  "support",
  "u",
  "www",
]);

const usernameValidationMessages = {
  format: "Username can only contain letters, numbers, and underscores",
  length: "Username must be between 3 and 30 characters long",
  reserved: "This username is reserved",
  taken: "Username is already taken",
} as const;

const normalizeUsername = (username: string) => username.trim().toLowerCase();

const validateUsername = (username: string) => {
  const normalizedUsername = normalizeUsername(username);

  if (!usernamePattern.test(normalizedUsername)) {
    return {
      normalizedUsername,
      error: usernameValidationMessages.format,
    };
  }

  if (normalizedUsername.length < 3 || normalizedUsername.length > 30) {
    return {
      normalizedUsername,
      error: usernameValidationMessages.length,
    };
  }

  if (reservedUsernames.has(normalizedUsername)) {
    return {
      normalizedUsername,
      error: usernameValidationMessages.reserved,
    };
  }

  return { normalizedUsername };
};

// Usernames are normalized with trim + lowercase before availability checks and
// storage. Collisions are reported as "Username is already taken"; HTTP callers
// should translate that collision to a 409 response.
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
    const validation = validateUsername(args.username);

    if (validation.error) {
      return {
        available: false,
        error: validation.error,
      };
    }

    const existingUsername = await db
      .query("usernames")
      .withIndex("by_username", (q) =>
        q.eq("username", validation.normalizedUsername),
      )
      .unique();

    return existingUsername
      ? { available: false, error: usernameValidationMessages.taken }
      : { available: true };
  },
});

export const setUsername = mutation({
  args: { username: v.string() },
  returns: v.object({ success: v.boolean(), error: v.optional(v.string()) }),
  handler: async ({ db, auth }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const validation = validateUsername(args.username);

    if (validation.error) {
      return {
        success: false,
        error: validation.error,
      };
    }

    const { normalizedUsername } = validation;
    const existingUsername = await db
      .query("usernames")
      .withIndex("by_username", (q) => q.eq("username", normalizedUsername))
      .unique();

    if (existingUsername && existingUsername.userId !== identity.subject) {
      return { success: false, error: usernameValidationMessages.taken };
    }

    const currentRecord = await db
      .query("usernames")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .unique();

    if (currentRecord) {
      await db.patch(currentRecord._id, { username: normalizedUsername });
    } else {
      await db.insert("usernames", {
        userId: identity.subject,
        username: normalizedUsername,
      });
    }

    return { success: true };
  },
});

export const getUserIdBySlug = query({
  args: { slug: v.string() },
  returns: v.union(v.string(), v.null()),
  handler: async ({ db }, args) => {
    const slug = args.slug.trim();
    const normalizedUsername = normalizeUsername(slug);
    const usernameRecord = await db
      .query("usernames")
      .withIndex("by_username", (q) => q.eq("username", normalizedUsername))
      .unique();

    if (usernameRecord) return usernameRecord.userId;

    const links = await db
      .query("links")
      .withIndex("by_user_and_order", (q) => q.eq("userId", slug))
      .first();

    return links ? slug : null;
  },
});
