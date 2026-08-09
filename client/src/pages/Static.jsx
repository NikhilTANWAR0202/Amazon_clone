import { useContext, useMemo } from 'react'
import ProductCard from '../components/ProductCard/ProductCard'
import { ProductContext } from '../context/ProductContext'
import styles from './CategoryPage.module.css'

function CategoryPage({ title, category, subtitle }) {
  const { products, loading, topRated } = useContext(ProductContext)

  const filteredProducts = useMemo(() => {
    let list = products

    if (category) {
      list = products.filter(
        (product) =>
          String(product.category).toLowerCase() === String(category).toLowerCase()
      )
    }

    if (title === "Today's Deals") {
      return [...list]
        .sort((a, b) => (b.discountPercentage ?? b.discount ?? 0) - (a.discountPercentage ?? a.discount ?? 0))
        .slice(0, 20)
    }

    if (title === 'Best Sellers') {
      return topRated
    }

    return list
  }, [category, products, title, topRated])

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          <p className={styles.stats}>
            {filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'} available
          </p>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading products...</div>
      ) : (
        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export const BestSellers = () => (
  <CategoryPage
    title="Best Sellers"
    subtitle="Shop the most popular items trending across the store."
  />
)

export const Mobiles = () => (
  <CategoryPage
    title="Mobiles"
    category="Mobiles"
    subtitle="Compare top smartphones, earbuds, and mobile accessories."
  />
)

export const Electronics = () => (
  <CategoryPage
    title="Electronics"
    category="Electronics"
    subtitle="Browse the latest gadgets, smart home devices, and entertainment tech."
  />
)

export const Fashion = () => (
  <CategoryPage
    title="Fashion"
    category="Fashion"
    subtitle="Discover clothing, accessories, and seasonal fashion picks."
  />
)

export const Laptops = () => (
  <CategoryPage
    title="Laptops"
    category="Laptops"
    subtitle="Find laptops for gaming, work, and creative projects."
  />
)

export const Books = () => (
  <CategoryPage
    title="Books"
    category="Books"
    subtitle="Browse best sellers, new releases, and curated reads."
  />
)

export const Gaming = () => (
  <CategoryPage
    title="Gaming"
    category="Gaming"
    subtitle="Shop consoles, games, and peripherals for every gamer."
  />
)

export const Kitchen = () => (
  <CategoryPage
    title="Kitchen"
    category="Kitchen"
    subtitle="Upgrade your kitchen with appliances, cookware, and tools."
  />
)

export const Sports = () => (
  <CategoryPage
    title="Sports"
    category="Sports"
    subtitle="Gear up for fitness, outdoor activities, and sports training."
  />
)

export const GiftCards = () => (
  <CategoryPage
    title="Gift Cards"
    subtitle="Give gift-ready options across categories and price ranges."
  />
)

export const TodayDeals = () => (
  <CategoryPage
    title="Today's Deals"
    subtitle="Grab limited-time offers and the best discounts available."
  />
)
