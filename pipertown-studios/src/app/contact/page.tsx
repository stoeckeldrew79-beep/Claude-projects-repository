import type { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Contact | Pipertown Studios",
  description:
    "Get a free quote for your website, brand identity, or AI tools from Pipertown Studios.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let&apos;s talk about your{" "}
            <span className="gradient-text">project</span>
          </>
        }
        subtitle="Tell us a bit about your business and what you need — we'll follow up with a free, no-pressure quote."
      />

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-5">
          <Reveal className="rounded-sm border border-border bg-background-elevated/40 p-8 lg:col-span-3">
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1} className="space-y-8 lg:col-span-2">
            <div className="flex gap-4">
              <Mail className="mt-1 h-5 w-5 shrink-0 text-accent-2" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <a
                  href="mailto:hello@pipertownstudios.com"
                  className="text-sm text-muted hover:text-foreground"
                >
                  hello@pipertownstudios.com
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-accent-2" />
              <div>
                <h3 className="font-semibold">Location</h3>
                <p className="text-sm text-muted">
                  Orlando, FL — serving Central Florida now, clients
                  nationwide welcome.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-accent-2" />
              <div>
                <h3 className="font-semibold">Response time</h3>
                <p className="text-sm text-muted">
                  We typically reply within one business day.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
