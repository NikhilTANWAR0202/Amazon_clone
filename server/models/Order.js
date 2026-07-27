import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  productId: Number,
  title: String,
  price: Number,
  qty: Number,
  image: String
})

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  address: Object,
  payment: Object,
  shippingCost: Number,
  gst: Number,
  discount: Number,
  total: Number,
  status: { type: String, default: 'Placed' },
  paymentMethod: String,
  orderId: String,
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Order', orderSchema)
