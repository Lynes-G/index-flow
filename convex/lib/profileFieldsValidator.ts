import { v } from "convex/values";

export const profileFieldTypeValidator = v.union(
  v.literal("phone"),
  v.literal("email"),
  v.literal("freeText"),
);

export const profileFieldValidator = v.object({
  id: v.string(),
  type: profileFieldTypeValidator,
  title: v.optional(v.string()),
  value: v.optional(v.string()),
  country: v.optional(v.string()),
});

export const profileFieldsValidator = v.optional(v.array(profileFieldValidator));
