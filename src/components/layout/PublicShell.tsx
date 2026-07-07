import type { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { Footer } from "./Footer";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <TopNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
