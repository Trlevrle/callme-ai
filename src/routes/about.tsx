import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/layout/PublicShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About - Call Me AI" },
      {
        name: "description",
        content:
          "Learn about Call Me AI, a privacy-first AI companion and personal voice assistant platform.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 md:py-28">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">About</p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-6xl">
          Private AI companion technology for meaningful conversation.
        </h1>
        <p className="mt-6 text-base text-muted-foreground">
          Call Me AI builds a personal voice assistant experience focused on continuity, safety, and
          user privacy. Our product combines voice and text conversation with memory and clear
          controls over local conversation history.
        </p>
        <p className="mt-4 text-base text-muted-foreground">
          We design for reliability across desktop and mobile, with transparent policies and
          operational safeguards suitable for production usage.
        </p>
        <p className="mt-8 text-sm text-muted-foreground">
          Contact:
          <a href="mailto:hello@callmeai.io" className="ml-1 text-foreground underline">
            hello@callmeai.io
          </a>
        </p>
      </section>
    </PublicShell>
  );
}
