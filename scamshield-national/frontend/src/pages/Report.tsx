import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSubmitReport } from '../hooks/useReports';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useCategories } from '../hooks/useScams';
import { formatPhoneDisplay, PUBLIC_PHONE, telHref } from '../utils/publicPhone';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
  'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY',
  'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV',
  'WI', 'WY',
];

export default function Report() {
  useDocumentMeta({
    title: 'Report a Scam',
    description: 'Report a scam to ScamShield National. Every report is reviewed and helps protect others.',
    path: '/report',
  });

  const { data: categories } = useCategories();
  const submit = useSubmitReport();

  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [scammerPhone, setScammerPhone] = useState('');
  const [scammerEmail, setScammerEmail] = useState('');
  const [scammerWebsite, setScammerWebsite] = useState('');
  const [moneyLost, setMoneyLost] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [country, setCountry] = useState('US');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [consentToFile, setConsentToFile] = useState(false);

  const hasContactInfo = !anonymous && Boolean(reporterEmail || reporterPhone);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submit.mutate({
      description,
      category_id: categoryId || undefined,
      scammer_phone: scammerPhone || undefined,
      scammer_email: scammerEmail || undefined,
      scammer_website: scammerWebsite || undefined,
      money_lost_amount: moneyLost ? Number(moneyLost) : undefined,
      incident_date: incidentDate || undefined,
      country,
      state: country === 'US' && state ? state : undefined,
      zip_code: zip || undefined,
      reporter_name: !anonymous && reporterName ? reporterName : undefined,
      reporter_email: !anonymous && reporterEmail ? reporterEmail : undefined,
      reporter_phone: !anonymous && reporterPhone ? reporterPhone : undefined,
      consent_to_file: hasContactInfo && consentToFile,
    });
  }

  if (submit.isSuccess) {
    const report = submit.data;
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700 text-2xl">
          ✓
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Report received</h1>
        <p className="mt-2 text-slate-600">
          Thank you. Your report has been filed and will be reviewed by our team. Verified reports help build
          public alerts that protect others from the same scam.
        </p>
        {report?.consent_to_file && (
          <p className="mt-2 text-slate-600">
            Since you asked us to file this on your behalf, our team will submit it to the appropriate agency and
            record the confirmation — check back on the status page below for updates.
          </p>
        )}
        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-left">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Your report reference</p>
          <p className="mt-1 font-mono text-sm text-slate-900 break-all">{report?.id}</p>
          <p className="mt-2 text-xs text-slate-500">
            Save this code — it's the only way to look up your report's status later, and we can't recover it for
            you if you submitted anonymously.
          </p>
        </div>
        <Link
          to={`/report-status?id=${report?.id ?? ''}`}
          className="mt-4 inline-block px-5 py-2.5 rounded-md bg-slate-900 text-white font-medium hover:bg-slate-800"
        >
          Check report status
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <p className="text-xs font-semibold tracking-widest text-red-700 uppercase">Report a scam</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Tell us what happened</h1>
      <p className="mt-3 text-slate-600">
        Every field except the description is optional. Reports are reviewed by our team before any information
        is published — nothing here goes public automatically.
      </p>

      <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 flex gap-3">
        <span className="text-2xl leading-none">🛡️</span>
        <div>
          <p className="font-semibold text-slate-900">We can file this with the government for you — free</p>
          <p className="mt-1 text-sm text-slate-700">
            Add your contact info below and check the box near the end of this form, and our team will personally
            submit your report to the right agency (like the FTC or FBI IC3) and track it for you — one less thing
            you have to do yourself while dealing with this.
          </p>
        </div>
      </div>

      {PUBLIC_PHONE && (
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-4 flex items-center justify-between gap-3">
          <p className="text-sm text-slate-700">
            Prefer to talk to a real person instead of filling out a form?
          </p>
          <a
            href={telHref(PUBLIC_PHONE)}
            className="shrink-0 px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
          >
            Call {formatPhoneDisplay(PUBLIC_PHONE)}
          </a>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">
            What happened? <span className="text-red-700">*</span>
          </label>
          <textarea
            required
            minLength={10}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            placeholder="Describe the scam in as much detail as you can — how you were contacted, what they said, what they asked you to do…"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">Category (if known)</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Not sure / other</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="border border-slate-200 rounded-lg p-4">
          <legend className="px-1 text-sm font-semibold text-slate-900">How they contacted you</legend>
          <div className="grid gap-3 sm:grid-cols-2 mt-2">
            <input
              value={scammerPhone}
              onChange={(e) => setScammerPhone(e.target.value)}
              placeholder="Their phone number"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              value={scammerEmail}
              onChange={(e) => setScammerEmail(e.target.value)}
              placeholder="Their email address"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              value={scammerWebsite}
              onChange={(e) => setScammerWebsite(e.target.value)}
              placeholder="Their website / social profile"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
            />
          </div>
        </fieldset>

        <fieldset className="border border-slate-200 rounded-lg p-4">
          <legend className="px-1 text-sm font-semibold text-slate-900">Details</legend>
          <div className="grid gap-3 sm:grid-cols-2 mt-2">
            <input
              type="number"
              min="0"
              step="0.01"
              value={moneyLost}
              onChange={(e) => setMoneyLost(e.target.value)}
              placeholder="Money lost (USD, if any)"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              type="date"
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="OTHER">Other</option>
            </select>
            {country === 'US' ? (
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">State</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="Postal code (optional)"
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            )}
          </div>
        </fieldset>

        <fieldset className="border border-slate-200 rounded-lg p-4">
          <legend className="px-1 text-sm font-semibold text-slate-900">Your contact info (optional)</legend>
          <label className="flex items-center gap-2 text-sm text-slate-600 mt-1 mb-3">
            <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
            Report anonymously
          </label>
          {!anonymous && (
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="Your name"
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder="Your email"
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                placeholder="Your phone"
                className="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
              />
            </div>
          )}
        </fieldset>

        <fieldset className="border-2 border-red-200 bg-red-50/40 rounded-lg p-4">
          <legend className="px-1 text-sm font-semibold text-slate-900">Let us file this for you</legend>
          <label
            className={`flex items-start gap-2 text-sm ${hasContactInfo ? 'text-slate-700' : 'text-slate-400'}`}
          >
            <input
              type="checkbox"
              checked={consentToFile}
              disabled={!hasContactInfo}
              onChange={(e) => setConsentToFile(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              I authorize ScamShield National to file this report with the appropriate agency (such as the FTC or
              FBI IC3 in the U.S., or the equivalent national agency for other countries) on my behalf, using the
              information above.
            </span>
          </label>
          {!hasContactInfo && (
            <p className="mt-2 text-xs font-medium text-red-700">
              ⚠ Add your email or phone number above (and un-check "Report anonymously") to turn this on — we need
              a way to reach you about it.
            </p>
          )}
          <p className="mt-2 text-xs text-slate-500">
            A staff member personally submits it through the agency's own site — nothing is auto-submitted. Most
            agencies don't provide case-by-case updates back to filers, so "status" here means what we've done, not
            a promise of government follow-through or investigation.
          </p>
        </fieldset>

        {submit.isError && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            Couldn't submit your report. Please check the form and try again.
          </p>
        )}

        <button
          type="submit"
          disabled={submit.isPending}
          className="w-full py-3 rounded-md bg-slate-900 text-white font-medium disabled:opacity-50"
        >
          {submit.isPending ? 'Submitting…' : 'Submit report'}
        </button>
      </form>
    </div>
  );
}
