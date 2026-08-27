import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  isProUser,
  getSubscriptionDetails,
  SUBSCRIPTION_STATUSES,
  PRO_PLANS,
  AI_COIN_COST,
  PRO_DAILY_LIMIT,
  fetchUserSubscription,
} from "../services/subscriptionService";

vi.mock("../services/supabase", () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  },
}));

import { supabase } from "../services/supabase";

function mockChain(finalResponse) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue(finalResponse),
  };
  supabase.from.mockReturnValue(chain);
  return chain;
}

describe("subscriptionService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Constants", () => {
    it("has correct AI coin cost and Pro daily limit", () => {
      expect(AI_COIN_COST).toBe(50);
      expect(PRO_DAILY_LIMIT).toBe(100);
    });

    it("defines 1month and 6months plans", () => {
      expect(PRO_PLANS).toHaveLength(2);
      expect(PRO_PLANS[0].id).toBe("1month");
      expect(PRO_PLANS[1].id).toBe("6months");
      expect(PRO_PLANS[1].isBestValue).toBe(true);
    });
  });

  describe("isProUser", () => {
    it("returns false for null or undefined subscription", () => {
      expect(isProUser(null)).toBe(false);
      expect(isProUser(undefined)).toBe(false);
    });

    it("returns true for active subscription with future period end", () => {
      const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const sub = {
        status: SUBSCRIPTION_STATUSES.ACTIVE,
        current_period_end: futureDate,
        cancel_at_period_end: false,
      };
      expect(isProUser(sub)).toBe(true);
    });

    it("returns true for trialing subscription with future period end", () => {
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const sub = {
        status: SUBSCRIPTION_STATUSES.TRIALING,
        current_period_end: futureDate,
      };
      expect(isProUser(sub)).toBe(true);
    });

    it("returns false for expired active subscription", () => {
      const pastDate = new Date(Date.now() - 10000).toISOString();
      const sub = {
        status: SUBSCRIPTION_STATUSES.ACTIVE,
        current_period_end: pastDate,
      };
      expect(isProUser(sub)).toBe(false);
    });

    it("returns false for past_due status", () => {
      const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const sub = {
        status: SUBSCRIPTION_STATUSES.PAST_DUE,
        current_period_end: futureDate,
      };
      expect(isProUser(sub)).toBe(false);
    });

    it("returns false for canceled status", () => {
      const sub = {
        status: SUBSCRIPTION_STATUSES.CANCELED,
      };
      expect(isProUser(sub)).toBe(false);
    });

    it("returns false for incomplete status", () => {
      const sub = {
        status: SUBSCRIPTION_STATUSES.INCOMPLETE,
      };
      expect(isProUser(sub)).toBe(false);
    });
  });

  describe("getSubscriptionDetails", () => {
    it("returns free details for null subscription", () => {
      const details = getSubscriptionDetails(null);
      expect(details.isPro).toBe(false);
      expect(details.status).toBe("free");
      expect(details.statusLabel).toBe("Free Tier");
    });

    it("returns correct formatted details for active 6months plan", () => {
      const futureDate = new Date("2026-12-31T23:59:59Z");
      const sub = {
        status: "active",
        plan_id: "6months",
        current_period_end: futureDate.toISOString(),
        cancel_at_period_end: true,
      };

      const details = getSubscriptionDetails(sub);
      expect(details.isPro).toBe(true);
      expect(details.status).toBe("active");
      expect(details.statusLabel).toBe("Active");
      expect(details.planName).toBe("6 Months Pro");
      expect(details.cancelAtPeriodEnd).toBe(true);
      expect(details.periodEnd).toEqual(futureDate);
    });
  });

  describe("fetchUserSubscription", () => {
    it("fetches subscription from subscriptions table for authenticated user", async () => {
      supabase.auth.getUser.mockResolvedValue({
        data: { user: { id: "user-abc" } },
        error: null,
      });

      const mockSub = {
        id: "sub-123",
        user_id: "user-abc",
        status: "active",
        plan_id: "1month",
      };

      const chain = mockChain({ data: mockSub, error: null });

      const result = await fetchUserSubscription();

      expect(supabase.from).toHaveBeenCalledWith("subscriptions");
      expect(chain.eq).toHaveBeenCalledWith("user_id", "user-abc");
      expect(result).toEqual(mockSub);
    });

    it("returns null if no authenticated user", async () => {
      supabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await fetchUserSubscription();
      expect(result).toBeNull();
    });
  });
});
