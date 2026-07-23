import type { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Pipertown Studios",
  description:
    "Get a free quote for your website, brand identity, or AI tools from Pipertown Studios.",
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Let&apos;s talk about your <span className="gradient-text">project</span>
        </h1>
        <p className="mt-5 text-muted">
          Tell us a bit about your business and what you need — we&apos;ll
          follow up with a free, no-pressure quote.
        </p>
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-2xl border border-border bg-background-elevated p-8">
          <ContactForm />
        </div>

        <div className="space-y-8 lg:col-span-2">
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
                Orlando, FL — serving Central Florida now, clients nationwide
                welcome.
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
        </div>
      </div>
    </section>
  );
}
