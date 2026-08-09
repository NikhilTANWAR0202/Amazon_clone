import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaHeart, FaShareAlt, FaStar } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { formatCurrency } from '../../utils/currency'
import QuickView from '../QuickView/QuickView'
import styles from './ProductCard.module.css'

function ProductCard({ product }) {
  const [open, setOpen] = useState(false)
  const { addToCart } = useCart()
  const { toggle, isIn } = useWishlist()

  const productId = product.id || product._id

  return (
    <>
      <motion.div
        className={styles.card}
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <Link to={`/product/${productId}`} className={styles.imageWrap}>
          <img
            src={product.images?.[0] || product.image || product.thumbnail || '/images/placeholder.jpg'}
            alt={product.title || product.name}
            className={styles.image}
          />
        </Link>

        <div className={styles.body}>
          <h4 className={styles.title}>{product.title}</h4>

          <div className={styles.meta}>
            <span className={styles.brand}>{product.brand}</span>

            <div className={styles.rating}>
              <FaStar color="#FFB400" />
              <span>{product.rating}</span>
            </div>
          </div>

          <div className={styles.priceRow}>
            <span className={styles.price}>{formatCurrency(product.price)}</span>

            {product.oldPrice && (
              <span className={styles.old}>
                {formatCurrency(product.oldPrice)}
              </span>
            )}

            {(product.discountPercentage || product.discount) && (
              <span className={styles.discount}>
                {Math.round(product.discountPercentage ?? product.discount)}% OFF
              </span>
            )}
          </div>

          <div className={styles.actions}>
            <button
              className={styles.cartBtn}
              onClick={() => addToCart(product, 1)}
            >
              Add to Cart
            </button>

            <button
              className={styles.quick}
              onClick={() => setOpen(true)}
            >
              Quick View
            </button>
          </div>

          <div className={styles.cardFooter}>
              <button className={styles.iconBtn} onClick={()=>toggle(product)}>
                <FaHeart color={isIn(product.id)?'#EF4444':'#6B7280'} />
              </button>

            <button className={styles.iconBtn}>
              <FaShareAlt />
            </button>

            <div className={styles.badges}>
              {product.prime && (
                <span className={styles.prime}>Prime</span>
              )}

              {product.stock > 0 ? (
                <span className={styles.stock}>In Stock</span>
              ) : (
                <span className={styles.out}>Out of Stock</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {open && (
        <QuickView
          product={product}
          onClose={() => setOpen(false)}
          onAdd={(p, q) => {
            addToCart(p, q);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}
export default ProductCard;