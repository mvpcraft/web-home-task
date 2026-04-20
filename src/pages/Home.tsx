import { useState } from 'react'
import {
  Zap, Trophy, Users, BarChart3, MessageCircle, Shield,
  ChevronDown, ChevronUp, Smartphone, Star, TrendingUp
} from 'lucide-react'
import styles from './Home.module.css'

const features = [
  {
    icon: <BarChart3 size={28} />,
    title: 'AI Win Probability',
    description:
      'Our AI analyzes head-to-head records, recent form, and team strength to deliver real-time win probabilities for every match. Know the odds before you predict.',
  },
  {
    icon: <MessageCircle size={28} />,
    title: 'Anime AI Commentary',
    description:
      'Experience matches like never before with a 3D anime avatar that reacts to goals, cards, and key moments with expressive, entertaining commentary in real time.',
  },
  {
    icon: <Zap size={28} />,
    title: 'Instant Predictions',
    description:
      'Predict match winners and exact scores with a single tap. Predictions lock when the match begins, keeping the competition fair for everyone.',
  },
  {
    icon: <Trophy size={28} />,
    title: 'Global Leaderboard',
    description:
      'Climb the ranks with accurate predictions. Earn points based on correct outcomes and exact score matches. See how you stack up against fans worldwide.',
  },
  {
    icon: <Users size={28} />,
    title: 'Private Leagues',
    description:
      'Create private leagues and invite friends with a simple code. Compete head-to-head in your own circle and crown a champion among your group.',
  },
  {
    icon: <Shield size={28} />,
    title: 'Live Match Data',
    description:
      'Stay on top of every match with real-time scores, lineups, and match events. All data sourced from professional football APIs for pinpoint accuracy.',
  },
]

const howItWorks = [
  {
    step: '01',
    title: 'Download & Sign Up',
    description: 'Get the app from the App Store and create your free account in seconds.',
  },
  {
    step: '02',
    title: 'Browse Matches',
    description: 'See all upcoming fixtures with real-time data, stats, and AI win probabilities.',
  },
  {
    step: '03',
    title: 'Make Your Predictions',
    description: 'Predict match outcomes and exact scores before kickoff. Earn points for accuracy.',
  },
  {
    step: '04',
    title: 'Watch & Compete',
    description: 'Enjoy anime commentary during matches, climb leaderboards, and challenge your friends.',
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
    name: 'Marco R.',
    role: 'Football Fan',
    text: 'The anime commentary is hilarious and actually makes watching matches more fun. I love competing with my friends in our private league.',
    rating: 5,
  },
  {
    name: 'Sarah K.',
    role: 'Casual Viewer',
    text: 'I never thought I would get into football predictions, but the AI probabilities make it easy to get started. The avatar character is adorable.',
    rating: 5,
  },
  {
    name: 'James T.',
    role: 'Sports Enthusiast',
    text: 'Finally an app that combines real data with entertainment. The AI predictions are surprisingly accurate and the leaderboard keeps me coming back.',
    rating: 5,
  },
]

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

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
              Predict match outcomes, get AI-powered win probabilities,
              and enjoy real-time anime commentary — all in one app.
              Compete with friends and climb the global leaderboard.
            </p>
            <div className={styles.heroCtas}>
              <a href="#download" className={styles.btnPrimary}>
                <Smartphone size={18} />
                Download for iOS
              </a>
              <a href="#features" className={styles.btnSecondary}>
                Learn More
              </a>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <strong>50K+</strong>
                <span>Predictions Made</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <strong>10K+</strong>
                <span>Active Users</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <strong>98%</strong>
                <span>Data Accuracy</span>
              </div>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.phoneMockup}>
              <div className={styles.phoneScreen}>
                <div className={styles.phoneHeader}>
                  <span className={styles.phoneLive}>● LIVE</span>
                  <span>Argentina vs France</span>
                </div>
                <div className={styles.phoneScore}>
                  <div className={styles.team}>
                    <div className={styles.teamFlag}>🇦🇷</div>
                    <span>ARG</span>
                  </div>
                  <div className={styles.scoreDisplay}>
                    <span className={styles.scoreNum}>3</span>
                    <span className={styles.scoreSep}>-</span>
                    <span className={styles.scoreNum}>3</span>
                  </div>
                  <div className={styles.team}>
                    <div className={styles.teamFlag}>🇫🇷</div>
                    <span>FRA</span>
                  </div>
                </div>
                <div className={styles.phoneProb}>
                  <div className={styles.probBar}>
                    <div className={styles.probFill} style={{ width: '45%' }} />
                  </div>
                  <div className={styles.probLabels}>
                    <span>ARG 45%</span>
                    <span>Draw 25%</span>
                    <span>FRA 30%</span>
                  </div>
                </div>
                <div className={styles.phoneComment}>
                  <div className={styles.commentAvatar}>🎭</div>
                  <div className={styles.commentBubble}>
                    GOOOAL! What a strike! Mbappé equalizes with an absolute thunderbolt! 🔥
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features} id="features">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Everything You Need</h2>
          <p className={styles.sectionSubtitle}>
            Powerful AI predictions, entertaining anime commentary, and social competition — all in your pocket.
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
