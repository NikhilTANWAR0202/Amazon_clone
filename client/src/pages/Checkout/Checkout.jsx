
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import api from '../../services/api'
import { formatCurrency } from '../../utils/currency'
import styles from './Checkout.module.css'

const paymentMethods = [
  { type: 'card', label: 'Credit or debit card' },
  { type: 'upi', label: 'Scan and Pay with UPI' },
  { type: 'netbanking', label: 'Net Banking' },
  { type: 'cod', label: 'Cash on Delivery' }
]

export default function Checkout(){
  const { cart, clearCart, setShippingAddress, setPaymentMethod } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [address, setAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  })
  const [selectedPayment, setSelectedPayment] = useState(cart.paymentMethod?.type || 'card')

  useEffect(()=>{
    if(cart.shippingAddress){
      setAddress(cart.shippingAddress)
    }
  },[cart.shippingAddress])

  const subtotal = useMemo(() => cart.items.reduce((sum,item)=>sum + item.price * (item.qty ?? item.quantity ?? 1), 0), [cart.items])
  const gst = Number((subtotal * 0.18).toFixed(2))
  const shipping = subtotal > 500 ? 0 : 25
  const total = Number((subtotal + gst + shipping).toFixed(2))

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setAddress(prev => ({ ...prev, [name]: value }))
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

  const handlePlaceOrder = async () => {
    setError('')
    setSuccess('')
    if (!address.fullName || !address.addressLine1 || !address.city || !address.state || !address.zip || !address.phone) {
      setError('Please fill in all required address fields before placing the order.')
      return
    }

    setLoading(true)
    try{
      const orderItems = cart.items.map(item => ({
    productId: item.id,
    title: item.title,
    price: item.price,
    quantity: item.qty || item.quantity || 1,
    image: item.images?.[0] || item.image || item.thumbnail || ""
}));

await api.post('/orders', {
    items: orderItems,
        address,
        paymentMethod:
paymentMethods.find((pm)=>pm.type===selectedPayment)?.label || "Cash on Delivery" || { type:'card', label:'Credit or debit card' },
        shippingCost: shipping,
        gst,
        discount: 0,
        total
      })
      clearCart()
      navigate('/orders')
    }catch(err){
      setError(err.response?.data?.message || 'Unable to place order')
      setLoading(false)
    }
  }

  if(cart.items.length === 0) return (
    <div className="container">
      <h2>Checkout</h2>
      <p>Your cart is empty.</p>
    </div>
  )

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.checkoutSection}>
        <div className={styles.checkoutHeader}>
          <div>
            <h2>Delivery address</h2>
            <p>Enter a delivery address for this order.</p>
          </div>
          <button className={styles.checkoutButton} type="button" onClick={saveAddress}>Save address</button>
        </div>

        {error && <div className={styles.alertError}>{error}</div>}
        {success && <div className={styles.alertSuccess}>{success}</div>}

        <div className={styles.checkoutStep}>
          <div className={styles.checkoutField}>
            <label htmlFor="fullName">Full name</label>
            <input id="fullName" name="fullName" value={address.fullName} onChange={handleAddressChange} placeholder="John Doe" />
          </div>
          <div className={styles.checkoutField}>
            <label htmlFor="addressLine1">Address line 1</label>
            <input id="addressLine1" name="addressLine1" value={address.addressLine1} onChange={handleAddressChange} placeholder="House number, street, landmark" />
          </div>
          <div className={styles.checkoutField}>
            <label htmlFor="addressLine2">Address line 2</label>
            <input id="addressLine2" name="addressLine2" value={address.addressLine2} onChange={handleAddressChange} placeholder="Apartment, suite, unit, building, floor" />
          </div>
          <div className={styles.addressRow}>
            <div className={styles.checkoutField}>
              <label htmlFor="city">City</label>
              <input id="city" name="city" value={address.city} onChange={handleAddressChange} placeholder="City" />
            </div>
            <div className={styles.checkoutField}>
              <label htmlFor="state">State</label>
              <input id="state" name="state" value={address.state} onChange={handleAddressChange} placeholder="State" />
            </div>
          </div>
          <div className={styles.addressRow}>
            <div className={styles.checkoutField}>
              <label htmlFor="zip">ZIP / Postal code</label>
              <input id="zip" name="zip" value={address.zip} onChange={handleAddressChange} placeholder="Postal code" />
            </div>
            <div className={styles.checkoutField}>
              <label htmlFor="phone">Phone number</label>
              <input id="phone" name="phone" value={address.phone} onChange={handleAddressChange} placeholder="Phone number" />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.checkoutSection}>
        <h3 className={styles.checkoutStepTitle}>Payment method</h3>
        <div className={styles.paymentOptions}>
          {paymentMethods.map((method) => (
            <label key={method.type} className={styles.paymentOption}>
              <input
                type="radio"
                name="payment"
                checked={selectedPayment === method.type}
                onChange={() => handlePaymentChange(method.type)}
              />
              <span>{method.label}</span>
            </label>
          ))}
        </div>
      </div>

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
          <button className={styles.checkoutButton} type="button" onClick={handlePlaceOrder} disabled={loading}>
            {loading ? 'Placing order...' : 'Place your order'}
          </button>
        </div>
      </div>
    </div>
  )
}
