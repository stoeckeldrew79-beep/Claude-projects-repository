"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

const services = [
  "Website Design",
  "Logo & Branding",
  "AI Chatbot",
  "AI Business Solutions",
  "Not sure yet",
];

export default function ContactForm() {
  const [service, setService] = useState(services[0]);

  return (
    <form
      className="space-y-5"
      action="mailto:hello@pipertownstudios.com"
      method="POST"
      encType="text/plain"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm text-muted" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="mt-1.5 w-full rounded-lg border border-border bg-background-elevated px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="text-sm text-muted" htmlFor="business">
            Business name
          </label>
          <input
            id="business"
            name="business"
            className="mt-1.5 w-full rounded-lg border border-border bg-background-elevated px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-muted" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1.5 w-full rounded-lg border border-border bg-background-elevated px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="text-sm text-muted" htmlFor="service">
          What are you interested in?
        </label>
        <select
          id="service"
          name="service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-border bg-background-elevated px-4 py-2.5 text-sm outline-none focus:border-accent"
        >
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm text-muted" htmlFor="message">
          Tell us about your business
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-1.5 w-full rounded-lg border border-border bg-background-elevated px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        Send Message
        <ArrowRight className="h-4 w-4" />
      </button>
      <p className="text-xs text-muted">
        This opens your email client with your message pre-filled to{" "}
        hello@pipertownstudios.com.
      </p>
    </form>
  );
}
