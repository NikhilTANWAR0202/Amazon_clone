import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema({
  url: String,
  alt: String
}, { _id: false })

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  oldPrice: { type: Number, min: 0 },
  discountPercentage: { type: Number, min: 0, max: 100, default: 0 },
  description: { type: String, required: true },
  images: [{ type: String }],
  thumbnail: { type: String },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviews: { type: Number, default: 0, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
  isFeatured: { type: Boolean, default: false },
  prime: { type: Boolean, default: false },
  deliveryDays: { type: Number, default: 2 },
  returnPolicy: { type: String, default: '30-day return policy' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.model('Product', productSchema)
