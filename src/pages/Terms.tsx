import styles from './Legal.module.css'

export default function Terms() {
  return (
    <div className={styles.legal}>
      <div className={styles.container}>
        <h1>Terms of Service</h1>
        <p className={styles.lastUpdated}>Last updated: April 20, 2026</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By downloading, installing, or using the PlayByPlay Anime mobile
            application or this website (together, the "Service"), you agree
            to these Terms of Service ("Terms"). If you do not agree to these
            Terms, do not use the Service. We may update these Terms from
            time to time; material changes will be reflected by updating the
            "Last updated" date at the top of this page, and your continued
            use after an update means you accept the revised Terms.
          </p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            PlayByPlay Anime is a football companion app centred on Victoria,
            a 3D anime avatar who delivers real-time voice commentary during
            live matches, reacts to goals and key moments with expressive
            animations, and holds a two-way voice conversation with the user.
            The app also offers AI-generated win probabilities and written
            match analysis for upcoming fixtures across 13 major competitions
            (including the Premier League, La Liga, Bundesliga, Serie A,
            Ligue 1, Champions League, MLS, Euro 2024 and the World Cup
            2026). The Service is provided for entertainment and
            informational purposes only.
          </p>
        </section>

        <section>
          <h2>3. Eligibility</h2>
          <p>
            You must be at least 13 years old (or the minimum age of digital
            consent in your country, if higher) to use the Service. If you
            are under 18, you may only use the Service with the involvement
            and consent of a parent or legal guardian. By using the Service,
            you represent that you meet these requirements.
          </p>
        </section>

        <section>
          <h2>4. Account Registration</h2>
          <ul>
            <li>
              Sign-up requires a valid email address, a username (up to 20
              characters), and a password. You also choose an emoji avatar
              and a timezone.
            </li>
            <li>
              You must provide accurate information and keep your password
              confidential. You are responsible for all activity that takes
              place under your account.
            </li>
            <li>
              Notify us promptly at{' '}
              <a href="mailto:support@playbyplayai.org">
                support@playbyplayai.org
              </a>{' '}
              if you believe someone has used your account without
              permission.
            </li>
            <li>
              We may suspend or terminate accounts that violate these Terms
              or abuse the Service.
            </li>
          </ul>
        </section>

        <section>
          <h2>5. Credits and In-App Purchases</h2>
          <h3>5.1 How credits work</h3>
          <p>
            Certain features of the Service are consumable and priced in
            credits. New accounts receive a welcome bonus of 10 free
            credits. Additional credits can be bought through in-app
            purchases in the App Store or Google Play Store, in packs of
            10, 50, 150 or 500 credits.
          </p>

          <h3>5.2 What credits are used for</h3>
          <ul>
            <li>
              <strong>AI match prediction:</strong> 1 credit per fixture.
              Once generated, re-opening the same prediction for the same
              match is free for you.
            </li>
            <li>
              <strong>Live commentary with Victoria:</strong> 2 credits to
              enter a live-match commentary room, plus 2 additional credits
              for every 5 minutes you remain in the session.
            </li>
          </ul>
          <p>
            We may change the credit price of features in future versions of
            the app. Any change will only apply to new activity taking place
            after the change.
          </p>

          <h3>5.3 Credit rules</h3>
          <ul>
            <li>
              Credits have no cash value and cannot be exchanged for money
              or transferred between accounts.
            </li>
            <li>Credits do not expire while your account is active.</li>
            <li>
              Credits are non-refundable once consumed, except where a
              refund is required by applicable consumer-protection law.
            </li>
            <li>
              Any remaining credit balance is forfeited if your account is
              terminated for violation of these Terms.
            </li>
          </ul>

          <h3>5.4 Purchases and refunds</h3>
          <p>
            All in-app purchases are processed by Apple (App Store) or
            Google (Play Store) through our purchase provider, RevenueCat.
            We do not handle or store payment-card information. Refund
            requests for purchases must be submitted to Apple or Google in
            accordance with their refund policies — we are not able to
            refund App Store or Play Store purchases directly.
          </p>
        </section>

        <section>
          <h2>6. Microphone &amp; Voice Interaction</h2>
          <p>
            Live commentary uses your device microphone so you can talk to
            Victoria. By entering a commentary session you consent to your
            voice being captured and streamed to our commentary backend for
            real-time transcription and response. The raw audio is not
            retained after the session ends; see our{' '}
            <a href="/privacy">Privacy Policy</a> for details. Do not use
            voice input to share sensitive personal information.
          </p>
        </section>

        <section>
          <h2>7. User Conduct</h2>
          <p>When using the Service, you agree not to:</p>
          <ul>
            <li>Use the Service for any unlawful purpose.</li>
            <li>
              Use the Service as a tool for real-money gambling, wagering
              or betting. PlayByPlay Anime is an entertainment companion,
              not a betting platform, and AI predictions are not betting
              advice.
            </li>
            <li>
              Create duplicate or fraudulent accounts in order to exploit
              the welcome-credit bonus, in-app purchases, or any other part
              of the credit system.
            </li>
            <li>
              Attempt to reverse-engineer, decompile, scrape, or otherwise
              tamper with the app, its APIs, or the 3D avatar assets.
            </li>
            <li>
              Use automated scripts, bots, or other tools to interact with
              the Service, including to trigger commentary sessions or
              predictions without your direct input.
            </li>
            <li>
              Interfere with, overload, or disrupt the Service, its
              servers, or the backend voice session infrastructure.
            </li>
            <li>
              Use the voice channel or any chat input to transmit
              harassing, hateful, sexually explicit, or otherwise abusive
              content, or content that infringes the rights of others.
            </li>
            <li>
              Choose a username or emoji avatar that is offensive,
              impersonates another person, or misrepresents your
              affiliation with any entity.
            </li>
          </ul>
        </section>

        <section>
          <h2>8. AI Features Disclaimer</h2>
          <p>
            AI win probabilities, written match analysis, and Victoria's
            commentary are generated by large language models and related
            AI systems, using live match data supplied by our third-party
            football-data provider. AI output can be inaccurate, incomplete,
            or out of date and should be treated as entertainment and
            conversation only. Do not rely on it to make wagers, financial
            decisions, or any decision with material consequences. Victoria
            is a fictional character and her statements do not represent
            the views of PlayByPlay Anime, any club, any player, or any
            competition organiser.
          </p>
        </section>

        <section>
          <h2>9. Third-Party Services and Data</h2>
          <p>
            The Service relies on third-party providers, including API-Football
            (api-sports.io) for live match fixtures and statistics, LiveKit
            for real-time voice transport, and RevenueCat together with
            Apple and Google for in-app purchases. We do not guarantee the
            accuracy, completeness, or timeliness of third-party data, and
            Service availability may be affected by third-party outages or
            rate limits. Team names, club crests, competition names, player
            names, and similar marks referenced in the app remain the
            property of their respective owners and are used for
            informational purposes only.
          </p>
        </section>

        <section>
          <h2>10. Intellectual Property</h2>
          <p>
            The Service and all of its original content — including but not
            limited to the Victoria 3D character and her voice, text
            responses, animations, logos, UI designs, graphics, code, and
            branding — are the property of PlayByPlay Anime or its
            licensors and are protected by copyright, trademark, and other
            intellectual-property laws. You are granted a personal,
            limited, non-exclusive, non-transferable, revocable licence to
            use the Service for its intended purpose on your own devices.
          </p>
          <p>
            You may not copy, redistribute, modify, create derivative works
            from, publicly display, or commercially exploit any part of the
            Service — including by extracting the 3D avatar, voice model,
            AI prompts, or any other asset — without our prior written
            consent.
          </p>
        </section>

        <section>
          <h2>11. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, PlayByPlay
            Anime and its officers, directors, employees, and agents shall
            not be liable for any indirect, incidental, special,
            consequential, or punitive damages, including but not limited
            to loss of profits, data, or goodwill, arising from your use of
            or inability to use the Service.
          </p>
          <p>
            Our total aggregate liability for any claim arising out of or
            relating to these Terms shall not exceed the greater of (a) the
            amount you actually paid us for credits in the twelve (12)
            months preceding the claim, or (b) USD 50.
          </p>
        </section>

        <section>
          <h2>12. Disclaimer of Warranties</h2>
          <p>
            The Service is provided "as is" and "as available" without
            warranties of any kind, either express or implied, including
            implied warranties of merchantability, fitness for a particular
            purpose, and non-infringement. We do not warrant that the
            Service will be uninterrupted, error-free, or secure, that
            commentary sessions will connect on every attempt, or that AI
            predictions will be accurate.
          </p>
        </section>

        <section>
          <h2>13. Termination</h2>
          <p>
            We may suspend or terminate your access to the Service at our
            reasonable discretion, without prior notice, for conduct that
            we believe violates these Terms or is harmful to the Service or
            to other users.
          </p>
          <p>
            You can stop using the Service at any time by signing out and
            removing the app from your device. Account deletion is handled
            by our support team — email us at{' '}
            <a href="mailto:support@playbyplayai.org">
              support@playbyplayai.org
            </a>{' '}
            from the address registered on your account and we will verify
            and action the request. Any unused credits will be forfeited
            when the account is deleted.
          </p>
        </section>

        <section>
          <h2>14. Governing Law and Dispute Resolution</h2>
          <p>
            These Terms are governed by the laws of the State of Delaware,
            United States, without regard to its conflict-of-law
            principles. Any dispute arising from these Terms or the Service
            shall be resolved through binding individual arbitration
            administered under the rules of the American Arbitration
            Association, except that either party may seek injunctive or
            equitable relief in a court of competent jurisdiction. You and
            PlayByPlay Anime agree that disputes will be resolved on an
            individual basis only, and not as part of a class, consolidated,
            or representative action.
          </p>
        </section>

        <section>
          <h2>15. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable or
            invalid, that provision will be limited or eliminated to the
            minimum extent necessary so that the remaining provisions
            remain in full force and effect.
          </p>
        </section>

        <section>
          <h2>16. Contact Us</h2>
          <p>
            If you have questions about these Terms of Service, please
            contact us at:
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
