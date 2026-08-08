import { createContext, useEffect, useMemo, useState } from 'react'
import api from '../services/api'

export const ProductContext = createContext()

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    const loadProducts = async () => {
      try {
        const response = await api.get('/products', { signal: controller.signal })
        const items = (response.data.products || []).map((product) => ({
          ...product,
          id: product._id,
          oldPrice: product.oldPrice ?? Math.round(product.price / (1 - (product.discountPercentage || 0) / 100)),
          prime: product.stock > 40 || product.rating >= 4.4,
          deliveryDays: product.deliveryDays ?? Math.max(1, Math.min(5, Math.round(2 + (100 - (product.stock || 0)) / 30)))
        }))
        setProducts(items)
        setCategories(Array.from(new Set(items.map((product) => product.category))).sort())
        setBrands(Array.from(new Set(items.map((product) => product.brand))).sort())
      } catch (error) {
        console.error('Product load failed', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
    return () => controller.abort()
  }, [])

  const getProductById = (id) => products.find((product) => String(product.id) === String(id) || String(product._id) === String(id))

  const getProductsByCategory = (category) => products.filter((product) => product.category === category)

  const getProductsByBrand = (brand) => products.filter((product) => product.brand === brand)

  const topRated = useMemo(
    () => [...products].sort((a, b) => b.rating - a.rating).slice(0, 12),
    [products]
  )

  return (
    <ProductContext.Provider
      value={{ products, categories, brands, loading, getProductById, getProductsByCategory, getProductsByBrand, topRated }}
    >
      {children}
    </ProductContext.Provider>
  )
}
