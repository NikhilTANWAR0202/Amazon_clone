
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Profile.module.css'

export default function Profile(){
  const { user, updateProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [formState, setFormState] = useState({ firstName:'', lastName:'', phone:'' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(()=>{
    if(user){
      setFormState({ firstName:user.firstName || '', lastName:user.lastName || '', phone:user.phone || '' })
    }
  },[user])

  const handleChange = (e)=> setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e)=>{
    e.preventDefault()
    try{
      await updateProfile(formState)
      setMessage('Profile updated successfully')
      setError('')
      setEditing(false)
    }catch(err){
      setMessage('')
      setError(err.response?.data?.message || 'Unable to update profile')
    }
  }

  if(!user) return <div className="container"><h2>My Account</h2><p>Loading profile...</p></div>

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div>
            <p className={styles.profileLabel}>Hello,</p>
            <h1 className={styles.profileName}>{user.firstName} {user.lastName}</h1>
            <p className={styles.profileEmail}>{user.email}</p>
          </div>
          <div className={styles.profileAvatar}>
            <span>{user.firstName?.[0] || 'U'}</span>
          </div>
        </div>
        <div className={styles.profileBody}>
          <div className={styles.profileSection}>
            <h2>Account details</h2>
            {message && <div className={styles.success}>{message}</div>}
            {error && <div className={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit} className={styles.profileForm}>
              <div className={styles.fieldGroup}>
                <label>First name</label>
                <input name="firstName" value={formState.firstName} onChange={handleChange} disabled={!editing} />
              </div>
              <div className={styles.fieldGroup}>
                <label>Last name</label>
                <input name="lastName" value={formState.lastName} onChange={handleChange} disabled={!editing} />
              </div>
              <div className={styles.fieldGroup}>
                <label>Email</label>
                <input value={user.email} disabled />
              </div>
              <div className={styles.fieldGroup}>
                <label>Phone</label>
                <input name="phone" value={formState.phone} onChange={handleChange} disabled={!editing} />
              </div>
              <div className={styles.profileActions}>
                <button type="button" className={styles.secondaryBtn} onClick={()=>setEditing(v=>!v)}>
                  {editing ? 'Cancel' : 'Edit profile'}
                </button>
                {editing && <button type="submit" className={styles.primaryBtn}>Save changes</button>}
              </div>
            </form>
          </div>
          <div className={styles.profileMenu}>
            <Link to="/profile/orders" className={styles.menuItem}>
              <h3>Orders</h3>
              <p>Track, return, or buy things again.</p>
            </Link>
            <Link to="/profile/security" className={styles.menuItem}>
              <h3>Login & security</h3>
              <p>Edit login, name, and mobile number.</p>
            </Link>
            <Link to="/profile/addresses" className={styles.menuItem}>
              <h3>Your addresses</h3>
              <p>Edit addresses for orders and gifts.</p>
            </Link>
            <Link to="/profile/payments" className={styles.menuItem}>
              <h3>Payment options</h3>
              <p>Edit or add payment methods.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
