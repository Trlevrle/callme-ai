import { Outlet, createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { CookieBanner } from "@/components/marketing/CookieBanner";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">404</p>
      <h1 className="mt-4 font-serif text-5xl tracking-tight text-foreground md:text-6xl">
        Lost in the void?
      </h1>
      <p className="mt-4 max-w-sm text-base text-muted-foreground">
        This page doesn&rsquo;t exist or has been moved. Let&rsquo;s get you home.
      </p>
      <a
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        Back to home
      </a>
    </div>
  );
}

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0b0a0f" />
        <HeadContent />
      </head>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
        <CookieBanner />
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { title: "Call Me AI - Private AI Companion" },
      {
        name: "description",
        content:
          "Call Me AI is a private AI companion and personal voice assistant for meaningful voice and text conversations.",
      },
      { name: "author", content: "Call Me AI" },
      { property: "og:title", content: "Call Me AI - Private AI Companion" },
      {
        property: "og:description",
        content:
          "Private AI companion and personal voice assistant for meaningful conversations with memory controls.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://callmeai.io" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Call Me AI - Private AI Companion" },
      {
        name: "twitter:description",
        content: "Personal voice assistant with private memory and always-available conversation.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});
