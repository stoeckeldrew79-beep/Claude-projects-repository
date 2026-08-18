import { FormEvent, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useReportStatus } from '../hooks/useReports';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { formatPhoneDisplay, PUBLIC_PHONE, telHref } from '../utils/publicPhone';

const INTERNAL_STATUS_COPY: Record<string, string> = {
  pending: 'Received, awaiting review by our team.',
  reviewed: 'Reviewed by our team.',
  promoted: 'Reviewed and published as a public scam alert — thank you for helping warn others.',
  dismissed: "Reviewed — didn't meet the bar for a public alert (this doesn't mean it wasn't real; not every report becomes a published entry).",
};

const FILING_STATUS_COPY: Record<string, string> = {
  suggested: 'Identified as a relevant agency — not yet filed.',
  filed: 'Filed.',
  not_applicable: "Reviewed — doesn't apply to this report.",
};

export default function ReportStatus() {
  useDocumentMeta({
    title: 'Check Your Report Status',
    description: 'Look up the status of a scam report you submitted to ScamShield National.',
    path: '/report-status',
  });

  const [params] = useSearchParams();
  const [lookupId, setLookupId] = useState(params.get('id') ?? '');
  const [activeId, setActiveId] = useState(params.get('id') ?? undefined);
  const { data, isLoading, isError } = useReportStatus(activeId);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setActiveId(lookupId.trim() || undefined);
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <p className="text-xs font-semibold tracking-widest text-red-700 uppercase">Report status</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Check on your report</h1>
      <p className="mt-3 text-slate-600">
        Paste the report reference code you received after submitting a report to look up its status.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
        <input
          value={lookupId}
          onChange={(e) => setLookupId(e.target.value)}
          placeholder="Report reference code"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm font-mono"
        />
        <button type="submit" className="px-5 py-2 rounded-md bg-slate-900 text-white font-medium">
          Look up
        </button>
      </form>

      {PUBLIC_PHONE && (
        <p className="mt-3 text-sm text-slate-500">
          Lost your reference code, or have a question? Call us at{' '}
          <a href={telHref(PUBLIC_PHONE)} className="underline hover:text-slate-700">
            {formatPhoneDisplay(PUBLIC_PHONE)}
          </a>{' '}
          and a real person can look it up for you.
        </p>
      )}

      {isLoading && <p className="mt-6 text-slate-500">Looking up your report…</p>}
      {isError && (
        <p className="mt-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          We couldn't find a report with that reference code. Double-check it and try again.
        </p>
      )}

      {data && (
        <div className="mt-8 space-y-6">
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Submitted</p>
            <p className="mt-1 text-sm text-slate-900">{new Date(data.created_at).toLocaleDateString()}</p>
            <p className="mt-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Review status</p>
            <p className="mt-1 text-sm text-slate-900">{INTERNAL_STATUS_COPY[data.status] ?? data.status}</p>
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">Agency filing</p>
            {!data.consent_to_file && (
              <p className="mt-2 text-sm text-slate-500">
                You didn't opt in to have us file this report with an outside agency. You can still file it
                yourself — the appropriate agency depends on where you are; in the U.S. that's usually{' '}
                <a href="https://reportfraud.ftc.gov/" className="underline" target="_blank" rel="noreferrer">
                  reportfraud.ftc.gov
                </a>
                .
              </p>
            )}
            {data.consent_to_file && data.filings.length === 0 && (
              <p className="mt-2 text-sm text-slate-500">
                We have your consent to file this — our team hasn't recorded a filing yet. Check back soon.
              </p>
            )}
            {data.consent_to_file && data.filings.length > 0 && (
              <ul className="mt-3 space-y-3">
                {data.filings.map((f, i) => (
                  <li key={i} className="text-sm">
                    <p className="font-medium text-slate-900">{f.agency_name}</p>
                    <p className="text-slate-600">{FILING_STATUS_COPY[f.status] ?? f.status}</p>
                    {f.filed_at && (
                      <p className="text-xs text-slate-400">
                        Filed {new Date(f.filed_at).toLocaleDateString()}
                        {f.reference_number && ` · Reference: ${f.reference_number}`}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-xs text-slate-500">
              Most agencies don't give case-by-case investigation updates back to filers — this shows what we've
              done on your behalf, not what the agency has done with it.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
