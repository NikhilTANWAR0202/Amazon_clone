import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { formatCurrency } from '../../utils/currency'
import styles from './AdminPanel.module.css'

const statuses = ['Placed', 'Confirmed', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await api.get('/admin/orders')
        setOrders(res.data.orders)
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load orders')
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  const refreshOrders = async () => {
    try {
      const res = await api.get('/admin/orders')
      setOrders(res.data.orders)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reload orders')
    }
  }

  const handleStatusChange = async (orderId, status) => {
    setError('')
    setSuccess('')
    try {
      const res = await api.put(`/admin/orders/${orderId}`, { status })
      setOrders((current) => current.map((order) => order._id === orderId ? res.data.order : order))
      setSuccess(`Order ${res.data.order.orderId} updated to ${status}.`)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update order status')
    }
  }

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Delete this order?')) return
    setError('')
    setSuccess('')
    try {
      await api.delete(`/admin/orders/${orderId}`)
      setOrders((current) => current.filter((order) => order._id !== orderId))
      setSuccess('Order deleted successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete order')
    }
  }

  if (loading) return <div className="container"><h2>Admin orders</h2><p>Loading orders...</p></div>
  if (error) return <div className="container"><h2>Admin orders</h2><p>{error}</p></div>

  return (
    <div className="container" style={{ maxWidth: 1100 }}>
      <div className={styles.adminNav}>
        <Link to="/admin" className={styles.adminNavLink}>Dashboard</Link>
        <Link to="/admin/users" className={styles.adminNavLink}>Users</Link>
        <Link to="/admin/orders" className={styles.adminNavLink}>Orders</Link>
      </div>
      <h2>Admin orders</h2>
      {success && <div className={styles.successBanner}>{success}</div>}
      <div className={styles.card}>
        <div className={styles.rowHeader}>
          <span>Order</span>
          <span>User</span>
          <span>Total</span>
          <span>Status</span>
          <span>Action</span>
        </div>
        {orders.map((order) => (
          <div key={order._id} className={styles.row}>
            <span>{order.orderId}</span>
            <span>{order.user?.email || 'Unknown'}</span>
            <span>{formatCurrency(order.total)}</span>
            <span>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </span>
            <span className={styles.rowActions}>
              <button type="button" onClick={() => handleDeleteOrder(order._id)} className={styles.dangerButton}>Delete</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
