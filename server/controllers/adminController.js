import Order from '../models/Order.js'
import User from '../models/User.js'

export const getUsers = async (req,res)=>{
  const users = await User.find().select('-password -verificationToken -resetToken -resetTokenExpiry')
  res.json({ users })
}

export const updateUserRole = async (req,res)=>{
  const { id } = req.params
  const { role } = req.body
  const user = await User.findByIdAndUpdate(id, { role }, { new:true }).select('-password -verificationToken -resetToken -resetTokenExpiry')
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
  const allowedStatuses = ['Placed', 'Confirmed', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid order status' })
  }
  const order = await Order.findByIdAndUpdate(id, { status }, { new:true }).populate('user', 'firstName lastName email')
  if(!order) return res.status(404).json({ message:'Order not found' })
  res.json({ order })
}

export const deleteOrder = async (req,res)=>{
  const { id } = req.params
  const order = await Order.findById(id)
  if(!order) return res.status(404).json({ message:'Order not found' })
  await order.deleteOne()
  res.json({ message:'Order deleted successfully' })
}
