import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-2">
              <Sparkles className="h-3.5 w-3.5 text-background" />
            </span>
            Pipertown Studios
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted">
            Websites, brand identity, and AI tools for businesses ready to
            outgrow their competition — starting in Orlando, built for
            nationwide growth.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Services</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/services#web-design" className="hover:text-foreground">Website Design</Link></li>
            <li><Link href="/services#branding" className="hover:text-foreground">Logo & Branding</Link></li>
            <li><Link href="/services#ai-chatbots" className="hover:text-foreground">AI Chatbots</Link></li>
            <li><Link href="/services#ai-business-solutions" className="hover:text-foreground">AI Business Solutions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/about" className="hover:text-foreground">About</Link></li>
            <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Based in Orlando, FL</h4>
          <p className="mt-3 text-sm text-muted">
            Serving Central Florida businesses now, with clients nationwide
            welcome.
          </p>
          <a
            href="mailto:hello@pipertownstudios.com"
            className="mt-3 inline-block text-sm text-accent-2 hover:underline"
          >
            hello@pipertownstudios.com
          </a>
        </div>
      </div>

      <div className="border-t border-border px-6 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Pipertown Studios. All rights reserved.
      </div>
    </footer>
  );
}
