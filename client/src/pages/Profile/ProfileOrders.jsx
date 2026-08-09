import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { formatCurrency } from '../../utils/currency'
import styles from './Profile.module.css'

const statusLabel = (status) => {
  switch (status) {
    case 'Placed': return 'Placed'
    case 'Confirmed': return 'Confirmed'
    case 'Shipped': return 'Shipped'
    case 'Delivered': return 'Delivered'
    case 'Cancelled': return 'Cancelled'
    default: return 'Unknown'
  }
}

export default function ProfileOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await api.get('/orders')
        setOrders(res.data.orders || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load orders')
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileCard}>
        <div className={styles.profileSection}>
          <h2>My Orders</h2>
          {loading && <p>Loading orders...</p>}
          {error && <p className={styles.errorText}>{error}</p>}
          {!loading && !error && orders.length === 0 && (
            <div>
              <p>No past orders found.</p>
              <Link to="/products" className={styles.btnLink}>Browse products</Link>
            </div>
          )}
          {!loading && !error && orders.length > 0 && (
            <div className={styles.orderList}>
              {orders.map((order) => (
                <div key={order._id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div>
                      <div className={styles.orderMeta}>Order #{order.orderId || order._id}</div>
                      <div className={styles.orderTotal}>{formatCurrency(order.total)}</div>
                    </div>
                    <div className={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className={styles.orderItems}>
                    {order.items?.map((item) => (
                      <div key={item.productId || item.id} className={styles.orderItemRow}>
                        <span>{item.title} x {item.quantity}</span>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.orderFooter}>
                    <span>Status: <strong>{statusLabel(order.status)}</strong></span>
                    <Link to={`/orders/track/${order._id}`} className={styles.btnLink}>Track order</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
