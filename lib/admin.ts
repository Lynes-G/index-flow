const normalizeList = (value: string | undefined) =>
  (value ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

export const getAdminUserIds = () => normalizeList(process.env.ADMIN_USER_IDS);

export const isAdminUserId = (userId: string | null | undefined) => {
  if (!userId) {
    return false;
  }

  return getAdminUserIds().includes(userId);
};
