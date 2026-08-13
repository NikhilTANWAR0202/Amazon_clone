import express from 'express'
import { confirmPayment, deleteOrder, deleteUser, getAllOrders, getOrderById, getStats, getUsers, updateOrderReturnStatus, updateOrderStatus, updateUserBlock, updateUserRole } from '../controllers/adminController.js'
import { addProduct, deleteProduct, getProducts, updateProduct, uploadProductImage } from '../controllers/productController.js'
import { admin } from '../middleware/adminMiddleware.js'
import { protect } from '../middleware/authMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.use(protect, admin)
router.get('/stats', getStats)
router.get('/users', getUsers)
router.put('/users/:id/role', updateUserRole)
router.patch('/users/:id/block', updateUserBlock)
router.delete('/users/:id', deleteUser)
router.get('/orders', getAllOrders)
router.get('/orders/:id', getOrderById)
router.put('/orders/:id', updateOrderStatus)
router.put('/orders/:id/status', updateOrderStatus)
router.put('/orders/:id/confirm-payment', confirmPayment)
router.put('/orders/:id/return', updateOrderReturnStatus)
router.delete('/orders/:id', deleteOrder)
router.get('/products', getProducts)
// allow multiple images (up to 6) when creating/updating products
router.post('/products', upload.array('images', 6), addProduct)
router.put('/products/:id', upload.array('images', 6), updateProduct)
router.delete('/products/:id', deleteProduct)
router.post('/products/:id/image', upload.single('image'), uploadProductImage)

export default router
