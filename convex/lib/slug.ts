import type { DatabaseReader } from "../_generated/server";

const normalizeUsernameSlug = (slug: string) => slug.trim().toLowerCase();

const findUsernameRecordBySlug = async (db: DatabaseReader, slug: string) => {
  const trimmedSlug = slug.trim();
  const normalizedSlug = normalizeUsernameSlug(trimmedSlug);

  const exactUsernameRecord = await db
    .query("usernames")
    .withIndex("by_username", (q) => q.eq("username", trimmedSlug))
    .unique();

  if (exactUsernameRecord) {
    return exactUsernameRecord;
  }

  if (normalizedSlug !== trimmedSlug) {
    const normalizedUsernameRecord = await db
      .query("usernames")
      .withIndex("by_username", (q) => q.eq("username", normalizedSlug))
      .unique();

    if (normalizedUsernameRecord) {
      return normalizedUsernameRecord;
    }
  }

  const usernameRecords = await db.query("usernames").collect();
  return (
    usernameRecords.find(
      (record) => normalizeUsernameSlug(record.username) === normalizedSlug,
    ) ?? null
  );
};

export const getUserIdForUsernameSlug = async (
  db: DatabaseReader,
  slug: string,
) => {
  const usernameRecord = await findUsernameRecordBySlug(db, slug);
  return usernameRecord?.userId ?? null;
};

export const resolveUserIdFromSlug = async (
  db: DatabaseReader,
  slug: string,
) => {
  return (await getUserIdForUsernameSlug(db, slug)) ?? slug.trim();
};
