import { useEffect, useMemo, useState } from 'react'
import api from '../../services/api'
import styles from './Admin.module.css'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/admin/users')
      setUsers(res.data.users || [])
    } catch (err) {
      setError('Unable to load users.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRoleChange(user) {
    setError('')
    try {
      const nextRole = user.role === 'admin' ? 'user' : 'admin'
      await api.put(`/admin/users/${user._id}/role`, { role: nextRole })
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update role.')
    }
  }

  async function handleDelete(userId) {
    const confirm = window.confirm('Delete this user account?')
    if (!confirm) return
    try {
      await api.delete(`/admin/users/${userId}`)
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete user.')
    }
  }

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const value = search.toLowerCase()
      return (
        user.firstName?.toLowerCase().includes(value) ||
        user.lastName?.toLowerCase().includes(value) ||
        user.email?.toLowerCase().includes(value) ||
        user.role?.toLowerCase().includes(value)
      )
    })
  }, [users, search])

  return (
    <div className={styles.adminShell}>
      <Sidebar />

      <div className={styles.adminContent}>
        <Navbar />

        <div className={styles.adminMain}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '18px', flexWrap: 'wrap' }}>
            <div>
              <h1 className={styles.adminTitle}>User management</h1>
              <p className={styles.adminSubtitle}>All registered customers and administrators are listed here.</p>
            </div>
            <div className={styles.metaCard}>
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>Total users</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{users.length}</div>
            </div>
          </div>

          {error && <div className={styles.alert}>{error}</div>}

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
            <input
              style={{ flex: '1 1 320px', padding: '14px 16px', borderRadius: '14px', border: '1px solid #d1d5db', background: '#fff' }}
              placeholder="Search users by email, name or role"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.adminTableWrapper}>
            {loading ? (
              <div className={styles.loadingBlock}>Loading users…</div>
            ) : filteredUsers.length === 0 ? (
              <div className={styles.emptyState} style={{ marginTop: '24px' }}>
                No users found. Try a different search term or refresh the page.
              </div>
            ) : (
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div style={{ display: 'grid', gap: '4px' }}>
                          <span style={{ fontWeight: 700 }}>{user.firstName} {user.lastName}</span>
                          <span style={{ color: '#6b7280', fontSize: '0.92rem' }}>{user.phone || 'No phone'}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`${styles.badge} ${user.role === 'admin' ? styles.badgeAdmin : styles.badgePrimary}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        <div className={styles.tableActions}>
                          <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={() => handleRoleChange(user)}>
                            {user.role === 'admin' ? 'Demote' : 'Promote'}
                          </button>
                          <button className={`${styles.button} ${styles.buttonDanger}`} onClick={() => handleDelete(user._id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
