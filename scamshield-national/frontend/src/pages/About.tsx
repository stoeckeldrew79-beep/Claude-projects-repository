import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useStats } from '../hooks/useStats';
import { CONTACT_EMAIL, LegalPage } from '../components/LegalPage';

export default function About() {
  useDocumentMeta({
    title: 'About ScamTitan International',
    description:
      'ScamTitan International is an independent consumer-protection company that documents scams worldwide and helps people recognize, report and recover from them.',
    path: '/about',
  });
  const { data: stats } = useStats();
  const fmt = (n?: number) => (n ? n.toLocaleString() : '—');

  return (
    <LegalPage
      eyebrow="About us"
      title="Scam intelligence that works for you."
      intro="ScamTitan International is an independent consumer-protection company. We have one focus: scams and the people who run them."
    >
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { n: fmt(stats?.scams), l: 'scams documented' },
          { n: fmt(stats?.countries), l: 'countries covered' },
          { n: fmt(stats?.sources), l: 'official sources linked' },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-4 text-center sm:p-5">
            <p className="text-xl font-extrabold sm:text-3xl tracking-tight text-[#b91c1c]">{s.n}</p>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">{s.l}</p>
          </div>
        ))}
      </div>

      <h2>Why we exist</h2>
      <p>
        Scammers move faster than the warnings meant to stop them. A new scheme can reach thousands of people before
        a single alert is published, and when warnings do appear they are scattered across hundreds of agency
        websites, press releases and news reports that most people never see.
      </p>
      <p>
        We bring that information together in one place, explain it in plain language, and put it in front of people
        before the scam reaches them.
      </p>

      <h2>What we do</h2>
      <ul>
        <li>
          <strong>Document scams worldwide.</strong> Every entry in our <Link to="/database">scam database</Link> is
          drawn from an official enforcement source or established reporting, with a link to where it came from.
        </li>
        <li>
          <strong>Watch official warnings as they are published.</strong> We follow{' '}
          <Link to="/state-attorneys-general">State Attorneys General</Link>, <Link to="/federal">federal agencies</Link>{' '}
          and <Link to="/global-sources">consumer-protection authorities</Link> around the world.
        </li>
        <li>
          <strong>Help you decide in the moment.</strong> The free <Link to="/check-now">Scam Checker</Link> compares a
          call, text or email against the warning signs real scams use.
        </li>
        <li>
          <strong>Help after the fact.</strong> Our <Link to="/help">recovery guide</Link> walks you through what to do,
          step by step, and our <Link to="/report">report form</Link> lets you warn others.
        </li>
        <li>
          <strong>Teach how scams work.</strong> Hundreds of <Link to="/articles">guides</Link> and the true stories
          behind history's <Link to="/notorious">most notorious frauds</Link>.
        </li>
      </ul>

      <h2>Independent, and on your side</h2>
      <p>
        ScamTitan International is a private company. We are not a government agency, a law firm or a bank, and we are
        not affiliated with or endorsed by any of the agencies whose warnings we follow. We do not sell your personal
        information, and the scam database is free for everyone to read.
      </p>

      <h2>Get in touch</h2>
      <p>
        Questions, corrections or press enquiries: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. If you spot
        an error in an entry, tell us and we will fix it.
      </p>
    </LegalPage>
  );
}
