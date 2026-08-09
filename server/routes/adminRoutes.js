import express from 'express'
import { deleteOrder, deleteUser, getAllOrders, getOrderById, getStats, getUsers, updateOrderStatus, updateUserRole } from '../controllers/adminController.js'
import { addProduct, deleteProduct, getProducts, updateProduct } from '../controllers/productController.js'
import { admin } from '../middleware/adminMiddleware.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect, admin)
router.get('/stats', getStats)
router.get('/users', getUsers)
router.put('/users/:id/role', updateUserRole)
router.delete('/users/:id', deleteUser)
router.get('/orders', getAllOrders)
router.get('/orders/:id', getOrderById)
router.put('/orders/:id', updateOrderStatus)
router.put('/orders/:id/status', updateOrderStatus)
router.delete('/orders/:id', deleteOrder)
router.get('/products', getProducts)
router.post('/products', addProduct)
router.put('/products/:id', updateProduct)
router.delete('/products/:id', deleteProduct)

export default router
