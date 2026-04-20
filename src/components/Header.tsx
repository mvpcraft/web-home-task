import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import styles from './Header.module.css'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/#features', label: 'Features' },
    { to: '/#faq', label: 'FAQ' },
    { to: '/contact', label: 'Contact' },
  ]

  const handleNavClick = (to: string) => {
    setMenuOpen(false)
    if (to.startsWith('/#')) {
      const id = to.slice(2)
      if (location.pathname === '/') {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.location.href = to
      }
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>P×P</div>
          <span className={styles.logoText}>PlayByPlay</span>
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to.startsWith('/#') ? '/' : link.to}
              className={styles.navLink}
              onClick={() => handleNavClick(link.to)}
            >
              {link.label}
            </Link>
          ))}
          <a href="#download" className={styles.cta} onClick={() => setMenuOpen(false)}>
            Download App
          </a>
        </nav>

        <button
          className={styles.menuBtn}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  )
}
