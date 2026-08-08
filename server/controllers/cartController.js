import Cart from '../models/Cart.js'
import Product from '../models/Product.js'

export const getCart = async (req,res)=>{
  const cart = await Cart.findOne({ user: req.user._id })
  res.json({ cart: cart || { items: [] } })
}

export const addToCart = async (req,res)=>{
  const { productId, qty = 1 } = req.body
  if(!productId) return res.status(400).json({ message:'Product ID is required' })

  const product = await Product.findById(productId)
  if(!product) return res.status(404).json({ message:'Product not found' })

  let cart = await Cart.findOne({ user: req.user._id })
  if(!cart) {
    cart = new Cart({ user: req.user._id, items: [] })
  }

  const existing = cart.items.find(item => item.productId.toString() === productId)
  if(existing) {
    existing.qty = Math.min(existing.qty + qty, product.stock)
  } else {
    cart.items.push({
      productId,
      title: product.title,
      price: product.price,
      image: product.thumbnail || product.images[0],
      qty: Math.min(qty, product.stock),
      stock: product.stock
    })
  }

  cart.updatedAt = Date.now()
  await cart.save()
  res.json({ cart })
}

export const updateCartItem = async (req,res)=>{
  const { productId } = req.params
  const { qty } = req.body
  if(qty == null) return res.status(400).json({ message:'Quantity is required' })

  const product = await Product.findById(productId)
  if(!product) return res.status(404).json({ message:'Product not found' })

  const cart = await Cart.findOne({ user: req.user._id })
  if(!cart) return res.status(404).json({ message:'Cart not found' })

  const item = cart.items.find(item => item.productId.toString() === productId)
  if(!item) return res.status(404).json({ message:'Cart item not found' })

  if(qty <= 0) {
    cart.items = cart.items.filter(item => item.productId.toString() !== productId)
  } else {
    item.qty = Math.min(qty, product.stock)
  }

  cart.updatedAt = Date.now()
  await cart.save()
  res.json({ cart })
}

export const removeCartItem = async (req,res)=>{
  const { productId } = req.params
  const cart = await Cart.findOne({ user: req.user._id })
  if(!cart) return res.status(404).json({ message:'Cart not found' })

  cart.items = cart.items.filter(item => item.productId.toString() !== productId)
  cart.updatedAt = Date.now()
  await cart.save()
  res.json({ cart })
}

export const clearCart = async (req,res)=>{
  const cart = await Cart.findOne({ user: req.user._id })
  if(cart) {
    cart.items = []
    cart.updatedAt = Date.now()
    await cart.save()
  }
  res.json({ cart: { items: [] } })
}
