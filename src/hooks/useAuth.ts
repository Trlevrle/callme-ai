import { useEffect, useState } from "react";
import { blink } from "@/blink/client";

/**
 * Subscribes to the Blink SDK auth state and exposes {user, loading, signOut}.
 * Loading follows the critical rule: only set to false, never reset to true —
 * otherwise the page flashes the spinner every time the SDK refreshes tokens.
 */
export function useAuth() {
  const [user, setUser] = useState<null | { id: string; email: string; displayName?: string; avatarUrl?: string }>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      if (state.user) {
        setUser({
          id: state.user.id,
          email: state.user.email,
          displayName: state.user.displayName,
          avatarUrl: state.user.avatarUrl,
        });
      } else {
        setUser(null);
      }
      if (!state.isLoading) setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signOut: () => blink.auth.signOut(),
    signIn: () => blink.auth.login(window.location.href),
  };
}
