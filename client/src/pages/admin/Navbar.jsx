import { FaUserCircle } from "react-icons/fa";
import styles from './Admin.module.css';

function Navbar() {
  const userRaw = localStorage.getItem("user")
  const user = userRaw ? JSON.parse(userRaw) : null

  return (
    <div className={styles.adminTopbar}>
      <div className={styles.adminTopbarDate}>
        {new Date().toLocaleDateString('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>

      <div className={styles.adminUserProfile}>
        <FaUserCircle size={26} color="#131921" />
        <div>
          <div>{user?.name || 'Admin'}</div>
          <div>{user?.email || ''}</div>
        </div>
      </div>
    </div>
  )
}

export default Navbar;