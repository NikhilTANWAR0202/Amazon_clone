import express from 'express'
import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from '../controllers/cartController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, getCart)
router.post('/add', protect, addToCart)
router.put('/:productId', protect, updateCartItem)
router.delete('/:productId', protect, removeCartItem)
router.delete('/', protect, clearCart)

export default router
