import { useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductGrid from '../../components/ProductGrid/ProductGrid'
import { useCart } from '../../context/CartContext'
import { ProductContext } from '../../context/ProductContext'
import { useWishlist } from '../../context/WishlistContext'
import { formatCurrency } from '../../utils/currency'
import styles from './ProductDetails.module.css'

export default function ProductDetails(){
  const { id } = useParams()
  const { getProductById } = useContext(ProductContext)
  const product = getProductById(id)
  const { addToCart } = useCart()
  const { toggle, isIn } = useWishlist()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)

  if(!product) return <div className="container"><p>Product not found</p></div>

  return (
    <div className="container">
      <div className={styles.grid}>
        <div className={styles.images}>
          <img src={product.images[0]} alt={product.title} />
        </div>
        <div className={styles.info}>
          <h1>{product.title}</h1>
          <p className={styles.brand}>by {product.brand}</p>
          <div className={styles.price}>{formatCurrency(product.price)} <span className={styles.old}>{formatCurrency(product.oldPrice)}</span></div>
          <div style={{display:'flex',gap:8,alignItems:'center',marginTop:8}}>
            <label>Qty</label>
            <div style={{display:'flex',gap:6,alignItems:'center'}}>
              <button className="btn" onClick={()=>setQty(q=>Math.max(1,q-1))}>-</button>
              <div style={{padding:'0.4rem 0.8rem',background:'#F3F4F6',borderRadius:6}}>{qty}</div>
              <button className="btn" onClick={()=>setQty(q=>q+1)}>+</button>
            </div>
          </div>
          <p className={styles.desc}>{product.description}</p>
          <div style={{marginTop:12,display:'flex',gap:8}}>
            <button className={styles.buy} onClick={()=>{addToCart(product, qty); navigate('/cart')}}>Buy Now</button>
            <button className={styles.cart} onClick={()=>addToCart(product, qty)}>Add to Cart</button>
            <button className="btn" onClick={()=>toggle(product)}>{isIn(product.id)?'Remove Wishlist':'Add to Wishlist'}</button>
          </div>
          <div style={{marginTop:16}}>
            <div><strong>Delivery:</strong> {product.deliveryDays} days</div>
            <div><strong>Stock:</strong> {product.stock>0?`${product.stock} available`:'Out of stock'}</div>
            <div><strong>Rating:</strong> {product.rating} ({product.reviews} reviews)</div>
            <div style={{marginTop:8}}><strong>Seller:</strong> {product.seller || 'Default Seller'}</div>
          </div>
        </div>
      </div>

      <section style={{marginTop:24}}>
        <h3>Related Products</h3>
        <ProductGrid products={useContext(ProductContext).products.filter(p=>p.category===product.category && p.id!==product.id).slice(0,8)} />
      </section>
    </div>
  )
}
