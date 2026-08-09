import { useNavigate } from 'react-router-dom'
import styles from './PaymentSuccess.module.css'

export default function PaymentSuccess() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>Payment Successful 🎉</h1>
        <p>Your order has been placed successfully.</p>

        <button
          className={styles.button}
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}