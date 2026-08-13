import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await API.get("/products");
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteProduct(id) {
    if (!window.confirm("Delete this product?")) return;

    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Delete Failed");
    }
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div style={{ padding: "20px" }}>
          <h1>Products</h1>

          <Link to="/admin/add-product">
            <button>Add Product</button>
          </Link>

          <br /><br />

          <table
            border="1"
            cellPadding="10"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>₹ {product.price}</td>
                  <td>{product.stock}</td>

                  <td>
                    <Link to={`/admin/edit-product/${product._id}`}>
                      <button>Edit</button>
                    </Link>

                    <button
                      style={{ marginLeft: "10px" }}
                      onClick={() => deleteProduct(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}

export default Products;