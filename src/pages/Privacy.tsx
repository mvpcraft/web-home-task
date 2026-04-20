import styles from './Legal.module.css'

export default function Privacy() {
  return (
    <div className={styles.legal}>
      <div className={styles.container}>
        <h1>Privacy Policy</h1>
        <p className={styles.lastUpdated}>Last updated: March 17, 2026</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            PlayByPlay Anime ("we," "our," or "us") is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you use our mobile application and website
            (collectively, the "Service"). Please read this policy carefully. By using
            the Service, you consent to the data practices described in this policy.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <h3>2.1 Information You Provide</h3>
          <ul>
            <li>
              <strong>Account Information:</strong> When you create an account, we
              collect your display name, email address, and password. You may optionally
              provide a profile picture.
            </li>
            <li>
              <strong>Prediction Data:</strong> We store the match predictions you
              submit, including predicted scores and outcomes, to calculate leaderboard
              rankings and display your prediction history.
            </li>
            <li>
              <strong>Payment Information:</strong> When you purchase credits through
              in-app purchases, payment processing is handled by Apple (App Store) or
              Google (Play Store). We do not directly collect or store your credit card
              number or banking information. We receive a transaction confirmation and
              purchase receipt.
            </li>
            <li>
              <strong>Communications:</strong> If you contact us through our support
              channels, we collect the content of your messages and any information you
              choose to provide.
            </li>
          </ul>

          <h3>2.2 Information Collected Automatically</h3>
          <ul>
            <li>
              <strong>Usage Data:</strong> We collect information about how you interact
              with the Service, including features used, matches viewed, predictions
              made, and time spent in the app.
            </li>
            <li>
              <strong>Device Information:</strong> We collect device type, operating
              system version, unique device identifiers, and mobile network information.
            </li>
            <li>
              <strong>Log Data:</strong> Our servers automatically record information
              including your IP address, browser type, referring/exit pages, and
              timestamps.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve the Service</li>
            <li>Process your predictions and calculate leaderboard standings</li>
            <li>Manage your account and credit balance</li>
            <li>Send match reminders and prediction deadline notifications</li>
            <li>Provide AI-powered win probability analysis and anime commentary features</li>
            <li>Respond to your support requests and communications</li>
            <li>Detect, prevent, and address technical issues and fraudulent activity</li>
            <li>Analyze usage trends to improve user experience</li>
          </ul>
        </section>

        <section>
          <h2>4. Information Sharing and Disclosure</h2>
          <p>We do not sell your personal information. We may share information in the following circumstances:</p>
          <ul>
            <li>
              <strong>Public Leaderboards:</strong> Your display name and prediction
              scores are visible to other users on global and league leaderboards.
            </li>
            <li>
              <strong>Private Leagues:</strong> Members of a private league can see your
              display name, predictions (after matches begin), and score within that
              league.
            </li>
            <li>
              <strong>Service Providers:</strong> We share data with third-party service
              providers who help us operate the Service (e.g., cloud hosting, analytics).
              These providers are contractually obligated to use your data only as
              necessary to provide services to us.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose information if
              required by law, regulation, legal process, or governmental request.
            </li>
          </ul>
        </section>

        <section>
          <h2>5. Data Retention</h2>
          <p>
            We retain your personal information for as long as your account is active
            or as needed to provide the Service. If you request account deletion, we
            will delete your personal data within 30 days, except where we are required
            to retain it for legal or legitimate business purposes (e.g., transaction
            records for accounting).
          </p>
        </section>

        <section>
          <h2>6. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your information,
            including encryption in transit (TLS/SSL) and at rest, secure cloud
            infrastructure (AWS), and regular security assessments. However, no method
            of electronic storage or transmission is 100% secure, and we cannot
            guarantee absolute security.
          </p>
        </section>

        <section>
          <h2>7. Your Rights and Choices</h2>
          <p>Depending on your jurisdiction, you may have the following rights:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
            <li><strong>Correction:</strong> Request correction of inaccurate data.</li>
            <li><strong>Deletion:</strong> Request deletion of your account and associated data.</li>
            <li><strong>Opt-Out:</strong> Opt out of promotional communications at any time by adjusting your notification settings in the app.</li>
            <li><strong>Data Portability:</strong> Request your data in a portable format.</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{' '}
            <a href="mailto:privacy@playbyplayanime.com">privacy@playbyplayanime.com</a>.
          </p>
        </section>

        <section>
          <h2>8. Children's Privacy</h2>
          <p>
            The Service is not intended for children under the age of 13. We do not
            knowingly collect personal information from children under 13. If we become
            aware that a child under 13 has provided us with personal information, we
            will take steps to delete that information promptly.
          </p>
        </section>

        <section>
          <h2>9. Third-Party Services</h2>
          <p>
            The Service integrates with third-party APIs for live match data
            (API-Football) and may contain links to third-party websites. We are not
            responsible for the privacy practices of these third parties. We encourage
            you to review their privacy policies.
          </p>
        </section>

        <section>
          <h2>10. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than
            your country of residence, including the United States, where our servers are
            located. We ensure appropriate safeguards are in place for such transfers in
            compliance with applicable data protection laws.
          </p>
        </section>

        <section>
          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of
            material changes by posting the new policy on this page and updating the
            "Last updated" date. Your continued use of the Service after changes are
            posted constitutes your acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2>12. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or our data
            practices, please contact us at:
          </p>
          <ul>
            <li>Email: <a href="mailto:privacy@playbyplayanime.com">privacy@playbyplayanime.com</a></li>
            <li>Website: <a href="/contact">Contact Form</a></li>
          </ul>
        </section>
      </div>
    </div>
  )
}
