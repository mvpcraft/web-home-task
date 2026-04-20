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
    a: 'PlayByPlay Anime is a mobile app that combines AI-powered football match predictions with anime-style live commentary. You can predict match outcomes, compete with friends in private leagues, and enjoy real-time AI commentary delivered by a 3D anime avatar during matches.',
  },
  {
    q: 'How does the AI win probability work?',
    a: 'Our AI engine analyzes three key factors: head-to-head records (40% weight), recent team form over the last 5 matches (40% weight), and overall team strength ratings (20% weight). These are combined to produce a percentage probability for each possible outcome — home win, draw, or away win.',
  },
  {
    q: 'Is the app free to use?',
    a: 'The app is free to download and includes basic features. Premium features like AI win probability analysis, anime AI commentary, and advanced statistics use a credit system. You can purchase credits through in-app purchases. Credits never expire and can be used whenever you want.',
  },
  {
    q: 'What leagues and competitions are covered?',
    a: 'At launch, we are focused on the FIFA World Cup and major international football tournaments. We plan to expand coverage to include the Premier League, La Liga, Champions League, and other top domestic leagues based on user demand.',
  },
  {
    q: 'How do private leagues work?',
    a: 'Any user can create a private league and share an invite code with friends. Members of a private league have their own separate leaderboard. It is a great way to compete with coworkers, family, or your friend group during major tournaments.',
  },
  {
    q: 'What is the anime AI commentary?',
    a: 'Our anime AI commentary features a 3D VRM avatar character that delivers real-time reactions and analysis during matches. The avatar reacts to goals, red cards, halftime, and full-time with expressive animations and witty commentary. Think of it as having an enthusiastic anime character watching the match with you.',
  },
  {
    q: 'How is my prediction scored?',
    a: 'You earn 3 points for predicting the exact score, 1 point for predicting the correct outcome (win, draw, or loss) without the exact score, and 0 points for an incorrect prediction. Points accumulate on both the global leaderboard and any private leagues you have joined.',
  },
  {
    q: 'When can I make a prediction?',
    a: 'Predictions can be made any time before a match kicks off. Once the match begins, predictions are locked and cannot be changed. This ensures fair competition. We recommend making your predictions after reviewing the AI win probability to make informed choices.',
  },
  {
    q: 'Is my data safe?',
    a: 'Yes. We take your privacy seriously. We only collect the minimum data necessary to provide our services. Your prediction history and account data are stored securely. We never sell your personal information to third parties. See our Privacy Policy for full details.',
  },
  {
    q: 'Which platforms is the app available on?',
    a: 'We are launching on iOS first, with Android support coming shortly after. A web-based companion experience is also planned for viewing leaderboards and league standings on desktop.',
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
