import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkRateLimit, resetRateLimitsForTests } from "@/lib/rate-limit";

describe("in-memory rate limiter", () => {
  beforeEach(() => {
    resetRateLimitsForTests();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-08T00:00:00Z"));
  });

  it("allows requests under the limit and blocks over-limit requests", () => {
    expect(checkRateLimit("user:1", 2, 1000).ok).toBe(true);
    expect(checkRateLimit("user:1", 2, 1000).ok).toBe(true);

    const third = checkRateLimit("user:1", 2, 1000);

    expect(third.ok).toBe(false);
  });

  it("resets after the window expires", () => {
    expect(checkRateLimit("user:1", 1, 1000).ok).toBe(true);
    expect(checkRateLimit("user:1", 1, 1000).ok).toBe(false);

    vi.advanceTimersByTime(1001);

    expect(checkRateLimit("user:1", 1, 1000).ok).toBe(true);
  });
});
