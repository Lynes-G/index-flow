export type Plan = "free" | "pro" | "ultra";

const planRank: Record<Plan, number> = {
  free: 0,
  pro: 1,
  ultra: 2,
};

export const resolveEffectivePlan = ({
  paidPlan,
  grantedPlan,
  isAdmin = false,
}: {
  paidPlan: Plan;
  grantedPlan: Plan | null;
  isAdmin?: boolean;
}): Plan => {
  if (isAdmin) {
    return "ultra";
  }

  if (!grantedPlan) {
    return paidPlan;
  }

  return planRank[grantedPlan] > planRank[paidPlan] ? grantedPlan : paidPlan;
};

export const canAccessAnalytics = (plan: Plan) => planRank[plan] >= planRank.pro;

export const canAccessUltraFeatures = (plan: Plan) =>
  planRank[plan] >= planRank.ultra;

export const getLinkLimit = (plan: Plan) => {
  if (plan === "ultra") {
    return null;
  }

  return plan === "pro" ? 10 : 3;
};

export const getPaidPlanFromClerkFeatures = ({
  hasAnalyticsFeature,
  hasProCapacityFeature,
  hasUltraCapacityFeature,
}: {
  hasAnalyticsFeature: boolean;
  hasProCapacityFeature: boolean;
  hasUltraCapacityFeature: boolean;
}): Plan => {
  if (hasUltraCapacityFeature) {
    return "ultra";
  }

  if (hasProCapacityFeature || hasAnalyticsFeature) {
    return "pro";
  }

  return "free";
};
