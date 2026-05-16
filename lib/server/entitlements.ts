import "server-only";

import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import {
  canAccessAnalytics,
  canAccessUltraFeatures,
  getLinkLimit,
  getPaidPlanFromClerkFeatures,
  resolveEffectivePlan,
  type Plan,
} from "@/lib/entitlements";

export const getCurrentUserEntitlements = async () => {
  const { has, userId } = await auth();

  if (!userId) {
    return {
      userId: null,
      paidPlan: "free" as Plan,
      grantedPlan: null as Plan | null,
      effectivePlan: "free" as Plan,
      canAccessAnalytics: false,
      canAccessUltraFeatures: false,
      linkLimit: 3,
    };
  }

  const paidPlan = getPaidPlanFromClerkFeatures({
    hasAnalyticsFeature: has({ feature: "analytics" }),
    hasProCapacityFeature: has({ feature: "pro_capacity" }),
    hasUltraCapacityFeature: has({ feature: "ultra_capacity" }),
  });

  const grant = await fetchQuery(api.lib.planEntitlements.getActivePlanGrantForUser, {
    userId,
  });
  const grantedPlan = grant?.plan ?? null;
  const effectivePlan = resolveEffectivePlan({
    paidPlan,
    grantedPlan,
  });

  return {
    userId,
    paidPlan,
    grantedPlan,
    effectivePlan,
    canAccessAnalytics: canAccessAnalytics(effectivePlan),
    canAccessUltraFeatures: canAccessUltraFeatures(effectivePlan),
    linkLimit: getLinkLimit(effectivePlan),
  };
};
