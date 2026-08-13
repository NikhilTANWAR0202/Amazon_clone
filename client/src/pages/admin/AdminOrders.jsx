import { Fragment, useEffect, useState } from 'react'
import api from '../../services/api'
import styles from './Admin.module.css'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedOrders, setExpandedOrders] = useState([])

  useEffect(() => {
    fetchOrders()
  }, [])

  function toggleDetails(orderId) {
    setExpandedOrders((current) =>
      current.includes(orderId) ? current.filter((id) => id !== orderId) : [...current, orderId]
    )
  }

  async function fetchOrders() {
    setLoading(true)
    setError('')

    try {
      const res = await api.get('/admin/orders')
      setOrders(res.data.orders || [])
    } catch (err) {
      setError('Unable to load orders.')
    } finally {
      setLoading(false)
    }
  }

  async function deleteOrder(id) {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return
    }

    try {
      await api.delete(`/admin/orders/${id}`)
      await fetchOrders()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Unable to delete order')
    }
  }

  async function updateStatus(id, status) {
    try {
      await api.patch(`/orders/${id}/status`, { status })
      await fetchOrders()
    } catch (err) {
      console.error(err)
      setError('Unable to update order status')
    }
  }

  async function updateReturnStatus(id, returnStatus) {
    try {
      await api.put(`/admin/orders/${id}/return`, { returnStatus })
      await fetchOrders()
    } catch (err) {
      console.error(err)
      setError('Unable to update return status')
    }
  }

  return (
    <div className={styles.adminShell}>
      <Sidebar />

      <div className={styles.adminContent}>
        <Navbar />

        <div className={styles.adminMain}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-start' }}>
            <div>
              <h1 className={styles.adminTitle}>Manage Orders</h1>
              <p className={styles.adminSubtitle}>Review and update order status across the store.</p>
            </div>
          </div>

          {error && <div className={styles.alert}>{error}</div>}

          <div className={styles.adminTableWrapper}>
            {loading ? (
              <div className={styles.loadingBlock}>Loading orders…</div>
            ) : orders.length === 0 ? (
              <div className={styles.emptyState}>No orders found.</div>
            ) : (
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Return</th>
                    <th>Items</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <Fragment key={order._id}>
                      <tr>
                        <td>
                          <div style={{ display: 'grid', gap: '4px' }}>
                            <span style={{ fontWeight: 700 }}>{order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || 'Guest' : 'Guest'}</span>
                            <span style={{ color: '#6b7280', fontSize: '0.92rem' }}>{order.user?.email || 'guest@example.com'}</span>
                          </div>
                        </td>
                        <td>₹ {Number(order.totalPrice ?? order.total ?? 0).toLocaleString('en-IN')}</td>
                        <td>{order.paymentMethod || 'N/A'}</td>
                        <td>
                          <span className={`${styles.badge} ${order.status === 'Delivered' ? styles.badgeSuccess : order.status === 'Cancelled' ? styles.badgeDanger : order.status === 'Processing' ? styles.badgeWarning : styles.badgePrimary}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <span className={`${styles.badge} ${order.returnStatus === 'Approved' ? styles.badgeSuccess : order.returnStatus === 'Rejected' ? styles.badgeDanger : order.returnStatus === 'Requested' ? styles.badgeWarning : styles.badgePrimary}`}>
                            {order.returnStatus || 'NotRequested'}
                          </span>
                        </td>
                        <td>{order.items?.length ?? 0}</td>
                        <td>
                          <div className={styles.tableActions} style={{ justifyContent: 'flex-end' }}>
                            <select className={styles.formGroup} value={order.status || 'Pending'} onChange={(e) => updateStatus(order._id, e.target.value)}>
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Packed">Packed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            {order.returnStatus === 'Requested' && (
                              <select className={styles.formGroup} value={order.returnStatus} onChange={(e) => updateReturnStatus(order._id, e.target.value)}>
                                <option value="Requested">Requested</option>
                                <option value="Approved">Approve</option>
                                <option value="Rejected">Reject</option>
                              </select>
                            )}
                            <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={() => toggleDetails(order._id)}>
                              {expandedOrders.includes(order._id) ? 'Hide items' : 'Show items'}
                            </button>
                            <button className={`${styles.button} ${styles.buttonDanger}`} onClick={() => deleteOrder(order._id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedOrders.includes(order._id) && (
                        <tr className={styles.orderDetailsRow}>
                          <td colSpan="6">
                            <div className={styles.orderDetails}>
                              <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                                <div><strong>Order ID:</strong> {order.orderId || order._id}</div>
                                <div><strong>Created:</strong> {new Date(order.createdAt).toLocaleString('en-IN')}</div>
                              </div>
                              <div style={{ display: 'grid', gap: '10px' }}>
                                {order.items?.map((item, index) => (
                                  <div className={styles.orderItem} key={`${order._id}-item-${index}`}>
                                    <div>
                                      <div style={{ fontWeight: 700 }}>{item.title}</div>
                                      <div style={{ color: '#6b7280', fontSize: '0.94rem' }}>{item.quantity} × ₹ {Number(item.price).toLocaleString('en-IN')}</div>
                                    </div>
                                    <div style={{ fontWeight: 700 }}>₹ {(item.quantity * item.price).toLocaleString('en-IN')}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
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

                        export default AdminOrders;