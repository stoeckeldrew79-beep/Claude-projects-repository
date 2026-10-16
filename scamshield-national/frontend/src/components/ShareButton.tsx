import { useState } from 'react';

// Share for a detail page: the native share sheet where the browser has one
// (most phones), otherwise copy the link. Warning someone else is the most
// useful thing a reader can do with a scam write-up, so it gets a real button.
export function ShareButton({ title, text, className = '' }: { title: string; text?: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        // The reader closing the sheet is not a failure worth a fallback.
        if ((err as DOMException)?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this link:', url);
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-400 ${className}`}
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M10 13V3m0 0L6.5 6.5M10 3l3.5 3.5M4 11v5a1 1 0 001 1h10a1 1 0 001-1v-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {copied ? 'Link copied' : 'Share'}
    </button>
  );
}
