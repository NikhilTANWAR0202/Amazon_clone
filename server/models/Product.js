import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    brand: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    oldPrice: { type: Number, min: 0 },
    category: { type: String, required: true, trim: true },
    image: { type: String, trim: true },
    images: [{ type: String, trim: true }],
    thumbnail: { type: String, trim: true },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    stock: { type: Number, default: 0, min: 0 },
    description: { type: String, required: true },
    featured: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

productSchema.pre('save', function (next) {
  if (this.name && !this.title) {
    this.title = this.name
  }
  if (this.title && !this.name) {
    this.name = this.title
  }
  if (this.originalPrice && !this.oldPrice) {
    this.oldPrice = this.originalPrice
  }
  if (this.oldPrice && !this.originalPrice) {
    this.originalPrice = this.oldPrice
  }
  if (this.image && !this.thumbnail) {
    this.thumbnail = this.image
  }
  if (this.thumbnail && !this.image) {
    this.image = this.thumbnail
  }
  if (typeof this.featured === 'undefined' && typeof this.isFeatured !== 'undefined') {
    this.featured = this.isFeatured
  }
  if (typeof this.isFeatured === 'undefined' && typeof this.featured !== 'undefined') {
    this.isFeatured = this.featured
  }
  next()
})

export default mongoose.model('Product', productSchema)
