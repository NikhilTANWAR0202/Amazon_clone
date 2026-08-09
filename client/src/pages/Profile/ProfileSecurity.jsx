import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import styles from './Profile.module.css'

export default function ProfileSecurity() {
  const { user, updateProfile } = useAuth()
  const [formState, setFormState] = useState({ firstName: '', lastName: '', phone: '', password: '', confirmPassword: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setFormState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        password: '',
        confirmPassword: ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (formState.password && formState.password !== formState.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const updates = {
      firstName: formState.firstName,
      lastName: formState.lastName,
      phone: formState.phone
    }

    if (formState.password) {
      updates.password = formState.password
    }

    try {
      setSaving(true)
      await updateProfile(updates)
      setSaving(false)
      setFormState((prev) => ({ ...prev, password: '', confirmPassword: '' }))
      setMessage('Security details updated successfully.')
    } catch (err) {
      setSaving(false)
      setError(err.response?.data?.message || 'Unable to update security settings.')
    }
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileCard}>
        <div className={styles.profileSection}>
          <h2>Login & security</h2>
          <p>Update your account name, phone, or password in one place.</p>
          {message && <div className={styles.success}>{message}</div>}
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit} className={styles.profileForm}>
            <div className={styles.fieldGroup}>
              <label>First name</label>
              <input name="firstName" value={formState.firstName} onChange={handleChange} />
            </div>
            <div className={styles.fieldGroup}>
              <label>Last name</label>
              <input name="lastName" value={formState.lastName} onChange={handleChange} />
            </div>
            <div className={styles.fieldGroup}>
              <label>Email</label>
              <input value={user?.email || ''} disabled />
            </div>
            <div className={styles.fieldGroup}>
              <label>Phone</label>
              <input name="phone" value={formState.phone} onChange={handleChange} />
            </div>
            <div className={styles.fieldGroup}>
              <label>New password</label>
              <input name="password" type="password" value={formState.password} onChange={handleChange} placeholder="Leave blank to keep current password" />
            </div>
            <div className={styles.fieldGroup}>
              <label>Confirm password</label>
              <input name="confirmPassword" type="password" value={formState.confirmPassword} onChange={handleChange} placeholder="Repeat new password" />
            </div>
            <div className={styles.profileActions}>
              <button type="submit" className={styles.primaryBtn} disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
