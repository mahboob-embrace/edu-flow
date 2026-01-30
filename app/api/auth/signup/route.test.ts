/**
 * @jest-environment node
 */
import { POST } from "./route";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { hash } from "bcryptjs";

// Mock dependencies
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("@/lib/rate-limit", () => ({
  rateLimit: jest.fn(),
  getClientIp: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

// Helper to create mock request
function createRequest(body: object, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

// Valid signup data factory
function createValidSignupData(overrides = {}) {
  return {
    name: "Test User",
    email: "test@example.com",
    password: "Password123!",
    ...overrides,
  };
}

// Mock created user factory
function createMockUser(overrides = {}) {
  return {
    id: "user-123",
    name: "Test User",
    email: "test@example.com",
    password: "hashed-password",
    isActive: true,
    failedLoginAttempts: 0,
    ...overrides,
  };
}

describe("POST /api/auth/signup", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mocks
    (getClientIp as jest.Mock).mockReturnValue("127.0.0.1");
    (rateLimit as jest.Mock).mockReturnValue({
      success: true,
      remaining: 2,
      resetTime: Date.now() + 60000,
    });
    (hash as jest.Mock).mockResolvedValue("hashed-password");
  });

  describe("Rate Limiting", () => {
    it("returns 400 when client IP cannot be determined", async () => {
      (getClientIp as jest.Mock).mockReturnValue(null);

      const request = createRequest(createValidSignupData());
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

      const request = createRequest(createValidSignupData());
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toBe(
        "Too many signup attempts. Please try again later.",
      );
      expect(response.headers.get("Retry-After")).toBeDefined();
    });

    it("allows requests within rate limit", async () => {
      (rateLimit as jest.Mock).mockReturnValue({
        success: true,
        remaining: 2,
        resetTime: Date.now() + 60000,
      });
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(createMockUser());

      const request = createRequest(createValidSignupData());
      await POST(request);

      expect(rateLimit).toHaveBeenCalledWith("signup:127.0.0.1", {
        maxRequests: 3,
        windowMs: 60000,
      });
    });
  });

  describe("Request Validation", () => {
    it("returns 400 when name is missing", async () => {
      const request = createRequest({
        email: "test@example.com",
        password: "Password123!",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it("returns 400 when name is empty", async () => {
      const request = createRequest(createValidSignupData({ name: "" }));
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Name is required");
    });

    it("returns 400 when email is missing", async () => {
      const request = createRequest({
        name: "Test User",
        password: "Password123!",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it("returns 400 when email is invalid", async () => {
      const request = createRequest(
        createValidSignupData({ email: "invalid-email" }),
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid email address");
    });

    it("returns 400 when password is missing", async () => {
      const request = createRequest({
        name: "Test User",
        email: "test@example.com",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });
  });

  describe("Password Complexity Validation", () => {
    it("returns 400 when password is too short", async () => {
      const request = createRequest(
        createValidSignupData({ password: "Pass1!" }),
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Password must be at least 8 characters");
    });

    it("returns 400 when password has no uppercase letter", async () => {
      const request = createRequest(
        createValidSignupData({ password: "password123!" }),
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(
        "Password must contain at least one uppercase letter",
      );
    });

    it("returns 400 when password has no lowercase letter", async () => {
      const request = createRequest(
        createValidSignupData({ password: "PASSWORD123!" }),
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(
        "Password must contain at least one lowercase letter",
      );
    });

    it("returns 400 when password has no number", async () => {
      const request = createRequest(
        createValidSignupData({ password: "Password!!" }),
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Password must contain at least one number");
    });

    it("returns 400 when password has no special character", async () => {
      const request = createRequest(
        createValidSignupData({ password: "Password123" }),
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(
        "Password must contain at least one special character",
      );
    });
  });

  describe("Email Uniqueness", () => {
    it("returns 400 when email already exists", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(createMockUser());

      const request = createRequest(createValidSignupData());
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(
        "Unable to create account. Please try again or use a different email.",
      );
    });

    it("normalizes email to lowercase before lookup", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(createMockUser());

      const request = createRequest(
        createValidSignupData({ email: "TEST@EXAMPLE.COM" }),
      );
      await POST(request);

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          email: { equals: "test@example.com", mode: "insensitive" },
        },
      });
    });
  });

  describe("Successful Signup", () => {
    it("returns 201 with user data on successful signup", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(createMockUser());

      const request = createRequest(createValidSignupData());
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.user).toEqual({
        id: "user-123",
        name: "Test User",
        email: "test@example.com",
      });
    });

    it("creates user with hashed password", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(createMockUser());

      const request = createRequest(createValidSignupData());
      await POST(request);

      expect(hash).toHaveBeenCalledWith("Password123!", 12);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: "Test User",
          email: "test@example.com",
          password: "hashed-password",
          isActive: true,
          failedLoginAttempts: 0,
        },
      });
    });

    it("stores email in lowercase", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(
        createMockUser({ email: "test@example.com" }),
      );

      const request = createRequest(
        createValidSignupData({ email: "TEST@EXAMPLE.COM" }),
      );
      await POST(request);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: "test@example.com",
        }),
      });
    });
  });

  describe("Error Handling", () => {
    it("returns 500 when database error occurs during user lookup", async () => {
      (prisma.user.findFirst as jest.Mock).mockRejectedValue(
        new Error("Database connection failed"),
      );

      const request = createRequest(createValidSignupData());
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Something went wrong");
    });

    it("returns 500 with specific message for database connection error", async () => {
      (prisma.user.findFirst as jest.Mock).mockRejectedValue(
        new Error("P1000: Database connection failed"),
      );

      const request = createRequest(createValidSignupData());
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe(
        "Database connection failed. Please try again later.",
      );
    });

    it("returns 400 for unique constraint violation", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockRejectedValue(
        new Error("P2002: Unique constraint violation"),
      );

      const request = createRequest(createValidSignupData());
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(
        "Unable to create account. Please try again or use a different email.",
      );
    });

    it("returns 500 when user creation fails", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockRejectedValue(
        new Error("User creation failed"),
      );

      const request = createRequest(createValidSignupData());
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Something went wrong");
    });

    it("returns 500 when password hashing fails", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      (hash as jest.Mock).mockRejectedValue(new Error("Hash error"));

      const request = createRequest(createValidSignupData());
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Something went wrong");
    });
  });
});
