import { createContext, useEffect, useMemo, useState } from 'react'
import api from '../services/api'

export const ProductContext = createContext()

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [filters, setFilters] = useState({})

  const loadProducts = async ({ signal, page: p = page, limit: l = limit, filters: f = filters } = {}) => {
    try {
      setLoading(true)
      const params = { page: p, limit: l, ...f }
      const response = await api.get('/products', { params, signal })
      const items = (response.data.products || []).map((product) => ({
        ...product,
        id: product._id,
        oldPrice:
          product.oldPrice ?? Math.round(product.price / (1 - (product.discountPercentage || product.discount || 0) / 100)),
        discountPercentage: product.discountPercentage ?? product.discount ?? 0,
        prime: product.prime ?? (product.stock > 40 || product.rating >= 4.4),
        deliveryDays:
          product.deliveryDays ?? Math.max(1, Math.min(5, Math.round(2 + (100 - (product.stock || 0)) / 30)))
      }))

      setProducts(items)
      setCategories(Array.from(new Set(items.map((product) => product.category))).sort())
      setBrands(Array.from(new Set(items.map((product) => product.brand))).sort())
      setPage(response.data.page || p)
      setLimit(response.data.limit || l)
      setTotalPages(response.data.totalPages || 1)
      setTotalProducts(response.data.totalProducts || 0)
    } catch (error) {
      console.error('Product load failed', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    loadProducts({ signal: controller.signal })
    return () => controller.abort()
  }, [])

  const getProductById = (id) =>
    products.find(
      (product) => String(product.id) === String(id) || String(product._id) === String(id)
    )

  const getProductsByCategory = (category) =>
    products.filter((product) => product.category === category)

  const getProductsByBrand = (brand) => products.filter((product) => product.brand === brand)

  const topRated = useMemo(
    () => [...products].sort((a, b) => b.rating - a.rating).slice(0, 12),
    [products]
  )
  const setFilterParams = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    loadProducts({ page: 1, filters: { ...filters, ...newFilters } })
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        brands,
        loading,
        getProductById,
        getProductsByCategory,
        getProductsByBrand,
        topRated,
        reloadProducts: () => loadProducts(),
        page,
        limit,
        totalPages,
        totalProducts,
        setPage: (p) => { setPage(p); loadProducts({ page: p }) },
        setLimit: (l) => { setLimit(l); loadProducts({ limit: l }) },
        setFilterParams
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}
