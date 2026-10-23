import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { CONTACT_EMAIL, LEGAL_UPDATED, LegalPage } from '../components/LegalPage';

// Describes what the code actually does — keep it in step with the backend
// (users, scam_reports, report_filings, waitlist_signups, alert
// subscriptions, the Scam Checker's no-storage rule and its optional AI
// second opinion). Reviewed by counsel before public launch.
export default function Privacy() {
  useDocumentMeta({
    title: 'Privacy Policy',
    description: 'What ScamTitan International collects, why, who it is shared with, and the choices you have.',
    path: '/privacy',
  });

  return (
    <LegalPage
      eyebrow="Privacy Policy"
      title="Your privacy, in plain language."
      intro="People come to us at a vulnerable moment. We collect only what we need to help, we never sell it, and we tell you exactly what happens to it."
      updated={LEGAL_UPDATED}
    >
      <h2>The short version</h2>
      <ul>
        <li>You can read the scam database, use the Scam Checker and follow official alerts without an account.</li>
        <li>We do not sell or rent your personal information, and we do not use advertising trackers.</li>
        <li>What you paste into the Scam Checker is not saved.</li>
        <li>You can report a scam anonymously.</li>
        <li>You can ask us to see or delete your information at any time.</li>
      </ul>

      <h2>What we collect</h2>
      <p>
        <strong>When you create an account:</strong> your email address and a password (stored only in scrambled,
        hashed form, never readable by us), and optionally your ZIP code or state. If you choose text alerts, your
        mobile number. If you subscribe to a paid plan, your plan and billing status.
      </p>
      <p>
        <strong>Alert preferences:</strong> the states, countries or scam types you ask us to watch for you.
      </p>
      <p>
        <strong>When you report a scam:</strong> your description of what happened and any details you choose to give
        about the scammer (their phone number, email address or website), money lost, the date, and your country, state
        and ZIP code. Your own name, email and phone are optional; you can tick "Report anonymously" instead.
      </p>
      <p>
        <strong>When you ask us to file a report for you:</strong> your written authorization, the time you gave it, and
        a record of which agencies we filed with and any reference numbers they gave us.
      </p>
      <p>
        <strong>When you join the launch waitlist:</strong> your email address.
      </p>
      <p>
        <strong>When you use the Scam Checker:</strong> nothing is stored. The text is checked and then discarded. We do
        not open links you paste; we only read the web address.
      </p>
      <p>
        <strong>Technical information:</strong> like nearly every website, our servers briefly log basic request
        information such as IP address and browser type, which we use to keep the service secure and to limit abuse.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To run your account and send the alerts you asked for.</li>
        <li>
          To review scam reports and, where they reveal a new pattern, add an anonymized description of the scam to the
          database so others can be warned. We never publish your name or contact details.
        </li>
        <li>To file your report with the agencies you authorized, and to contact you about it.</li>
        <li>To process payments, prevent fraud and abuse, and keep the service secure.</li>
        <li>To tell you about the launch, if you joined the waitlist. One email, no spam.</li>
      </ul>

      <h2>Who we share it with</h2>
      <p>We share personal information only in these cases:</p>
      <ul>
        <li>
          <strong>Agencies you authorize.</strong> If you ask us to file a report for you, we send its details to the
          relevant agency, such as the FTC or the FBI's Internet Crime Complaint Center.
        </li>
        <li>
          <strong>Service providers that run the site for us,</strong> under contract and only for that purpose: hosting
          (Render, Vercel), payments (Stripe, which handles your card; we never see the full number), email delivery
          (SendGrid), text messages (Twilio), and an AI provider (Anthropic) that may give the Scam Checker a second
          opinion on the text you paste. That provider receives the text for that one check only.
        </li>
        <li>
          <strong>When the law requires it,</strong> or to protect someone from imminent harm.
        </li>
      </ul>

      <h2>Cookies and storage</h2>
      <p>
        We use your browser's storage to keep you signed in and to remember a few display preferences. We do not use
        advertising or cross-site tracking cookies.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep your account information while your account is open. Scam reports are kept so patterns can be tracked
        over time; if you ask, we will remove your contact details from a report you submitted. Waitlist emails are
        deleted after launch unless you create an account.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>Turn alerts off, or switch between email and text, at any time.</li>
        <li>Cancel a paid plan at any time; you keep it until the end of the period you paid for.</li>
        <li>
          Ask to see, correct or delete your information by emailing{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Depending on where you live (for example California
          or the EU), you may have additional legal rights; we honor those requests.
        </li>
      </ul>

      <h2>Security</h2>
      <p>
        Data is encrypted in transit, passwords are hashed, and access to reports is limited to the staff who review
        them. No system is perfectly secure, but we work hard to protect what you share with us.
      </p>

      <h2>Children</h2>
      <p>ScamTitan International is not directed to children under 13, and we do not knowingly collect their information.</p>

      <h2>Changes</h2>
      <p>
        If we change this policy, we will update the date above, and for significant changes we will tell account
        holders by email. See also our <Link to="/terms">Terms of Use</Link>.
      </p>
    </LegalPage>
  );
}
