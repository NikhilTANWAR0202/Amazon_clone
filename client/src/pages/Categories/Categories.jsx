import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ProductContext } from '../../context/ProductContext'

export default function Categories(){
  const { categories } = useContext(ProductContext)

  return (
    <div className="container">
      <h2>Categories</h2>
      <div style={{display:'grid',gap:12,gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))'}}>
        {categories.map((category) => (
          <Link
            key={category}
            to={`/category/${encodeURIComponent(category)}`}
            style={{padding:12,background:'var(--cards)',borderRadius:8,textDecoration:'none',color:'var(--text)'}}
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  )
}
