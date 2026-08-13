import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, default: '' }
})

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [orderItemSchema], required: true },
  address: { type: Object, required: true },
  payment: { type: Object, default: {} },
  shippingCost: { type: Number, required: true },
  gst: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  statusTimeline: [
    {
      status: {
        type: String,
        enum: ['Pending', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']
      },
      updatedAt: { type: Date, default: Date.now }
    }
  ],
  returnStatus: {
    type: String,
    enum: ['NotRequested', 'Requested', 'Approved', 'Rejected', 'Refunded'],
    default: 'NotRequested'
  },
  returnReason: { type: String, default: '' },
  returnRequestedAt: { type: Date },
  returnUpdatedAt: { type: Date },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  paymentInfo: {
    paymentId: { type: String },
    orderId: { type: String },
    signature: { type: String },
    method: { type: String },
    status: { type: String }
  },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  paymentMethod: { type: String, required: true },
  orderId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Order', orderSchema)
