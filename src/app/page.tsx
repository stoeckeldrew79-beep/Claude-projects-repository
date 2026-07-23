import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Palette,
  Bot,
  BrainCircuit,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { services, differentiators, process } from "@/lib/content";

const icons = {
  "web-design": Globe,
  branding: Palette,
  "ai-chatbots": Bot,
  "ai-business-solutions": BrainCircuit,
};

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="glow-grid border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-28 text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background-elevated px-4 py-1.5 text-xs text-muted">
            <MapPin className="h-3.5 w-3.5 text-accent-2" />
            Now booking new clients in Orlando, FL
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Websites, brands, and{" "}
            <span className="gradient-text">AI that outwork</span> your
            competition
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
            Pipertown Studios designs and builds modern websites, logos, and
            AI chatbots for businesses ready to look — and operate — like the
            best company in their industry.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Get a Free Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Services overview */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything your business needs, one team
          </h2>
          <p className="mt-4 text-muted">
            No juggling a web designer, a logo freelancer, and a separate AI
            vendor. Pipertown Studios builds it all together, so it all works
            together.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = icons[service.slug as keyof typeof icons];
            return (
              <Link
                key={service.slug}
                href={`/services#${service.slug}`}
                className="group rounded-2xl border border-border bg-background-elevated p-6 transition-colors hover:border-accent"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent-2/20">
                  <Icon className="h-5 w-5 text-accent-2" />
                </span>
                <h3 className="mt-5 font-semibold">{service.name}</h3>
                <p className="mt-2 text-sm text-muted">{service.tagline}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-accent-2 opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why Pipertown */}
      <section className="border-y border-border bg-background-elevated/50">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Why local businesses choose Pipertown
            </h2>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            {differentiators.map((item) => (
              <div key={item.title} className="flex gap-4">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-accent-2" />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            How a project works
          </h2>
          <p className="mt-4 text-muted">
            A clear process from first call to launch — and beyond.
          </p>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {process.map((step) => (
            <div key={step.step}>
              <span className="gradient-text text-3xl font-bold">
                {step.step}
              </span>
              <h3 className="mt-3 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to leave your competitors behind?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Tell us about your business and we&apos;ll put together a free,
            no-pressure quote for your new site, brand, or AI tools.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Get a Free Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
