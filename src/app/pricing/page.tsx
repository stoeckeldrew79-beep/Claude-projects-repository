import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { websiteTiers, addOns } from "@/lib/content";

export const metadata: Metadata = {
  title: "Pricing | Pipertown Studios",
  description:
    "Transparent starting prices for website design, branding, AI chatbots, and AI business automation.",
};

export default function PricingPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Pricing that&apos;s <span className="gradient-text">actually public</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted">
            No games, no &quot;call us for pricing.&quot; Here are real
            starting prices — your final quote depends on scope, and we&apos;ll
            always confirm it before any work begins.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-2xl font-semibold tracking-tight">
          Website Packages
        </h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {websiteTiers.map((tier) => (
            <div
              key={tier.name}
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
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-background-elevated/50">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="text-center text-2xl font-semibold tracking-tight">
            Add-Ons & Other Services
          </h2>
          <div className="mt-10 divide-y divide-border overflow-hidden rounded-2xl border border-border">
            {addOns.map((addOn) => (
              <div
                key={addOn.name}
                className="flex items-center justify-between px-6 py-4"
              >
                <span className="text-sm">{addOn.name}</span>
                <span className="text-sm font-medium text-accent-2">
                  {addOn.price}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            AI Business Solutions are scoped individually based on your
            workflows — every quote starts with a free consultation.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Still have questions about pricing?
          </h2>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Talk to Us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
