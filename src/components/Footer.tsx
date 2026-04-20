import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>P×P</div>
              <span className={styles.logoText}>PlayByPlay Anime</span>
            </div>
            <p className={styles.tagline}>
              AI-powered football predictions with anime-style live commentary.
              Predict, compete, and enjoy the beautiful game like never before.
            </p>
          </div>

          <div className={styles.linkGroup}>
            <h4>Product</h4>
            <Link to="/#features">Features</Link>
            <Link to="/#how-it-works">How It Works</Link>
            <Link to="/#faq">FAQ</Link>
            <a href="#download">Download</a>
          </div>

          <div className={styles.linkGroup}>
            <h4>Legal</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>

          <div className={styles.linkGroup}>
            <h4>Support</h4>
            <Link to="/contact">Contact Us</Link>
            <a href="mailto:support@playbyplayanime.com">Email Support</a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} PlayByPlay Anime. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
