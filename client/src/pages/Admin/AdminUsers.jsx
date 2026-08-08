import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import styles from './AdminPanel.module.css'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await api.get('/admin/users')
        setUsers(res.data.users)
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load users')
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

  const handleRoleChange = async (id, role) => {
    try {
      const res = await api.put(`/admin/users/${id}/role`, { role })
      setUsers((current) => current.map((user) => user._id === id ? res.data.user : user))
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update role')
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`)
      setUsers((current) => current.filter((user) => user._id !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete user')
    }
  }

  if (loading) return <div className="container"><h2>Admin users</h2><p>Loading users...</p></div>
  if (error) return <div className="container"><h2>Admin users</h2><p>{error}</p></div>

  return (
    <div className="container" style={{ maxWidth: 1100 }}>
      <div className={styles.adminNav}>
        <Link to="/admin" className={styles.adminNavLink}>Dashboard</Link>
        <Link to="/admin/users" className={styles.adminNavLink}>Users</Link>
        <Link to="/admin/orders" className={styles.adminNavLink}>Orders</Link>
      </div>
      <h2>Admin users</h2>
      <div className={styles.card}>
        <div className={styles.rowHeader}>
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Actions</span>
        </div>
        {users.map((user) => (
          <div key={user._id} className={styles.row}>
            <span>{user.firstName} {user.lastName}</span>
            <span>{user.email}</span>
            <span>{user.role}</span>
            <span className={styles.rowActions}>
              <select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)}>
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
              <button type="button" onClick={() => handleDelete(user._id)} className={styles.dangerButton}>Delete</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
