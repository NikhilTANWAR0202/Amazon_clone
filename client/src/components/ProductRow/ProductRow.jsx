import ProductCard from '../ProductCard/ProductCard'
import styles from './ProductRow.module.css'

export default function ProductRow({ title, products = [] }) {
  return (
    <section className={styles.row} aria-labelledby={title.replace(/\s+/g, '-').toLowerCase()}>
      <div className={styles.heading}>
        <h2 id={title.replace(/\s+/g, '-').toLowerCase()}>{title}</h2>
      </div>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
