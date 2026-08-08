import { useContext, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import ProductGrid from '../../components/ProductGrid/ProductGrid'
import { ProductContext } from '../../context/ProductContext'

function useQuery(){
  return new URLSearchParams(useLocation().search)
}

export default function SearchResults(){
  const q = useQuery().get('q') || ''
  const { products, loading } = useContext(ProductContext)

  const results = useMemo(()=>{
    if(!q) return []
    const term = q.toLowerCase()
    return products.filter(p => p.title.toLowerCase().includes(term) || p.brand.toLowerCase().includes(term) || (p.category||'').toLowerCase().includes(term))
  },[q, products])

  return (
    <div className="container">
      <h2>Search results for "{q}"</h2>
      {loading ? <p>Loading...</p> : (
        results.length ? <ProductGrid products={results} /> : <p>No products found</p>
      )}
    </div>
  )
}
