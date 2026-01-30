/**
 * @jest-environment node
 */
import { POST } from "./route";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { compare } from "bcryptjs";

// Mock dependencies
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    session: {
      create: jest.fn(),
    },
  },
}));

jest.mock("@/lib/rate-limit", () => ({
  rateLimit: jest.fn(),
  getClientIp: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

// Helper to create mock request
function createRequest(body: object, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

// Mock user factory
function createMockUser(overrides = {}) {
  return {
    id: "user-123",
    name: "Test User",
    email: "test@example.com",
    password: "hashed-password",
    isActive: true,
    failedLoginAttempts: 0,
    lockedUntil: null,
    ...overrides,
  };
}

describe("POST /api/auth/signin", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mocks
    (getClientIp as jest.Mock).mockReturnValue("127.0.0.1");
    (rateLimit as jest.Mock).mockReturnValue({
      success: true,
      remaining: 4,
      resetTime: Date.now() + 60000,
    });
  });

  describe("Rate Limiting", () => {
    it("returns 400 when client IP cannot be determined", async () => {
      (getClientIp as jest.Mock).mockReturnValue(null);

      const request = createRequest({
        email: "test@example.com",
        password: "password123",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Cannot process request.");
    });

    it("returns 429 when rate limit is exceeded", async () => {
      const resetTime = Date.now() + 30000;
      (rateLimit as jest.Mock).mockReturnValue({
        success: false,
        remaining: 0,
        resetTime,
      });

      const request = createRequest({
        email: "test@example.com",
        password: "password123",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toBe(
        "Too many login attempts. Please try again later.",
      );
      expect(response.headers.get("Retry-After")).toBeDefined();
    });

    it("allows requests within rate limit", async () => {
      (rateLimit as jest.Mock).mockReturnValue({
        success: true,
        remaining: 3,
        resetTime: Date.now() + 60000,
      });
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

      const request = createRequest({
        email: "test@example.com",
        password: "password123",
      });
      const response = await POST(request);

      // Should proceed past rate limiting (will fail for other reasons)
      expect(rateLimit).toHaveBeenCalledWith("signin:127.0.0.1", {
        maxRequests: 5,
        windowMs: 60000,
      });
    });
  });

  describe("Request Validation", () => {
    it("returns 400 when email is missing", async () => {
      const request = createRequest({ password: "password123" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Email and password are required");
    });

    it("returns 400 when password is missing", async () => {
      const request = createRequest({ email: "test@example.com" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Email and password are required");
    });

    it("returns 400 when both email and password are missing", async () => {
      const request = createRequest({});
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Email and password are required");
    });
  });

  describe("User Lookup", () => {
    it("returns 401 when user is not found", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

      const request = createRequest({
        email: "nonexistent@example.com",
        password: "password123",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Invalid email or password");
    });

    it("returns 401 when user has no password (OAuth account)", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(
        createMockUser({ password: null }),
      );

      const request = createRequest({
        email: "oauth@example.com",
        password: "password123",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Invalid email or password");
    });

    it("normalizes email to lowercase for lookup", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

      const request = createRequest({
        email: "  TEST@EXAMPLE.COM  ",
        password: "password123",
      });
      await POST(request);

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          email: { equals: "test@example.com", mode: "insensitive" },
        },
      });
    });
  });

  describe("Inactive User", () => {
    it("returns 401 when user is inactive", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(
        createMockUser({ isActive: false }),
      );

      const request = createRequest({
        email: "inactive@example.com",
        password: "password123",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Invalid email or password");
    });
  });

  describe("Account Lockout", () => {
    it("returns 423 when account is locked", async () => {
      const lockedUntil = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(
        createMockUser({ lockedUntil }),
      );

      const request = createRequest({
        email: "locked@example.com",
        password: "password123",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(423);
      expect(data.error).toMatch(/Account temporarily locked/);
      expect(data.error).toMatch(/\d+ minutes/);
    });

    it("allows login when lockout has expired", async () => {
      const expiredLockout = new Date(Date.now() - 1000); // 1 second ago
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(
        createMockUser({ lockedUntil: expiredLockout }),
      );
      (compare as jest.Mock).mockResolvedValue(true);
      (prisma.session.create as jest.Mock).mockResolvedValue({});

      const request = createRequest({
        email: "test@example.com",
        password: "password123",
      });
      const response = await POST(request);

      expect(response.status).toBe(200);
    });

    it("locks account after 5 failed attempts", async () => {
      const user = createMockUser({ failedLoginAttempts: 4 });
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(user);
      (compare as jest.Mock).mockResolvedValue(false);
      (prisma.user.update as jest.Mock).mockResolvedValue({});

      const request = createRequest({
        email: "test@example.com",
        password: "wrongpassword",
      });
      await POST(request);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 5,
          lockedUntil: expect.any(Date),
        },
      });
    });
  });

  describe("Password Validation", () => {
    it("returns 401 when password is invalid", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(createMockUser());
      (compare as jest.Mock).mockResolvedValue(false);
      (prisma.user.update as jest.Mock).mockResolvedValue({});

      const request = createRequest({
        email: "test@example.com",
        password: "wrongpassword",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Invalid email or password");
    });

    it("increments failed login attempts on invalid password", async () => {
      const user = createMockUser({ failedLoginAttempts: 2 });
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(user);
      (compare as jest.Mock).mockResolvedValue(false);
      (prisma.user.update as jest.Mock).mockResolvedValue({});

      const request = createRequest({
        email: "test@example.com",
        password: "wrongpassword",
      });
      await POST(request);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 3,
          lockedUntil: null,
        },
      });
    });
  });

  describe("Successful Login", () => {
    it("returns 200 with user data on successful login", async () => {
      const user = createMockUser();
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(user);
      (compare as jest.Mock).mockResolvedValue(true);
      (prisma.session.create as jest.Mock).mockResolvedValue({});

      const request = createRequest({
        email: "test@example.com",
        password: "password123",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user).toEqual({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    });

    it("creates a session on successful login", async () => {
      const user = createMockUser();
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(user);
      (compare as jest.Mock).mockResolvedValue(true);
      (prisma.session.create as jest.Mock).mockResolvedValue({});

      const request = createRequest({
        email: "test@example.com",
        password: "password123",
      });
      await POST(request);

      expect(prisma.session.create).toHaveBeenCalledWith({
        data: {
          sessionToken: expect.any(String),
          userId: user.id,
          expires: expect.any(Date),
        },
      });
    });

    it("sets session cookie on successful login", async () => {
      const user = createMockUser();
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(user);
      (compare as jest.Mock).mockResolvedValue(true);
      (prisma.session.create as jest.Mock).mockResolvedValue({});

      const request = createRequest({
        email: "test@example.com",
        password: "password123",
      });
      const response = await POST(request);

      const setCookie = response.headers.get("Set-Cookie");
      expect(setCookie).toBeDefined();
      expect(setCookie).toContain("authjs.session-token=");
      expect(setCookie).toContain("HttpOnly");
      expect(setCookie).toContain("SameSite=lax");
      expect(setCookie).toContain("Path=/");
    });

    it("resets failed login attempts on successful login", async () => {
      const user = createMockUser({ failedLoginAttempts: 3 });
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(user);
      (compare as jest.Mock).mockResolvedValue(true);
      (prisma.session.create as jest.Mock).mockResolvedValue({});
      (prisma.user.update as jest.Mock).mockResolvedValue({});

      const request = createRequest({
        email: "test@example.com",
        password: "password123",
      });
      await POST(request);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      });
    });

    it("does not update user if no prior failed attempts", async () => {
      const user = createMockUser({ failedLoginAttempts: 0 });
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(user);
      (compare as jest.Mock).mockResolvedValue(true);
      (prisma.session.create as jest.Mock).mockResolvedValue({});

      const request = createRequest({
        email: "test@example.com",
        password: "password123",
      });
      await POST(request);

      // user.update should NOT be called to reset attempts when already 0
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    it("returns 500 when database error occurs during user lookup", async () => {
      (prisma.user.findFirst as jest.Mock).mockRejectedValue(
        new Error("Database connection failed"),
      );

      const request = createRequest({
        email: "test@example.com",
        password: "password123",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Something went wrong");
    });

    it("returns 500 when session creation fails", async () => {
      const user = createMockUser();
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(user);
      (compare as jest.Mock).mockResolvedValue(true);
      (prisma.session.create as jest.Mock).mockRejectedValue(
        new Error("Session creation failed"),
      );

      const request = createRequest({
        email: "test@example.com",
        password: "password123",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Something went wrong");
    });

    it("returns 500 when password comparison throws", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(createMockUser());
      (compare as jest.Mock).mockRejectedValue(new Error("Bcrypt error"));

      const request = createRequest({
        email: "test@example.com",
        password: "password123",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Something went wrong");
    });
  });
});
