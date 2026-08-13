import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import api from '../../services/api'
import { formatCurrency } from '../../utils/currency'
import styles from './Checkout.module.css'
import RazorpayCheckout from './RazorpayCheckout'

const paymentMethods = [
  { type: 'card', label: 'Credit or debit card' },
  { type: 'upi', label: 'Scan and Pay with UPI' },
  { type: 'netbanking', label: 'Net Banking' },
  { type: 'razorpay', label: 'Razorpay / UPI / Card / Wallet' },
  { type: 'cod', label: 'Cash on Delivery' }
]

export default function Checkout() {
  const { cart, clearCart, setShippingAddress, setPaymentMethod } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const redirectTimerRef = useRef(null)

  const [address, setAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  })

  const [selectedPayment, setSelectedPayment] = useState(
    cart.paymentMethod?.type || 'card'
  )

  useEffect(() => {
    if (cart.shippingAddress) {
      setAddress(cart.shippingAddress)
    }
  }, [cart.shippingAddress])

  useEffect(() => {
    return () => {
      window.clearTimeout(redirectTimerRef.current)
    }
  }, [])

  const subtotal = useMemo(() => {
    return cart.items.reduce(
      (sum, item) => sum + item.price * (item.qty ?? item.quantity ?? 1),
      0
    )
  }, [cart.items])

  const gst = Number((subtotal * 0.18).toFixed(2))
  const shipping = subtotal > 500 ? 0 : 25
  const total = Number((subtotal + gst + shipping).toFixed(2))

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setAddress((prev) => ({ ...prev, [name]: value }))
  }

  const saveAddress = () => {
    setShippingAddress(address)
    setSuccess('Delivery address saved successfully.')
    setError('')
  }

  const handlePaymentChange = (type) => {
    setSelectedPayment(type)
    const payment = paymentMethods.find((option) => option.type === type)
    if (payment) setPaymentMethod(payment)
  }

  const orderItems = cart.items.map((item) => ({
    productId: item.id,
    title: item.title,
    price: item.price,
    quantity: item.qty || item.quantity || 1,
    image: item.images?.[0] || item.image || item.thumbnail || ''
  }))

  const paymentMethodLabel =
    paymentMethods.find((pm) => pm.type === selectedPayment)?.label ||
    'Cash on Delivery'

  // Razorpay payment success
  const scheduleSuccessRedirect = () => {
    redirectTimerRef.current = window.setTimeout(() => {
      setShowSuccess(false)
      navigate('/orders')
    }, 3000)
  }

  const handlePaymentSuccess = async (paymentInfo) => {
    setLoading(true)

    try {
      // verify stock for each item before creating order
      for (const item of orderItems) {
        const res = await api.get(`/products/${item.productId}`)
        const prod = res.data.product
        if (!prod) throw new Error('Product not found: ' + item.title)
        if ((prod.stock || 0) < item.quantity) {
          throw new Error(`Not enough stock for ${prod.title || prod.name}: requested ${item.quantity}, available ${prod.stock || 0}`)
        }
      }
      await api.post('/orders', {
        items: orderItems,
        address,
        paymentMethod: 'Razorpay',
        paymentStatus: 'Paid',
        paymentInfo,
        payment: paymentInfo,
        shippingCost: shipping,
        gst,
        discount: 0,
        total
      })

      clearCart()
      setLoading(false)
      setShowSuccess(true)
      scheduleSuccessRedirect()
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.message ||
          'Unable to save order after payment.'
      )
      setLoading(false)
    }
  }

  // Cash on Delivery / normal order
  const handlePlaceOrder = async () => {
    setError('')
    setSuccess('')

    if (
      !address.fullName ||
      !address.addressLine1 ||
      !address.city ||
      !address.state ||
      !address.zip ||
      !address.phone
    ) {
      setError('Please fill in all required address fields before placing the order.')
      return
    }

    // Razorpay handled separately
    if (selectedPayment === 'razorpay') return

    setLoading(true)

    try {
      // verify stock for each item before creating order
      for (const item of orderItems) {
        const res = await api.get(`/products/${item.productId}`)
        const prod = res.data.product
        if (!prod) throw new Error('Product not found: ' + item.title)
        if ((prod.stock || 0) < item.quantity) {
          throw new Error(`Not enough stock for ${prod.title || prod.name}: requested ${item.quantity}, available ${prod.stock || 0}`)
        }
      }
      await api.post('/orders', {
        items: orderItems,
        address,
        paymentMethod: paymentMethodLabel,
        shippingCost: shipping,
        gst,
        discount: 0,
        total
      })

      clearCart()
      setLoading(false)
      setShowSuccess(true)
      scheduleSuccessRedirect()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Unable to place order')
      setLoading(false)
    }
  }

  if (cart.items.length === 0 && !showSuccess) {
    return (
      <div className="container">
        <h2>Checkout</h2>
        <p>Your cart is empty.</p>
      </div>
    )
  }

  return (
    <>
      {/* Success Animation */}
      {showSuccess && (
        <div className={styles.successOverlay}>
          <div className={styles.successCard}>
            <div className={styles.successCircle}>✓</div>

            <h2>Order Placed Successfully! 🎉</h2>

            <p>Your order has been placed successfully.</p>
            <p>Thank you for shopping with Amazon Clone.</p>

            <div className={styles.successLoader}></div>

            <span>Preparing your order...</span>
          </div>
        </div>
      )}

      <div className={styles.checkoutPage}>
        {/* Delivery Address */}
        <div className={styles.checkoutSection}>
          <h2 className={styles.checkoutTitle}>Delivery address</h2>
          <p className={styles.checkoutSubtitle}>
            Enter a delivery address for this order.
          </p>

          <button
            className={styles.saveAddressButton}
            type="button"
            onClick={saveAddress}
          >
            Save address
          </button>

          {error && <div className={styles.alertError}>{error}</div>}
          {success && <div className={styles.alertSuccess}>{success}</div>}

          <div className={styles.checkoutStep}>
            <div className={styles.checkoutField}>
              <label>Full name</label>
              <input
                name="fullName"
                value={address.fullName}
                onChange={handleAddressChange}
                placeholder="John Doe"
              />
            </div>

            <div className={styles.checkoutField}>
              <label>Address line 1</label>
              <input
                name="addressLine1"
                value={address.addressLine1}
                onChange={handleAddressChange}
                placeholder="House number, street, landmark"
              />
            </div>

            <div className={styles.checkoutField}>
              <label>Address line 2</label>
              <input
                name="addressLine2"
                value={address.addressLine2}
                onChange={handleAddressChange}
                placeholder="Apartment, suite, building, floor"
              />
            </div>

            <div className={styles.addressRow}>
              <div className={styles.checkoutField}>
                <label>City</label>
                <input
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  placeholder="City"
                />
              </div>

              <div className={styles.checkoutField}>
                <label>State</label>
                <input
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                  placeholder="State"
                />
              </div>
            </div>

            <div className={styles.addressRow}>
              <div className={styles.checkoutField}>
                <label>ZIP / Postal code</label>
                <input
                  name="zip"
                  value={address.zip}
                  onChange={handleAddressChange}
                  placeholder="Postal code"
                />
              </div>

              <div className={styles.checkoutField}>
                <label>Phone number</label>
                <input
                  name="phone"
                  value={address.phone}
                  onChange={handleAddressChange}
                  placeholder="Phone number"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className={styles.checkoutSection}>
          <h3 className={styles.checkoutStepTitle}>Payment method</h3>

          <div className={styles.paymentOptions}>
            {paymentMethods.map((method) => (
              <label key={method.type} className={styles.paymentOption}>
                <input
                  type="radio"
                  checked={selectedPayment === method.type}
                  onChange={() => handlePaymentChange(method.type)}
                />
                <span>{method.label}</span>
              </label>
            ))}
          </div>

          {selectedPayment === 'razorpay' && (
            <RazorpayCheckout
              amount={total}
              user={user}
              address={address}
              onSuccess={handlePaymentSuccess}
            />
          )}
        </div>

        {/* Order Summary */}
        <div className={styles.checkoutSection}>
          <h3 className={styles.checkoutStepTitle}>Order summary</h3>

          <div className={styles.summaryCard}>
            <div className={styles.summaryLine}>
              <span>Subtotal ({cart.items.length} items)</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className={styles.summaryLine}>
              <span>GST</span>
              <span>{formatCurrency(gst)}</span>
            </div>

            <div className={styles.summaryLine}>
              <span>Shipping</span>
              <span>{formatCurrency(shipping)}</span>
            </div>

            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <div className={styles.summaryLine}>
              <span>Deliver to</span>
              <span>{address.fullName || 'No address saved yet'}</span>
            </div>

            {selectedPayment !== 'razorpay' && (
              <button
                className={styles.checkoutButton}
                type="button"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? 'Processing order...' : 'Place your order'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}