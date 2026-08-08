import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { formatCurrency } from '../../utils/currency'
import styles from './AdminDashboard.module.css'

const initialProduct = {
  title: '',
  brand: '',
  category: '',
  price: '',
  stock: '',
  description: '',
  thumbnail: ''
}

const statusOrderKeys = ['Placed', 'Confirmed', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [newProduct, setNewProduct] = useState(initialProduct)
  const [editingProduct, setEditingProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0)
  const totalSales = orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + Number(item.quantity || 0), 0), 0)
  const totalOrders = orders.length
  const totalUsers = users.length
  const totalProducts = products.length
  const outOfStock = products.filter((product) => Number(product.stock) <= 0).length
  const pendingOrders = orders.filter((order) => ['Placed', 'Confirmed', 'Processing', 'Pending'].includes(order.status)).length
  const deliveredOrders = orders.filter((order) => order.status === 'Delivered').length

  const statusCounts = statusOrderKeys.reduce((counts, status) => {
    counts[status] = 0
    return counts
  }, {})

  const revenueByStatus = statusOrderKeys.reduce((revenue, status) => {
    revenue[status] = 0
    return revenue
  }, {})

  orders.forEach((order) => {
    const status = statusOrderKeys.includes(order.status) ? order.status : 'Placed'
    statusCounts[status] = (statusCounts[status] || 0) + 1
    revenueByStatus[status] = (revenueByStatus[status] || 0) + Number(order.total || 0)
  })

  const maxCount = Math.max(...Object.values(statusCounts), 1)
  const maxRevenue = Math.max(...Object.values(revenueByStatus), 1)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersRes, ordersRes, productsRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/orders'),
          api.get('/products')
        ])
        setUsers(usersRes.data.users)
        setOrders(ordersRes.data.orders)
        setProducts(productsRes.data.products)
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load admin data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleChange = (field, value) => {
    setNewProduct((current) => ({ ...current, [field]: value }))
  }

  const handleAddProduct = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    try {
      const payload = {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        images: newProduct.thumbnail ? [newProduct.thumbnail] : []
      }
      const res = await api.post('/products', payload)
      setProducts((current) => [res.data.product, ...current])
      setNewProduct(initialProduct)
      setSuccess('Product added successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to add product')
    }
  }

  const handleEditClick = (product) => {
    setEditingProduct({ ...product, price: product.price ?? '', stock: product.stock ?? '' })
    setSuccess('')
    setError('')
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
    setError('')
    setSuccess('')
  }

  const handleUpdateProduct = async (event) => {
    event.preventDefault()
    if (!editingProduct) return
    setError('')
    setSuccess('')

    try {
      const payload = {
        title: editingProduct.title,
        brand: editingProduct.brand,
        category: editingProduct.category,
        description: editingProduct.description,
        price: Number(editingProduct.price),
        stock: Number(editingProduct.stock),
        thumbnail: editingProduct.thumbnail,
        images: editingProduct.thumbnail ? [editingProduct.thumbnail] : []
      }
      const res = await api.put(`/products/${editingProduct._id}`, payload)
      setProducts((current) => current.map((product) => product._id === res.data.product._id ? res.data.product : product))
      setEditingProduct(null)
      setSuccess('Product updated successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update product')
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return
    setError('')
    setSuccess('')

    try {
      await api.delete(`/products/${id}`)
      setProducts((current) => current.filter((product) => product._id !== id))
      setSuccess('Product deleted successfully.')
      if (editingProduct?._id === id) {
        setEditingProduct(null)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete product')
    }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user account?')) return
    setError('')
    setSuccess('')

    try {
      await api.delete(`/admin/users/${id}`)
      setUsers((current) => current.filter((user) => user._id !== id))
      setSuccess('User profile deleted successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete user')
    }
  }

  if (loading) return <div className="container"><h2>Admin Dashboard</h2><p>Loading admin data...</p></div>
  if (error) return <div className="container"><h2>Admin Dashboard</h2><p>{error}</p></div>

  return (
    <div className="container" style={{ maxWidth: 1100 }}>
      <div className={styles.adminNav}>
        <Link to="/admin" className={styles.adminNavLink}>Dashboard</Link>
        <Link to="/admin/users" className={styles.adminNavLink}>Users</Link>
        <Link to="/admin/orders" className={styles.adminNavLink}>Orders</Link>
      </div>

      <h2>Admin Dashboard</h2>
      {success && <div className={styles.successBanner}>{success}</div>}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <h4>Total Revenue</h4>
          <p>{formatCurrency(totalRevenue)}</p>
        </div>
        <div className={styles.statCard}>
          <h4>Total Sales</h4>
          <p>{totalSales}</p>
        </div>
        <div className={styles.statCard}>
          <h4>Total Orders</h4>
          <p>{totalOrders}</p>
        </div>
        <div className={styles.statCard}>
          <h4>Total Products</h4>
          <p>{totalProducts}</p>
        </div>
        <div className={styles.statCard}>
          <h4>Total Users</h4>
          <p>{totalUsers}</p>
        </div>
        <div className={styles.statCard}>
          <h4>Out of Stock</h4>
          <p>{outOfStock}</p>
        </div>
        <div className={styles.statCard}>
          <h4>Pending Orders</h4>
          <p>{pendingOrders}</p>
        </div>
        <div className={styles.statCard}>
          <h4>Delivered Orders</h4>
          <p>{deliveredOrders}</p>
        </div>
      </div>

      <div className={styles.chartGrid}>
        <section className={styles.card}>
          <h3>Order status distribution</h3>
          {statusOrderKeys.map((status) => (
            <div key={status} className={styles.chartRow}>
              <span>{status}</span>
              <div className={styles.chartBar}>
                <div className={styles.chartBarFill} style={{ width: `${(statusCounts[status] / maxCount) * 100}%` }} />
              </div>
              <span>{statusCounts[status]}</span>
            </div>
          ))}
        </section>

        <section className={styles.card}>
          <h3>Revenue by status</h3>
          {statusOrderKeys.map((status) => (
            <div key={status} className={styles.chartRow}>
              <span>{status}</span>
              <div className={styles.chartBar}>
                <div className={styles.chartBarFill} style={{ width: `${(revenueByStatus[status] / maxRevenue) * 100}%` }} />
              </div>
              <span>{formatCurrency(revenueByStatus[status])}</span>
            </div>
          ))}
        </section>
      </div>

      <section className={styles.card}>
        <h3>Product inventory</h3>
        <form className={styles.productForm} onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
          <div className={styles.productInputs}>
            <div className={styles.productField}>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                value={editingProduct ? editingProduct.title : newProduct.title}
                onChange={(e) => editingProduct ? setEditingProduct((current) => ({ ...current, title: e.target.value })) : handleChange('title', e.target.value)}
                required
              />
            </div>
            <div className={styles.productField}>
              <label htmlFor="brand">Brand</label>
              <input
                id="brand"
                value={editingProduct ? editingProduct.brand : newProduct.brand}
                onChange={(e) => editingProduct ? setEditingProduct((current) => ({ ...current, brand: e.target.value })) : handleChange('brand', e.target.value)}
                required
              />
            </div>
            <div className={styles.productField}>
              <label htmlFor="category">Category</label>
              <input
                id="category"
                value={editingProduct ? editingProduct.category : newProduct.category}
                onChange={(e) => editingProduct ? setEditingProduct((current) => ({ ...current, category: e.target.value })) : handleChange('category', e.target.value)}
                required
              />
            </div>
            <div className={styles.productField}>
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={editingProduct ? editingProduct.price : newProduct.price}
                onChange={(e) => editingProduct ? setEditingProduct((current) => ({ ...current, price: e.target.value })) : handleChange('price', e.target.value)}
                required
              />
            </div>
            <div className={styles.productField}>
              <label htmlFor="stock">Stock</label>
              <input
                id="stock"
                type="number"
                min="0"
                value={editingProduct ? editingProduct.stock : newProduct.stock}
                onChange={(e) => editingProduct ? setEditingProduct((current) => ({ ...current, stock: e.target.value })) : handleChange('stock', e.target.value)}
                required
              />
            </div>
            <div className={styles.productField}>
              <label htmlFor="thumbnail">Image URL</label>
              <input
                id="thumbnail"
                value={editingProduct ? editingProduct.thumbnail : newProduct.thumbnail}
                onChange={(e) => editingProduct ? setEditingProduct((current) => ({ ...current, thumbnail: e.target.value })) : handleChange('thumbnail', e.target.value)}
              />
            </div>
          </div>
          <div className={styles.productField}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={editingProduct ? editingProduct.description : newProduct.description}
              onChange={(e) => editingProduct ? setEditingProduct((current) => ({ ...current, description: e.target.value })) : handleChange('description', e.target.value)}
              rows="3"
              required
            />
          </div>
          <div className={styles.productActions}>
            <button type="submit" className={styles.primaryButton}>{editingProduct ? 'Update product' : 'Add product'}</button>
            {editingProduct && (
              <button type="button" className={styles.secondaryButton} onClick={handleCancelEdit}>Cancel</button>
            )}
          </div>
        </form>

        <div className={styles.productTable}>
          <div className={styles.productTableHeader}>
            <span>Product</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Actions</span>
          </div>
          {products.map((product) => (
            <div key={product._id} className={styles.productRow}>
              <span>{product.title}</span>
              <span>{formatCurrency(product.price)}</span>
              <span>{product.stock}</span>
              <span className={styles.rowActions}>
                <button type="button" onClick={() => handleEditClick(product)} className={styles.secondaryButton}>Edit</button>
                <button type="button" onClick={() => handleDeleteProduct(product._id)} className={styles.dangerButton}>Delete</button>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.card}>
        <h3>Recent users</h3>
        <div className={styles.table}>
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
                <button type="button" onClick={() => handleDeleteUser(user._id)} className={styles.dangerButton}>Delete</button>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.card}>
        <h3>Recent orders</h3>
        <div className={styles.table}>
          <div className={styles.rowHeader}>
            <span>Order</span>
            <span>User</span>
            <span>Total</span>
          </div>
          {orders.map((order) => (
            <div key={order._id} className={styles.row}>
              <span>{order.orderId}</span>
              <span>{order.user?.email || 'Unknown'}</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
