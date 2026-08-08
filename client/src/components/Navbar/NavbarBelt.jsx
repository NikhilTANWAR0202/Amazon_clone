import { useContext, useState } from 'react'
import { FaSearch, FaShoppingCart } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import amazonLogo from '../../assets/amazonLogo.png'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { ProductContext } from '../../context/ProductContext'
import styles from './NavbarBelt.module.css'

export default function NavbarBelt() {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { cart } = useCart()
  const { user, logout } = useAuth()
  const { products } = useContext(ProductContext)
  const navigate = useNavigate()

  const handleSearch = (event) => {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    setShowSuggestions(false)
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  const suggestions = query.trim().length > 0
    ? products
        .filter((product) =>
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.brand.toLowerCase().includes(query.toLowerCase()) ||
          (product.category || '').toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6)
    : []

  const handleSuggestionClick = (value) => {
    setQuery(value)
    setShowSuggestions(false)
    navigate(`/search?q=${encodeURIComponent(value)}`)
  }

  return (
    <div className={styles.navbelt}>
      <Link to="/" className={styles.logo}>
        <img src={amazonLogo} alt="Amazon" className={styles.logoImg} />
      </Link>
      <div className={styles.location}>
        <small>Deliver to</small>
        <strong>India</strong>
      </div>
      <div className={styles.searchWrapper}>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder="Search Amazon.in"
            aria-label="Search products"
          />
          <button type="submit" aria-label="Search">
            <FaSearch />
          </button>
        </form>
        {showSuggestions && suggestions.length > 0 && (
          <div className={styles.suggestionsPanel}>
            {suggestions.map((product) => (
              <button
                key={product.id}
                type="button"
                className={styles.suggestionItem}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSuggestionClick(product.title)}
              >
                {product.title}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className={styles.actions}>
        <div className={styles.actionItem}>
          <span>{user ? `Hello, ${user.firstName || user.email}` : 'Hello, Sign in'}</span>
          <Link to={user ? '/profile' : '/login'}>{user ? 'Account' : 'Account & Lists'}</Link>
        </div>
        <div className={styles.actionItem}>
          <span>Returns</span>
          <Link to="/orders">Orders</Link>
        </div>
        {user?.role === 'admin' && (
          <div className={styles.actionItem}>
            <span>Admin</span>
            <Link to="/admin">Dashboard</Link>
          </div>
        )}
        <div className={styles.actionItem}>
          <span>Your</span>
          <Link to="/wishlist">Wishlist</Link>
        </div>
        <Link to="/cart" className={styles.cartLink}>
          <FaShoppingCart />
          <span className={styles.cartCount}>{cart.items.length}</span>
          <span>Cart</span>
        </Link>
        {user && (
          <button type="button" className={styles.logoutButton} onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </div>
  )
}
