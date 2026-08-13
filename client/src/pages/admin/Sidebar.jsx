import {
  FaBoxOpen,
  FaShoppingBag,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUsers,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from './Admin.module.css';

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: FaTachometerAlt, exact: true },
  { to: "/admin/products", label: "Products", icon: FaBoxOpen },
  { to: "/admin/orders", label: "Orders", icon: FaShoppingBag },
  { to: "/admin/users", label: "Users", icon: FaUsers },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  function isActive(item) {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <aside className={styles.adminSidebar}>
      <div className={styles.adminBrand}>
        <div className={styles.adminBrandTitle}>Amazon Clone</div>
        <div className={styles.adminBrandSubtitle}>Admin Panel</div>
      </div>

      <nav className={styles.adminNav}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              style={{
                color: active ? "#131921" : "#d1d5db",
                background: active ? "#FFD814" : "transparent",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                borderRadius: "8px",
                fontWeight: active ? 600 : 500,
                fontSize: "14.5px",
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className={styles.adminNavFooter}>
        <button className={styles.adminLogout} onClick={handleLogout}>
          <FaSignOutAlt size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;