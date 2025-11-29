import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

// 🔍 Get links by user slug (username or clerk ID)
export const getLinksBySlug = query({
  args: { slug: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("links"),
      _creationTime: v.number(),
      userId: v.string(),
      title: v.string(),
      url: v.string(),
      order: v.number(),
    }),
  ),
  handler: async ({ db }, args) => {
    // First try to find a custom username
    const usernameRecord = await db
      .query("usernames")
      .withIndex("by_username", (q) => q.eq("username", args.slug))
      .unique();

    let userId: string;
    if (usernameRecord) {
      userId = usernameRecord.userId;
    } else {
      // Fallback to treating slug as clerk user ID
      userId = args.slug;
    }

    return await db
      .query("links")
      .withIndex("by_user_and_order", (q) => q.eq("userId", userId))
      .order("asc")
      .collect(); // Collect all matching links
  },
});

// 🔍 Get links by user ID
export const getLinksByUserId = query({
  args: { userId: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("links"),
      _creationTime: v.number(),
      userId: v.string(),
      title: v.string(),
      url: v.string(),
      order: v.number(),
    }),
  ),
  handler: async ({ db }, args) => {
    return await db
      .query("links")
      .withIndex("by_user_and_order", (q) => q.eq("userId", args.userId))
      .order("asc")
      .collect(); // Collect all matching links
  },
});

// 📋 Update order

export const updateLinkOrder = mutation({
  args: { linkIds: v.array(v.id("links")) },
  returns: v.null(),
  handler: async ({ db, auth }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Get all links and filter out invalid ones
    const links = await Promise.all(
      args.linkIds.map((linkId) => db.get(linkId)),
    );

    const validLinks = links
      .map((link, index) => ({ link, originalIndex: index }))
      .filter(({ link }) => link && link.userId === identity.subject)
      .map(({ link, originalIndex }) => ({
        link: link as NonNullable<typeof link>,
        originalIndex,
      }));

    // Update only valid links with their new order
    await Promise.all(
      validLinks.map(({ link, originalIndex }) =>
        db.patch(link._id, { order: originalIndex }),
      ),
    );
    return null;
  },
});

// ❌ Delete link
export const deleteLink = mutation({
  args: { linkId: v.id("links") },
  returns: v.null(),
  handler: async ({ db, auth }, args) => {
    const identity = await auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const link = await db.get(args.linkId);
    if (!link || link.userId !== identity.subject) {
      throw new Error("Link not found or unauthorized");
    }

    await db.delete(args.linkId);
    return null;
  },
});

// ✏️ Update link details
export const updateLink = mutation({
  args: {
    linkId: v.id("links"),
    title: v.string(),
    url: v.string(),
  },
  returns: v.null(),
  handler: async ({ db, auth }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const link = await db.get(args.linkId);
    if (!link || link.userId !== identity.subject) {
      throw new Error("Link not found or unauthorized");
    }

    await db.patch(args.linkId, { title: args.title, url: args.url });
    return null;
  },
});

// 🔢 Get link count by user ID
export const getLinkCountByUserId = query({
  args: { userId: v.string() },
  returns: v.number(),
  handler: async ({ db }, args) => {
    const links = await db
      .query("links")
      .withIndex("by_user_and_order", (q) => q.eq("userId", args.userId))
      .collect();
    return links.length;
  },
});

// ➕ Create new link
export const createLink = mutation({
  args: { title: v.string(), url: v.string() },
  returns: v.id("links"),
  handler: async ({ db, auth }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Determine the order for the new link
    const existingLinks = await db
      .query("links")
      .withIndex("by_user_and_order", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .first();
    const newOrder = existingLinks ? existingLinks.order + 1 : 0;

    return await db.insert("links", {
      userId: identity.subject,
      title: args.title,
      url: args.url,
      order: newOrder,
    });
  },
});
