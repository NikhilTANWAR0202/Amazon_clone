import Order from '../models/Order.js'
import Product from '../models/Product.js'
import User from '../models/User.js'

export const getStats = async (req, res) => {
  const [totalRevenueResult, totalUsers, totalProducts, outOfStockProducts, pendingOrders, deliveredOrders, totalOrders] = await Promise.all([
    Order.aggregate([{ $group: { _id: null, totalRevenue: { $sum: '$total' } } }]),
    User.countDocuments(),
    Product.countDocuments(),
    Product.countDocuments({ stock: 0 }),
    Order.countDocuments({ status: 'Pending' }),
    Order.countDocuments({ status: 'Delivered' }),
    Order.countDocuments()
  ])

  const totalRevenue = totalRevenueResult?.[0]?.totalRevenue || 0
  const recentOrders = await Order.find().sort('-createdAt').limit(10).populate('user', 'firstName lastName email')
  const lowStockProducts = await Product.find({ stock: { $lte: 5 } }).sort('stock').limit(10)

  res.json({
    stats: {
      totalRevenue,
      totalUsers,
      totalProducts,
      outOfStockProducts,
      pendingOrders,
      deliveredOrders,
      totalOrders,
      recentOrders,
      lowStockProducts
    }
  })
}

export const getUsers = async (req,res)=>{
  const users = await User.find().select('-password -verificationToken -resetToken -resetTokenExpiry')
  res.json({ users })
}

export const updateUserRole = async (req,res)=>{
  const { id } = req.params
  const { role } = req.body
  if (!['user','admin'].includes(role)) {
    return res.status(400).json({ message:'Invalid role' })
  }
  const user = await User.findByIdAndUpdate(id, { role }, { new:true }).select('-password -verificationToken -resetToken -resetTokenExpiry')
  if(!user) return res.status(404).json({ message:'User not found' })
  res.json({ user })
}

export const updateUserBlock = async (req,res)=>{
  const { id } = req.params
  const { blocked } = req.body
  const user = await User.findByIdAndUpdate(id, { blocked: Boolean(blocked) }, { new:true }).select('-password -verificationToken -resetToken -resetTokenExpiry')
  if(!user) return res.status(404).json({ message:'User not found' })
  res.json({ user })
}

export const deleteUser = async (req,res)=>{
  const { id } = req.params
  const user = await User.findById(id)
  if(!user) return res.status(404).json({ message:'User not found' })
  await user.deleteOne()
  res.json({ message:'User deleted successfully' })
}

export const getAllOrders = async (req,res)=>{
  const orders = await Order.find().sort('-createdAt').populate('user', 'firstName lastName email')
  res.json({ orders })
}

export const getOrderById = async (req,res)=>{
  const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email')
  if(!order) return res.status(404).json({ message:'Order not found' })
  res.json({ order })
}

export const updateOrderStatus = async (req,res)=>{
  const { id } = req.params
  const { status } = req.body
  const allowedStatuses = ['Pending', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid order status' })
  }
  const order = await Order.findById(id)
  if(!order) return res.status(404).json({ message:'Order not found' })
  order.status = status
  order.statusTimeline = order.statusTimeline || []
  order.statusTimeline.push({ status, updatedAt: new Date() })
  await order.save()
  await order.populate('user', 'firstName lastName email')
  res.json({ order })
}

export const updateOrderReturnStatus = async (req,res)=>{
  const { id } = req.params
  const { returnStatus } = req.body
  const allowedReturnStatuses = ['NotRequested', 'Requested', 'Approved', 'Rejected', 'Refunded']
  if (!allowedReturnStatuses.includes(returnStatus)) {
    return res.status(400).json({ message: 'Invalid return status' })
  }
  const order = await Order.findById(id)
  if(!order) return res.status(404).json({ message:'Order not found' })
  order.returnStatus = returnStatus
  order.returnUpdatedAt = new Date()
  await order.save()
  await order.populate('user', 'firstName lastName email')
  res.json({ order })
}

export const confirmPayment = async (req, res) => {
  try {
    const { id } = req.params
    const { paymentInfo } = req.body
    const order = await Order.findById(id)
    if (!order) return res.status(404).json({ message: 'Order not found' })
    order.paymentStatus = 'Paid'
    order.paymentInfo = paymentInfo || order.paymentInfo || {}
    order.paymentConfirmedAt = new Date()
    await order.save()
    await order.populate('user', 'firstName lastName email')
    res.json({ order })
  } catch (err) {
    console.error('Confirm payment error', err)
    res.status(500).json({ message: 'Unable to confirm payment' })
  }
}

export const deleteOrder = async (req,res)=>{
  const { id } = req.params
  const order = await Order.findById(id)
  if(!order) return res.status(404).json({ message:'Order not found' })
  await order.deleteOne()
  res.json({ message:'Order deleted successfully' })
}
