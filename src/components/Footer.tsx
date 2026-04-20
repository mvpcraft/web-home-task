import { Link, useLocation, useNavigate } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  const location = useLocation()
  const navigate = useNavigate()

  const goToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(`/#${id}`)
    }
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <img src="/logo.png" alt="PlayByPlay Anime" className={styles.logoIcon} />
              <span className={styles.logoText}>PlayByPlay Anime</span>
            </div>
            <p className={styles.tagline}>
              AI-powered match predictions and a 3D anime commentator who watches
              live football with you — in real time, by voice. Across 13 major
              competitions.
            </p>
          </div>

          <div className={styles.linkGroup}>
            <h4>Product</h4>
            <a href="/#features" onClick={goToSection('features')}>Features</a>
            <a href="/#how-it-works" onClick={goToSection('how-it-works')}>How It Works</a>
            <a href="/#faq" onClick={goToSection('faq')}>FAQ</a>
            <a href="/#download" onClick={goToSection('download')}>Download</a>
          </div>

          <div className={styles.linkGroup}>
            <h4>Legal</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>

          <div className={styles.linkGroup}>
            <h4>Support</h4>
            <Link to="/contact">Contact Us</Link>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} PlayByPlay Anime. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
