import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: String,
  price: Number,
  image: String,
  qty: { type: Number, default: 1, min: 1 },
  stock: { type: Number, default: 0 }
}, { _id: false })

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.model('Cart', cartSchema)
