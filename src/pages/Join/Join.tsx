import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle, BarChart3, Trophy, Gift, Sparkles } from 'lucide-react'
import styles from './Join.module.css'

export default function Join() {
  return (
    <div className={styles.card}>
      <span className={styles.eyebrow}>
        <Sparkles size={14} />
        JOIN PLAYBYPLAY ANIME
      </span>

      <h1 className={styles.title}>
        Football, with <span className={styles.titleAccent}>better company.</span>
      </h1>

      <p className={styles.lede}>
        AI win probabilities for every fixture, plus Victoria — our 3D anime
        commentator who watches live matches with you by voice. Set up your
        free account in under a minute.
      </p>

      <ul className={styles.featureList}>
        <li className={styles.featureItem}>
          <span className={styles.featureIcon}>
            <MessageCircle size={20} />
          </span>
          <div className={styles.featureBody}>
            <strong>Live voice commentary with Victoria</strong>
            <span>
              Talk to a 3D anime commentator who reacts to goals, red cards and
              big moments in real time.
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
              written analysis.
            </span>
          </div>
        </li>
        <li className={styles.featureItem}>
          <span className={styles.featureIcon}>
            <Trophy size={20} />
          </span>
          <div className={styles.featureBody}>
            <strong>13 major competitions</strong>
            <span>
              Premier League, La Liga, Champions League, MLS, the World Cup
              2026 and more — all in one place.
            </span>
          </div>
        </li>
        <li className={styles.featureItem}>
          <span className={styles.featureIcon}>
            <Gift size={20} />
          </span>
          <div className={styles.featureBody}>
            <strong>10 free welcome credits</strong>
            <span>
              No card required. Try AI predictions and live commentary the
              moment you sign up.
            </span>
          </div>
        </li>
      </ul>

      <div className={styles.ctaRow}>
        <Link to="/join/signup" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge} ${styles.btnBlock}`}>
          Create your free account
          <ArrowRight size={18} />
        </Link>
      </div>

      <p className={styles.secondaryNote}>
        Already have an account?{' '}
        <span>
          Open PlayByPlay Anime on your phone and sign in with your email.
        </span>
      </p>
    </div>
  )
}
