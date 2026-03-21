import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchUser, updateUser } from "./userService";
vi.mock("./supabase.js", () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  },
}));

import { supabase } from "./supabase.js";
function mockChain(finalResponse) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(finalResponse),
  };
  supabase.from.mockReturnValue(chain);
  return chain;
}

// ─────────────────────────────────────────
// shared mock user
// ─────────────────────────────────────────
const MOCK_AUTH_USER = { id: "user-123" };
const MOCK_PROFILE = {
  id: "user-123",
  name: "Maria",
  email: "maria@email.com",
  calorie_goal: 2000,
  weight: 62,
  height: 168,
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ─────────────────────────────────────────
// fetchUser
// ─────────────────────────────────────────
describe("fetchUser", () => {
  it("returns profile data for authenticated user", async () => {
    supabase.auth.getUser.mockResolvedValue({
      data: { user: MOCK_AUTH_USER },
      error: null,
    });
    mockChain({ data: MOCK_PROFILE, error: null });

    const result = await fetchUser();

    expect(result).toEqual(MOCK_PROFILE);
  });

  it("queries the profiles table with the correct user id", async () => {
    supabase.auth.getUser.mockResolvedValue({
      data: { user: MOCK_AUTH_USER },
      error: null,
    });
    const chain = mockChain({ data: MOCK_PROFILE, error: null });

    await fetchUser();

    expect(supabase.from).toHaveBeenCalledWith("profiles");
    expect(chain.eq).toHaveBeenCalledWith("id", "user-123");
  });

  it("throws if no authenticated user", async () => {
    supabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    await expect(fetchUser()).rejects.toThrow("No authenticated user");
  });

  it("throws if auth call fails", async () => {
    supabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: "Auth session expired" },
    });

    await expect(fetchUser()).rejects.toThrow("Auth session expired");
  });

  it("throws if profile query fails", async () => {
    supabase.auth.getUser.mockResolvedValue({
      data: { user: MOCK_AUTH_USER },
      error: null,
    });
    mockChain({ data: null, error: { message: "Profile not found" } });

    await expect(fetchUser()).rejects.toThrow("Profile not found");
  });
});

// ─────────────────────────────────────────
// updateUser
// ─────────────────────────────────────────
describe("updateUser", () => {
  it("returns updated profile data", async () => {
    const updates = { name: "Maria J.", calorie_goal: 1800 };
    const updatedProfile = { ...MOCK_PROFILE, ...updates };

    supabase.auth.getUser.mockResolvedValue({
      data: { user: MOCK_AUTH_USER },
      error: null,
    });
    mockChain({ data: updatedProfile, error: null });

    const result = await updateUser(updates);

    expect(result).toEqual(updatedProfile);
  });

  it("sends the correct updates to the profiles table", async () => {
    const updates = { name: "Maria J." };

    supabase.auth.getUser.mockResolvedValue({
      data: { user: MOCK_AUTH_USER },
      error: null,
    });
    const chain = mockChain({
      data: { ...MOCK_PROFILE, ...updates },
      error: null,
    });

    await updateUser(updates);

    expect(supabase.from).toHaveBeenCalledWith("profiles");
    expect(chain.update).toHaveBeenCalledWith(updates);
    expect(chain.eq).toHaveBeenCalledWith("id", "user-123");
  });

  it("throws if no authenticated user", async () => {
    supabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    await expect(updateUser({ name: "x" })).rejects.toThrow(
      "No authenticated user",
    );
  });

  it("throws if auth call fails", async () => {
    supabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: "Token expired" },
    });

    await expect(updateUser({ name: "x" })).rejects.toThrow("Token expired");
  });

  it("throws if update query fails", async () => {
    supabase.auth.getUser.mockResolvedValue({
      data: { user: MOCK_AUTH_USER },
      error: null,
    });
    mockChain({ data: null, error: { message: "Update failed" } });

    await expect(updateUser({ name: "x" })).rejects.toThrow("Update failed");
  });
});
