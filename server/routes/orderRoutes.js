import express from 'express'
import { createOrder, getOrderById, getOrders, requestOrderReturn, updateOrderStatus } from '../controllers/orderController.js'
import { admin } from '../middleware/adminMiddleware.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', protect, createOrder)
router.get('/', protect, getOrders)
router.get('/:id', protect, getOrderById)
router.patch('/:id/status', protect, admin, updateOrderStatus)
router.patch('/:id/return', protect, requestOrderReturn)

export default router
