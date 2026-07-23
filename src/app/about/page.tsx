import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, MapPin, Rocket, Handshake } from "lucide-react";

export const metadata: Metadata = {
  title: "About | Pipertown Studios",
  description:
    "Pipertown Studios is an Orlando-based studio building websites, brands, and AI tools for growing businesses.",
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Built in Orlando, for businesses ready to{" "}
            <span className="gradient-text">grow up</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted">
            Pipertown Studios exists because too many small and mid-sized
            businesses are stuck with an outdated website, no real brand, and
            zero idea how to use AI to save time or win more customers. We
            fix all three, together.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <MapPin className="h-6 w-6 text-accent-2" />
            <h3 className="mt-4 font-semibold">Local first</h3>
            <p className="mt-2 text-sm text-muted">
              We started in Orlando, so we understand the local market and
              show up like a business down the street — not a faceless
              agency.
            </p>
          </div>
          <div>
            <Rocket className="h-6 w-6 text-accent-2" />
            <h3 className="mt-4 font-semibold">Built to scale</h3>
            <p className="mt-2 text-sm text-muted">
              Every process, tool, and system we use is built to serve
              clients well beyond Central Florida as we grow nationwide.
            </p>
          </div>
          <div>
            <Handshake className="h-6 w-6 text-accent-2" />
            <h3 className="mt-4 font-semibold">Honest partnership</h3>
            <p className="mt-2 text-sm text-muted">
              Transparent pricing, realistic timelines, and straight answers
              — we&apos;d rather earn your trust than oversell you.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background-elevated/50">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="text-2xl font-semibold tracking-tight">
            Our mission
          </h2>
          <p className="mt-4 text-muted">
            Most local businesses are competing against companies with
            far bigger marketing budgets — using websites and brands that
            haven&apos;t been touched in years. Pipertown Studios levels
            that playing field: a genuinely modern website, a brand identity
            that looks the part, and AI tools that handle the busywork, all
            for a price that makes sense for a growing business, not just an
            enterprise.
          </p>
          <p className="mt-4 text-muted">
            We&apos;re starting with Orlando businesses because that&apos;s
            our home base — but the same process that gets a local client a
            standout website is exactly what will let us take on clients
            nationwide as we grow.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Let&apos;s build something that outworks the competition
          </h2>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Start a Project
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
