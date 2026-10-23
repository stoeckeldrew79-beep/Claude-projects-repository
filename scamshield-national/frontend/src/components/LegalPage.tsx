import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

// Shared layout for the About / Privacy / Terms pages: a dark header band
// matching the rest of the site, then a readable single column.

export const CONTACT_EMAIL = 'support@scamtitan.com';
export const LEGAL_UPDATED = 'October 24, 2026';

export function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: ReactNode;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="bg-gradient-to-b from-slate-950 to-[#0f1a2b] px-4 pb-14 pt-12 text-white sm:pt-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-red-400">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">{intro}</p>
          {updated && <p className="mt-4 text-xs text-slate-500">Last updated {updated}</p>}
        </div>
      </section>
      <article className="mx-auto max-w-3xl px-4 py-12 text-[15px] leading-relaxed text-slate-700 [&_a]:font-medium [&_a]:text-[#8a2e2e] [&_a]:underline [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-slate-900 [&_li]:mt-1.5 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
        <div className="mt-12 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-200 pt-6 text-sm">
          <Link to="/about">About us</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Use</Link>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </div>
      </article>
    </>
  );
}
