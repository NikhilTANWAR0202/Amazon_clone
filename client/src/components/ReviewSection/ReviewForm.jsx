import { useState } from 'react'
import api from '../../services/api'
import styles from './ReviewSection.module.css'
import StarRating from './StarRating'

export default function ReviewForm({ productId, onReviewCreated }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    if (!comment.trim()) {
      setError('Please enter your review comment.')
      return
    }
    setLoading(true)
    try {
      await api.post(`/reviews/${productId}`, { rating, comment })
      setSuccess('Review submitted successfully.')
      setComment('')
      setRating(5)
      onReviewCreated()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to post review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={styles.reviewForm} onSubmit={handleSubmit}>
      <h3>Write a review</h3>
      <div className={styles.formRow}>
        <label>Rating</label>
        <StarRating value={rating} onChange={setRating} editable />
      </div>
      <div className={styles.formRow}>
        <label htmlFor="reviewComment">Your review</label>
        <textarea
          id="reviewComment"
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you like about this product?"
        />
      </div>
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}
      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit review'}
      </button>
    </form>
  )
}
