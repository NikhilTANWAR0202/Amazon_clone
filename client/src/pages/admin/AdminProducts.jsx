import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ProductContext } from '../../context/ProductContext'
import api from '../../services/api'
import styles from './Admin.module.css'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const initialForm = {
  title: '',
  brand: '',
  category: '',
  description: '',
  price: '',
  stock: '',
  image: '',
  oldPrice: '',
  discountPercentage: '',
  prime: 'false',
  deliveryDays: '2',
  returnPolicy: '30-day return policy'
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(initialForm)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [activeProduct, setActiveProduct] = useState(null)
  const [search, setSearch] = useState('')
  const { page, totalPages, setPage } = useContext(ProductContext)

  useEffect(() => {
    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const value = search.toLowerCase()
      return (
        product.title?.toLowerCase().includes(value) ||
        product.brand?.toLowerCase().includes(value) ||
        product.category?.toLowerCase().includes(value)
      )
    })
  }, [products, search])

  async function fetchProducts() {
    setLoading(true)
    setError('')

    try {
      const res = await api.get('/admin/products')
      setProducts(res.data.products || [])
    } catch (err) {
      if (err.response?.status === 404) {
        const fallback = await api.get('/products')
        setProducts(fallback.data.products || [])
      } else {
        setError('Unable to load products.')
      }
    } finally {
      setLoading(false)
    }
  }

  const navigate = useNavigate()

  function openAddProduct() {
    setForm(initialForm)
    setActiveProduct(null)
    setIsEditMode(false)
    setIsModalOpen(true)
  }

  function openEditProduct(product) {
    navigate(`/admin/edit-product/${product._id}`)
  }

  function handleFormChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function normalizeCategory(value) {
    return value
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\bphones?\b/i, 'Mobiles')
      .replace(/\bmobile\b/i, 'Mobiles')
      .replace(/\bsmartphone\b/i, 'Mobiles')
      .replace(/\blaptops?\b/i, 'Laptops')
      .replace(/\bnotebook\b/i, 'Laptops')
      .replace(/\bheadphones?\b/i, 'Electronics')
      .replace(/\bcamera\b/i, 'Electronics')
      .replace(/\bconsole\b/i, 'Gaming')
      .replace(/\bshoes?\b/i, 'Shoes')
      .replace(/\bbooks?\b/i, 'Books')
      .replace(/\bkitchen\b/i, 'Kitchen')
      .replace(/\bhome\b/i, 'Home')
      .replace(/\bfashion\b/i, 'Fashion')
      .replace(/\bbeauty\b/i, 'Beauty')
      .replace(/\bsports?\b/i, 'Sports')
      .replace(/\baccessories?\b/i, 'Accessories')
  }

  function buildPayload() {
    return {
      name: form.title,
      title: form.title,
      brand: form.brand,
      category: form.category ? normalizeCategory(form.category) : form.category,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.image ? [form.image] : [],
      thumbnail: form.image,
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      discountPercentage: form.discountPercentage ? Number(form.discountPercentage) : 0,
      prime: form.prime === 'true',
      deliveryDays: Number(form.deliveryDays),
      returnPolicy: form.returnPolicy
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = buildPayload()

      if (isEditMode && activeProduct) {
        await api.put(`/admin/products/${activeProduct._id}`, payload)
      } else {
        await api.post('/admin/products', payload)
      }

      await fetchProducts()
      setIsModalOpen(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save product')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(productId) {
    const confirm = window.confirm('Delete this product permanently?')
    if (!confirm) return

    try {
      await api.delete(`/admin/products/${productId}`)
      await fetchProducts()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete product')
    }
  }

  const activeImage = form.image || 'https://via.placeholder.com/240x180?text=Preview'

  return (
    <div className={styles.adminShell}>
      <Sidebar />

      <div className={styles.adminContent}>
        <Navbar />

        <div className={styles.adminMain}>
          <div className={styles.adminHeader}>
            <div>
              <h1 className={styles.adminTitle}>Product catalog</h1>
              <p className={styles.adminSubtitle}>Manage inventory, pricing and product details from one dashboard.</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/admin/add-product" className={styles.buttonLink}>
                <button className={`${styles.button} ${styles.buttonPrimary}`} type="button">
                  Add new product
                </button>
              </Link>
            </div>
          </div>

          {error && <div className={styles.alert}>{error}</div>}

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginTop: '18px' }}>
            <input
              className={styles.formGroup}
              type="search"
              placeholder="Search products by title, brand or category"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: '1 1 320px', padding: '14px 16px', borderRadius: '14px', border: '1px solid #d1d5db', background: '#fff' }}
            />

            <div className={styles.metaCard}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Total products</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '6px' }}>{products.length}</div>
            </div>
            <div className={styles.metaCard}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Total products</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '6px' }}>{products.length}</div>
            </div>
          </div>

          <div className={styles.adminTableWrapper}>
            {loading ? (
              <div className={styles.loadingBlock}>Loading product catalog…</div>
            ) : filteredProducts.length === 0 ? (
              <div className={styles.emptyState} style={{ marginTop: '24px' }}>
                No products match this search.
              </div>
            ) : (
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <div className={styles.productCell}>
                          <img className={styles.productImage} src={product.images?.[0] || product.thumbnail || 'https://via.placeholder.com/80'} alt={product.title || product.name || 'Product'} />
                          <div>
                            <div style={{ fontWeight: 700, marginBottom: '6px' }}>{product.title || product.name}</div>
                            <div style={{ color: '#6b7280', fontSize: '0.95rem' }}>{product.brand} · {product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td>₹ {(product.price ?? product.amount ?? 0).toLocaleString('en-IN')}</td>
                      <td>{product.stock ?? 0}</td>
                      <td>
                        <span className={`${styles.badge} ${product.stock === 0 ? styles.badgeDanger : product.stock < 10 ? styles.badgeWarning : styles.badgeSuccess}`}>
                          {product.stock === 0 ? 'Out of stock' : product.stock < 10 ? 'Low stock' : 'In stock'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.tableActions}>
                          <button className={`${styles.button} ${styles.buttonOutline}`} onClick={() => openEditProduct(product)}>
                            Edit
                          </button>
                          <button className={`${styles.button} ${styles.buttonDanger}`} onClick={() => handleDelete(product._id)}>
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

      {isModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>{isEditMode ? 'Edit product' : 'Add new product'}</h2>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem' }}>Update pricing, stock and product details.</p>
              </div>
              <button className={styles.button} style={{ background: 'transparent', color: '#334155' }} onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalBody}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Title</label>
                  <input name="title" value={form.title} onChange={handleFormChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Brand</label>
                  <input name="brand" value={form.brand} onChange={handleFormChange} required />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Category</label>
                  <input name="category" value={form.category} onChange={handleFormChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Price</label>
                  <input name="price" type="number" min="0" value={form.price} onChange={handleFormChange} required />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Stock</label>
                  <input name="stock" type="number" min="0" value={form.stock} onChange={handleFormChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Image URL</label>
                  <input name="image" value={form.image} onChange={handleFormChange} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Old Price</label>
                  <input name="oldPrice" type="number" min="0" value={form.oldPrice} onChange={handleFormChange} />
                </div>
                <div className={styles.formGroup}>
                  <label>Discount %</label>
                  <input name="discountPercentage" type="number" min="0" max="100" value={form.discountPercentage} onChange={handleFormChange} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Delivery Days</label>
                  <input name="deliveryDays" type="number" min="1" value={form.deliveryDays} onChange={handleFormChange} />
                </div>
                <div className={styles.formGroup}>
                  <label>Prime</label>
                  <select name="prime" value={form.prime} onChange={handleFormChange}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea name="description" rows="4" value={form.description} onChange={handleFormChange} required />
              </div>

              <div className={styles.formGroup}>
                <label>Return policy</label>
                <input name="returnPolicy" value={form.returnPolicy} onChange={handleFormChange} />
              </div>

              <img className={styles.imagePreview} src={activeImage} alt="Product preview" />

              <div className={styles.modalFooter}>
                <button className={`${styles.button} ${styles.buttonOutline}`} type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button className={`${styles.button} ${styles.buttonPrimary}`} type="submit" disabled={saving}>
                  {saving ? 'Saving…' : isEditMode ? 'Update product' : 'Create product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
