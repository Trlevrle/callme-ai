"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type LegalSection = {
  id: string;
  title: string;
  body: ReactNode;
};

type LegalDocumentProps = {
  title: string;
  lastUpdated: string;
  intro: ReactNode;
  sections: LegalSection[];
  tocLabel?: string;
};

export function LegalDocument({
  title,
  lastUpdated,
  intro,
  sections,
  tocLabel = "On this page",
}: LegalDocumentProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const defaultOpen = useMemo(() => sections.map((section) => section.id), [sections]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible?.target?.id) return;
        setActiveId(visible.target.id);
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0.15, 0.3, 0.55, 0.8],
      },
    );

    const observed = Object.values(sectionRefs.current).filter(Boolean) as HTMLElement[];
    observed.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [sections]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Legal</p>
          <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
            {title}
          </h1>
          <p className="mt-2 text-xs text-muted-foreground">Last updated: {lastUpdated}</p>

          <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-5 text-sm text-foreground/80">
            {intro}
          </div>

          <div className="mt-8 space-y-3 text-sm text-foreground/80">
            <Accordion type="multiple" defaultValue={defaultOpen} className="space-y-3">
              {sections.map((section) => (
                <AccordionItem
                  key={section.id}
                  value={section.id}
                  ref={(node) => {
                    sectionRefs.current[section.id] = node;
                  }}
                  id={section.id}
                  className={cn(
                    "rounded-2xl border border-border/60 bg-card/40 px-6",
                    activeId === section.id && "border-primary/35 bg-card/60",
                  )}
                >
                  <AccordionTrigger className="border-l-[3px] border-l-primary py-5 pl-4 pr-0 text-left font-serif text-xl text-foreground no-underline hover:no-underline [&>svg]:text-primary">
                    {section.title}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pl-4 pr-0 pt-0 text-sm leading-6 text-foreground/80">
                    {section.body}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-border/60 bg-card/40 p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {tocLabel}
            </p>
            <nav className="mt-4 space-y-1.5">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm transition-colors",
                    activeId === section.id
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                  aria-current={activeId === section.id ? "true" : undefined}
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </section>
  );
}
