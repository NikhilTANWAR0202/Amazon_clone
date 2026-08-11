import express from 'express'
import { body, param, validationResult } from 'express-validator'
import { createReview, deleteReview, getReviewsForProduct, updateReview } from '../controllers/reviewController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg })
  }
  next()
}

router.get('/:productId', [param('productId').isMongoId().withMessage('Invalid product id')], validate, getReviewsForProduct)
router.post('/:productId', protect, [param('productId').isMongoId().withMessage('Invalid product id'), body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5')], validate, createReview)
router.put('/:id', protect, [param('id').isMongoId().withMessage('Invalid review id'), body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5')], validate, updateReview)
router.delete('/:id', protect, [param('id').isMongoId().withMessage('Invalid review id')], validate, deleteReview)

export default router
