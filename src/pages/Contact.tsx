import { useState, type FormEvent } from 'react'
import { Mail, Clock, Send } from 'lucide-react'
import styles from './Contact.module.css'

const SUPPORT_EMAIL = 'support@playbyplayai.org'
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${SUPPORT_EMAIL}`

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSending(true)

    const form = e.currentTarget
    const data = new FormData(form)

    const payload = {
      name: data.get('name'),
      email: data.get('email'),
      subject: data.get('subject'),
      message: data.get('message'),
      _subject: `PlayByPlay Anime contact — ${data.get('subject') || 'New enquiry'}`,
      _template: 'table',
      _captcha: 'false',
    }

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      setSubmitted(true)
    } catch (err) {
      console.error('Contact form submit failed', err)
      setError(
        'We could not send your message right now. Please try again, or email us directly at ' +
          SUPPORT_EMAIL +
          '.',
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={styles.contact}>
      <div className={styles.container}>
        <h1>Get in Touch</h1>
        <p className={styles.subtitle}>
          Whether you need account help, want to report an issue, or have a
          partnership idea, our team reads every message. Use the form below
          and we will route your enquiry to the right person.
        </p>

        <div className={styles.grid}>
          <div className={styles.info}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <Mail size={24} />
              </div>
              <div>
                <h3>General &amp; Account Support</h3>
                <p>
                  Account questions, bug reports, and account deletion
                  requests.
                </p>
                <a href="mailto:support@playbyplayai.org">
                  support@playbyplayai.org
                </a>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <Clock size={24} />
              </div>
              <div>
                <h3>Response Times</h3>
                <p>
                  Most enquiries receive a reply within 1–2 business days.
                  Account and purchase issues are prioritised — please include
                  the email address on your account for faster resolution.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.formWrapper}>
            {submitted ? (
              <div className={styles.successMsg}>
                <div className={styles.successIcon}>✓</div>
                <h3>Message Received</h3>
                <p>
                  Thank you for contacting PlayByPlay Anime. A member of our
                  team will review your message and respond within 1–2 business
                  days. For urgent account or purchase issues, you can also
                  email us directly at{' '}
                  <a href="mailto:support@playbyplayai.org">
                    support@playbyplayai.org
                  </a>
                  .
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Full name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Jane Doe"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email address</label>
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
                  <label htmlFor="subject">How can we help?</label>
                  <select id="subject" name="subject" required defaultValue="">
                    <option value="" disabled>
                      Select a topic
                    </option>
                    <option value="account">Account &amp; Login</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="privacy">Privacy or Data Request</option>
                    <option value="deletion">Account Deletion</option>
                    <option value="partnership">Press, Partnership or Business</option>
                    <option value="general">General Enquiry</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Please describe your question or issue in as much detail as you can. For account issues, include the email address on your account."
                    required
                  />
                </div>

                {error && (
                  <div className={styles.formError} role="alert">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={sending}
                  aria-busy={sending}
                >
                  <Send size={18} />
                  {sending ? 'Sending\u2026' : 'Send message'}
                </button>

                <p className={styles.formNote}>
                  By submitting this form you agree to our{' '}
                  <a href="/privacy">Privacy Policy</a>. We will only use the
                  information you provide to respond to your enquiry.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
