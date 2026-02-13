import { fn } from "storybook/test";

export const hardNavigate = fn((url: string) => {
  console.log("[Storybook Mock] hardNavigate called with:", url);
}).mockName("hardNavigate");
