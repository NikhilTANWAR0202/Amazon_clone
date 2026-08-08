import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from '../Auth/Auth.module.css'

export default function AdminLogin() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await adminLogin({
  email,
  password
});
      if (res.user?.role === 'admin') {
        navigate('/admin')
      } else {
        setError('Admin credentials required')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.authPage}>
      <div className={styles.authCard}>
        <h1 className={styles.authHeading}>Admin login</h1>
        {error && <div className={styles.alert}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.authField}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.authField}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.authActions}>
            <button type="submit" className={styles.authPrimary} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in as admin'}
            </button>
            <Link to="/login" className={styles.authLink}>Back to user login</Link>
          </div>
        </form>
      </div>
    </section>
  )
}
