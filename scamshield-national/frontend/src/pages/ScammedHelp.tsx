import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useStateAgSources } from '../hooks/useStateAgSources';

// "I've been scammed — what now?" A recovery plan by situation. Every
// resource linked here is an official or long-established public service;
// the order of steps is what decides how much can still be recovered.

interface Resource {
  label: string;
  href: string;
  note: string;
}

interface Situation {
  key: string;
  label: string;
  icon: string;
  now: string[];
  today: string[];
  thisWeek: string[];
  resources: Resource[];
}

const FTC: Resource = { label: 'FTC — ReportFraud.ftc.gov', href: 'https://reportfraud.ftc.gov', note: 'The main U.S. place to report any scam. Shared with law enforcement nationwide.' };
const IC3: Resource = { label: 'FBI — IC3.gov', href: 'https://www.ic3.gov', note: 'Report online and crypto fraud, especially if you lost money.' };
const IDT: Resource = { label: 'IdentityTheft.gov', href: 'https://www.identitytheft.gov', note: 'A free, personal recovery plan from the FTC, with pre-filled letters.' };
const FREEZES: Resource[] = [
  { label: 'Equifax credit freeze', href: 'https://www.equifax.com/personal/credit-report-services/credit-freeze/', note: 'Free. Stops new accounts being opened in your name.' },
  { label: 'Experian credit freeze', href: 'https://www.experian.com/freeze/center.html', note: 'Free. Do all three bureaus.' },
  { label: 'TransUnion credit freeze', href: 'https://www.transunion.com/credit-freeze', note: 'Free. You can lift it any time.' },
];
const ELDER: Resource = { label: 'National Elder Fraud Hotline: 1-833-372-8311', href: 'tel:18333728311', note: 'U.S. Department of Justice. Free help for adults 60+ and their families, weekdays 10am–6pm ET.' };

const SITUATIONS: Situation[] = [
  {
    key: 'paid',
    label: 'I sent money',
    icon: '💸',
    now: [
      'Call your bank or card company on the number on the back of your card. Say "I was scammed" and ask them to stop or reverse the payment.',
      'Paid with a gift card? Call the company that issued the card (the brand on it) and keep the card and receipt.',
      'Sent crypto? Contact the exchange or Bitcoin ATM company with the transaction ID.',
      'Stop all contact with the scammer. Don\'t send more money for "fees" to get the first payment back.',
    ],
    today: [
      'Report it to the FTC, and to the FBI\'s IC3 if it happened online or involved crypto.',
      'Save everything: messages, emails, receipts, phone numbers, wallet addresses, screenshots.',
    ],
    thisWeek: [
      'Watch your accounts for more charges, and report it to your state Attorney General (below).',
      'Be ready for "recovery" scams: anyone who contacts you offering to get your money back for a fee is a second scam.',
    ],
    resources: [FTC, IC3],
  },
  {
    key: 'identity',
    label: 'I gave my SSN or ID',
    icon: '🪪',
    now: [
      'Freeze your credit at all three bureaus (links below). It\'s free and takes a few minutes each.',
      'If you also gave bank details, call your bank now.',
    ],
    today: [
      'Go to IdentityTheft.gov — it builds a recovery plan for exactly what you shared.',
      'Get your free credit reports at AnnualCreditReport.com and look for accounts you don\'t recognize.',
    ],
    thisWeek: [
      'Get an IRS Identity Protection PIN (irs.gov/ippin) so no one can file taxes in your name.',
      'Report it to the FTC and your state Attorney General.',
    ],
    resources: [IDT, ...FREEZES, { label: 'AnnualCreditReport.com', href: 'https://www.annualcreditreport.com', note: 'The only official site for free credit reports.' }],
  },
  {
    key: 'remote',
    label: 'They got into my computer',
    icon: '💻',
    now: [
      'Disconnect the computer from the internet (turn off Wi-Fi or unplug it).',
      'From a different device, change your email password first, then your bank and other important passwords.',
      'Call your bank: tell them someone had remote access and ask them to watch for transfers.',
    ],
    today: [
      'Uninstall the remote-access app they had you install (AnyDesk, TeamViewer and similar), then run a security scan.',
      'Turn on two-step verification for email and banking.',
    ],
    thisWeek: [
      'If they saw documents with your Social Security number, follow the "I gave my SSN" steps too.',
      'Report it to the FTC and the FBI\'s IC3.',
    ],
    resources: [FTC, IC3],
  },
  {
    key: 'hacked',
    label: 'An account was hacked',
    icon: '🔓',
    now: [
      'Use the service\'s official "hacked account" or "forgot password" page to get back in — not links from any message.',
      'Change the password, and change it anywhere else you used the same one.',
      'Turn on two-step verification, and check the recovery email and phone number haven\'t been changed.',
    ],
    today: [
      'Warn your contacts: hacked accounts are used to message friends asking for money or codes.',
      'Check for changes you didn\'t make: forwarding rules in email, new payees in banking, new devices signed in.',
    ],
    thisWeek: ['If money or your identity was involved, report it to the FTC.'],
    resources: [FTC, IDT],
  },
  {
    key: 'threat',
    label: 'Someone is threatening me',
    icon: '⚠️',
    now: [
      'Don\'t pay. Paying almost never ends it — it usually leads to more demands.',
      'Stop responding, but don\'t delete anything: screenshot the messages, usernames and payment requests.',
      'If you feel in danger, call 911.',
    ],
    today: [
      'Report it to the FBI at tips.fbi.gov or IC3.gov. Sextortion is a federal crime.',
      'If the person in the images is under 18, report it to NCMEC — Take It Down can help remove images.',
      'Block the person on every platform and report their account to the platform.',
    ],
    thisWeek: ['Talk to someone you trust. You are the victim of a crime, and you are not alone.'],
    resources: [
      { label: 'FBI tips', href: 'https://tips.fbi.gov', note: 'Report threats, extortion and sextortion.' },
      { label: 'NCMEC Take It Down', href: 'https://takeitdown.ncmec.org', note: 'Free help removing images of anyone under 18.' },
      IC3,
    ],
  },
  {
    key: 'loved_one',
    label: 'A loved one is being scammed',
    icon: '👵',
    now: [
      'Talk to them calmly — scammers coach victims to distrust family. Lead with care, not blame.',
      'If money is still moving, call their bank together and ask about holds or a trusted-contact person.',
    ],
    today: [
      'If they\'re 60 or older, call the National Elder Fraud Hotline for free, one-on-one help.',
      'Report it to the FTC and, if money was lost online, to the FBI\'s IC3.',
    ],
    thisWeek: [
      'Set up scam alerts for their state so you both hear about new scams early.',
      'If they\'re being exploited and can\'t protect themselves, contact Adult Protective Services in their area.',
    ],
    resources: [ELDER, FTC, IC3, { label: 'Find Adult Protective Services', href: 'https://www.napsa-now.org/help-in-your-area/', note: 'Local help for vulnerable adults.' }],
  },
];

function Steps({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  if (!items.length) return null;
  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
      <p className={`text-xs font-bold uppercase tracking-wider ${tone}`}>{title}</p>
      <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-slate-700">
        {items.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
    </div>
  );
}

function StateAgPicker() {
  const { data } = useStateAgSources();
  const [state, setState] = useState('');
  const ag = data?.find((s) => s.state === state);
  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
      <label htmlFor="help-state" className="text-xs font-bold uppercase tracking-wider text-slate-500">
        Report to your state Attorney General
      </label>
      <select
        id="help-state"
        value={state}
        onChange={(e) => setState(e.target.value)}
        className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
      >
        <option value="">Choose your state…</option>
        {(data ?? [])
          .slice()
          .sort((a, b) => a.state_name.localeCompare(b.state_name))
          .map((s) => (
            <option key={s.state} value={s.state}>
              {s.state_name}
            </option>
          ))}
      </select>
      {ag && (
        <a
          href={ag.consumer_protection_url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 block rounded-lg bg-slate-50 p-3 text-sm hover:bg-slate-100"
        >
          <span className="font-semibold text-slate-900">{ag.agency_name}</span>
          <span className="block text-[#8a2e2e] underline">File a consumer complaint →</span>
        </a>
      )}
    </div>
  );
}

export default function ScammedHelp() {
  useDocumentMeta({
    title: "I've Been Scammed — What Now?",
    description:
      'Step-by-step help if you sent money, gave out your Social Security number, let someone onto your computer, were hacked or threatened — and exactly where to report it.',
    path: '/help',
  });
  const [params, setParams] = useSearchParams();
  const active = SITUATIONS.find((s) => s.key === params.get('situation')) ?? null;

  return (
    <div>
      <section className="bg-gradient-to-b from-slate-950 to-[#0f1a2b] px-4 pb-16 pt-12 text-center text-white sm:pt-16">
        <p className="text-xs font-bold uppercase tracking-widest text-red-400">Help after a scam</p>
        <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-5xl">
          You&apos;ve been scammed. Here&apos;s what to do now.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-300 sm:text-lg">
          It happens to careful, smart people every day. Acting quickly gives you the best chance of getting money
          back and stopping it going further. Pick what happened:
        </p>
      </section>

      <div className="mx-auto -mt-8 max-w-4xl px-4 pb-16">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {SITUATIONS.map((s) => {
            const on = active?.key === s.key;
            return (
              <button
                key={s.key}
                type="button"
                aria-pressed={on}
                onClick={() => setParams(on ? {} : { situation: s.key }, { replace: true })}
                className={`flex min-h-[72px] items-center gap-3 rounded-xl p-4 text-left font-semibold shadow-sm ring-1 transition-colors ${
                  on ? 'bg-[#8a2e2e] text-white ring-[#8a2e2e]' : 'bg-white text-slate-900 ring-slate-200 hover:ring-slate-400'
                }`}
              >
                <span className="text-2xl" aria-hidden="true">
                  {s.icon}
                </span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {active ? (
          <div className="mt-8 rounded-2xl bg-slate-50 p-4 sm:p-6" aria-live="polite">
            <h2 className="text-xl font-bold text-slate-900">
              <span aria-hidden="true">{active.icon}</span> {active.label}
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <Steps title="Right now" items={active.now} tone="text-red-700" />
              <Steps title="Today" items={active.today} tone="text-amber-700" />
              <Steps title="This week" items={active.thisWeek} tone="text-slate-500" />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Where to report and get help</p>
                <ul className="mt-2 space-y-2.5">
                  {active.resources.map((r) => (
                    <li key={r.href}>
                      <a href={r.href} target="_blank" rel="noreferrer" className="font-semibold text-[#8a2e2e] underline">
                        {r.label}
                      </a>
                      <span className="block text-sm text-slate-600">{r.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <StateAgPicker />
            </div>
          </div>
        ) : (
          <p className="mt-6 text-center text-sm text-slate-500">Choose one above to see your step-by-step plan.</p>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link to="/check-now" className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:ring-slate-400">
            <p className="font-bold text-slate-900">Not sure it was a scam?</p>
            <p className="mt-1 text-sm text-slate-600">Paste the message, link or number into the free Scam Checker.</p>
          </Link>
          <Link to="/report" className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:ring-slate-400">
            <p className="font-bold text-slate-900">Warn others</p>
            <p className="mt-1 text-sm text-slate-600">
              Report it to ScamShield so we can spot the pattern and alert people near you.
            </p>
          </Link>
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">
          ScamShield National is a private consumer-protection service, not a government agency or law firm. In an
          emergency, call 911.
        </p>
      </div>
    </div>
  );
}
