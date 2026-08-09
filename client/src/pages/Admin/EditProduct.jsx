import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

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
      const payload = {
        name: product.name,
        brand: product.brand,
        category: product.category,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.image ? [product.image] : [],
      };

      const res = await api.put(`/admin/products/${id}`, payload)

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
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div style={{ padding: "30px" }}>
          <h1>Edit Product</h1>

          {loading ? (
            <p>Loading product...</p>
          ) : (
            <form onSubmit={handleSubmit}>

              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={product.name}
                onChange={handleChange}
              />

              <br /><br />

              <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={product.brand}
                onChange={handleChange}
              />

              <br /><br />

              <input
                type="text"
                name="category"
                placeholder="Category"
                value={product.category}
                onChange={handleChange}
              />

              <br /><br />

              <textarea
                name="description"
                placeholder="Description"
                rows="4"
                cols="40"
                value={product.description}
                onChange={handleChange}
              />

              <br /><br />

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={product.price}
                onChange={handleChange}
              />

              <br /><br />

              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={product.stock}
                onChange={handleChange}
              />

              <br /><br />

              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={product.image}
                onChange={handleChange}
              />

              <br /><br />

              <button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditProduct;