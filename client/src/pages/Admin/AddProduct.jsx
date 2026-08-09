import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function AddProduct() {
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

  function handleChange(e) {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const payload = {
        name: product.name,
        brand: product.brand,
        category: product.category,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.image ? [product.image] : [],
      }

      const res = await api.post('/admin/products', payload)

      alert(res.data.message);

      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add product");
    }
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div style={{ padding: "30px" }}>
          <h1>Add Product</h1>

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

            <button type="submit">
              Add Product
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;