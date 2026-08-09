import crypto from 'crypto'
import Cart from '../models/Cart.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'

const formatPaymentMethod = (paymentMethod) => {
  if (!paymentMethod) return 'Unknown'
  if (typeof paymentMethod === 'string') return paymentMethod
  if (typeof paymentMethod === 'object') {
    return paymentMethod.label || paymentMethod.type || 'Unknown'
  }
  return String(paymentMethod)
}

const normalizeItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return null
  }

  const normalized = items.map((item) => {
    if (!item || typeof item !== 'object') return null

    const rawId = item.productId ?? item.id ?? item._id
    const productId = String(rawId || '')
    const title = item.title || item.name || ''
    const price = Number(item.price)
    const quantity = Number(item.quantity ?? item.qty ?? item.qtyOrdered ?? 1)
    const image = item.image || item.images?.[0] || item.thumbnail || ''

    if (!productId) return null
    if (!title || typeof title !== 'string') return null
    if (!Number.isFinite(price) || price < 0) return null
    if (!Number.isFinite(quantity) || quantity <= 0) return null

    return { productId, title, price, quantity, image }
  })

  if (normalized.some((item) => item === null)) return null
  return normalized
}

const validateAddress = (address) => {
  if (!address || typeof address !== 'object') return false
  const requiredFields = ['fullName', 'addressLine1', 'city', 'state', 'zip', 'phone']
  return requiredFields.every((field) => typeof address[field] === 'string' && address[field].trim().length > 0)
}

export const createOrder = async (req,res)=>{
  try {
    const { items, address, payment, paymentInfo, shippingCost, gst, discount = 0, total, paymentMethod, paymentStatus, razorpayOrderId, razorpayPaymentId } = req.body

    const normalizedItems = normalizeItems(items)
    if (!normalizedItems) {
      return res.status(400).json({ success: false, message: 'Invalid order items' })
    }

    if (!validateAddress(address)) {
      return res.status(400).json({ success: false, message: 'Invalid shipping address' })
    }

    if (!Number.isFinite(shippingCost) || shippingCost < 0) {
      return res.status(400).json({ success: false, message: 'Invalid shipping cost' })
    }

    if (!Number.isFinite(gst) || gst < 0) {
      return res.status(400).json({ success: false, message: 'Invalid GST amount' })
    }

    if (!Number.isFinite(total) || total < 0) {
      return res.status(400).json({ success: false, message: 'Invalid order total' })
    }

    const paymentMethodString = formatPaymentMethod(paymentMethod)
    const orderId = `ORD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`

    const productIds = normalizedItems.map((item) => item.productId)
    const products = await Product.find({ _id: { $in: productIds } })
    if (products.length !== normalizedItems.length) {
      return res.status(400).json({ success: false, message: 'One or more products in the order are not available' })
    }

    const productMap = new Map(products.map((product) => [String(product._id), product]))
    for (const item of normalizedItems) {
      const product = productMap.get(item.productId)
      if (!product) {
        return res.status(400).json({ success: false, message: `Product ${item.title} not found` })
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Not enough stock for ${product.title}` })
      }
    }

    for (const item of normalizedItems) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } }, { new: true })
    }

    const computedPaymentInfo = paymentInfo || (payment?.razorpayPaymentId ? {
      paymentId: payment.razorpayPaymentId,
      orderId: payment.razorpayOrderId,
      signature: payment.razorpaySignature,
      method: 'Razorpay',
      status: paymentStatus || 'Paid'
    } : undefined)

    const order = await Order.create({
      user: req.user._id,
      items: normalizedItems,
      address,
      payment: payment || {},
      paymentInfo: computedPaymentInfo,
      shippingCost,
      gst,
      discount,
      total,
      paymentMethod: paymentMethodString,
      paymentStatus: paymentStatus || 'Pending',
      razorpayOrderId: razorpayOrderId || undefined,
      razorpayPaymentId: razorpayPaymentId || undefined,
      orderId
    })

    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] }, { new: true })

    res.status(201).json({ success: true, message: 'Order placed successfully', order })
  } catch (error) {
    console.error('Order creation error:', error)
    res.status(500).json({ success: false, message: 'Unable to place order' })
  }
}

export const getOrders = async (req,res)=>{
  try {
    const orders = await Order.find({ user:req.user._id }).sort('-createdAt')
    res.json({ success: true, orders })
  } catch (error) {
    console.error('Get orders error:', error)
    res.status(500).json({ success: false, message: 'Unable to fetch orders' })
  }
}

export const getOrderById = async (req,res)=>{
  try {
    const order = await Order.findById(req.params.id)
    if(!order) return res.status(404).json({ success: false, message:'Order not found' })
    if(String(order.user)!==String(req.user._id)) return res.status(403).json({ success: false, message:'Not allowed' })
    res.json({ success: true, order })
  } catch (error) {
    console.error('Get order by id error:', error)
    res.status(500).json({ success: false, message: 'Unable to fetch order' })
  }
}
