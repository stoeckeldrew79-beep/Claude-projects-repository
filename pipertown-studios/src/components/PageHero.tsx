import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";

export default function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border pb-20 pt-40 lg:pt-48">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(124,92,255,0.16),transparent)]" />
      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-10">
        <Reveal>
          <span className="text-eyebrow">{eyebrow}</span>
          <h1 className="text-display-md mt-4">{title}</h1>
          {subtitle && (
            <p className="mx-auto mt-6 max-w-2xl text-muted">{subtitle}</p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
