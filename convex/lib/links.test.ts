import assert from "node:assert/strict";
import test from "node:test";

import { getTrackableLink, updateLinkOrder } from "./links";

const userId = "user_123";

type MockLink = {
  _id: string;
  userId: string;
  order: number;
  title?: string;
  url?: string;
};

const createUpdateLinkOrderHandler = () =>
  (
    updateLinkOrder as typeof updateLinkOrder & {
      _handler: (ctx: unknown, args: { linkIds: string[] }) => Promise<null>;
    }
  )._handler;

const createMockCtx = (links: Record<string, MockLink | null>) => {
  const patches: Array<{ id: string; value: { order: number } }> = [];

  return {
    ctx: {
      auth: {
        getUserIdentity: async () => ({ subject: userId }),
      },
      db: {
        get: async (id: string) => links[id] ?? null,
        patch: async (id: string, value: { order: number }) => {
          patches.push({ id, value });
        },
      },
    },
    patches,
  };
};

test("updateLinkOrder rejects duplicate link IDs", async () => {
  const handler = createUpdateLinkOrderHandler();
  const { ctx, patches } = createMockCtx({
    link_1: { _id: "link_1", userId, order: 0 },
  });

  await assert.rejects(
    handler(ctx, { linkIds: ["link_1", "link_1"] }),
    /Duplicate links are not allowed/,
  );

  assert.deepEqual(patches, []);
});

test("updateLinkOrder rejects links the current user does not own", async () => {
  const handler = createUpdateLinkOrderHandler();
  const { ctx, patches } = createMockCtx({
    link_1: { _id: "link_1", userId, order: 0 },
    link_2: { _id: "link_2", userId: "user_other", order: 1 },
  });

  await assert.rejects(
    handler(ctx, { linkIds: ["link_1", "link_2"] }),
    /Invalid link order payload/,
  );

  assert.deepEqual(patches, []);
});

test("updateLinkOrder patches each owned link in the requested order", async () => {
  const handler = createUpdateLinkOrderHandler();
  const { ctx, patches } = createMockCtx({
    link_1: { _id: "link_1", userId, order: 1 },
    link_2: { _id: "link_2", userId, order: 0 },
  });

  await handler(ctx, { linkIds: ["link_2", "link_1"] });

  assert.deepEqual(patches, [
    { id: "link_2", value: { order: 0 } },
    { id: "link_1", value: { order: 1 } },
  ]);
});

const createGetTrackableLinkHandler = () =>
  (
    getTrackableLink as typeof getTrackableLink & {
      _handler: (
        ctx: unknown,
        args: { userId: string; linkId: string },
      ) => Promise<{ title: string; url: string } | null>;
    }
  )._handler;

const createTrackableLinkCtx = (links: Record<string, MockLink | null>) => ({
  db: {
    normalizeId: (_table: "links", id: string) =>
      id.startsWith("link_") ? id : null,
    get: async (id: string) => links[id] ?? null,
  },
});

test("getTrackableLink reads a single link by id", async () => {
  const handler = createGetTrackableLinkHandler();

  const result = await handler(
    createTrackableLinkCtx({
      link_1: {
        _id: "link_1",
        userId,
        order: 0,
        title: "Portfolio",
        url: "https://example.com",
      },
    }),
    { userId, linkId: "link_1" },
  );

  assert.deepEqual(result, {
    title: "Portfolio",
    url: "https://example.com",
  });
});

test("getTrackableLink rejects malformed ids and links owned by other users", async () => {
  const handler = createGetTrackableLinkHandler();

  assert.equal(
    await handler(createTrackableLinkCtx({}), {
      userId,
      linkId: "not-a-link-id",
    }),
    null,
  );

  assert.equal(
    await handler(
      createTrackableLinkCtx({
        link_2: {
          _id: "link_2",
          userId: "user_other",
          order: 0,
          title: "Other",
          url: "https://example.com",
        },
      }),
      { userId, linkId: "link_2" },
    ),
    null,
  );
});
