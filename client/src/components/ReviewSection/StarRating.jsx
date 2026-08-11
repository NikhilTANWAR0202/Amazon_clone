import { FaStar } from 'react-icons/fa'
import styles from './ReviewSection.module.css'

export default function StarRating({ value, onChange, editable }) {
  return (
    <div className={styles.starRating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={editable ? 'button' : 'div'}
          className={`${styles.starButton} ${value >= star ? styles.active : ''}`}
          onClick={() => editable && onChange(star)}
          onMouseDown={(e) => e.preventDefault()}
        >
          <FaStar />
        </button>
      ))}
    </div>
  )
}
