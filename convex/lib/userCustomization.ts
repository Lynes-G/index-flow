// Get customizations by slug (for public pages)

import { v } from "convex/values";
import { query, mutation } from "../_generated/server";

// Get customizations by user ID
export const getUserCustomizations = query({
  args: { userId: v.string() },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("userCustomizations"),
      _creationTime: v.number(),
      userId: v.string(),
      profilePictureStorageId: v.optional(v.id("_storage")),
      profilePictureUrl: v.optional(v.string()),
      description: v.optional(v.string()),
      accentColor: v.optional(v.string()),
      themePreset: v.optional(v.string()),
      fontFamily: v.optional(v.string()),
      layoutStyle: v.optional(v.string()),
      linkStyle: v.optional(v.string()),
      backgroundType: v.optional(v.string()),
      backgroundValue: v.optional(v.string()),
      backgroundImageStorageId: v.optional(v.id("_storage")),
      backgroundImageUrl: v.optional(v.string()),
      bannerImageStorageId: v.optional(v.id("_storage")),
      bannerImageUrl: v.optional(v.string()),
      avatarShape: v.optional(v.string()),
      socialLinks: v.optional(
        v.array(
          v.object({
            platform: v.string(),
            url: v.string(),
          }),
        ),
      ),
    }),
  ),
  handler: async ({ db, storage }, args) => {
    const customization = await db
      .query("userCustomizations")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .unique();
    if (!customization) return null;

    // Get profile picture URL if storage ID exists
    let profilePictureUrl: string | undefined;
    if (customization.profilePictureStorageId) {
      const url = await storage.getUrl(customization.profilePictureStorageId);
      profilePictureUrl = url || undefined;
    }

    let backgroundImageUrl: string | undefined;
    if (customization.backgroundImageStorageId) {
      const url = await storage.getUrl(customization.backgroundImageStorageId);
      backgroundImageUrl = url || undefined;
    }

    let bannerImageUrl: string | undefined;
    if (customization.bannerImageStorageId) {
      const url = await storage.getUrl(customization.bannerImageStorageId);
      bannerImageUrl = url || undefined;
    }
    return {
      ...customization,
      profilePictureUrl,
      backgroundImageUrl,
      bannerImageUrl,
    };
  },
});

// Get customizations by slug (for public pages)
export const getCustomizationBySlug = query({
  args: { slug: v.string() },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("userCustomizations"),
      _creationTime: v.number(),
      userId: v.string(),
      profilePictureStorageId: v.optional(v.id("_storage")),
      profilePictureUrl: v.optional(v.string()),
      description: v.optional(v.string()),
      accentColor: v.optional(v.string()),
      themePreset: v.optional(v.string()),
      fontFamily: v.optional(v.string()),
      layoutStyle: v.optional(v.string()),
      linkStyle: v.optional(v.string()),
      backgroundType: v.optional(v.string()),
      backgroundValue: v.optional(v.string()),
      backgroundImageStorageId: v.optional(v.id("_storage")),
      backgroundImageUrl: v.optional(v.string()),
      bannerImageStorageId: v.optional(v.id("_storage")),
      bannerImageUrl: v.optional(v.string()),
      avatarShape: v.optional(v.string()),
      socialLinks: v.optional(
        v.array(
          v.object({
            platform: v.string(),
            url: v.string(),
          }),
        ),
      ),
    }),
  ),
  handler: async ({ db, storage }, args) => {
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

    const customization = await db
      .query("userCustomizations")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();

    if (!customization) return null;

    // Get profile picture URL if storage ID exists
    let profilePictureUrl: string | undefined;
    if (customization.profilePictureStorageId) {
      const url = await storage.getUrl(customization.profilePictureStorageId);
      profilePictureUrl = url || undefined;
    }

    let backgroundImageUrl: string | undefined;
    if (customization.backgroundImageStorageId) {
      const url = await storage.getUrl(customization.backgroundImageStorageId);
      backgroundImageUrl = url || undefined;
    }

    let bannerImageUrl: string | undefined;
    if (customization.bannerImageStorageId) {
      const url = await storage.getUrl(customization.bannerImageStorageId);
      bannerImageUrl = url || undefined;
    }
    return {
      ...customization,
      profilePictureUrl,
      backgroundImageUrl,
      bannerImageUrl,
    };
  },
});

// Update or create user customizations
export const updateCustomizations = mutation({
  args: {
    profilePictureStorageId: v.optional(v.id("_storage")),
    description: v.optional(v.string()),
    accentColor: v.optional(v.string()),
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
  },
  returns: v.id("userCustomizations"),
  handler: async ({ db, auth, storage }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    //  Check if customization exists
    const existing = await db
      .query("userCustomizations")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .unique();

    if (existing) {
      // If we're updating the profile picture, delete the old one
      if (args.profilePictureStorageId && existing.profilePictureStorageId) {
        await storage.delete(existing.profilePictureStorageId);
      }

      if (args.backgroundImageStorageId && existing.backgroundImageStorageId) {
        await storage.delete(existing.backgroundImageStorageId);
      }

      if (args.bannerImageStorageId && existing.bannerImageStorageId) {
        await storage.delete(existing.bannerImageStorageId);
      }

      // Update existing customization
      await db.patch(existing._id, {
        ...(args.profilePictureStorageId !== undefined && {
          profilePictureStorageId: args.profilePictureStorageId,
        }),
        ...(args.description !== undefined && {
          description: args.description,
        }),
        ...(args.accentColor !== undefined && {
          accentColor: args.accentColor,
        }),
        ...(args.themePreset !== undefined && {
          themePreset: args.themePreset,
        }),
        ...(args.fontFamily !== undefined && {
          fontFamily: args.fontFamily,
        }),
        ...(args.layoutStyle !== undefined && {
          layoutStyle: args.layoutStyle,
        }),
        ...(args.linkStyle !== undefined && {
          linkStyle: args.linkStyle,
        }),
        ...(args.backgroundType !== undefined && {
          backgroundType: args.backgroundType,
        }),
        ...(args.backgroundValue !== undefined && {
          backgroundValue: args.backgroundValue,
        }),
        ...(args.backgroundImageStorageId !== undefined && {
          backgroundImageStorageId: args.backgroundImageStorageId,
        }),
        ...(args.bannerImageStorageId !== undefined && {
          bannerImageStorageId: args.bannerImageStorageId,
        }),
        ...(args.avatarShape !== undefined && {
          avatarShape: args.avatarShape,
        }),
        ...(args.socialLinks !== undefined && {
          socialLinks: args.socialLinks,
        }),
      });
      return existing._id;
    } else {
      // Create new customization
      return await db.insert("userCustomizations", {
        userId: identity.subject,
        ...(args.profilePictureStorageId !== undefined && {
          profilePictureStorageId: args.profilePictureStorageId,
        }),
        ...(args.description !== undefined && {
          description: args.description,
        }),
        ...(args.accentColor !== undefined && {
          accentColor: args.accentColor,
        }),
        ...(args.themePreset !== undefined && {
          themePreset: args.themePreset,
        }),
        ...(args.fontFamily !== undefined && {
          fontFamily: args.fontFamily,
        }),
        ...(args.layoutStyle !== undefined && {
          layoutStyle: args.layoutStyle,
        }),
        ...(args.linkStyle !== undefined && {
          linkStyle: args.linkStyle,
        }),
        ...(args.backgroundType !== undefined && {
          backgroundType: args.backgroundType,
        }),
        ...(args.backgroundValue !== undefined && {
          backgroundValue: args.backgroundValue,
        }),
        ...(args.backgroundImageStorageId !== undefined && {
          backgroundImageStorageId: args.backgroundImageStorageId,
        }),
        ...(args.bannerImageStorageId !== undefined && {
          bannerImageStorageId: args.bannerImageStorageId,
        }),
        ...(args.avatarShape !== undefined && {
          avatarShape: args.avatarShape,
        }),
        ...(args.socialLinks !== undefined && {
          socialLinks: args.socialLinks,
        }),
      });
    }
  },
});

// Generate upload URL for profile picture
export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async ({ storage, auth }) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await storage.generateUploadUrl();
  },
});

// Remove profile picture
export const removeProfilePicture = mutation({
  args: {},
  returns: v.null(),
  handler: async ({ db, storage, auth }) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const existing = await db
      .query("userCustomizations")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .unique();

    if (existing && existing.profilePictureStorageId) {
      // Delete from storage
      await storage.delete(existing.profilePictureStorageId);

      // Update the record to remove the storage ID
      await db.patch(existing._id, {
        profilePictureStorageId: undefined,
      });
    }
    return null;
  },
});

export const removeBannerImage = mutation({
  args: {},
  returns: v.null(),
  handler: async ({ db, storage, auth }) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const existing = await db
      .query("userCustomizations")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .unique();

    if (existing && existing.bannerImageStorageId) {
      await storage.delete(existing.bannerImageStorageId);
      await db.patch(existing._id, { bannerImageStorageId: undefined });
    }
    return null;
  },
});

export const removeBackgroundImage = mutation({
  args: {},
  returns: v.null(),
  handler: async ({ db, storage, auth }) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const existing = await db
      .query("userCustomizations")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .unique();

    if (existing && existing.backgroundImageStorageId) {
      await storage.delete(existing.backgroundImageStorageId);
      await db.patch(existing._id, {
        backgroundImageStorageId: undefined,
      });
    }
    return null;
  },
});
