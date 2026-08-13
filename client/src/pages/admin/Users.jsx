import { useEffect, useState } from "react";

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data.users);
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteUser(id) {
    if (!window.confirm("Delete this user?")) return;

    try {
      await API.delete(`/admin/users/${id}`);
      alert("User deleted successfully");
      fetchUsers();
    } catch (err) {
      console.log(err);
      alert("Unable to delete user");
    }
  }

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "30px" }}>
      <h1>User Management</h1>

      <p
        style={{
          color: "#666",
          marginBottom: "20px",
        }}
      >
        Total Users : <b>{filteredUsers.length}</b>
      </p>

      <input
        type="text"
        placeholder="Search user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "350px",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "5px",
          border: "1px solid gray",
        }}
      />

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "white",
          boxShadow: "0 2px 10px rgba(0,0,0,.1)",
        }}
      >
        <thead
          style={{
            background: "#131921",
            color: "white",
          }}
        >
          <tr>
            <th style={th}>Name</th>
            <th style={th}>Email</th>
            <th style={th}>Phone</th>
            <th style={th}>Role</th>
            <th style={th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td style={td}>{user.name}</td>

              <td style={td}>{user.email}</td>

              <td style={td}>{user.phone || "-"}</td>

              <td style={td}>
                <span
                  style={{
                    padding: "5px 12px",
                    borderRadius: "20px",
                    color: "white",
                    background:
                      user.role === "admin"
                        ? "#2E7D32"
                        : "#1976D2",
                  }}
                >
                  {user.role}
                </span>
              </td>

              <td style={td}>
                <button
                  onClick={() => deleteUser(user._id)}
                  style={{
                    background: "#D32F2F",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  padding: "15px",
  textAlign: "left",
};

const td = {
  padding: "15px",
  borderBottom: "1px solid #ddd",
};

export default Users;