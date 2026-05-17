import assert from "node:assert/strict";
import test from "node:test";

import { revokeInvite } from "./planEntitlements";

const adminUserId = "user_3Dqd9CzRKYPQYUtBl7rpdfg308X";
process.env.ADMIN_USER_IDS = adminUserId;

type MockInvite = {
  _id: string;
  status: "draft" | "sent" | "accepted" | "revoked";
  acceptedByUserId?: string;
};

type MockGrant = {
  _id: string;
  inviteId: string;
};

const createMockCtx = ({
  invite,
  grants = [],
}: {
  invite: MockInvite | null;
  grants?: MockGrant[];
}) => {
  const deletedIds: string[] = [];

  return {
    ctx: {
      auth: {
        getUserIdentity: async () => ({ subject: adminUserId }),
      },
      db: {
        get: async (id: string) => (invite?._id === id ? invite : null),
        query: (table: string) => ({
          withIndex: (
            indexName: string,
            apply: (query: { eq: (field: string, value: string) => { field: string; value: string } }) => {
              field: string;
              value: string;
            },
          ) => {
            const lookup = apply({
              eq: (field: string, value: string) => ({ field, value }),
            });

            return {
              collect: async () => {
                if (table === "planGrants" && indexName === "by_invite_id") {
                  return grants.filter((grant) => grant.inviteId === lookup.value);
                }

                return [];
              },
            };
          },
        }),
        delete: async (id: string) => {
          deletedIds.push(id);
        },
      },
    },
    deletedIds,
  };
};

test("revokeInvite deletes an accepted invite and its grants", async () => {
  const { ctx, deletedIds } = createMockCtx({
    invite: {
      _id: "invite_123",
      status: "accepted",
      acceptedByUserId: "user_claimed",
    },
    grants: [{ _id: "grant_123", inviteId: "invite_123" }],
  });

  const revokeInviteHandler = (
    revokeInvite as typeof revokeInvite & {
      _handler: (
        ctx: unknown,
        args: { inviteId: string },
      ) => Promise<null>;
    }
  )._handler;

  await revokeInviteHandler(ctx, { inviteId: "invite_123" });

  assert.deepEqual(deletedIds, ["grant_123", "invite_123"]);
});
