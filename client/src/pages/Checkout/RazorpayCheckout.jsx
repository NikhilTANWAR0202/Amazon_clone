import { useState } from 'react'
import api from '../../services/api'
import styles from './RazorpayCheckout.module.css'

function RazorpayCheckout({ amount, user, address, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load Razorpay script dynamically
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)

      document.body.appendChild(script)
    })

  const handlePayment = async () => {
    setError('')

    if (!amount || Number(amount) <= 0) {
      setError('Invalid payment amount.')
      return
    }

    setLoading(true)

    try {
      // Load Razorpay SDK
      const scriptLoaded = await loadRazorpayScript()

      if (!scriptLoaded) {
        setError('Unable to load Razorpay checkout. Please try again.')
        setLoading(false)
        return
      }

      // Create order on backend
      const response = await api.post('/payment/create-order', {
        amount
      })

      const { order, key } = response.data

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'Amazon Clone',
        description: 'Secure online payment using Razorpay',
        order_id: order.id,

        prefill: {
          name: user?.name || address?.fullName || 'Guest User',
          email: user?.email || '',
          contact: address?.phone || ''
        },

        notes: {
          address: `${address?.addressLine1 || ''}, ${address?.city || ''}`
        },

        theme: {
          color: '#0b6e4f'
        },

        // SUCCESS HANDLER
        handler: async (paymentResponse) => {
          try {
            // Verify payment signature on backend
            const verifyRes = await api.post('/payment/verify', {
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature
            })

            if (verifyRes.data.success) {
              // Wait for parent success handler
              await onSuccess({
                paymentId: paymentResponse.razorpay_payment_id,
                orderId: paymentResponse.razorpay_order_id,
                signature: paymentResponse.razorpay_signature,
                method: 'Razorpay',
                status: 'Paid'
              })
            } else {
              setError('Payment verification failed.')
              setLoading(false)
            }
          } catch (err) {
            console.error(err)
            setError(
              err.response?.data?.message ||
                'Payment verification failed. Please try again.'
            )
            setLoading(false)
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false)
          }
        }
      }

      const razorpayWindow = new window.Razorpay(options)
      razorpayWindow.open()
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.message ||
          'Unable to start Razorpay payment.'
      )
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      {error && <div className={styles.error}>{error}</div>}

      <button
        className={styles.payButton}
        type="button"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? 'Opening Razorpay...' : 'Pay with Razorpay'}
      </button>
    </div>
  )
}

export default RazorpayCheckout