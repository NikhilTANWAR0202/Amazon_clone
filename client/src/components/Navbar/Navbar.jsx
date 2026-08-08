import styles from './Navbar.module.css'
import NavbarBanner from './NavbarBanner'
import NavbarBelt from './NavbarBelt'

export default function Navbar() {
  return (
    <header className={styles.header}>
      <NavbarBelt />
      <NavbarBanner />
    </header>
  )
}
