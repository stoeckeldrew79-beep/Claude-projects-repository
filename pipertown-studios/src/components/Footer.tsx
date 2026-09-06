import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <Reveal>
          <Link
            href="/contact"
            className="group flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
          >
            <span className="text-display-md gradient-text">
              Let&apos;s talk.
            </span>
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-border-strong transition-colors group-hover:border-foreground sm:h-20 sm:w-20">
              <ArrowUpRight className="h-7 w-7 transition-transform duration-300 group-hover:rotate-45" />
            </span>
          </Link>
        </Reveal>

        <div className="mt-24 grid gap-10 border-t border-border pt-12 text-sm md:grid-cols-4">
          <div>
            <Link href="/" className="font-semibold">
              Pipertown Studios
            </Link>
            <p className="mt-3 max-w-xs text-muted">
              Websites, brand identity, and AI tools for businesses ready to
              outgrow their competition — starting in Orlando, built for
              nationwide growth.
            </p>
          </div>

          <div>
            <h4 className="text-eyebrow">Services</h4>
            <ul className="mt-4 space-y-2 text-muted">
              <li><Link href="/services#web-design" className="hover:text-foreground">Website Design</Link></li>
              <li><Link href="/services#branding" className="hover:text-foreground">Logo & Branding</Link></li>
              <li><Link href="/services#ai-chatbots" className="hover:text-foreground">AI Chatbots</Link></li>
              <li><Link href="/services#ai-business-solutions" className="hover:text-foreground">AI Business Solutions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-eyebrow">Company</h4>
            <ul className="mt-4 space-y-2 text-muted">
              <li><Link href="/about" className="hover:text-foreground">About</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-eyebrow">Based in Orlando, FL</h4>
            <p className="mt-4 text-muted">
              Serving Central Florida businesses now, with clients nationwide
              welcome.
            </p>
            <a
              href="mailto:hello@pipertownstudios.com"
              className="mt-3 inline-block text-accent-2 hover:underline"
            >
              hello@pipertownstudios.com
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Pipertown Studios. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
