import { useEffect, useMemo, useState } from "react";
import { clearSession, loadSession, saveSession, type AuthSession } from "@/lib/storage";

export const useAuth = () => {
  const [user, setUser] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = loadSession();
    setUser(session);
    setIsLoading(false);
  }, []);

  return useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      signIn: (session?: Partial<AuthSession>) => {
        const nextSession: AuthSession = {
          id: session?.id ?? "guest",
          name: session?.name ?? "Guest User",
          displayName: session?.displayName ?? "Guest User",
          email: session?.email ?? "guest@example.com",
          createdAt: session?.createdAt ?? new Date().toISOString(),
          lastSeenAt: new Date().toISOString(),
        };

        saveSession(nextSession);
        setUser(nextSession);
        return nextSession;
      },
      signOut: async () => {
        clearSession();
        setUser(null);
      },
    }),
    [isLoading, user],
  );
};
