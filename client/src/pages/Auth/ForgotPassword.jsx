import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import styles from './Auth.module.css'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const res = await api.post('/auth/forgot-password', { email })
      setMessage(res.data.message || 'Password reset link sent. Check your email.')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.authPage}>
      <div className={styles.authCard}>
        <h1 className={styles.authHeading}>Forgot Password</h1>
        {message && <div className={styles.success}>{message}</div>}
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.authField}>
            <label htmlFor="email">Enter your email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.authActions}>
            <button type="submit" className={styles.authPrimary} disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
            <Link to="/login" className={styles.authLink}>Back to sign in</Link>
          </div>
        </form>
      </div>
    </section>
  )
}
