import assert from "node:assert/strict";
import test from "node:test";

import {
  checkUsernameAvailability,
  getUserIdBySlug,
  setUsername,
} from "./usernames";

type QueryLookup = {
  table: string;
  indexName: string;
  field: string;
  value: string;
};

const createHandler = <TArgs, TResult>(callable: {
  _handler: (ctx: unknown, args: TArgs) => Promise<TResult>;
}) => callable._handler;

const createQueryBuilder = (
  resolve: (lookup: QueryLookup) => {
    unique?: () => Promise<unknown>;
    first?: () => Promise<unknown>;
  },
) => ({
  query: (table: string) => ({
    withIndex: (
      indexName: string,
      apply: (query: {
        eq: (field: string, value: string) => { field: string; value: string };
      }) => { field: string; value: string },
    ) => {
      const lookup = apply({
        eq: (field: string, value: string) => ({ field, value }),
      });

      return resolve({
        table,
        indexName,
        field: lookup.field,
        value: lookup.value,
      });
    },
  }),
});

const createGetUserIdBySlugCtx = ({
  usernameRecord = null,
  hasLinksForSlug = false,
}: {
  usernameRecord?: { userId: string } | null;
  hasLinksForSlug?: boolean;
} = {}) => ({
  db: createQueryBuilder((lookup) => {
    if (lookup.table === "usernames" && lookup.indexName === "by_username") {
      return {
        unique: async () =>
          lookup.value === "johndoe" ? usernameRecord : null,
      };
    }

    if (lookup.table === "links" && lookup.indexName === "by_user_and_order") {
      return {
        first: async () =>
          lookup.value === "user_123" && hasLinksForSlug ? {} : null,
      };
    }

    throw new Error(`Unexpected query: ${lookup.table}.${lookup.indexName}`);
  }),
});

test("getUserIdBySlug returns the mapped user ID for a custom username", async () => {
  const handler = createHandler<{ slug: string }, string | null>(
    getUserIdBySlug as never,
  );
  const ctx = createGetUserIdBySlugCtx({
    usernameRecord: { userId: "user_abc" },
  });

  const userId = await handler(ctx, { slug: "johndoe" });

  assert.equal(userId, "user_abc");
});

test("getUserIdBySlug normalizes username slugs before lookup", async () => {
  const handler = createHandler<{ slug: string }, string | null>(
    getUserIdBySlug as never,
  );
  const ctx = createGetUserIdBySlugCtx({
    usernameRecord: { userId: "user_abc" },
  });

  const userId = await handler(ctx, { slug: " JohnDoe " });

  assert.equal(userId, "user_abc");
});

test("getUserIdBySlug falls back to the slug when it matches a user with links", async () => {
  const handler = createHandler<{ slug: string }, string | null>(
    getUserIdBySlug as never,
  );
  const ctx = createGetUserIdBySlugCtx({
    hasLinksForSlug: true,
  });

  const userId = await handler(ctx, { slug: "user_123" });

  assert.equal(userId, "user_123");
});

test("getUserIdBySlug returns null for an unknown public slug", async () => {
  const handler = createHandler<{ slug: string }, string | null>(
    getUserIdBySlug as never,
  );
  const ctx = createGetUserIdBySlugCtx();

  const userId = await handler(ctx, { slug: "missing-user" });

  assert.equal(userId, null);
});

const createAvailabilityCtx = ({
  existingUsername = null,
}: {
  existingUsername?: { userId: string } | null;
} = {}) => {
  const lookups: QueryLookup[] = [];

  return {
    ctx: {
      db: createQueryBuilder((lookup) => {
        lookups.push(lookup);

        if (
          lookup.table === "usernames" &&
          lookup.indexName === "by_username"
        ) {
          return {
            unique: async () => existingUsername,
          };
        }

        throw new Error(
          `Unexpected query: ${lookup.table}.${lookup.indexName}`,
        );
      }),
    },
    lookups,
  };
};

test("checkUsernameAvailability trims and lowercases before lookup", async () => {
  const handler = createHandler<
    { username: string },
    { available: boolean; error?: string }
  >(checkUsernameAvailability as never);
  const { ctx, lookups } = createAvailabilityCtx();

  const result = await handler(ctx, { username: " Jane_Doe " });

  assert.deepEqual(result, { available: true });
  assert.equal(lookups[0]?.value, "jane_doe");
});

test("checkUsernameAvailability rejects reserved usernames", async () => {
  const handler = createHandler<
    { username: string },
    { available: boolean; error?: string }
  >(checkUsernameAvailability as never);
  const { ctx, lookups } = createAvailabilityCtx();

  const result = await handler(ctx, { username: "Dashboard" });

  assert.deepEqual(result, {
    available: false,
    error: "This username is reserved",
  });
  assert.deepEqual(lookups, []);
});

const createSetUsernameCtx = ({
  existingUsername = null,
  currentRecord = null,
}: {
  existingUsername?: { _id: string; userId: string; username: string } | null;
  currentRecord?: { _id: string; userId: string; username: string } | null;
} = {}) => {
  const patches: Array<{ id: string; value: { username: string } }> = [];
  const inserts: Array<{ userId: string; username: string }> = [];

  return {
    ctx: {
      auth: {
        getUserIdentity: async () => ({ subject: "user_123" }),
      },
      db: {
        ...createQueryBuilder((lookup) => {
          if (
            lookup.table === "usernames" &&
            lookup.indexName === "by_username"
          ) {
            return {
              unique: async () => existingUsername,
            };
          }

          if (
            lookup.table === "usernames" &&
            lookup.indexName === "by_user_id"
          ) {
            return {
              unique: async () => currentRecord,
            };
          }

          throw new Error(
            `Unexpected query: ${lookup.table}.${lookup.indexName}`,
          );
        }),
        patch: async (id: string, value: { username: string }) => {
          patches.push({ id, value });
        },
        insert: async (
          _table: "usernames",
          value: (typeof inserts)[number],
        ) => {
          inserts.push(value);
        },
      },
    },
    inserts,
    patches,
  };
};

test("setUsername stores normalized usernames", async () => {
  const handler = createHandler<
    { username: string },
    { success: boolean; error?: string }
  >(setUsername as never);
  const { ctx, inserts } = createSetUsernameCtx();

  const result = await handler(ctx, { username: " Jane_Doe " });

  assert.deepEqual(result, { success: true });
  assert.deepEqual(inserts, [{ userId: "user_123", username: "jane_doe" }]);
});

test("setUsername rejects usernames owned by another user", async () => {
  const handler = createHandler<
    { username: string },
    { success: boolean; error?: string }
  >(setUsername as never);
  const { ctx, inserts, patches } = createSetUsernameCtx({
    existingUsername: {
      _id: "username_1",
      userId: "user_other",
      username: "jane_doe",
    },
  });

  const result = await handler(ctx, { username: "Jane_Doe" });

  assert.deepEqual(result, {
    success: false,
    error: "Username is already taken",
  });
  assert.deepEqual(inserts, []);
  assert.deepEqual(patches, []);
});
