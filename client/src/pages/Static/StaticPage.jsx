import { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import ProductGrid from '../../components/ProductGrid/ProductGrid'
import { ProductContext } from '../../context/ProductContext'

export default function StaticPage({ title, description, category }){
  const { products, loading, topRated } = useContext(ProductContext)

  const pageProducts = useMemo(() => {
    if (category) {
      return products.filter(
        (product) => String(product.category).toLowerCase() === String(category).toLowerCase()
      )
    }

    if (title === "Today's Deals") {
      return [...products]
        .sort((a, b) => (b.discount || 0) - (a.discount || 0))
        .slice(0, 18)
    }

    if (title === 'Best Sellers') {
      return topRated
    }

    if (title === 'Gift Cards') {
      return products
        .filter((product) =>
          ['accessories', 'home', 'fashion'].includes(String(product.category).toLowerCase())
        )
        .slice(0, 18)
    }

    return products.slice(0, 18)
  }, [category, products, title, topRated])

  const displayCount = pageProducts.length

  return (
    <div className="container" style={{maxWidth:900}}>
      <h2>{title}</h2>
      <p style={{color:'#6B7280'}}>{description || 'Explore this section for curated selections and deals.'}</p>
      <p style={{marginTop:8,color:'#4B5563'}}>{displayCount} product{displayCount === 1 ? '' : 's'} available</p>

      {loading ? (
        <p>Loading...</p>
      ) : pageProducts.length ? (
        <ProductGrid products={pageProducts} />
      ) : (
        <div style={{padding:24,background:'var(--cards)',borderRadius:12,marginTop:16}}>
          <p>No products are available for {title.toLowerCase()} yet.</p>
          <p style={{marginTop:16}}>
            <Link to="/products" className="btn">
              Browse all products
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
