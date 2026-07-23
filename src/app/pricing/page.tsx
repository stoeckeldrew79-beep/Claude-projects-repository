import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { websiteTiers, aiTiers, addOns } from "@/lib/content";
import PricingCard from "@/components/PricingCard";

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
            starting prices for every service we offer — your final quote
            depends on scope, and we&apos;ll always confirm it before any
            work begins.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-2xl font-semibold tracking-tight">
          Website Packages
        </h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {websiteTiers.map((tier) => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-background-elevated/50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-center text-2xl font-semibold tracking-tight">
            AI Services
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted">
            Priced for growing local businesses, not enterprise consulting
            budgets — start small and scale up as it proves its value.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {aiTiers.map((tier) => (
              <PricingCard key={tier.name} tier={tier} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
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
            Bundling a website with a logo & brand identity or an AI chatbot
            saves you more than booking them separately — ask us for a
            bundled quote.
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
