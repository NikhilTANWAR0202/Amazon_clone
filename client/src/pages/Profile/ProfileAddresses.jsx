import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import styles from './Profile.module.css'

const emptyAddress = {
  label: '',
  firstName: '',
  lastName: '',
  phone: '',
  country: '',
  state: '',
  city: '',
  pincode: '',
  addressLine: '',
  apartment: '',
  isDefault: false
}

export default function ProfileAddresses() {
  const { user, updateProfile } = useAuth()
  const [addresses, setAddresses] = useState([])
  const [formState, setFormState] = useState(emptyAddress)
  const [editingIndex, setEditingIndex] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setAddresses(user?.addresses || [])
  }, [user])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormState((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const resetForm = () => {
    setFormState(emptyAddress)
    setEditingIndex(null)
  }

  const handleEdit = (index) => {
    setEditingIndex(index)
    setFormState({ ...addresses[index] })
  }

  const handleDelete = async (index) => {
    const next = addresses.filter((_, idx) => idx !== index)
    try {
      setSaving(true)
      await updateProfile({ addresses: next })
      setAddresses(next)
      setMessage('Address removed successfully.')
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to remove address.')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!formState.label || !formState.addressLine || !formState.city || !formState.state || !formState.pincode) {
      setError('Please fill in all required address fields.')
      return
    }

    const nextAddresses = [...addresses]
    const updatedAddress = { ...formState, isDefault: !!formState.isDefault }

    if (updatedAddress.isDefault) {
      nextAddresses.forEach((address) => { address.isDefault = false })
    }

    if (editingIndex !== null) {
      nextAddresses[editingIndex] = updatedAddress
    } else {
      nextAddresses.push(updatedAddress)
    }

    if (!nextAddresses.some((address) => address.isDefault) && nextAddresses.length > 0) {
      nextAddresses[0].isDefault = true
    }

    try {
      setSaving(true)
      await updateProfile({ addresses: nextAddresses })
      setAddresses(nextAddresses)
      setMessage(editingIndex !== null ? 'Address updated successfully.' : 'Address added successfully.')
      setError('')
      resetForm()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save address.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileCard}>
        <div className={styles.profileSection}>
          <h2>Your addresses</h2>
          <p>Edit addresses for orders and gifts.</p>
          {message && <div className={styles.success}>{message}</div>}
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.sectionGrid}>
            <div>
              <h3>{editingIndex !== null ? 'Edit address' : 'Add new address'}</h3>
              <form onSubmit={handleSubmit} className={styles.profileForm}>
                <div className={styles.fieldGroup}>
                  <label>Label</label>
                  <input name="label" value={formState.label} onChange={handleChange} placeholder="Home, Work, Parents" />
                </div>
                <div className={styles.splitRow}>
                  <div className={styles.fieldGroup}>
                    <label>First name</label>
                    <input name="firstName" value={formState.firstName} onChange={handleChange} />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label>Last name</label>
                    <input name="lastName" value={formState.lastName} onChange={handleChange} />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label>Phone</label>
                  <input name="phone" value={formState.phone} onChange={handleChange} />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Address line</label>
                  <input name="addressLine" value={formState.addressLine} onChange={handleChange} />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Apartment / suite</label>
                  <input name="apartment" value={formState.apartment} onChange={handleChange} />
                </div>
                <div className={styles.splitRow}>
                  <div className={styles.fieldGroup}>
                    <label>City</label>
                    <input name="city" value={formState.city} onChange={handleChange} />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label>State</label>
                    <input name="state" value={formState.state} onChange={handleChange} />
                  </div>
                </div>
                <div className={styles.splitRow}>
                  <div className={styles.fieldGroup}>
                    <label>Pincode</label>
                    <input name="pincode" value={formState.pincode} onChange={handleChange} />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label>Country</label>
                    <input name="country" value={formState.country} onChange={handleChange} />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label>
                    <input name="isDefault" type="checkbox" checked={formState.isDefault} onChange={handleChange} /> Set as default address
                  </label>
                </div>
                <div className={styles.profileActions}>
                  <button type="submit" className={styles.primaryBtn} disabled={saving}>{saving ? 'Saving...' : editingIndex !== null ? 'Update address' : 'Add address'}</button>
                  {editingIndex !== null && (
                    <button type="button" className={styles.secondaryBtn} onClick={resetForm}>Cancel</button>
                  )}
                </div>
              </form>
            </div>
            <div>
              <h3>Saved addresses</h3>
              {addresses.length === 0 && <p>No addresses saved yet.</p>}
              <div className={styles.addressGrid}>
                {addresses.map((address, idx) => (
                  <div key={`${address.label}-${idx}`} className={styles.addressCard}>
                    <div className={styles.addressCardHeader}>
                      <strong>{address.label || 'Address'}</strong>
                      {address.isDefault && <span className={styles.defaultBadge}>Default</span>}
                    </div>
                    <p>{address.firstName} {address.lastName}</p>
                    <p>{address.addressLine}{address.apartment ? `, ${address.apartment}` : ''}</p>
                    <p>{address.city}, {address.state} {address.pincode}</p>
                    <p>{address.country}</p>
                    <p>Phone: {address.phone}</p>
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
