import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { services, differentiators, process } from "@/lib/content";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import SplitHeadline from "@/components/SplitHeadline";
import ScrollWords from "@/components/ScrollWords";
import Marquee from "@/components/Marquee";
import AuroraCanvas from "@/components/AuroraCanvas";
import ServiceArtwork from "@/components/ServiceArtwork";

const marqueeItems = [
  "Website Design",
  "Logo & Branding",
  "AI Chatbots",
  "AI Business Solutions",
].map((label, i) => (
  <span key={label} className="flex items-center gap-8 px-8 py-6 text-lg text-muted sm:text-2xl">
    {label}
    {i < 3 && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
  </span>
));

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden pb-16 pt-24">
        <div className="absolute inset-0">
          <AuroraCanvas className="opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-10">
          <span className="text-eyebrow mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-border px-4 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-2" />
            Now booking new clients in Orlando, FL
          </span>

          <h1 className="text-display max-w-5xl">
            <SplitHeadline text="Websites, brands, and AI that" />{" "}
            <SplitHeadline
              text="outwork your competition."
              delay={0.35}
              className="gradient-text"
            />
          </h1>

          <Reveal delay={0.9} className="mt-6 max-w-lg">
            <p className="text-lg text-muted">
              Pipertown Studios designs and builds premium websites, brand
              identities, and AI chatbots for businesses ready to look — and
              operate — like the best company in their industry.
            </p>
          </Reveal>

          <Reveal delay={1.05} className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Get a Free Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-border-strong px-6 py-3 text-sm font-medium transition-colors hover:border-foreground"
            >
              See Pricing
            </Link>
          </Reveal>
        </div>

        <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted sm:flex">
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </div>
      </section>

      <section className="relative border-y border-border">
        <Marquee items={marqueeItems} />
      </section>

      {/* Numbered service showcase */}
      <section className="mx-auto max-w-7xl px-6 py-32 lg:px-10">
        <Reveal>
          <span className="text-eyebrow">What we do</span>
          <h2 className="text-display-md mt-4 max-w-2xl">
            Four services. One system.
          </h2>
        </Reveal>

        <div className="mt-24 space-y-24 lg:space-y-32">
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
                  <h3 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-accent-2">{service.tagline}</p>
                  <p className="mt-5 text-muted">{service.description}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <span className="text-sm text-muted">
                      Starting at{" "}
                      <span className="font-semibold text-foreground">
                        {service.startingAt}
                      </span>
                    </span>
                  </div>
                  <Link
                    href="/services"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium hover:text-accent-2"
                  >
                    Learn more
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Statement */}
      <section className="border-y border-border bg-background-elevated/40">
        <div className="mx-auto max-w-5xl px-6 py-32 text-center lg:px-10">
          <ScrollWords
            text="We don't just build websites. We build the sharpest version of your business — online, on brand, and backed by AI that works while you sleep."
            className="text-display-md"
          />
        </div>
      </section>

      {/* Why Pipertown — bento grid */}
      <section className="mx-auto max-w-7xl px-6 py-32 lg:px-10">
        <Reveal>
          <span className="text-eyebrow">Why Pipertown</span>
          <h2 className="text-display-md mt-4 max-w-2xl">
            Built different, on purpose.
          </h2>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2">
          {differentiators.map((item, i) => (
            <RevealItem
              key={item.title}
              className="bg-background p-8 lg:p-12"
            >
              <span className="font-mono text-sm text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-muted">{item.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Process */}
      <section className="border-t border-border bg-background-elevated/40">
        <div className="mx-auto max-w-7xl px-6 py-32 lg:px-10">
          <Reveal>
            <span className="text-eyebrow">How it works</span>
            <h2 className="text-display-md mt-4 max-w-2xl">
              From first call to launch.
            </h2>
          </Reveal>

          <RevealGroup className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            {process.map((step) => (
              <RevealItem key={step.step} className="border-t border-border-strong pt-6">
                <span className="gradient-text text-3xl font-bold">
                  {step.step}
                </span>
                <h3 className="mt-3 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
