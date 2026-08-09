import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await API.get("/orders");
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    }
  }

  async function updateStatus(id, status) {
    try {
      await API.put(`/orders/${id}/status`, {
        orderStatus: status,
      });

      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div style={{ padding: "30px" }}>
          <h1>All Orders</h1>

          <table border="1" cellPadding="10" width="100%">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.user?.name || "Unknown customer"}</td>

                  <td>₹ {order.totalPrice}</td>

                  <td>{order.orderStatus}</td>

                  <td>
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
                    >
                      <option>Pending</option>
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
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

export default Orders;