import { cn } from "@/lib/utils";

interface WordmarkProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  /** Render the wordmark with the brand mark as a single horizontal unit. */
  as?: "span" | "a";
  href?: string;
}

/**
 * Call Me AI wordmark. A small telephone-handset glyph sits between the
 * words "Call" and "Me" — visible at a glance, neutral, no adult semantics.
 * Wordmark uses Fraunces italic for "Call" + "AI" and Inter for "Me" so
 * the device mark + typographic contrast carry the brand without a separate
 * product icon.
 */
export function Wordmark({ size = "md", className, as = "span", href }: WordmarkProps) {
  const Tag = as as "span";
  const dims =
    size === "sm"
      ? { mark: 14, call: "text-base", me: "text-base", ai: "text-base" }
      : size === "lg"
        ? { mark: 22, call: "text-3xl", me: "text-3xl", ai: "text-3xl" }
        : size === "xl"
          ? { mark: 32, call: "text-5xl", me: "text-5xl", ai: "text-5xl" }
          : { mark: 18, call: "text-xl", me: "text-xl", ai: "text-xl" };

  const inner = (
    <>
      <span
        className={cn("font-serif italic font-medium tracking-tight text-foreground", dims.call)}
      >
        Call
      </span>
      <HandsetMark size={dims.mark} className="mx-[0.18em] -translate-y-[0.05em] text-primary" />
      <span className={cn("font-sans font-normal tracking-tight text-foreground", dims.me)}>
        Me
      </span>
      <span
        className={cn("ml-1 font-serif italic font-medium tracking-tight text-primary", dims.ai)}
      >
        AI
      </span>
    </>
  );

  if (as === "a" && href) {
    return (
      <a href={href} className={cn("inline-flex items-baseline", className)}>
        {inner}
      </a>
    );
  }
  return <Tag className={cn("inline-flex items-baseline", className)}>{inner}</Tag>;
}

/**
 * Telephone-handset glyph used in the wordmark. Stylized, not literal.
 * Sits on the text baseline and inherits `color` from the parent.
 */
export function HandsetMark({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("inline-block align-baseline", className)}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
      {/* pulse rings — two concentric arcs that suggest "ringing" */}
      <path d="M17.5 4.5a6 6 0 0 1 2 4.5" opacity="0.7" />
      <path d="M20 2.5a10 10 0 0 1 2 6.5" opacity="0.4" />
    </svg>
  );
}
