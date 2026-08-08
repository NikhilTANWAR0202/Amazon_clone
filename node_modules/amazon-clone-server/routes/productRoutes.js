import express from 'express'
import { body, param, validationResult } from 'express-validator'
import {
    addProduct,
    deleteProduct,
    getProductById,
    getProducts,
    getProductsByCategory,
    searchProducts,
    seedProducts,
    updateProduct
} from '../controllers/productController.js'
import { admin } from '../middleware/adminMiddleware.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg })
  }
  next()
}

router.get('/', getProducts)
router.get('/search', searchProducts)
router.get('/category/:category', getProductsByCategory)
router.get('/:id', [param('id').isMongoId().withMessage('Invalid product id')], validate, getProductById)
router.post('/seed', protect, admin, seedProducts)
router.post(
  '/',
  protect,
  admin,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('brand').notEmpty().withMessage('Brand is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('description').notEmpty().withMessage('Description is required')
  ],
  validate,
  addProduct
)
router.put(
  '/:id',
  protect,
  admin,
  [
    param('id').isMongoId().withMessage('Invalid product id'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('brand').optional().notEmpty().withMessage('Brand cannot be empty'),
    body('category').optional().notEmpty().withMessage('Category cannot be empty'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
  ],
  validate,
  updateProduct
)
router.delete('/:id', protect, admin, [param('id').isMongoId().withMessage('Invalid product id')], validate, deleteProduct)

export default router
