import mongoose from 'mongoose'
import productsData from './data/products.js'
import Product from './models/Product.js'
import { inferCategoryFromTitle } from './utils/categoryHelper.js'

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

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/amazon_clone', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    const normalizedProducts = productsData.map(normalizeProduct)
    const titles = normalizedProducts.map((product) => product.title)
    const existing = await Product.find({ title: { $in: titles } }).select('title').lean()
    const existingTitles = new Set(existing.map((product) => product.title))
    const missing = normalizedProducts.filter((product) => !existingTitles.has(product.title))

    console.log('existing:', existing.length, 'missing:', missing.length)
    if (missing.length > 0) {
      await Product.insertMany(missing)
      console.log('inserted', missing.length)
    } else {
      console.log('no missing products inserted')
    }

    await mongoose.disconnect()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

run()
