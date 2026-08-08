import { motion } from 'framer-motion'
import { FaStar } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '../../utils/currency'
import styles from './QuickView.module.css'

export default function QuickView({product, onClose, onAdd}){
  const navigate = useNavigate()
  if(!product) return null
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <motion.div className={styles.modal} onClick={e=>e.stopPropagation()} initial={{opacity:0, y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}}>
        <div className={styles.left}>
          <img src={product.images[0]} alt={product.title} />
        </div>
        <div className={styles.right}>
          <h2>{product.title}</h2>
          <div className={styles.meta}><span className={styles.brand}>{product.brand}</span><span className={styles.rating}><FaStar color="#FFB400"/> {product.rating}</span></div>
          <p className={styles.price}>{formatCurrency(product.price)} <span className={styles.old}>{formatCurrency(product.oldPrice)}</span></p>
          <p className={styles.desc}>{product.description}</p>
          <div className={styles.actions}>
            <button className="btn" onClick={()=>onAdd(product,1)}>Add to Cart</button>
            <button className="btn" onClick={onClose} style={{background:'#E5E7EB',color:'#111827'}}>Close</button>
            <button className="btn" style={{background:'#F3F4F6',color:'#111827'}} onClick={()=>{onClose(); navigate(`/product/${product.id}`)}}>View Details</button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
