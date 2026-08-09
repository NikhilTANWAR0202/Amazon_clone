import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import styles from './Profile.module.css'

const emptyPayment = {
  type: 'card',
  provider: 'Visa',
  maskedNumber: '',
  expiry: '',
  isDefault: false
}

export default function ProfilePayments() {
  const { user, updateProfile } = useAuth()
  const [payments, setPayments] = useState([])
  const [formState, setFormState] = useState(emptyPayment)
  const [editingIndex, setEditingIndex] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setPayments(user?.payments || [])
  }, [user])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormState((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const resetForm = () => {
    setFormState(emptyPayment)
    setEditingIndex(null)
  }

  const handleEdit = (index) => {
    setEditingIndex(index)
    setFormState({ ...payments[index] })
  }

  const handleDelete = async (index) => {
    const next = payments.filter((_, idx) => idx !== index)
    try {
      setSaving(true)
      await updateProfile({ payments: next })
      setPayments(next)
      setMessage('Payment method removed successfully.')
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to remove payment method.')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!formState.maskedNumber || !formState.expiry || !formState.provider) {
      setError('Please complete all payment fields.')
      return
    }

    const nextPayments = [...payments]
    const nextPayment = { ...formState, isDefault: !!formState.isDefault }

    if (nextPayment.isDefault) {
      nextPayments.forEach((payment) => { payment.isDefault = false })
    }

    if (editingIndex !== null) {
      nextPayments[editingIndex] = nextPayment
    } else {
      nextPayments.push(nextPayment)
    }

    if (!nextPayments.some((payment) => payment.isDefault) && nextPayments.length > 0) {
      nextPayments[0].isDefault = true
    }

    try {
      setSaving(true)
      await updateProfile({ payments: nextPayments })
      setPayments(nextPayments)
      setMessage(editingIndex !== null ? 'Payment method updated.' : 'Payment method added.')
      setError('')
      resetForm()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save payment method.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileCard}>
        <div className={styles.profileSection}>
          <h2>Payment options</h2>
          <p>Edit or add payment methods.</p>
          {message && <div className={styles.success}>{message}</div>}
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.sectionGrid}>
            <div>
              <h3>{editingIndex !== null ? 'Edit payment method' : 'Add payment method'}</h3>
              <form onSubmit={handleSubmit} className={styles.profileForm}>
                <div className={styles.fieldGroup}>
                  <label>Type</label>
                  <select name="type" value={formState.type} onChange={handleChange}>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="wallet">Wallet</option>
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label>Provider</label>
                  <input name="provider" value={formState.provider} onChange={handleChange} />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Masked number</label>
                  <input name="maskedNumber" value={formState.maskedNumber} onChange={handleChange} placeholder="XXXX-XXXX-XXXX-1234" />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Expiry</label>
                  <input name="expiry" value={formState.expiry} onChange={handleChange} placeholder="MM/YY" />
                </div>
                <div className={styles.fieldGroup}>
                  <label>
                    <input name="isDefault" type="checkbox" checked={formState.isDefault} onChange={handleChange} /> Set as default payment
                  </label>
                </div>
                <div className={styles.profileActions}>
                  <button type="submit" className={styles.primaryBtn} disabled={saving}>{saving ? 'Saving...' : editingIndex !== null ? 'Update payment' : 'Add payment'}</button>
                  {editingIndex !== null && (
                    <button type="button" className={styles.secondaryBtn} onClick={resetForm}>Cancel</button>
                  )}
                </div>
              </form>
            </div>
            <div>
              <h3>Saved payment methods</h3>
              {payments.length === 0 && <p>No payment methods saved yet.</p>}
              <div className={styles.addressGrid}>
                {payments.map((payment, idx) => (
                  <div key={`${payment.type}-${idx}`} className={styles.addressCard}>
                    <div className={styles.addressCardHeader}>
                      <strong>{payment.provider} ({payment.type})</strong>
                      {payment.isDefault && <span className={styles.defaultBadge}>Default</span>}
                    </div>
                    <p>{payment.maskedNumber}</p>
                    <p>Expiry: {payment.expiry}</p>
                    <div className={styles.cardActions}>
                      <button type="button" className={styles.secondaryBtn} onClick={() => handleEdit(idx)}>Edit</button>
                      <button type="button" className={styles.secondaryBtn} onClick={() => handleDelete(idx)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
