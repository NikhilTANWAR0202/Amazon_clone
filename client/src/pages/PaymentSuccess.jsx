import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PaymentSuccess() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/orders')
    }, 4000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f0fdf4'
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ fontSize: '70px', color: 'green' }}>✅</div>

        <h1>Order Placed Successfully! 🎉</h1>

        <p>Your payment was processed successfully.</p>
        <p>Redirecting to your orders in 4 seconds...</p>
      </div>
    </div>
  )
}