import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services | Pipertown Studios",
  description:
    "Website design, logo & brand identity, AI chatbots, and AI business automation for Orlando businesses.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Services built to work <span className="gradient-text">together</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted">
            Every service below is designed as part of one system — your
            site, your brand, and your AI tools, built by the same team so
            nothing feels bolted on.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl divide-y divide-border px-6">
        {services.map((service, i) => (
          <section
            key={service.slug}
            id={service.slug}
            className="scroll-mt-24 py-16"
          >
            <div className="grid gap-10 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <span className="text-sm text-muted">0{i + 1}</span>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  {service.name}
                </h2>
                <p className="mt-2 text-accent-2">{service.tagline}</p>
                <p className="mt-4 text-sm text-muted">{service.description}</p>
                <div className="mt-6 flex items-center gap-4">
                  <span className="text-sm text-muted">
                    Starting at{" "}
                    <span className="font-semibold text-foreground">
                      {service.startingAt}
                    </span>
                  </span>
                </div>
                <Link
                  href="/contact"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent-2"
                >
                  Get a quote for this service
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="lg:col-span-3">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 rounded-xl border border-border bg-background-elevated p-4 text-sm"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Not sure what you need?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Most clients start with a quick, free consultation — we&apos;ll
            help you figure out where a new site, brand, or AI tool will move
            the needle most.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Book a Free Consultation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
