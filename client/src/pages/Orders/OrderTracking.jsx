import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../services/api'
import { formatCurrency } from '../../utils/currency'

export default function OrderTracking() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`)
        setOrder(res.data.order)
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load order')
      } finally {
        setLoading(false)
      }
    }
    loadOrder()
  }, [id])

  if (loading) return <div className="container"><h2>Track order</h2><p>Loading...</p></div>
  if (error) return <div className="container"><h2>Track order</h2><p>{error}</p></div>
  if (!order) return <div className="container"><h2>Track order</h2><p>Order not found.</p></div>

  const timeline = [
    { key: 'Placed', label: 'Order placed', hours: 0, description: 'We have received your order.' },
    { key: 'Confirmed', label: 'Order confirmed', hours: 2, description: 'Your order has been confirmed.' },
    { key: 'Processing', label: 'Processing', hours: 5, description: 'Your order is being prepared for shipment.' },
    { key: 'Shipped', label: 'Shipped', hours: 8, description: 'Your package has left the warehouse.' },
    { key: 'Out for Delivery', label: 'Out for Delivery', hours: 12, description: 'Your order is on the way.' },
    { key: 'Delivered', label: 'Delivered', hours: 16, description: 'Your order is scheduled to be delivered.' }
  ]

  // Find matching timeline step using case-insensitive comparison so different capitalizations
  // (e.g. "Out for Delivery" vs "Out for delivery") match correctly.
  const currentIndex = timeline.findIndex((step) => (step.key || '').toLowerCase() === (order.status || '').toLowerCase())
  const statusIndex = currentIndex === -1 ? timeline.findIndex((step) => step.key === 'Shipped') : currentIndex

  const formatStageTime = (hours) => {
    const date = new Date(order.createdAt)
    date.setHours(date.getHours() + hours)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <h2>Track your order</h2>
      <div style={{ padding: 20, background: '#fff', borderRadius: 14, boxShadow: '0 10px 30px rgba(15,23,42,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h3>{order.orderId}</h3>
            <p>Status: <strong>{order.status}</strong></p>
            <p>Placed on: {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p>Total: <strong>{formatCurrency(order.total)}</strong></p>
            <p>Payment: {order.paymentMethod}</p>
          </div>
        </div>

        <div style={{ marginTop: 24, padding: '18px 0' }}>
          <h4>Delivery timeline</h4>
          <div style={{ display: 'grid', gap: 16 }}>
            {timeline.map((step, index) => {
              const isCompleted = index <= statusIndex
              return (
                <div key={step.key} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: isCompleted ? '#16a34a' : '#d1d5db',
                    marginTop: 4
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'baseline' }}>
                      <div style={{ fontWeight: 700, color: isCompleted ? '#111' : '#4b5563' }}>{step.label}</div>
                      <div style={{ color: '#6b7280', fontSize: 13 }}>{formatStageTime(step.hours)}</div>
                    </div>
                    <div style={{ color: isCompleted ? '#374151' : '#6b7280', fontSize: 14 }}>{step.description}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <h4>Shipping address</h4>
          <p>{order.address.fullName}</p>
          <p>{order.address.addressLine1}</p>
          {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
          <p>{order.address.city}, {order.address.state} {order.address.zip}</p>
          <p>{order.address.phone}</p>
        </div>
        <div style={{ marginTop: 24 }}>
          <h4>Order items</h4>
          <div style={{ display: 'grid', gap: 12 }}>
            {order.items.map((item) => (
              <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: 12, border: '1px solid #e5e7eb', borderRadius: 10 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{item.title}</div>
                  <div>{item.quantity} × {formatCurrency(item.price)}</div>
                </div>
                <div>{formatCurrency(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <Link to="/orders" style={{ color: '#2563eb' }}>Back to orders</Link>
        </div>
      </div>
    </div>
  )
}
