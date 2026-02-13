import { http, HttpResponse } from "msw";
import * as v from "valibot";
import { SignupSchema } from "@/lib/validations/auth";

/**
 * Sign-up MSW handlers
 */
export const signUpHandlers = [
  // Auth signup handler - default success response
  http.post("/api/auth/signup", async ({ request }) => {
    const body = await request.json();
    const result = v.safeParse(SignupSchema, body);

    if (!result.success) {
      return HttpResponse.json(
        { error: result.issues[0].message },
        { status: 400 },
      );
    }

    const { name, email } = result.output;

    // Default success response
    return HttpResponse.json(
      {
        user: {
          id: "mock-user-id",
          name: name,
          email: email,
        },
      },
      { status: 201 },
    );
  }),
];
