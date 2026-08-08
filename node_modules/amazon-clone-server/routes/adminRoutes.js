import express from 'express'
import { deleteOrder, deleteUser, getAllOrders, getOrderById, getUsers, updateOrderStatus, updateUserRole } from '../controllers/adminController.js'
import { admin } from '../middleware/adminMiddleware.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect, admin)
router.get('/users', getUsers)
router.put('/users/:id/role', updateUserRole)
router.delete('/users/:id', deleteUser)
router.get('/orders', getAllOrders)
router.get('/orders/:id', getOrderById)
router.put('/orders/:id', updateOrderStatus)
router.delete('/orders/:id', deleteOrder)

export default router
