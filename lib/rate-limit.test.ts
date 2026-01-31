/**
 * @jest-environment node
 */
import { rateLimit, getClientIp } from "./rate-limit";

describe("rateLimit", () => {
  // Use unique identifiers for each test to avoid shared state issues
  let testId = 0;
  const getUniqueId = (prefix: string) => `${prefix}-${Date.now()}-${++testId}`;

  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("First Request", () => {
    it("allows first request and creates new entry", () => {
      const result = rateLimit(getUniqueId("first-request"), {
        maxRequests: 5,
        windowMs: 60000,
      });

      expect(result.success).toBe(true);
      expect(result.remaining).toBe(4);
      expect(result.resetTime).toBeGreaterThan(Date.now());
    });

    it("uses default configuration when not provided", () => {
      const result = rateLimit(getUniqueId("default-config"));

      expect(result.success).toBe(true);
      expect(result.remaining).toBe(4); // Default maxRequests is 5
    });
  });

  describe("Subsequent Requests", () => {
    it("increments count on subsequent requests", () => {
      const identifier = getUniqueId("increment-count");
      const config = { maxRequests: 5, windowMs: 60000 };

      const first = rateLimit(identifier, config);
      expect(first.remaining).toBe(4);

      const second = rateLimit(identifier, config);
      expect(second.remaining).toBe(3);

      const third = rateLimit(identifier, config);
      expect(third.remaining).toBe(2);
    });

    it("allows requests within limit", () => {
      const identifier = getUniqueId("within-limit");
      const config = { maxRequests: 3, windowMs: 60000 };

      expect(rateLimit(identifier, config).success).toBe(true); // 1st
      expect(rateLimit(identifier, config).success).toBe(true); // 2nd
      expect(rateLimit(identifier, config).success).toBe(true); // 3rd
    });

    it("blocks requests exceeding limit", () => {
      const identifier = getUniqueId("exceed-limit");
      const config = { maxRequests: 3, windowMs: 60000 };

      rateLimit(identifier, config); // 1st
      rateLimit(identifier, config); // 2nd
      rateLimit(identifier, config); // 3rd

      const blocked = rateLimit(identifier, config); // 4th - should be blocked
      expect(blocked.success).toBe(false);
      expect(blocked.remaining).toBe(0);
    });

    it("continues blocking after limit exceeded", () => {
      const identifier = getUniqueId("continue-block");
      const config = { maxRequests: 2, windowMs: 60000 };

      rateLimit(identifier, config); // 1st
      rateLimit(identifier, config); // 2nd
      rateLimit(identifier, config); // 3rd - blocked
      const fourthAttempt = rateLimit(identifier, config); // 4th - still blocked

      expect(fourthAttempt.success).toBe(false);
      expect(fourthAttempt.remaining).toBe(0);
    });
  });

  describe("Window Expiration", () => {
    it("resets count after window expires", () => {
      const identifier = getUniqueId("window-expire");
      const config = { maxRequests: 3, windowMs: 60000 };

      // Make requests
      rateLimit(identifier, config);
      rateLimit(identifier, config);
      rateLimit(identifier, config);

      // Should be blocked
      expect(rateLimit(identifier, config).success).toBe(false);

      // Fast-forward time past window
      jest.advanceTimersByTime(60001);

      // Should allow new requests
      const result = rateLimit(identifier, config);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(2);
    });

    it("creates new window with fresh count", () => {
      const identifier = getUniqueId("new-window");
      const config = { maxRequests: 5, windowMs: 30000 };

      // Use up 3 requests
      rateLimit(identifier, config);
      rateLimit(identifier, config);
      rateLimit(identifier, config);

      // Advance past window
      jest.advanceTimersByTime(30001);

      // New window should start fresh
      const result = rateLimit(identifier, config);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(4); // Fresh count
    });
  });

  describe("Multiple Identifiers", () => {
    it("tracks different identifiers separately", () => {
      const config = { maxRequests: 2, windowMs: 60000 };
      const user1 = getUniqueId("user-1");
      const user2 = getUniqueId("user-2");

      // User 1 makes 2 requests
      rateLimit(user1, config);
      rateLimit(user1, config);

      // User 1 should be blocked
      expect(rateLimit(user1, config).success).toBe(false);

      // User 2 should still be allowed
      expect(rateLimit(user2, config).success).toBe(true);
    });

    it("does not interfere with other identifiers", () => {
      const config = { maxRequests: 3, windowMs: 60000 };
      const user1 = getUniqueId("user-a");
      const user2 = getUniqueId("user-b");

      rateLimit(user1, config);
      rateLimit(user2, config);
      rateLimit(user1, config);
      rateLimit(user2, config);

      const user1Result = rateLimit(user1, config);
      const user2Result = rateLimit(user2, config);

      expect(user1Result.remaining).toBe(0); // 3rd request
      expect(user2Result.remaining).toBe(0); // 3rd request
    });
  });

  describe("Custom Configuration", () => {
    it("respects custom maxRequests", () => {
      const identifier = getUniqueId("custom-max");
      const config = { maxRequests: 10, windowMs: 60000 };

      for (let i = 0; i < 10; i++) {
        expect(rateLimit(identifier, config).success).toBe(true);
      }

      expect(rateLimit(identifier, config).success).toBe(false);
    });

    it("respects custom windowMs", () => {
      const identifier = getUniqueId("custom-window");
      const config = { maxRequests: 2, windowMs: 5000 };

      rateLimit(identifier, config);
      rateLimit(identifier, config);

      expect(rateLimit(identifier, config).success).toBe(false);

      jest.advanceTimersByTime(5001);

      expect(rateLimit(identifier, config).success).toBe(true);
    });
  });

  describe("Reset Time", () => {
    it("returns correct reset time for new entry", () => {
      const now = Date.now();
      const config = { maxRequests: 5, windowMs: 60000 };

      const result = rateLimit(getUniqueId("reset-time"), config);

      expect(result.resetTime).toBeGreaterThanOrEqual(now + 60000);
      expect(result.resetTime).toBeLessThanOrEqual(now + 60100); // Small buffer
    });

    it("maintains same reset time within window", () => {
      const config = { maxRequests: 5, windowMs: 60000 };
      const identifier = getUniqueId("same-reset");

      const first = rateLimit(identifier, config);
      const second = rateLimit(identifier, config);

      expect(second.resetTime).toBe(first.resetTime);
    });
  });
});

describe("getClientIp", () => {
  function createMockRequest(headers: Record<string, string> = {}) {
    return new Request("http://localhost", { headers });
  }

  describe("x-forwarded-for Header", () => {
    it("returns IP from x-forwarded-for header", () => {
      const request = createMockRequest({
        "x-forwarded-for": "192.168.1.1",
      });

      expect(getClientIp(request)).toBe("192.168.1.1");
    });

    it("returns first IP from multiple IPs in x-forwarded-for", () => {
      const request = createMockRequest({
        "x-forwarded-for": "192.168.1.1, 10.0.0.1, 172.16.0.1",
      });

      expect(getClientIp(request)).toBe("192.168.1.1");
    });

    it("trims whitespace from x-forwarded-for IP", () => {
      const request = createMockRequest({
        "x-forwarded-for": "  192.168.1.1  ",
      });

      expect(getClientIp(request)).toBe("192.168.1.1");
    });

    it("trims whitespace from first IP in comma-separated list", () => {
      const request = createMockRequest({
        "x-forwarded-for": " 192.168.1.1 , 10.0.0.1 ",
      });

      expect(getClientIp(request)).toBe("192.168.1.1");
    });
  });

  describe("x-real-ip Header", () => {
    it("returns IP from x-real-ip header", () => {
      const request = createMockRequest({
        "x-real-ip": "10.0.0.1",
      });

      expect(getClientIp(request)).toBe("10.0.0.1");
    });

    it("prioritizes x-forwarded-for over x-real-ip", () => {
      const request = createMockRequest({
        "x-forwarded-for": "192.168.1.1",
        "x-real-ip": "10.0.0.1",
      });

      expect(getClientIp(request)).toBe("192.168.1.1");
    });
  });

  describe("Fallback Behavior", () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it("returns 127.0.0.1 in development when no headers", () => {
      process.env.NODE_ENV = "development";
      const request = createMockRequest();

      expect(getClientIp(request)).toBe("127.0.0.1");
    });

    it("returns 127.0.0.1 in test environment when no headers", () => {
      process.env.NODE_ENV = "test";
      const request = createMockRequest();

      expect(getClientIp(request)).toBe("127.0.0.1");
    });

    it("returns null in production when no headers", () => {
      process.env.NODE_ENV = "production";
      const request = createMockRequest();

      expect(getClientIp(request)).toBe(null);
    });
  });

  describe("IPv6 Addresses", () => {
    it("handles IPv6 addresses in x-forwarded-for", () => {
      const request = createMockRequest({
        "x-forwarded-for": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
      });

      expect(getClientIp(request)).toBe(
        "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
      );
    });

    it("handles IPv6 addresses in x-real-ip", () => {
      const request = createMockRequest({
        "x-real-ip": "::1",
      });

      expect(getClientIp(request)).toBe("::1");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty x-forwarded-for header", () => {
      const request = createMockRequest({
        "x-forwarded-for": "",
      });

      // Should fall through to x-real-ip or fallback
      expect(getClientIp(request)).toBeTruthy();
    });

    it("handles malformed IP addresses", () => {
      const request = createMockRequest({
        "x-forwarded-for": "not-an-ip",
      });

      // Should return the value as-is (validation is not the responsibility of this function)
      expect(getClientIp(request)).toBe("not-an-ip");
    });
  });
});
