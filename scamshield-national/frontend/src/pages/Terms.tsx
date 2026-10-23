import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { CONTACT_EMAIL, LEGAL_UPDATED, LegalPage } from '../components/LegalPage';

// Plain-language terms. Reviewed by counsel before public launch — the
// governing-law and dispute clauses in particular depend on how and where
// the company is organized.
export default function Terms() {
  useDocumentMeta({
    title: 'Terms of Use',
    description: 'The terms for using ScamTitan International, its scam database, Scam Checker, reports and alert plans.',
    path: '/terms',
  });

  return (
    <LegalPage
      eyebrow="Terms of Use"
      title="The terms, without the fine print."
      intro="By using ScamTitan International you agree to these terms. We have written them to be read, not skimmed."
      updated={LEGAL_UPDATED}
    >
      <h2>What we are, and what we are not</h2>
      <p>
        ScamTitan International is a private consumer-protection information service. We are not a government agency,
        a law enforcement body, a law firm, a bank or a financial adviser, and we are not affiliated with or endorsed by
        any agency whose warnings we report. Nothing on this site is legal, financial or investment advice. In an
        emergency, call 911 or your local emergency number.
      </p>

      <h2>The information we publish</h2>
      <p>
        Scam entries, alerts and articles are based on official enforcement sources and established reporting, and we
        link to those sources. We work to keep them accurate and current, but scams change quickly and sources can be
        wrong or updated after we publish. The information is provided "as is" for general awareness. If you find an
        error, please tell us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
      <p>
        Profiles of notorious frauds describe matters of public record, such as convictions, regulatory actions and
        court filings, as reported by the cited sources.
      </p>

      <h2>The Scam Checker</h2>
      <p>
        The Scam Checker gives an automated assessment of the warning signs in what you paste. It can be wrong in
        either direction: a message it rates as low risk can still be a scam. Treat its result as one input, and
        when money or personal information is involved, verify independently using a phone number or website you
        already trust.
      </p>

      <h2>Reports you submit</h2>
      <ul>
        <li>Only submit information that is true to the best of your knowledge.</li>
        <li>
          You allow us to use your report to warn others. Anything we publish from it is anonymized; we never publish
          your name or contact details.
        </li>
        <li>Do not use the report form to harass anyone or to make accusations you know to be false.</li>
      </ul>

      <h2>Filing on your behalf</h2>
      <p>
        If you tick the authorization box on the report form, you ask us to submit your report to the appropriate
        agency for you, using the information you provided. A member of our staff submits it through the agency's own
        public channel. Filing does not make us your lawyer or representative in any proceeding, and we cannot
        guarantee that an agency will investigate, contact you, or recover any money. Agencies generally do not share
        case-by-case updates with the people who file.
      </p>

      <h2>Accounts</h2>
      <p>
        Keep your password private; you are responsible for activity on your account. We may suspend accounts used for
        abuse, fraud or attacks on the service.
      </p>

      <h2>Paid plans</h2>
      <ul>
        <li>
          Plans are billed monthly in advance through our payment processor, Stripe, at the price shown on the{' '}
          <Link to="/subscribe">plans page</Link> when you subscribe.
        </li>
        <li>Your plan renews automatically each month until you cancel.</li>
        <li>
          You can cancel at any time from your account. Cancellation takes effect at the end of the current billing
          period, and you keep your plan until then.
        </li>
        <li>
          Alerts depend on email and mobile networks outside our control, so we cannot guarantee that every alert
          arrives, or arrives before a scam reaches you.
        </li>
        <li>If we change a plan's price, we will tell you in advance and the change will apply from your next period.</li>
      </ul>

      <h2>Acceptable use</h2>
      <p>
        Do not try to disrupt or break into the service, scrape it in bulk in a way that degrades it for others, or use
        it to plan or carry out fraud.
      </p>

      <h2>Links to other sites</h2>
      <p>
        We link to government agencies, news outlets and other sites we do not control, and we are not responsible for
        their content.
      </p>

      <h2>Limits of our responsibility</h2>
      <p>
        To the fullest extent the law allows, ScamTitan International is not liable for losses caused by scams, by
        decisions you make based on the information here, or by delays or errors in alerts, and our total liability to
        you for any claim is limited to the amount you paid us in the twelve months before it. Some places do not allow
        these limits, so they may not apply to you.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms. We will change the date above and, for significant changes, tell account holders by
        email. Continuing to use the service after a change means you accept the new terms. See also our{' '}
        <Link to="/privacy">Privacy Policy</Link>.
      </p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </LegalPage>
  );
}
