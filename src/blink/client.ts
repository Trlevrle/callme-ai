const CLIENT_DISABLED_MESSAGE =
  "Browser-side provider client is disabled for security. Use server /api routes instead.";

function disabledClientError() {
  return new Error(CLIENT_DISABLED_MESSAGE);
}

export const blink = {
  auth: {
    login: (redirectTo = "/app") => {
      if (typeof window !== "undefined") {
        window.location.assign(redirectTo);
      }
    },
    logout: () => undefined,
    getUser: () => null,
  },
  ai: {
    generateText: async () => {
      throw disabledClientError();
    },
    generateImage: async () => {
      throw disabledClientError();
    },
  },
};
export const blinkClient = blink;
export const projectId = "callme-ai";
export const publishableKey = "dev-placeholder";
