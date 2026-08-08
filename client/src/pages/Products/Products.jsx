import { useContext } from 'react'
import ProductGrid from '../../components/ProductGrid/ProductGrid'
import { ProductContext } from '../../context/ProductContext'

export default function Products(){
  const { products, loading } = useContext(ProductContext)

  return (
    <div className="container">
      <h2>All Products</h2>
      {loading ? <p>Loading...</p> : <ProductGrid products={products} />}
    </div>
  )
}
