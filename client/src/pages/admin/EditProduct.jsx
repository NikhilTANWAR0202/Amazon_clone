import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ProductContext } from '../../context/ProductContext'
import api from '../../services/api'
import styles from './Admin.module.css'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reloadProducts } = useContext(ProductContext)

  const [product, setProduct] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchProduct() {
    try {
      const res = await api.get(`/products/${id}`)
      const p = res.data.product

      setProduct({
        name: p.name || "",
        brand: p.brand || "",
        category: p.category || "",
        description: p.description || "",
        price: p.price ?? "",
        stock: p.stock ?? "",
        // Product model stores images as an array; the form just edits
        // the first one for now (matches AddProduct's single-URL input).
        image: p.images?.[0] || "",
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to load product");
      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      let res
      if (files.length) {
        const fd = new FormData()
        fd.append('name', product.name)
        fd.append('brand', product.brand)
        fd.append('category', product.category)
        fd.append('description', product.description)
        fd.append('price', product.price)
        fd.append('stock', product.stock)
        files.forEach((f) => fd.append('images', f))
        res = await api.put(`/admin/products/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        const payload = {
          name: product.name,
          brand: product.brand,
          category: product.category,
          description: product.description,
          price: product.price,
          stock: product.stock,
          images: product.image ? [product.image] : [],
        };

        res = await api.put(`/admin/products/${id}`, payload)
      }

      if (reloadProducts) await reloadProducts()
      alert(res.data.message || 'Product updated successfully')

      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.adminShell}>
      <Sidebar />

      <div className={styles.adminContent}>
        <Navbar />

        <main className={styles.addProductBody}>
          <div className={styles.addProductCard}>
            <div className={styles.addProductHeader}>
              <div>
                <h1 className={styles.addProductTitle}>Edit Product</h1>
                <p className={styles.addProductDescription}>
                  Update product details and keep the catalog current.
                </p>
              </div>
            </div>

            {loading ? (
              <div style={{ padding: 24 }}>Loading product...</div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.addProductForm}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Product Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter the product title"
                      value={product.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Brand</label>
                    <input
                      type="text"
                      name="brand"
                      placeholder="Brand name"
                      value={product.brand}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Category</label>
                    <input
                      type="text"
                      name="category"
                      placeholder="Category"
                      value={product.category}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Price</label>
                    <input
                      type="number"
                      name="price"
                      min="0"
                      placeholder="₹0"
                      value={product.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Stock</label>
                    <input
                      type="number"
                      name="stock"
                      min="0"
                      placeholder="Units available"
                      value={product.stock}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Image URL</label>
                    <input
                      type="text"
                      name="image"
                      placeholder="https://..."
                      value={product.image}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Upload images</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const selected = Array.from(e.target.files || [])
                        setFiles(selected)
                        setPreviews(selected.map((f) => URL.createObjectURL(f)))
                      }}
                    />
                    <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                      {previews.map((src, idx) => (
                        <img key={idx} src={src} alt={`preview-${idx}`} style={{ width: 96, height: 72, objectFit: 'cover', borderRadius: 6 }} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea
                    name="description"
                    placeholder="Enter product description"
                    rows="5"
                    value={product.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                {product.image && (
                  <div>
                    <label style={{ display: 'block', marginBottom: 8 }}>Preview</label>
                    <img src={product.image} alt="Preview" className={styles.imagePreview} />
                    {uploadingImage && <div style={{ marginTop: 8, color: '#6b7280' }}>Uploading image…</div>}
                  </div>
                )}

                <div className={styles.formActions}>
                  <button type="button" className={`${styles.button} ${styles.buttonOutline}`} onClick={() => navigate('/admin/products')}>
                    Cancel
                  </button>
                  <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default EditProduct;