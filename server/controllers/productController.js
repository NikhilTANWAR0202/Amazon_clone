import productsData from '../data/products.js'
import Product from '../models/Product.js'
import { inferCategoryFromTitle } from '../utils/categoryHelper.js'

const getImageUrl = (value, title) => {
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value
  const seed = encodeURIComponent((title || 'product').replace(/\s+/g, '-').toLowerCase())
  return `https://picsum.photos/seed/${seed}/600/600`
}

const normalizeProduct = (payload) => {
  const name = payload.name || payload.title
  const title = payload.title || payload.name
  const rawImage = payload.image || payload.thumbnail || (Array.isArray(payload.images) ? payload.images[0] : '')
  const image = getImageUrl(rawImage, title)
  const images = payload.images?.length ? payload.images.map((img) => getImageUrl(img, title)) : image ? [image] : []
  const oldPrice = payload.oldPrice ?? payload.originalPrice
  const originalPrice = payload.originalPrice ?? payload.oldPrice
  const featured = payload.featured ?? payload.isFeatured ?? false

  return {
    ...payload,
    name,
    title,
    image,
    images,
    thumbnail: payload.thumbnail ? getImageUrl(payload.thumbnail, title) : image,
    oldPrice,
    originalPrice,
    featured,
    isFeatured: featured,
    category: payload.category?.trim() || inferCategoryFromTitle(title)
  }
}

export const seedProducts = async (req, res) => {
  try {
    await Product.deleteMany({})
    const normalizedProducts = productsData.map(normalizeProduct)
    await Product.insertMany(normalizedProducts)
    res.json({ message: 'Seeded products successfully', count: normalizedProducts.length })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getProducts = async (req, res) => {
  try {
    const {
      q,
      category,
      featured,
      minPrice,
      maxPrice,
      rating,
      inStock,
      sort,
      page = 1,
      limit = 20
    } = req.query

    const filter = {}

    if (category) filter.category = new RegExp(`^${category}$`, 'i')
    if (featured === 'true') filter.isFeatured = true
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) }
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) }
    if (rating) filter.averageRating = { $gte: Number(rating) }
    if (inStock === 'true') filter.stock = { $gt: 0 }
    if (q) {
      const queryRegex = new RegExp(q, 'i')
      filter.$or = [
        { title: queryRegex },
        { name: queryRegex },
        { brand: queryRegex },
        { category: queryRegex },
        { description: queryRegex }
      ]
    }

    const pageNumber = Math.max(1, Number(page))
    const pageSize = Math.max(1, Number(limit))
    const skip = (pageNumber - 1) * pageSize

    const sortValue =
      sort === 'priceAsc'
        ? { price: 1 }
        : sort === 'priceDesc'
        ? { price: -1 }
        : sort === 'ratingDesc'
        ? { averageRating: -1 }
        : sort === 'newest'
        ? { createdAt: -1 }
        : { createdAt: -1 }

    const [products, count, categories] = await Promise.all([
      Product.find(filter).sort(sortValue).skip(skip).limit(pageSize),
      Product.countDocuments(filter),
      Product.distinct('category')
    ])

    const totalPages = Math.ceil(count / pageSize)

    res.json({ products, totalProducts: count, page: pageNumber, limit: pageSize, totalPages, categories })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json({ product })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category
    const products = await Product.find({ category: new RegExp(`^${category}$`, 'i') })
    res.json({ products })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const searchProducts = async (req, res) => {
  try {
    const q = req.query.q || ''
    const filter = q
      ? {
          $or: [
            { title: new RegExp(q, 'i') },
            { name: new RegExp(q, 'i') },
            { brand: new RegExp(q, 'i') },
            { category: new RegExp(q, 'i') },
            { description: new RegExp(q, 'i') }
          ]
        }
      : {}
    const products = await Product.find(filter).sort({ createdAt: -1 })
    res.json({ products })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

import { uploadToCloudinary } from '../utils/cloudinary.js'

export const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image file provided' })
    const result = await uploadToCloudinary(req.file.buffer, { folder: 'amazon-clone/products' })
    res.json({ url: result.secure_url })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const addProduct = async (req, res) => {
  try {
    const payload = normalizeProduct(req.body)
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, { folder: 'amazon-clone/products' })
      payload.images = [uploadResult.secure_url]
      payload.thumbnail = uploadResult.secure_url
      payload.image = uploadResult.secure_url
    }
    const product = await Product.create(payload)
    res.status(201).json({ product })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const payload = normalizeProduct(req.body)
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, { folder: 'amazon-clone/products' })
      payload.images = [uploadResult.secure_url]
      payload.thumbnail = uploadResult.secure_url
      payload.image = uploadResult.secure_url
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...payload, updatedAt: Date.now() },
      { new: true, runValidators: true }
    )
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json({ product })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    await product.deleteOne()
    res.json({ message: 'Product deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
