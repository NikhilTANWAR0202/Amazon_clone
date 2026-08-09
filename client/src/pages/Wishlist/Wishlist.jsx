
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { formatCurrency } from '../../utils/currency'
import styles from './Wishlist.module.css'

export default function Wishlist(){
  const { wishlist, remove } = useWishlist()
  const { addToCart, cart } = useCart()

  const moveToCart = (item) => {
    addToCart({ ...item, id: item.id, images: item.images || [item.image] }, 1)
    remove(item.id)
  }

  return (
    <div className="container">
      <h2>Your Wishlist</h2>
      {wishlist.items.length === 0 ? (
        <p>Your wishlist is empty. Save items from the cart or product pages.</p>
      ) : (
        <div className={styles.wishlistGrid}>
          {wishlist.items.map((item) => (
            <article key={item.id} className={styles.wishlistItem}>
              <img src={item.images?.[0]} alt={item.title} />
              <div>
                <h3>{item.title}</h3>
                <p>{formatCurrency(item.price)}</p>
                <div className={styles.actions}>
                  <button onClick={() => moveToCart(item)}>
                    {cart.items.some((cartItem) => cartItem.id === item.id) ? 'In Cart' : 'Move to cart'}
                  </button>
                  <button onClick={() => remove(item.id)}>Remove</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
