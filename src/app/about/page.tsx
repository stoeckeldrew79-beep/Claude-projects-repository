import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, MapPin, Rocket, Handshake } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import ScrollWords from "@/components/ScrollWords";

export const metadata: Metadata = {
  title: "About | Pipertown Studios",
  description:
    "Pipertown Studios is an Orlando-based studio building websites, brands, and AI tools for growing businesses.",
};

const pillars = [
  {
    icon: MapPin,
    title: "Local first",
    description:
      "We started in Orlando, so we understand the local market and show up like a business down the street — not a faceless agency.",
  },
  {
    icon: Rocket,
    title: "Built to scale",
    description:
      "Every process, tool, and system we use is built to serve clients well beyond Central Florida as we grow nationwide.",
  },
  {
    icon: Handshake,
    title: "Honest partnership",
    description:
      "Transparent pricing, realistic timelines, and straight answers — we'd rather earn your trust than oversell you.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={
          <>
            Built in Orlando, for businesses ready to{" "}
            <span className="gradient-text">grow up</span>
          </>
        }
        subtitle="Pipertown Studios exists because too many small and mid-sized businesses are stuck with an outdated website, no real brand, and zero idea how to use AI to save time or win more customers. We fix all three, together."
      />

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <RevealGroup className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-3">
          {pillars.map((pillar) => (
            <RevealItem key={pillar.title} className="bg-background p-8 lg:p-10">
              <pillar.icon className="h-6 w-6 text-accent-2" />
              <h3 className="mt-5 font-semibold">{pillar.title}</h3>
              <p className="mt-2 text-sm text-muted">{pillar.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="border-y border-border bg-background-elevated/40">
        <div className="mx-auto max-w-5xl px-6 py-32 text-center lg:px-10">
          <ScrollWords
            text="Most local businesses compete against companies with far bigger marketing budgets, using websites that haven't been touched in years. Pipertown Studios levels that playing field."
            className="text-display-md"
          />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 lg:px-10">
        <Reveal className="space-y-5 text-muted">
          <p>
            A genuinely modern website, a brand identity that looks the part,
            and AI tools that handle the busywork — all for a price that
            makes sense for a growing business, not just an enterprise.
          </p>
          <p>
            We&apos;re starting with Orlando businesses because that&apos;s
            our home base — but the same process that gets a local client a
            standout website is exactly what will let us take on clients
            nationwide as we grow.
          </p>
        </Reveal>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-10">
          <Reveal>
            <h2 className="text-display-md">
              Let&apos;s build something that outworks the competition.
            </h2>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Start a Project
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
