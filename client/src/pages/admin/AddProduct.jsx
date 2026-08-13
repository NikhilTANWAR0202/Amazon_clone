import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../../context/ProductContext";
import api from "../../services/api";
import styles from "./Admin.module.css";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function AddProduct() {
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
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])

  function handleChange(e) {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  }

  function handleFileChange(e) {
    const selected = Array.from(e.target.files || [])
    setFiles(selected)
    setPreviews(selected.map((f) => URL.createObjectURL(f)))
  }

  async function handleSubmit(e) {
    e.preventDefault();

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
        res = await api.post('/admin/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        const payload = {
          name: product.name,
          brand: product.brand,
          category: product.category,
          description: product.description,
          price: product.price,
          stock: product.stock,
          images: product.image ? [product.image] : [],
        }
        res = await api.post('/admin/products', payload)
      }

      if (reloadProducts) await reloadProducts()
      alert(res.data.message || 'Product added successfully')

      navigate("/admin/products")
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add product");
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
                <h1 className={styles.addProductTitle}>Add Product</h1>
                <p className={styles.addProductDescription}>
                  Create a new catalog item and keep your storefront inventory up to date.
                </p>
              </div>
            </div>

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
                  <input type="file" accept="image/*" multiple onChange={handleFileChange} />
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

              <div className={styles.formActions}>
                <button type="button" className={`${styles.button} ${styles.buttonOutline}`} onClick={() => navigate('/admin/products')}>
                  Cancel
                </button>
                <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AddProduct;