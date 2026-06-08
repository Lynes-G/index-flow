import assert from "node:assert/strict";
import test from "node:test";

import { updateCustomizations } from "./userCustomization";

const userId = "user_123";

const createUpdateCustomizationsHandler = () =>
  (
    updateCustomizations as typeof updateCustomizations & {
      _handler: (
        ctx: unknown,
        args: {
          featuredLinkId?: string | null;
          description?: string;
          fontFamily?: string;
          patternOverlayOpacity?: number;
          profilePictureStorageId?: string;
          profileFields?: [];
        },
      ) => Promise<string>;
    }
  )._handler;

const createMockCtx = ({
  featuredLink,
  existingCustomization = null,
}: {
  featuredLink: { _id: string; userId: string } | null;
  existingCustomization?: {
    _id: string;
    userId: string;
    profilePictureStorageId?: string;
    backgroundImageStorageId?: string;
    bannerImageStorageId?: string;
  } | null;
}) => {
  const deletedStorageIds: string[] = [];
  const inserts: Array<Record<string, unknown>> = [];
  const patches: Array<{ id: string; value: Record<string, unknown> }> = [];

  return {
    ctx: {
      auth: {
        getUserIdentity: async () => ({ subject: userId }),
      },
      db: {
        get: async (id: string) =>
          featuredLink?._id === id ? featuredLink : null,
        query: (table: string) => ({
          withIndex: (
            indexName: string,
            apply: (query: {
              eq: (
                field: string,
                value: string,
              ) => { field: string; value: string };
            }) => {
              field: string;
              value: string;
            },
          ) => {
            const lookup = apply({
              eq: (field: string, value: string) => ({ field, value }),
            });

            return {
              unique: async () => {
                if (
                  table === "userCustomizations" &&
                  indexName === "by_user_id" &&
                  lookup.value === userId
                ) {
                  return existingCustomization;
                }

                return null;
              },
            };
          },
        }),
        insert: async (_table: string, value: Record<string, unknown>) => {
          inserts.push(value);
          return "customization_123";
        },
        patch: async (id: string, value: Record<string, unknown>) => {
          patches.push({ id, value });
        },
      },
      storage: {
        delete: async (id: string) => {
          deletedStorageIds.push(id);
        },
      },
    },
    deletedStorageIds,
    inserts,
    patches,
  };
};

test("updateCustomizations rejects a featured link owned by another user", async () => {
  const handler = createUpdateCustomizationsHandler();
  const { ctx, inserts, patches } = createMockCtx({
    featuredLink: { _id: "link_other", userId: "user_other" },
  });

  await assert.rejects(
    handler(ctx, {
      featuredLinkId: "link_other",
      description: "Hello world",
      profileFields: [],
    }),
    /Featured link not found/,
  );

  assert.deepEqual(inserts, []);
  assert.deepEqual(patches, []);
});

test("updateCustomizations allows an owned featured link during creation", async () => {
  const handler = createUpdateCustomizationsHandler();
  const { ctx, inserts } = createMockCtx({
    featuredLink: { _id: "link_1", userId },
  });

  const createdId = await handler(ctx, {
    featuredLinkId: "link_1",
    description: "Hello world",
    profileFields: [],
  });

  assert.equal(createdId, "customization_123");
  assert.equal(inserts.length, 1);
  assert.equal(inserts[0].featuredLinkId, "link_1");
  assert.equal(inserts[0].userId, userId);
});

test("updateCustomizations sanitizes unsupported font families", async () => {
  const handler = createUpdateCustomizationsHandler();
  const { ctx, inserts } = createMockCtx({
    featuredLink: null,
  });

  await handler(ctx, {
    description: "Hello world",
    fontFamily: '"Unknown Font", sans-serif',
    profileFields: [],
  });

  assert.equal(inserts[0].fontFamily, '"Sora", "Helvetica Neue", sans-serif');
});

test("updateCustomizations stores overlay strength when provided", async () => {
  const handler = createUpdateCustomizationsHandler();
  const { ctx, inserts } = createMockCtx({
    featuredLink: null,
  });

  await handler(ctx, {
    description: "Hello world",
    profileFields: [],
    patternOverlayOpacity: 0.32,
  } as {
    description: string;
    profileFields: [];
    patternOverlayOpacity: number;
  });

  assert.equal(inserts[0].patternOverlayOpacity, 0.32);
});

test("updateCustomizations clears featured link when null is provided", async () => {
  const handler = createUpdateCustomizationsHandler();
  const { ctx, patches } = createMockCtx({
    featuredLink: null,
    existingCustomization: { _id: "customization_123", userId },
  });

  const updatedId = await handler(ctx, {
    featuredLinkId: null,
    profileFields: [],
  });

  assert.equal(updatedId, "customization_123");
  assert.equal(patches.length, 1);
  assert.equal(patches[0].value.featuredLinkId, undefined);
});

test("updateCustomizations deletes replaced profile images", async () => {
  const handler = createUpdateCustomizationsHandler();
  const { ctx, deletedStorageIds, patches } = createMockCtx({
    featuredLink: null,
    existingCustomization: {
      _id: "customization_123",
      userId,
      profilePictureStorageId: "old_profile_image",
    },
  });

  await handler(ctx, {
    profilePictureStorageId: "new_profile_image",
    profileFields: [],
  });

  assert.deepEqual(deletedStorageIds, ["old_profile_image"]);
  assert.equal(patches[0].value.profilePictureStorageId, "new_profile_image");
});
