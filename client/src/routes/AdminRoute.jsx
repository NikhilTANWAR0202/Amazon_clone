import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <p>Loading admin access...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  if (user.role !== 'admin') {
    return (
      <div className="container" style={{ padding: '3rem 0' }}>
        <h2>Access denied</h2>
        <p>Admin access only. You must sign in with an admin account.</p>
        <Link to="/profile">Go to Profile</Link>
      </div>
    )
  }

  return children
}
