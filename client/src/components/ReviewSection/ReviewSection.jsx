import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import ReviewForm from './ReviewForm'
import styles from './ReviewSection.module.css'
import StarRating from './StarRating'

export default function ReviewSection({ productId }) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchReviews = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get(`/reviews/${productId}`)
      setReviews(res.data.reviews || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  }, [reviews])

  const userReview = useMemo(() => reviews.find((review) => user && String(review.user?._id) === String(user.id)), [reviews, user])

  return (
    <section className={styles.reviewSection}>
      <div className={styles.reviewHeader}>
        <div>
          <h2>Customer reviews</h2>
          <p>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
        </div>
        <div className={styles.ratingSummary}>
          <div className={styles.ratingValue}>{averageRating.toFixed(1)}</div>
          <div>
            <StarRating value={Math.round(averageRating)} />
            <span>{reviews.length} ratings</span>
          </div>
        </div>
      </div>
      {loading ? (
        <div className={styles.loading}>Loading reviews…</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.reviewBody}>
          {user ? (
            userReview ? (
              <div className={styles.alert}>
                You have already reviewed this product.
              </div>
            ) : (
              <ReviewForm productId={productId} onReviewCreated={fetchReviews} />
            )
          ) : (
            <div className={styles.alert}>Please log in to write a review.</div>
          )}

          <div className={styles.reviewsList}>
            {reviews.length === 0 ? (
              <div className={styles.emptyState}>No reviews yet. Be the first to share your experience.</div>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className={styles.reviewCard}>
                  <div className={styles.reviewMeta}>
                    <strong>{review.user?.firstName || 'Customer'} {review.user?.lastName || ''}</strong>
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.reviewRating}>
                    <StarRating value={review.rating} />
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </section>
  )
}
