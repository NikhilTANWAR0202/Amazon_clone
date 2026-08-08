import { useContext } from 'react'
import CategoryGrid from '../../components/CategoryGrid/CategoryGrid'
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel'
import HomeBanner from '../../components/HomeBanner/HomeBanner'
import ProductGrid from '../../components/ProductGrid/ProductGrid'
import { ProductContext } from '../../context/ProductContext'
import styles from './Home.module.css'

export default function Home(){
  const {products, loading} = useContext(ProductContext)
  const topProducts = products.slice(0,12)

  return (
    <div className={styles.home}>
      <HeroCarousel />
      <HomeBanner />

      <div className="container">
        <section style={{marginTop:18}}>
          <CategoryGrid />
        </section>

        <section style={{marginTop:28}}>
          <h2>Trending Products</h2>
          {loading ? <p>Loading...</p> : <ProductGrid products={topProducts} />}
        </section>

        <section style={{marginTop:28}}>
          <h2>Featured</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
            <div style={{padding:20,background:'var(--cards)',borderRadius:12}}>Today's Deals content</div>
            <div style={{padding:20,background:'var(--cards)',borderRadius:12}}>Best Sellers content</div>
            <div style={{padding:20,background:'var(--cards)',borderRadius:12}}>Recommended for you</div>
          </div>
        </section>
      </div>
    </div>
  )
}
