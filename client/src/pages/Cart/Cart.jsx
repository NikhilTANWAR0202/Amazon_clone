
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { formatCurrency } from '../../utils/currency'
import styles from './Cart.module.css'

export default function Cart(){
  const navigate = useNavigate()
  const { cart, removeFromCart, updateQty, clearCart } = useCart()
  const { add, isIn } = useWishlist()

  const subtotal = cart.items.reduce((s,i)=> s + i.price * i.qty, 0)
  const gst = +(subtotal * 0.18).toFixed(2)
  const shipping = subtotal > 500 ? 0 : 25
  const total = +(subtotal + gst + shipping).toFixed(2)

  const handleSaveForLater = (item) => {
    if (isIn(item.id)) {
      navigate('/wishlist')
      return
    }

    add(item)
    removeFromCart(item.id)
    navigate('/wishlist')
  }

  return (
    <div className={styles.cart}>
      {cart.items.length === 0 ? (
        <div className={styles.emptyCart}>
          <h2>Your Amazon Cart is empty</h2>
          <p>Browse today's Deals and discover new arrivals.</p>
          <a className={styles.continueShopping} href="/products">Continue shopping</a>
        </div>
      ) : (
        <>
          <section className={styles.cartContent}>
            <div className={styles.cartHeader}>
              <h1>Shopping Cart</h1>
              <div className={styles.cartSummaryText}>{cart.items.length} item{cart.items.length > 1 ? 's' : ''} in your cart</div>
            </div>

            <div className={styles.cartItemsList}>
              {cart.items.map((item) => (
                <article key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img src={item.images[0]} alt={item.title} />
                  </div>
                  <div className={styles.itemMain}>
                    <div className={styles.itemTitle}>{item.title}</div>
                    <div className={styles.itemMeta}>
                      <span className={styles.stockText}>{item.stock > 0 ? 'In Stock' : 'Currently unavailable'}</span>
                      <span className={styles.sellerText}>Sold by {item.brand || 'Amazon'}</span>
                    </div>
                    <div className={styles.itemMessage}>Eligible for FREE delivery. Order within 10 hrs 32 mins.</div>
                    <div className={styles.itemActions}>
                      <div className={styles.qtyLabel}>Qty:</div>
                      <div className={styles.qtyControls}>
                        <button className={styles.qtyButton} onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}>-</button>
                        <span className={styles.qtyValue}>{item.qty}</span>
                        <button className={styles.qtyButton} onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                      </div>
                      <button className={styles.actionButton} onClick={() => removeFromCart(item.id)}>Delete</button>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleSaveForLater(item)}
                      >
                        {isIn(item.id) ? 'Saved for later' : 'Save for later'}
                      </button>
                    </div>
                  </div>
                  <div className={styles.itemPriceBlock}>
                    <div className={styles.itemPrice}>{formatCurrency(item.price * item.qty)}</div>
                    <div className={styles.itemUnitPrice}>{formatCurrency(item.price)} each</div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className={styles.orderSummary}>
            <div className={styles.summaryBox}>
              <div className={styles.summaryRow}>
                <span>Subtotal ({cart.items.length} items):</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>
              <div className={styles.summaryDetail}>Shipping, taxes, and discounts calculated at checkout.</div>
              <button className={styles.checkoutButton} onClick={() => navigate('/checkout')}>
                Proceed to Buy
              </button>
              <div className={styles.giftOption}>
                <input type="checkbox" id="gift" />
                <label htmlFor="gift">This order contains a gift</label>
              </div>
            </div>
            <div className={styles.summaryNote}>
              <p>Secure transaction. You are saving with Checkout.</p>
            </div>
          </aside>
        </>
      )}
    </div>
  )
}
