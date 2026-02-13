import { http, HttpResponse } from "msw";
import * as v from "valibot";
import { SigninSchema } from "@/lib/validations/auth";

/**
 * Sign-in MSW handlers
 */
export const signInHandlers = [
  // Auth signin handler - default success response
  http.post("/api/auth/signin", async ({ request }) => {
    const body = await request.json();
    const result = v.safeParse(SigninSchema, body);

    if (!result.success) {
      return HttpResponse.json(
        { error: result.issues[0].message },
        { status: 400 },
      );
    }

    const { email } = result.output;

    // Default success response
    return HttpResponse.json(
      {
        user: {
          id: "mock-user-id",
          name: "Test User",
          email: email,
        },
      },
      { status: 200 },
    );
  }),
];
