import { useState, type FormEvent } from 'react'
import { Mail, MessageSquare, MapPin, Send } from 'lucide-react'
import styles from './Contact.module.css'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className={styles.contact}>
      <div className={styles.container}>
        <h1>Contact Us</h1>
        <p className={styles.subtitle}>
          Have a question, feedback, or need help? We'd love to hear from you.
        </p>

        <div className={styles.grid}>
          <div className={styles.info}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <Mail size={24} />
              </div>
              <div>
                <h3>Email</h3>
                <p>For general inquiries and support</p>
                <a href="mailto:support@playbyplayai.org">support@playbyplayai.org</a>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <MessageSquare size={24} />
              </div>
              <div>
                <h3>In-App Support</h3>
                <p>Get help directly within the app</p>
                <span>Settings → Help & Support</span>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <MapPin size={24} />
              </div>
              <div>
                <h3>Location</h3>
                <p>Our team operates remotely across the United States</p>
                <span>Delaware, United States</span>
              </div>
            </div>

            <div className={styles.responseNote}>
              <p>
                We typically respond to inquiries within 24–48 hours during business
                days. For urgent issues related to your account or purchases, please
                include your account email in your message for faster resolution.
              </p>
            </div>
          </div>

          <div className={styles.formWrapper}>
            {submitted ? (
              <div className={styles.successMsg}>
                <div className={styles.successIcon}>✓</div>
                <h3>Message Sent!</h3>
                <p>
                  Thank you for reaching out. We'll get back to you within 24–48
                  hours. Check your email for a confirmation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject">Subject</label>
                  <select id="subject" name="subject" required>
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing & Credits</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="partnership">Partnership / Business</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Tell us how we can help..."
                    required
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  <Send size={18} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
