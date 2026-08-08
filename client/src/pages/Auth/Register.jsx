import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Auth.module.css'

export default function Register(){
  const navigate = useNavigate()
  const { register } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (e)=>{
    e.preventDefault()
    setLoading(true)
    setError('')
    try{
      await register({ firstName, lastName, email, password })
      navigate('/')
    }catch(err){
      setError(err.response?.data?.message || 'Unable to register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.authPage}>
      <div className={styles.authCard}>
        <h1 className={styles.authHeading}>Create account</h1>
        {error && <div className={styles.alert}>{error}</div>}
        <form onSubmit={handle}>
          <div className={styles.authField}>
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              value={firstName}
              onChange={e=>setFirstName(e.target.value)}
              required
            />
          </div>
          <div className={styles.authField}>
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              value={lastName}
              onChange={e=>setLastName(e.target.value)}
              required
            />
          </div>
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
              {loading ? 'Creating account...' : 'Create your Amazon account'}
            </button>
            <Link to="/login" className={styles.authLink}>Already have an account? Sign in</Link>
          </div>
        </form>
        <p className={styles.authNote}>
          By creating an account, you agree to Amazon's Conditions of Use and Privacy Notice.
        </p>
      </div>
    </section>
  )
}
