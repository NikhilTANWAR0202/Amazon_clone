import crypto from 'crypto'
import Order from '../models/Order.js'

export const createOrder = async (req,res)=>{
  const { items, address, payment, shippingCost, gst, discount, total, paymentMethod } = req.body
  const orderId = `ORD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`
  const order = await Order.create({ user:req.user._id, items, address, payment, shippingCost, gst, discount, total, paymentMethod, orderId })
  res.status(201).json({ order })
}

export const getOrders = async (req,res)=>{
  const orders = await Order.find({ user:req.user._id }).sort('-createdAt')
  res.json({ orders })
}

export const getOrderById = async (req,res)=>{
  const order = await Order.findById(req.params.id)
  if(!order) return res.status(404).json({ message:'Order not found' })
  if(String(order.user)!==String(req.user._id)) return res.status(403).json({ message:'Not allowed' })
  res.json({ order })
}
