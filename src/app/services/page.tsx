import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { services } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import ServiceArtwork from "@/components/ServiceArtwork";

export const metadata: Metadata = {
  title: "Services | Pipertown Studios",
  description:
    "Website design, logo & brand identity, AI chatbots, and AI business automation for Orlando businesses.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Built to work <span className="gradient-text">together</span>
          </>
        }
        subtitle="Every service below is designed as part of one system — your site, your brand, and your AI tools, built by the same team so nothing feels bolted on."
      />

      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="space-y-24 lg:space-y-32">
          {services.map((service, i) => (
            <Reveal key={service.slug}>
              <div
                id={service.slug}
                className={`grid scroll-mt-28 items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <ServiceArtwork index={i} />
                <div>
                  <span className="font-mono text-sm text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                    {service.name}
                  </h2>
                  <p className="mt-2 text-accent-2">{service.tagline}</p>
                  <p className="mt-5 text-muted">{service.description}</p>

                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-muted"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap items-center gap-6">
                    <span className="text-sm text-muted">
                      Starting at{" "}
                      <span className="font-semibold text-foreground">
                        {service.startingAt}
                      </span>
                    </span>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 text-sm font-medium hover:text-accent-2"
                    >
                      Get a quote
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-10">
          <Reveal>
            <h2 className="text-display-md">Not sure what you need?</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              Most clients start with a quick, free consultation — we&apos;ll
              help you figure out where a new site, brand, or AI tool will
              move the needle most.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Book a Free Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
