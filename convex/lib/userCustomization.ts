// Get customizations by slug (for public pages)

import { sanitizeAppearanceFontFamily } from "../../lib/frontend/appearance/appearanceFonts";
import { v } from "convex/values";
import {
  query,
  mutation,
  type DatabaseReader,
  type DatabaseWriter,
} from "../_generated/server";
import type { Id } from "../_generated/dataModel";

import { profileFieldsValidator } from "./profileFieldsValidator";
import { resolveUserIdFromSlug } from "./slug";

const socialLinksValidator = v.optional(
  v.array(
    v.object({
      platform: v.string(),
      url: v.string(),
    }),
  ),
);

const customizationResponseValidator = v.object({
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
  backgroundSolidColor: v.optional(v.string()),
  patternOverlayEnabled: v.optional(v.boolean()),
  patternOverlayValue: v.optional(v.string()),
  patternOverlayOpacity: v.optional(v.number()),
  backgroundImageStorageId: v.optional(v.id("_storage")),
  backgroundImageUrl: v.optional(v.string()),
  backgroundImagePositionX: v.optional(v.number()),
  backgroundImagePositionY: v.optional(v.number()),
  bannerImageStorageId: v.optional(v.id("_storage")),
  bannerImageUrl: v.optional(v.string()),
  bannerImagePositionX: v.optional(v.number()),
  bannerImagePositionY: v.optional(v.number()),
  featuredLinkId: v.optional(v.id("links")),
  avatarShape: v.optional(v.string()),
  profileFields: profileFieldsValidator,
  socialLinks: socialLinksValidator,
});

type CustomizationStorage = {
  getUrl: (storageId: Id<"_storage">) => Promise<string | null>;
};

type CustomizationMutationStorage = CustomizationStorage & {
  delete: (storageId: Id<"_storage">) => Promise<void>;
};

type ExistingCustomization = NonNullable<
  Awaited<ReturnType<typeof getCustomizationByUserId>>
>;

type CustomizationFieldsArgs = {
  profilePictureStorageId?: Id<"_storage">;
  description?: string;
  accentColor?: string;
  themePreset?: string;
  layoutStyle?: string;
  linkStyle?: string;
  backgroundType?: string;
  backgroundValue?: string;
  backgroundSolidColor?: string;
  patternOverlayEnabled?: boolean;
  patternOverlayValue?: string;
  patternOverlayOpacity?: number;
  backgroundImageStorageId?: Id<"_storage">;
  backgroundImagePositionX?: number;
  backgroundImagePositionY?: number;
  bannerImageStorageId?: Id<"_storage">;
  bannerImagePositionX?: number;
  bannerImagePositionY?: number;
  featuredLinkId?: Id<"links"> | null;
  avatarShape?: string;
  profileFields?: ExistingCustomization["profileFields"];
  socialLinks?: ExistingCustomization["socialLinks"];
};

type CustomizationWriteFields = {
  fontFamily?: string;
} & Omit<CustomizationFieldsArgs, "featuredLinkId"> & {
    featuredLinkId?: Id<"links">;
  };

const getCustomizationByUserId = (db: DatabaseReader, userId: string) =>
  db
    .query("userCustomizations")
    .withIndex("by_user_id", (q) => q.eq("userId", userId))
    .unique();

const getStorageUrl = async (
  storage: CustomizationStorage,
  storageId?: Id<"_storage">,
) => {
  if (!storageId) {
    return undefined;
  }

  const url = await storage.getUrl(storageId as never);
  return url || undefined;
};

const buildCustomizationResponse = async (
  storage: CustomizationStorage,
  customization: NonNullable<
    Awaited<ReturnType<typeof getCustomizationByUserId>>
  >,
) => {
  const [profilePictureUrl, backgroundImageUrl, bannerImageUrl] =
    await Promise.all([
      getStorageUrl(storage, customization.profilePictureStorageId),
      getStorageUrl(storage, customization.backgroundImageStorageId),
      getStorageUrl(storage, customization.bannerImageStorageId),
    ]);

  return {
    ...customization,
    profilePictureUrl,
    backgroundImageUrl,
    bannerImageUrl,
  };
};

const ensureOwnedFeaturedLink = async (
  db: DatabaseReader,
  userId: string,
  featuredLinkId: Id<"links"> | null | undefined,
) => {
  if (!featuredLinkId) {
    return;
  }

  const link = await db.get(featuredLinkId);
  if (!link || link.userId !== userId) {
    throw new Error("Featured link not found");
  }
};

const buildCustomizationFields = ({
  args,
  sanitizedFontFamily,
  isUpdate,
}: {
  args: CustomizationFieldsArgs;
  sanitizedFontFamily?: string;
  isUpdate: boolean;
}) => {
  const fields: CustomizationWriteFields = {
    ...(args.profilePictureStorageId !== undefined && {
      profilePictureStorageId: args.profilePictureStorageId,
    }),
    ...(args.description !== undefined && { description: args.description }),
    ...(args.accentColor !== undefined && { accentColor: args.accentColor }),
    ...(args.themePreset !== undefined && { themePreset: args.themePreset }),
    ...(sanitizedFontFamily !== undefined && {
      fontFamily: sanitizedFontFamily,
    }),
    ...(args.layoutStyle !== undefined && { layoutStyle: args.layoutStyle }),
    ...(args.linkStyle !== undefined && { linkStyle: args.linkStyle }),
    ...(args.backgroundType !== undefined && {
      backgroundType: args.backgroundType,
    }),
    ...(args.backgroundValue !== undefined && {
      backgroundValue: args.backgroundValue,
    }),
    ...(args.backgroundSolidColor !== undefined && {
      backgroundSolidColor: args.backgroundSolidColor,
    }),
    ...(args.patternOverlayEnabled !== undefined && {
      patternOverlayEnabled: args.patternOverlayEnabled,
    }),
    ...(args.patternOverlayValue !== undefined && {
      patternOverlayValue: args.patternOverlayValue,
    }),
    ...(args.patternOverlayOpacity !== undefined && {
      patternOverlayOpacity: args.patternOverlayOpacity,
    }),
    ...(args.backgroundImageStorageId !== undefined && {
      backgroundImageStorageId: args.backgroundImageStorageId,
    }),
    ...(args.backgroundImagePositionX !== undefined && {
      backgroundImagePositionX: args.backgroundImagePositionX,
    }),
    ...(args.backgroundImagePositionY !== undefined && {
      backgroundImagePositionY: args.backgroundImagePositionY,
    }),
    ...(args.bannerImageStorageId !== undefined && {
      bannerImageStorageId: args.bannerImageStorageId,
    }),
    ...(args.bannerImagePositionX !== undefined && {
      bannerImagePositionX: args.bannerImagePositionX,
    }),
    ...(args.bannerImagePositionY !== undefined && {
      bannerImagePositionY: args.bannerImagePositionY,
    }),
    ...(args.avatarShape !== undefined && { avatarShape: args.avatarShape }),
    ...(args.profileFields !== undefined && {
      profileFields: args.profileFields,
    }),
    ...(args.socialLinks !== undefined && { socialLinks: args.socialLinks }),
  };

  if (args.featuredLinkId !== undefined) {
    if (isUpdate) {
      fields.featuredLinkId = args.featuredLinkId ?? undefined;
    } else if (args.featuredLinkId !== null) {
      fields.featuredLinkId = args.featuredLinkId;
    }
  }

  return fields;
};

const replacementStorageFields = [
  "profilePictureStorageId",
  "backgroundImageStorageId",
  "bannerImageStorageId",
] as const;

const deleteReplacedStorageImages = async ({
  args,
  existing,
  storage,
}: {
  args: {
    profilePictureStorageId?: Id<"_storage">;
    backgroundImageStorageId?: Id<"_storage">;
    bannerImageStorageId?: Id<"_storage">;
  };
  existing: ExistingCustomization;
  storage: CustomizationMutationStorage;
}) => {
  await Promise.all(
    replacementStorageFields.map(async (field) => {
      if (args[field] && existing[field]) {
        await storage.delete(existing[field]);
      }
    }),
  );
};

const removeStoredImage = async ({
  db,
  storage,
  userId,
  storageField,
}: {
  db: DatabaseWriter;
  storage: CustomizationMutationStorage;
  userId: string;
  storageField:
    | "profilePictureStorageId"
    | "backgroundImageStorageId"
    | "bannerImageStorageId";
}) => {
  const existing = await getCustomizationByUserId(db, userId);

  if (!existing?.[storageField]) {
    return;
  }

  await storage.delete(existing[storageField]);
  await db.patch(existing._id, { [storageField]: undefined });
};

// Get customizations by user ID
export const getUserCustomizations = query({
  args: { userId: v.string() },
  returns: v.union(v.null(), customizationResponseValidator),
  handler: async ({ db, storage }, args) => {
    const customization = await getCustomizationByUserId(db, args.userId);
    if (!customization) return null;

    return buildCustomizationResponse(storage, customization);
  },
});

// Get customizations by slug (for public pages)
export const getCustomizationBySlug = query({
  args: { slug: v.string() },
  returns: v.union(v.null(), customizationResponseValidator),
  handler: async ({ db, storage }, args) => {
    const userId = await resolveUserIdFromSlug(db, args.slug);
    const customization = await getCustomizationByUserId(db, userId);

    if (!customization) return null;

    return buildCustomizationResponse(storage, customization);
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
    backgroundSolidColor: v.optional(v.string()),
    patternOverlayEnabled: v.optional(v.boolean()),
    patternOverlayValue: v.optional(v.string()),
    patternOverlayOpacity: v.optional(v.number()),
    backgroundImageStorageId: v.optional(v.id("_storage")),
    backgroundImagePositionX: v.optional(v.number()),
    backgroundImagePositionY: v.optional(v.number()),
    bannerImageStorageId: v.optional(v.id("_storage")),
    bannerImagePositionX: v.optional(v.number()),
    bannerImagePositionY: v.optional(v.number()),
    featuredLinkId: v.optional(v.union(v.id("links"), v.null())),
    avatarShape: v.optional(v.string()),
    profileFields: profileFieldsValidator,
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
    const sanitizedFontFamily =
      args.fontFamily !== undefined
        ? sanitizeAppearanceFontFamily(args.fontFamily)
        : undefined;
    const fields = buildCustomizationFields({
      args,
      sanitizedFontFamily,
      isUpdate: false,
    });

    await ensureOwnedFeaturedLink(db, identity.subject, args.featuredLinkId);

    const existing = await getCustomizationByUserId(db, identity.subject);

    if (existing) {
      await deleteReplacedStorageImages({
        args,
        existing,
        storage,
      });

      await db.patch(
        existing._id,
        buildCustomizationFields({
          args,
          sanitizedFontFamily,
          isUpdate: true,
        }),
      );
      return existing._id;
    }

    return await db.insert("userCustomizations", {
      userId: identity.subject,
      ...fields,
    });
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

    await removeStoredImage({
      db,
      storage,
      userId: identity.subject,
      storageField: "profilePictureStorageId",
    });

    return null;
  },
});

export const removeBannerImage = mutation({
  args: {},
  returns: v.null(),
  handler: async ({ db, storage, auth }) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    await removeStoredImage({
      db,
      storage,
      userId: identity.subject,
      storageField: "bannerImageStorageId",
    });

    return null;
  },
});

export const removeBackgroundImage = mutation({
  args: {},
  returns: v.null(),
  handler: async ({ db, storage, auth }) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    await removeStoredImage({
      db,
      storage,
      userId: identity.subject,
      storageField: "backgroundImageStorageId",
    });

    return null;
  },
});
