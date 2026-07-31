import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { websiteTiers, aiTiers, addOns } from "@/lib/content";
import PricingCard from "@/components/PricingCard";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Pricing | Pipertown Studios",
  description:
    "Transparent starting prices for website design, branding, AI chatbots, and AI business automation.",
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title={
          <>
            Pricing that&apos;s{" "}
            <span className="gradient-text">actually public</span>
          </>
        }
        subtitle={
          <>
            No games, no &quot;call us for pricing.&quot; Here are real
            starting prices for every service we offer — your final quote
            depends on scope, and we&apos;ll always confirm it before any
            work begins.
          </>
        }
      />

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal>
          <span className="text-eyebrow">01</span>
          <h2 className="text-display-md mt-3">Website Packages</h2>
        </Reveal>
        <RevealGroup className="mt-14 grid gap-6 lg:grid-cols-3">
          {websiteTiers.map((tier) => (
            <RevealItem key={tier.name}>
              <PricingCard tier={tier} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="border-t border-border bg-background-elevated/30">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <Reveal>
            <span className="text-eyebrow">02</span>
            <h2 className="text-display-md mt-3">AI Services</h2>
            <p className="mt-4 max-w-xl text-muted">
              Priced for growing local businesses, not enterprise consulting
              budgets — start small and scale up as it proves its value.
            </p>
          </Reveal>
          <RevealGroup className="mt-14 grid gap-6 lg:grid-cols-3">
            {aiTiers.map((tier) => (
              <RevealItem key={tier.name}>
                <PricingCard tier={tier} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-24 lg:px-10">
          <Reveal>
            <span className="text-eyebrow">03</span>
            <h2 className="text-display-md mt-3">Add-Ons</h2>
          </Reveal>
          <Reveal className="mt-10 divide-y divide-border overflow-hidden rounded-sm border border-border">
            {addOns.map((addOn) => (
              <div
                key={addOn.name}
                className="flex items-center justify-between px-6 py-5"
              >
                <span className="text-sm">{addOn.name}</span>
                <span className="text-sm font-medium text-accent-2">
                  {addOn.price}
                </span>
              </div>
            ))}
          </Reveal>
          <p className="mt-6 text-center text-sm text-muted">
            Bundling a website with a logo & brand identity or an AI chatbot
            saves you more than booking them separately — ask us for a
            bundled quote.
          </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-10">
          <Reveal>
            <h2 className="text-display-md">
              Still have questions about pricing?
            </h2>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Talk to Us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
