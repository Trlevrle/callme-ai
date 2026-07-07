import { createClient } from "@blinkdotnew/sdk";

const projectId =
  import.meta.env.VITE_BLINK_PROJECT_ID || "vocalis-design-system-g8i6sn3c";
const publishableKey =
  import.meta.env.VITE_BLINK_PUBLISHABLE_KEY ||
  "blnk_pk_JzPjvpyFP-rmlC7nl5QkHnS-uKyWrW6W";

export const blink = createClient({
  projectId,
  publishableKey,
  authRequired: false,
  auth: { mode: "managed" },
});
