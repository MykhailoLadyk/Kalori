import { supabase } from "./supabase";

export const AI_COIN_COST = 50;
export const PRO_DAILY_LIMIT = 100;

export const SUBSCRIPTION_STATUSES = {
  ACTIVE: "active",
  TRIALING: "trialing",
  PAST_DUE: "past_due",
  CANCELED: "canceled",
  INCOMPLETE: "incomplete",
};

export const PRO_PLANS = [
  {
    id: "1month",
    name: "1 Month Pro",
    title: "Monthly",
    price: "$4.99",
    period: "/ month",
    billingDesc: "Billed monthly. Cancel anytime.",
    badge: null,
    isBestValue: false,
    dailyLimit: PRO_DAILY_LIMIT,
  },
  {
    id: "6months",
    name: "6 Months Pro",
    title: "6 Months",
    price: "$19.99",
    period: "/ 6 months",
    pricePerMonth: "$3.33 / mo",
    billingDesc: "Billed every 6 months ($3.33/mo). Cancel anytime.",
    badge: "SAVE 33%",
    isBestValue: true,
    dailyLimit: PRO_DAILY_LIMIT,
  },
];

export const PRO_FEATURES = [
  {
    icon: "sparkles",
    title: "High Daily AI Scans",
    desc: "Up to 100 AI meal analyses per day with 0 coin cost",
  },
  {
    icon: "camera",
    title: "AI Photo Food Scanner",
    desc: "Instant calorie and macro breakdown from any meal photo",
  },
  {
    icon: "mic",
    title: "Natural Language Logging",
    desc: "Describe what you ate in plain text and get instant estimates",
  },
  {
    icon: "adjust",
    title: "Smart AI Clarifications",
    desc: "Fine-tune ingredients, portions, cooking oils, and toppings",
  },
  {
    icon: "shield",
    title: "Bonus Streak Protection",
    desc: "Extra streak safety shields to safeguard your consistency",
  },
  {
    icon: "crown",
    title: "Exclusive Pro Profile Badge",
    desc: "Show off your Pro status with special gold accents",
  },
];

/**
 * Checks if a subscription record represents an active Pro subscriber.
 * Status must be 'active' or 'trialing', and if current_period_end is provided,
 * it must be in the future.
 */
export function isProUser(subscription) {
  if (!subscription) return false;
  
  const activeStatuses = [SUBSCRIPTION_STATUSES.ACTIVE, SUBSCRIPTION_STATUSES.TRIALING];
  if (!activeStatuses.includes(subscription.status)) {
    return false;
  }

  if (subscription.current_period_end) {
    const periodEnd = new Date(subscription.current_period_end);
    if (periodEnd.getTime() < Date.now()) {
      return false;
    }
  }

  return true;
}

/**
 * Returns formatted details for the given subscription.
 */
export function getSubscriptionDetails(subscription) {
  if (!subscription) {
    return {
      isPro: false,
      status: "free",
      statusLabel: "Free Tier",
      planName: "Free",
      periodEnd: null,
      cancelAtPeriodEnd: false,
    };
  }

  const isPro = isProUser(subscription);
  const status = subscription.status || "free";

  let statusLabel = "Free Tier";
  if (status === SUBSCRIPTION_STATUSES.ACTIVE) statusLabel = "Active";
  else if (status === SUBSCRIPTION_STATUSES.TRIALING) statusLabel = "Trialing";
  else if (status === SUBSCRIPTION_STATUSES.PAST_DUE) statusLabel = "Past Due";
  else if (status === SUBSCRIPTION_STATUSES.CANCELED) statusLabel = "Canceled";
  else if (status === SUBSCRIPTION_STATUSES.INCOMPLETE) statusLabel = "Incomplete";

  const planObj = PRO_PLANS.find((p) => p.id === subscription.plan_id) || PRO_PLANS[0];

  return {
    isPro,
    status,
    statusLabel,
    planName: planObj?.name || "Pro Plan",
    periodEnd: subscription.current_period_end ? new Date(subscription.current_period_end) : null,
    cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
  };
}

let hasWarnedSubPermission = false;

/**
 * Fetches the user's latest subscription from the separate `subscriptions` table.
 */
export async function fetchUserSubscription() {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) return null;

    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      if (!hasWarnedSubPermission && error.code !== "PGRST116") {
        console.warn(
          "Notice: Could not query 'subscriptions' table (defaulting to Free Tier). Run the provided SQL migration in Supabase SQL editor to enable the subscriptions table.",
          error.message
        );
        hasWarnedSubPermission = true;
      }
      return null;
    }

    return data;
  } catch (err) {
    if (!hasWarnedSubPermission) {
      console.warn("Failed to fetch user subscription:", err);
      hasWarnedSubPermission = true;
    }
    return null;
  }
}

