import styles from './Legal.module.css'

export default function Privacy() {
  return (
    <div className={styles.legal}>
      <div className={styles.container}>
        <h1>Privacy Policy</h1>
        <p className={styles.lastUpdated}>Last updated: April 20, 2026</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            PlayByPlay Anime ("we," "our," or "us") respects your privacy. This
            Privacy Policy describes what information we collect when you use the
            PlayByPlay Anime mobile application and this website (together, the
            "Service"), how we use it, and who we share it with. By using the
            Service you agree to the practices described below.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <h3>2.1 Information You Provide</h3>
          <ul>
            <li>
              <strong>Account information:</strong> when you sign up we collect
              your email address, a username (up to 20 characters), and a
              password. You also choose an emoji avatar (for example
              ⭐, 👑 or ⚽) — we do not collect or store profile photos.
            </li>
            <li>
              <strong>Profile preferences:</strong> you select a timezone
              (an IANA zone such as <code>Europe/London</code>) so match
              kick-off times display correctly. You can update your username,
              emoji avatar, timezone and password at any time from the Profile
              tab.
            </li>
            <li>
              <strong>Voice input during live commentary:</strong> when you
              enter a live-match commentary room, you can talk to Victoria, our
              3D anime avatar. Your voice is captured through your device
              microphone and streamed in real time to our commentary backend,
              where it is transcribed to text so Victoria can respond. The raw
              audio is processed for the duration of the session and is not
              stored on our servers after the session ends; only the resulting
              text transcript is held in memory during the conversation for
              context.
            </li>
            <li>
              <strong>AI prediction requests:</strong> when you request an AI
              match prediction, the match identifier and your account identifier
              are sent to our backend, which generates probabilities and written
              analysis and caches the result against that match so you can
              re-open it without being charged a second credit.
            </li>
            <li>
              <strong>Purchase records:</strong> when you buy credits, the
              payment itself is processed by Apple (App Store) or Google (Play
              Store) through our in-app purchase provider, RevenueCat. We do
              not see or store your card number, bank details, or billing
              address. We receive the transaction receipt and an entitlement
              confirmation from RevenueCat, which we use to credit your account
              and keep a transaction history in the app.
            </li>
            <li>
              <strong>Support communications:</strong> if you email support or
              use the contact form, we keep the content of your message and any
              contact details you include so that we can reply.
            </li>
          </ul>

          <h3>2.2 Information Collected Automatically</h3>
          <ul>
            <li>
              <strong>Session data:</strong> after you log in, a session token
              (a JWT) is issued by our backend and stored locally on your
              device so you stay signed in between app launches.
            </li>
            <li>
              <strong>Device &amp; log data:</strong> our servers log basic
              request information such as IP address, request timestamps, the
              API endpoint called, and the platform (iOS or Android) making the
              request. We use this to operate the Service, diagnose issues and
              protect against abuse.
            </li>
            <li>
              <strong>No third-party analytics or ad SDKs:</strong> we do not
              integrate Google Analytics, Firebase Analytics, Amplitude,
              Mixpanel, Segment, attribution SDKs, or advertising networks in
              the mobile app. We do not show ads and we do not sell or share
              data for advertising.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Create and maintain your account and keep you signed in.</li>
            <li>
              Process in-app purchases and track your credit balance and
              transaction history.
            </li>
            <li>
              Generate AI win-probability predictions and written analysis on
              request.
            </li>
            <li>
              Power live commentary with Victoria — including streaming audio,
              transcribing your voice, generating responses and synthesizing
              her replies back to you.
            </li>
            <li>Respond to your support requests.</li>
            <li>
              Detect and prevent fraud, abuse, and technical problems with the
              Service.
            </li>
          </ul>
        </section>

        <section>
          <h2>4. Device Permissions</h2>
          <p>
            The app requests the following permissions on your device. You can
            revoke any of them at any time in your device's system settings,
            though some features will stop working if you do.
          </p>
          <ul>
            <li>
              <strong>Microphone</strong> (iOS and Android): required to talk
              to Victoria during live commentary. Not used for any other
              purpose and not used in the background.
            </li>
            <li>
              <strong>Network / internet</strong> (Android): required to
              contact our backend and stream commentary audio.
            </li>
            <li>
              <strong>Modify audio settings and vibrate</strong> (Android):
              used to configure the audio session for voice playback and
              haptic feedback during live moments.
            </li>
          </ul>
          <p>
            The app does <strong>not</strong> request access to your camera,
            contacts, location, calendar, photos, or push notifications.
          </p>
        </section>

        <section>
          <h2>5. Who We Share Information With</h2>
          <p>
            We do not sell your personal information. We share data only with
            the service providers we need to operate the app, and only to the
            extent each one needs. The providers we use are:
          </p>
          <ul>
            <li>
              <strong>Apple App Store and Google Play Store</strong> — process
              your in-app purchases. Their own privacy policies apply to the
              payment itself.
            </li>
            <li>
              <strong>RevenueCat</strong> — validates purchase receipts from
              Apple / Google and confirms which credit pack you bought. We
              send RevenueCat your account identifier so it can attach the
              purchase to the right account.
            </li>
            <li>
              <strong>LiveKit</strong> — provides the real-time audio room for
              live commentary. Your voice audio and text messages flow through
              LiveKit during an active session.
            </li>
            <li>
              <strong>API-Football (api-sports.io)</strong> — provides live
              match fixtures, scores, and statistics. We query public match
              data from this provider; we do <strong>not</strong> send them
              your account or personal information.
            </li>
            <li>
              <strong>Cloud hosting</strong> — our backend API runs on
              Amazon Web Services (AWS) in the United States.
            </li>
          </ul>
          <p>
            We may also disclose information if we are required to by law, a
            valid legal request, or to protect our rights, users, or the
            public.
          </p>
        </section>

        <section>
          <h2>6. What We Do Not Collect</h2>
          <p>
            To be explicit about what the app does <em>not</em> do today:
          </p>
          <ul>
            <li>We do not collect payment card numbers or banking details.</li>
            <li>We do not collect your real name or date of birth.</li>
            <li>We do not collect location data or your contact list.</li>
            <li>
              We do not record or store your voice audio after a commentary
              session ends.
            </li>
            <li>
              We do not run behavioural analytics SDKs or advertising trackers
              in the app.
            </li>
            <li>
              There are no public leaderboards, friend lists, or social feeds
              in the current version of the app, so your predictions and
              commentary sessions are not visible to other users.
            </li>
          </ul>
        </section>

        <section>
          <h2>7. Data Retention</h2>
          <p>
            We keep your account data for as long as your account exists. If
            you ask us to delete your account, we will delete your profile,
            credit balance, and cached predictions from our active systems
            within 30 days. We may retain a minimal record of purchase
            transactions for longer where we are required to by tax, accounting
            or consumer-protection law. Backups are overwritten on a rolling
            schedule.
          </p>
        </section>

        <section>
          <h2>8. Security</h2>
          <p>
            All traffic between the app and our backend is encrypted in
            transit using HTTPS/TLS. Passwords are never stored in the app
            itself — the app holds a session token issued by our backend.
            Purchase validation relies on signed receipts from Apple / Google
            and RevenueCat, so credit grants cannot be forged client-side.
            No system is perfectly secure, and we cannot guarantee absolute
            security, but we follow industry-standard practices to protect
            your data.
          </p>
        </section>

        <section>
          <h2>9. Your Rights</h2>
          <p>
            Depending on where you live (for example, under the EU GDPR or the
            California CCPA), you may have the right to:
          </p>
          <ul>
            <li>Access the personal data we hold about you.</li>
            <li>Correct data that is inaccurate or incomplete.</li>
            <li>Delete your account and associated personal data.</li>
            <li>Receive your data in a portable format.</li>
            <li>Object to, or restrict, certain types of processing.</li>
          </ul>
          <p>
            Account deletion is currently handled by our support team — email
            us at{' '}
            <a href="mailto:support@playbyplayai.org">
              support@playbyplayai.org
            </a>{' '}
            from the address on your account and we will verify and action the
            request. The same address can be used for any of the other rights
            listed above.
          </p>
        </section>

        <section>
          <h2>10. Children's Privacy</h2>
          <p>
            PlayByPlay Anime is not intended for children under the age of 13
            (or the minimum age of digital consent in your country, if
            higher). We do not knowingly collect personal information from
            children under that age. If you believe a child has created an
            account, please contact us and we will delete the account.
          </p>
        </section>

        <section>
          <h2>11. International Data Transfers</h2>
          <p>
            Our backend is hosted in the United States. If you use the Service
            from outside the United States, your information will be
            transferred to, stored, and processed in the United States and in
            any other country where our service providers operate. We rely on
            standard contractual safeguards where required by applicable law.
          </p>
        </section>

        <section>
          <h2>12. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy as the app evolves. When we make
            a material change we will update the "Last updated" date at the top
            of this page and, where appropriate, surface a notice inside the
            app. Your continued use of the Service after an update means you
            accept the revised policy.
          </p>
        </section>

        <section>
          <h2>13. Contact Us</h2>
          <p>
            For any questions about this Privacy Policy or the data we hold
            about you, please contact:
          </p>
          <ul>
            <li>
              Email:{' '}
              <a href="mailto:support@playbyplayai.org">
                support@playbyplayai.org
              </a>
            </li>
            <li>
              Website: <a href="/contact">Contact form</a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
