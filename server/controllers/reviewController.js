import Product from '../models/Product.js'
import Review from '../models/Review.js'

const recalculateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId })
  const numReviews = reviews.length
  const averageRating = numReviews > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / numReviews : 0
  await Product.findByIdAndUpdate(productId, { averageRating, numReviews }, { new: true })
}

export const createReview = async (req, res) => {
  try {
    const { productId } = req.params
    const { rating, comment } = req.body
    const userId = req.user._id

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' })
    }

    const existing = await Review.findOne({ user: userId, product: productId })
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this product' })
    }

    const review = await Review.create({ user: userId, product: productId, rating, comment })
    await recalculateProductRating(productId)

    res.status(201).json({ review })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getReviewsForProduct = async (req, res) => {
  try {
    const { productId } = req.params
    const reviews = await Review.find({ product: productId }).populate('user', 'firstName lastName')
    res.json({ reviews })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params
    const { rating, comment } = req.body
    const review = await Review.findById(id)
    if (!review) return res.status(404).json({ message: 'Review not found' })
    if (String(review.user) !== String(req.user._id)) return res.status(403).json({ message: 'Not allowed' })
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' })
    }
    review.rating = rating ?? review.rating
    review.comment = typeof comment === 'string' ? comment : review.comment
    await review.save()
    await recalculateProductRating(review.product)
    res.json({ review })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params
    const review = await Review.findById(id)
    if (!review) return res.status(404).json({ message: 'Review not found' })
    if (String(review.user) !== String(req.user._id)) return res.status(403).json({ message: 'Not allowed' })
    await review.deleteOne()
    await recalculateProductRating(review.product)
    res.json({ message: 'Review deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
