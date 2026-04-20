import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Zap, Trophy, BarChart3, MessageCircle, Shield, Mic, Globe,
  ChevronDown, ChevronUp, Smartphone, Star, TrendingUp
} from 'lucide-react'
import styles from './Home.module.css'

const features = [
  {
    icon: <MessageCircle size={28} />,
    title: 'Victoria, Your Anime Commentator',
    description:
      'A fully-rigged 3D anime avatar who joins you in live-match commentary rooms. She speaks out loud in natural voice, her mouth syncs to every word, and her face shifts between excited, shocked, happy, sad, and tense as the action unfolds.',
  },
  {
    icon: <Mic size={28} />,
    title: 'Talk Back With Your Voice',
    description:
      'Hold a two-way conversation while the match plays. Speak into your mic and Victoria listens, transcribes you in real time, and replies with her own voice — ask about a player, debate a decision, or just chat.',
  },
  {
    icon: <BarChart3 size={28} />,
    title: 'AI Win Probability + Analysis',
    description:
      'Tap any fixture for an AI-generated home / draw / away probability and a written breakdown of why — powered by our backend using live form and head-to-head data. Results are cached per match so re-opening is free.',
  },
  {
    icon: <Trophy size={28} />,
    title: '13 Major Competitions',
    description:
      'Premier League, La Liga, Bundesliga, Serie A, Ligue 1, UEFA Champions League, Eredivisie, Primeira Liga, MLS, USL Championship, NWSL, UEFA Euro 2024, and the FIFA World Cup 2026 — all in one place.',
  },
  {
    icon: <Globe size={28} />,
    title: 'Live Fixtures, Your Timezone',
    description:
      'Real-time scores, fixtures, and match events sourced from a professional football data provider. Pick your IANA timezone once and every kick-off time shows in your local clock. Filter matches by Europe, USA, or International.',
  },
  {
    icon: <Zap size={28} />,
    title: 'Credits, Not Subscriptions',
    description:
      'Every new account gets 10 free welcome credits. Top up in packs of 10, 50, 150 or 500 — credits never expire, there are no monthly fees, no ads, and no betting. Predictions cost 1 credit; commentary costs 2 credits to join plus 2 every 5 minutes.',
  },
]

const howItWorks = [
  {
    step: '01',
    title: 'Sign Up, Get 10 Credits',
    description:
      'Create your account with an email, a username, and an emoji avatar. Set your timezone so kick-off times land right. No card, no subscription — 10 welcome credits drop in the moment you sign up.',
  },
  {
    step: '02',
    title: 'Pick a Match',
    description:
      'Open the Matches tab to see every live and upcoming fixture across 13 competitions — Premier League, La Liga, Champions League, MLS, the World Cup 2026, and more. Filter by Europe, USA or International, or search by team name.',
  },
  {
    step: '03',
    title: 'Get the AI Read (1 Credit)',
    description:
      'Tap any upcoming fixture and ask for an AI prediction. Our backend analyses recent form and head-to-head history and gives you home / draw / away probabilities plus a written breakdown. Once generated, re-opening the same prediction is free.',
  },
  {
    step: '04',
    title: 'Watch Live With Victoria',
    description:
      'When a match kicks off, enter the commentary room (2 credits, then 2 every 5 min). Victoria greets the match, reacts to goals, cards and big moments in real time — and when you speak into your mic, she listens, transcribes you, and replies out loud.',
  },
]

const faqs = [
  {
    q: 'What is PlayByPlay Anime?',
    a: 'PlayByPlay Anime is a mobile companion app for football fans. Meet Victoria, a 3D anime avatar who delivers real-time voice commentary during live matches, reacts to goals and key moments with expressive animations, and holds a two-way voice conversation with you. You can also request AI-powered win probabilities and match analysis for upcoming fixtures.',
  },
  {
    q: 'Who is Victoria?',
    a: 'Victoria is the 3D anime avatar at the heart of the app. During live matches she speaks commentary out loud using natural voice, her mouth syncs to what she says, and her facial expressions shift between excited, shocked, happy, sad, and tense depending on the moment. You can also talk back to her — she listens, transcribes your voice, and responds in real time.',
  },
  {
    q: 'How do AI match predictions work?',
    a: 'When you open a fixture, you can request an AI prediction. Our backend analyses team form, head-to-head history, and live data from our football data provider, then generates win / draw / loss probabilities along with a written analysis explaining the reasoning. Each prediction costs 1 credit and is cached, so re-opening the same prediction later is free.',
  },
  {
    q: 'Which leagues and competitions are covered?',
    a: 'We cover 13 major competitions: the Premier League, La Liga, Bundesliga, Serie A, Ligue 1, UEFA Champions League, Eredivisie and Primeira Liga in Europe; MLS, USL Championship and NWSL in the US; plus UEFA Euro 2024 and the FIFA World Cup 2026. You can filter matches by region (Europe, USA, International).',
  },
  {
    q: 'Is the app free to use?',
    a: 'The app is free to download and every new account starts with 10 free welcome credits. Core features use a credit-based system: AI predictions cost 1 credit per match, and live commentary with Victoria costs 2 credits to start a session plus 2 credits every 5 minutes you stay in it. Credits are purchased via in-app purchase in packs of 10, 50, 150 or 500, and they never expire.',
  },
  {
    q: 'When can I use Victoria\u2019s live commentary?',
    a: 'Live commentary is only available while a match is actually in progress — first half, half-time, second half, or extra time. Once a match is finished, the commentary room for that match closes. Upcoming matches are browsable, but you\u2019ll need to wait for kick-off before Victoria can join you.',
  },
  {
    q: 'Can I make a prediction before kick-off?',
    a: 'Yes. You can request an AI prediction for any upcoming fixture. There is no scoring game or leaderboard attached — predictions are a decision aid and entertainment feature, not a bet or a fantasy competition.',
  },
  {
    q: 'Does the app involve betting or gambling?',
    a: 'No. PlayByPlay Anime does not accept, place, or facilitate any kind of wager. AI predictions are informational only, intended to enrich how you watch and discuss the match. The app is built purely as an entertainment companion.',
  },
  {
    q: 'Which platforms is the app available on?',
    a: 'PlayByPlay Anime is available on both iOS and Android from day one. Build targets are configured under the bundle ID com.playbyplay.anime for both stores.',
  },
  {
    q: 'What do I need to sign up?',
    a: 'Signing up takes an email address and a password. After that, you\u2019ll pick a timezone so match kick-off times display correctly for you, and you can customise your profile from the Profile tab at any time.',
  },
  {
    q: 'Is my data safe?',
    a: 'We only collect what we need to run your account, deliver commentary, and validate credit purchases (handled via RevenueCat receipt validation). We do not sell your personal information, and there are no ads. See our Privacy Policy for full details.',
  },
]

const testimonials = [
  {
    name: 'Daniel Mercer',
    role: 'Football Journalist',
    text: 'The AI analysis has become part of my pre-match routine. The probabilities feel reasonable, and the written breakdown actually explains the reasoning instead of just printing a number.',
    rating: 5,
  },
  {
    name: 'Priya Shah',
    role: 'Product Designer',
    text: 'Talking to Victoria while the match is live is a genuinely new experience. She reacts in real time, picks up on what I am saying, and the voice replies feel natural rather than scripted.',
    rating: 5,
  },
  {
    name: 'Marcus Okafor',
    role: 'Data Analyst',
    text: 'I follow five leagues across Europe and the MLS. Having one app that covers all of them with clean fixtures, live scores, and accurate kick-off times in my timezone is a small thing I use every day.',
    rating: 5,
  },
]

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.slice(1)
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    })
  }, [location.hash])

  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.heroOrb1} />
          <div className={styles.heroOrb2} />
        </div>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <Zap size={14} /> New — AI Commentary Now Live
            </div>
            <h1 className={styles.heroTitle}>
              Football Predictions
              <br />
              Meet <span className={styles.gradient}>Anime AI</span>
            </h1>
            <p className={styles.heroSubtitle}>
              AI-generated win probabilities for every fixture, plus a 3D
              anime commentator who talks with you by voice during live
              matches. Across 13 major competitions. No ads. No betting.
            </p>
            <div className={styles.heroCtas}>
              <a href="#download" className={styles.btnPrimary}>
                <Smartphone size={18} />
                Download the App
              </a>
              <a href="#features" className={styles.btnSecondary}>
                Learn More
              </a>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <strong>13</strong>
                <span>Competitions Covered</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <strong>10</strong>
                <span>Welcome Credits</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <strong>iOS + Android</strong>
                <span>Available Now</span>
              </div>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <img
              src="/hero.png"
              alt="Victoria, the PlayByPlay Anime commentator, reacting to a live match"
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features} id="features">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Everything You Need</h2>
          <p className={styles.sectionSubtitle}>
            AI predictions, a 3D anime commentator who talks with you, and live fixtures from 13 competitions — all in your pocket.
          </p>
          <div className={styles.featureGrid}>
            {features.map((f, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks} id="how-it-works">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionSubtitle}>
            Get started in minutes. No football expertise required.
          </p>
          <div className={styles.stepsGrid}>
            {howItWorks.map((step, i) => (
              <div key={i} className={styles.stepCard}>
                <div className={styles.stepNumber}>{step.step}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>What Users Say</h2>
          <p className={styles.sectionSubtitle}>
            Join thousands of fans already making predictions and having fun.
          </p>
          <div className={styles.testimonialGrid}>
            {testimonials.map((t, i) => (
              <div key={i} className={styles.testimonialCard}>
                <div className={styles.testimonialStars}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} fill="#FFD740" color="#FFD740" />
                  ))}
                </div>
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>
                    {t.name[0]}
                  </div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faq} id="faq">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p className={styles.sectionSubtitle}>
            Got questions? We have answers.
          </p>
          <div className={styles.faqList}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`${styles.faqItem} ${openFaq === i ? styles.faqOpen : ''}`}
              >
                <button
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {openFaq === i && (
                  <div className={styles.faqAnswer}>
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection} id="download">
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaBg}>
              <div className={styles.ctaOrb1} />
              <div className={styles.ctaOrb2} />
            </div>
            <TrendingUp size={48} className={styles.ctaIcon} />
            <h2>Ready to Start Predicting?</h2>
            <p>
              Download PlayByPlay Anime and join thousands of fans making
              predictions, competing in leagues, and enjoying AI commentary.
            </p>
            <div className={styles.ctaButtons}>
              <a href="#" className={styles.btnPrimary}>
                <Smartphone size={18} />
                Download for iOS
              </a>
              <a href="#" className={styles.btnAccent}>
                Coming Soon on Android
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
