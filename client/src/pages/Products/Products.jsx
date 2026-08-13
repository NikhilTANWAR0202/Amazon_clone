import { useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ProductGrid from '../../components/ProductGrid/ProductGrid'
import { ProductContext } from '../../context/ProductContext'

export default function Products(){
  const { products, loading, page, totalPages, setPage, setFilterParams } = useContext(ProductContext)
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const filters = {}
    for (const key of ['q', 'category', 'sort', 'minPrice', 'maxPrice', 'brand']) {
      const v = params.get(key)
      if (v) filters[key === 'q' ? 'q' : key] = v
    }
    setFilterParams(filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])

  return (
    <div className="container">
      <h2>All Products</h2>
      {loading ? <p>Loading...</p> : <ProductGrid products={products} />}
    </div>
  )
}
