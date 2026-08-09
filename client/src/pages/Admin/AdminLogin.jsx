import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './AdminLogin.module.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { adminLogin } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await adminLogin({ email, password })
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in as admin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.adminLoginPage}>
      <div className={styles.adminLoginCard}>
        <h1 className={styles.adminLoginHeadline}>Admin sign in</h1>
        <p className={styles.adminLoginIntro}>
          Use your admin credentials to access the seller dashboard and manage the store.
        </p>

        {error && <div className={styles.adminAlert}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.adminAuthField}>
            <label htmlFor="adminEmail">Email</label>
            <input
              id="adminEmail"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.adminAuthField}>
            <label htmlFor="adminPassword">Password</label>
            <input
              id="adminPassword"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.adminAuthActions}>
            <button type="submit" className={styles.adminAuthButton} disabled={loading}>
              {loading ? 'Signing in…' : 'Continue as admin'}
            </button>
          </div>
        </form>

        <div className={styles.adminAuthMeta}>
          <span>Need a user account?</span>
          <Link className={styles.adminAuthLink} to="/login">
            Sign in as customer
          </Link>
        </div>
      </div>
    </section>
  )
}
