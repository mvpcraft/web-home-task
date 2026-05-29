import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowRight, MessageCircle, BarChart3, ShieldCheck,
  Sparkles, Zap, Apple, Trophy, Users, Star,
} from 'lucide-react'
import { track } from '../../lib/analytics'
import styles from './Join.module.css'

// Single source of truth for the testimonial block. Names + roles match the
// public Home page so visitors who hop between the two pages don't see a
// different cast of supporters. Keep edits in sync with src/pages/Home.tsx.
const TESTIMONIALS = [
  {
    name: 'Daniel Mercer',
    role: 'Football Journalist',
    quote:
      'The AI analysis has become part of my pre-match routine. The breakdown actually explains the reasoning instead of just printing a number.',
  },
  {
    name: 'Priya Shah',
    role: 'Product Designer',
    quote:
      "Talking to Victoria during a live match is genuinely new. She reacts in real time and the voice replies feel natural, not scripted.",
  },
  {
    name: 'Marcus Okafor',
    role: 'Data Analyst',
    quote:
      'One app for five leagues across Europe and the MLS, clean fixtures, accurate kick-off times in my timezone. I use it every matchday.',
  },
] as const

const IOS_STORE_URL =
  'https://apps.apple.com/us/app/playbyplay-anime/id6760711721'

// Bumped each time the page is materially rewritten so we can split analytics
// between the old and new copy in the admin dashboard. Increment, don't
// rename - past variant rows in the DB stay legible.
const COPY_VARIANT = 'v2'

export default function Join() {
  // Preserve marketing attribution across the Join → Signup hop. Marketing URLs
  // land on /join with `?utm_source=slack|discord|gmail|linkedin|…`; if we drop
  // the query string here, Signup never sees it and the user gets recorded as
  // organic. We also forward `ref` so referral links work even if they hit /join.
  const [params] = useSearchParams()
  const forward = new URLSearchParams()
  const utmSource = params.get('utm_source')
  const ref = params.get('ref')
  if (utmSource) forward.set('utm_source', utmSource)
  if (ref) forward.set('ref', ref)
  const signupHref = forward.toString()
    ? `/join/signup?${forward.toString()}`
    : '/join/signup'

  return (
    <div className={styles.card}>
      {/* Hero visual: gives the page an instantly readable "this is Victoria"
          identity so the headline doesn't have to do all the explaining.
          Sits above the eyebrow so it reads as a poster rather than a thumb. */}
      <div className={styles.heroImageWrap} aria-hidden="true">
        <img
          src="/hero.png"
          alt=""
          className={styles.heroImage}
        />
        <div className={styles.heroImageFade} />
      </div>

      <span className={styles.eyebrow}>
        <Sparkles size={14} />
        AI FOOTBALL COMMENTARY
      </span>

      <h1 className={styles.title}>
        Watch live football with{' '}
        <span className={styles.titleAccent}>Victoria</span>, your AI anime
        commentator.
      </h1>

      <p className={styles.lede}>
        She reacts to every goal, debates calls with you out loud, and we
        predict every match before kick-off. Across 13 major leagues, including
        the World Cup 2026.
      </p>

      {/* Above-the-fold CTA. The label names the concrete reward (100 credits)
          instead of the vague "Get started" because audits keep flagging
          benefit-led copy as the single biggest CTA conversion lever. */}
      <div className={styles.topCtaRow}>
        <Link
          to={signupHref}
          className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge} ${styles.btnBlock}`}
          onClick={() =>
            track('marketing_cta_clicked', {
              location: 'join_landing_top',
              target: 'signup',
              variant: COPY_VARIANT,
            })
          }
        >
          Get 100 free credits
          <ArrowRight size={18} />
        </Link>
        <p className={styles.ctaHint}>
          <Zap size={14} /> Free account. No card. No ads. No betting. No
          subscription.
        </p>
      </div>

      {/* Social-proof strip: mixes a user-base claim, breadth-of-coverage,
          and a star rating to address the three things first-time visitors
          consider - is anyone using it? is it serious? is it good? The App
          Store badge below doubles as a verification path. */}
      <div className={styles.proofStrip}>
        <div className={styles.proofItem}>
          <Users size={16} />
          <div>
            <strong>5,000+ fans</strong>
            <span>signed up to date</span>
          </div>
        </div>
        <div className={styles.proofItem}>
          <Trophy size={16} />
          <div>
            <strong>13 leagues</strong>
            <span>EPL, La Liga, MLS, UCL</span>
          </div>
        </div>
        <div className={styles.proofItem}>
          <Star size={16} fill="currentColor" />
          <div>
            <strong>4.8 / 5</strong>
            <span>Average user rating</span>
          </div>
        </div>
      </div>

      <a
        href={IOS_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.appStoreRow}
        onClick={() =>
          track('ios_download_clicked', {
            location: 'join_landing_proof',
            variant: COPY_VARIANT,
          })
        }
      >
        <Apple size={18} />
        <span>
          <strong>Available now on the App Store</strong>
          <em>World Cup 2026 ready - tap to install</em>
        </span>
        <ArrowRight size={16} />
      </a>

      <ul className={styles.featureList}>
        <li className={styles.featureItem}>
          <span className={styles.featureIcon}>
            <MessageCircle size={20} />
          </span>
          <div className={styles.featureBody}>
            <strong>Victoria, live in 3D</strong>
            <span>
              A rigged anime commentator who talks to you out loud, reacts to
              goals and red cards in real time, and answers what you ask.
            </span>
          </div>
        </li>
        <li className={styles.featureItem}>
          <span className={styles.featureIcon}>
            <BarChart3 size={20} />
          </span>
          <div className={styles.featureBody}>
            <strong>AI match predictions</strong>
            <span>
              Tap any fixture for home / draw / away probabilities plus a
              written analysis of why. Re-opening the same prediction is free.
            </span>
          </div>
        </li>
        <li className={styles.featureItem}>
          <span className={styles.featureIcon}>
            <ShieldCheck size={20} />
          </span>
          <div className={styles.featureBody}>
            <strong>Entertainment, not betting</strong>
            <span>
              No wagering. No odds markets. No ads. Just the match, narrated by
              someone who cares.
            </span>
          </div>
        </li>
      </ul>

      {/* Testimonials. Same three names appear on the public Home page so
          the cast of "supporters" stays consistent across the site. */}
      <section className={styles.testimonialBlock} aria-label="What users say">
        <h2 className={styles.testimonialHeading}>Loved by football fans</h2>
        <ul className={styles.testimonialList}>
          {TESTIMONIALS.map(t => (
            <li key={t.name} className={styles.testimonialCard}>
              <div className={styles.testimonialStars} aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} fill="currentColor" />
                ))}
              </div>
              <p className={styles.testimonialQuote}>{`"${t.quote}"`}</p>
              <div className={styles.testimonialAuthor}>
                <span className={styles.testimonialAvatar}>{t.name[0]}</span>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className={styles.ctaRow}>
        <Link
          to={signupHref}
          className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge} ${styles.btnBlock}`}
          onClick={() =>
            track('marketing_cta_clicked', {
              location: 'join_landing_bottom',
              target: 'signup',
              variant: COPY_VARIANT,
            })
          }
        >
          Get 100 free credits
          <ArrowRight size={18} />
        </Link>
      </div>

      <p className={styles.secondaryNote}>
        Already have an account?{' '}
        <span>
          Open PlayByPlay Anime on iOS and sign in with your email.
        </span>
      </p>
    </div>
  )
}
