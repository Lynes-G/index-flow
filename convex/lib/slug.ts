import type { DatabaseReader } from "../_generated/server";

export const resolveUserIdFromSlug = async (
  db: DatabaseReader,
  slug: string,
) => {
  const usernameRecord = await db
    .query("usernames")
    .withIndex("by_username", (q) => q.eq("username", slug))
    .unique();

  return usernameRecord?.userId ?? slug;
};
