import { Link } from 'react-router-dom'
import styles from './NavbarBanner.module.css'

const navLinks = [
  { label: 'Best Sellers', to: '/best-sellers' },
  { label: 'Mobiles', to: '/mobiles' },
  { label: 'Customer Service', to: '/customer-service' },
  { label: 'Prime', to: '/products' },
  { label: "Today's Deals", to: '/today-deals' },
  { label: 'Electronics', to: '/electronics' },
  { label: 'Fashion', to: '/fashion' },
  { label: 'New Releases', to: '/products' },
  { label: 'Home', to: '/' },
  { label: 'Beauty', to: '/products' },
]

export default function NavbarBanner() {
  return (
    <div className={styles.banner}>
      <div className={styles.menuToggle}>All</div>
      {navLinks.map(({ label, to }) => (
        <Link key={label} to={to} className={styles.link}>
          {label}
        </Link>
      ))}
    </div>
  )
}
