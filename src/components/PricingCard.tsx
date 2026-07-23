import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { PricingTier } from "@/lib/content";

export default function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <div
      className={`rounded-2xl border p-8 ${
        tier.highlighted
          ? "border-accent bg-gradient-to-b from-accent/10 to-transparent"
          : "border-border bg-background-elevated"
      }`}
    >
      {tier.highlighted && (
        <span className="mb-4 inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
          Most Popular
        </span>
      )}
      <h3 className="text-lg font-semibold">{tier.name}</h3>
      <p className="mt-2 text-3xl font-semibold tracking-tight">
        {tier.price}
        {tier.cadence && (
          <span className="text-base font-normal text-muted">{tier.cadence}</span>
        )}
      </p>
      <p className="mt-3 text-sm text-muted">{tier.description}</p>
      <ul className="mt-6 space-y-3">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-2" />
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href="/contact"
        className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 ${
          tier.highlighted
            ? "bg-foreground text-background"
            : "border border-border text-foreground"
        }`}
      >
        Get Started <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
