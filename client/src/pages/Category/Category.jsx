import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import ProductGrid from '../../components/ProductGrid/ProductGrid'
import { ProductContext } from '../../context/ProductContext'

export default function Category(){
  const { name } = useParams()
  const { products } = useContext(ProductContext)
  const list = products.filter(p=> (p.category||'').toLowerCase() === (name||'').toLowerCase())
  return (
    <div className="container">
      <h2>Category: {name}</h2>
      {list.length ? <ProductGrid products={list} /> : <p>No products in this category</p>}
    </div>
  )
}
