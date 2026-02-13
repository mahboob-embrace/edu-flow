import { signInHandlers } from "./signin";
import { signUpHandlers } from "./signup";

/**
 * Combined MSW handlers
 */
export const handlers = [...signInHandlers, ...signUpHandlers];
