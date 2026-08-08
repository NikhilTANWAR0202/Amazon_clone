import { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ProductContext } from '../../context/ProductContext'
import styles from './CategoryGrid.module.css'

const CATEGORY_LABELS = {
  "smartphones": 'Smartphones',
  "laptops": 'Laptops',
  "home-decoration": 'Home Decoration',
  "kitchen-accessories": 'Kitchen Accessories',
  "mens-shirts": "Men's Shirts",
  "womens-dresses": "Women's Dresses",
  "mens-shoes": "Men's Shoes",
  "womens-shoes": "Women's Shoes",
  "womens-watches": "Women's Watches",
  "mens-watches": "Men's Watches",
  "fragrances": 'Fragrances',
  "beauty": 'Beauty',
  "groceries": 'Groceries',
  "motorcycle": 'Motorcycle',
  "vehicle": 'Vehicle',
  "sports-accessories": 'Sports Accessories',
  "mobile-accessories": 'Mobile Accessories',
  "tablets": 'Tablets',
  "sunglasses": 'Sunglasses',
  "tops": 'Fashion' 
}

export default function CategoryGrid(){
  const { products, categories, loading } = useContext(ProductContext)

  const cards = useMemo(() => {
    return categories.map((category) => {
      const bucket = products.filter((product) => product.category === category)
      const sample = bucket[0]
      return {
        key: category,
        title: CATEGORY_LABELS[category] || category.replace(/-/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase()),
        count: bucket.length,
        image: sample?.thumbnail || sample?.images?.[0] || '',
        desc: `${bucket.length} products`
      }
    })
  }, [categories, products])

  if (loading) {
    return <div className={styles.grid}>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className={styles.skeleton}></div>
      ))}
    </div>
  }

  return (
    <div className={styles.grid}>
      {cards.map((card) => (
        <Link key={card.key} to={`/category/${encodeURIComponent(card.key)}`} className={styles.card}>
          <div className={styles.media}>
            {card.image && <img src={card.image} alt={card.title} loading="lazy" />}
          </div>
          <div className={styles.content}>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
            <span>{card.count} items</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
