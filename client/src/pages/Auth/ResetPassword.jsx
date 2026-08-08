import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../services/api'
import styles from './Auth.module.css'

export default function ResetPassword() {
  const { token } = useParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)

    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password })
      setMessage(res.data.message || 'Password reset successfully. Please login.')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.authPage}>
      <div className={styles.authCard}>
        <h1 className={styles.authHeading}>Reset Password</h1>
        {message && <div className={styles.success}>{message}</div>}
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.authField}>
            <label htmlFor="password">New password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.authField}>
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.authActions}>
            <button type="submit" className={styles.authPrimary} disabled={loading}>
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
            <Link to="/login" className={styles.authLink}>Back to sign in</Link>
          </div>
        </form>
      </div>
    </section>
  )
}
