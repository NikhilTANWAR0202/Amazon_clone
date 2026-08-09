import { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaExclamationTriangle,
  FaRupeeSign,
  FaShoppingBag,
  FaUsers,
} from "react-icons/fa";
import api from "../../services/api";
import styles from "./Admin.module.css";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    outOfStockProducts: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/admin/stats");
      setStats(res.data.stats || {});
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.adminShell}>
      <Sidebar />

      <div className={styles.adminContent}>
        <Navbar />

        <div className={styles.adminMain}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "18px", flexWrap: "wrap" }}>
            <div>
              <h1 className={styles.adminTitle}>Dashboard</h1>
              <p className={styles.adminSubtitle}>
                Welcome back{user?.firstName ? `, ${user.firstName}` : user?.name ? `, ${user.name.split(" ")[0]}` : ""}! Here's a quick overview of your store.
              </p>
            </div>
            <div className={styles.metaCard}>
              <div style={{ fontSize: "0.82rem", color: "#475569" }}>Orders tracked</div>
              <div style={{ fontSize: "1.9rem", fontWeight: 700 }}>{loading ? "—" : stats.totalOrders}</div>
            </div>
          </div>

          {error && <div className={styles.alert}>{error}</div>}

          <div className={styles.statsGrid}>
            <MetricCard
              icon={FaRupeeSign}
              label="Total Revenue"
              value={loading ? "—" : `₹${stats.totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              accent="#f59e0b"
              note="Revenue from all processed orders"
            />
            <MetricCard
              icon={FaShoppingBag}
              label="Total Orders"
              value={loading ? "—" : stats.totalOrders}
              accent="#2563eb"
              note="Orders currently in the system"
            />
            <MetricCard
              icon={FaUsers}
              label="Total Users"
              value={loading ? "—" : stats.totalUsers}
              accent="#7c3aed"
              note="Registered customers and admins"
            />
            <MetricCard
              icon={FaBoxOpen}
              label="Total Products"
              value={loading ? "—" : stats.totalProducts}
              accent="#059669"
              note="Products listed in the catalog"
            />
            <MetricCard
              icon={FaExclamationTriangle}
              label="Out of stock"
              value={loading ? "—" : stats.outOfStockProducts}
              accent="#ef4444"
              note="Products needing restock"
            />
            <MetricCard
              icon={FaShoppingBag}
              label="Pending orders"
              value={loading ? "—" : stats.pendingOrders}
              accent="#f59e0b"
              note="Orders waiting for processing"
            />
            <MetricCard
              icon={FaCheckCircle}
              label="Delivered orders"
              value={loading ? "—" : stats.deliveredOrders}
              accent="#16a34a"
              note="Orders successfully delivered"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, accent, note }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <div>
          <p className={styles.statLabel}>{label}</p>
        </div>
        <div className={styles.statIcon} style={{ background: `${accent}15` }}>
          <Icon color={accent} size={18} />
        </div>
      </div>
      <div className={styles.statValue}>{value}</div>
      <p className={styles.statNote}>{note}</p>
    </div>
  );
}

export default Dashboard;
