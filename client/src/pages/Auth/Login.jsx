import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Auth.module.css'

export default function Login(){
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (e)=>{
    e.preventDefault()
    setLoading(true)
    setError('')
    try{
      await login({ email, password })
      navigate('/')
    }catch(err){
      setError(err.response?.data?.message || 'Unable to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.authPage}>
      <div className={styles.authCard}>
        <h1 className={styles.authHeading}>Sign in</h1>
        {error && <div className={styles.alert}>{error}</div>}
        <form onSubmit={handle}>
          <div className={styles.authField}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.authField}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.authActions}>
            <button type="submit" className={styles.authPrimary} disabled={loading}>
              {loading ? 'Signing in...' : 'Continue'}
            </button>
            <Link to="/forgot-password" className={styles.authLink}>Forgot your password?</Link>
            <Link to="/register" className={styles.authLink}>Create your Amazon account</Link>
          </div>
        </form>
        <p className={styles.authNote}>
          By continuing, you agree to Amazon's Conditions of Use and Privacy Notice.
        </p>
      </div>
    </section>
  )
}
