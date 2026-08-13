import dotenv from 'dotenv'
import Razorpay from 'razorpay'
import crypto from 'crypto'

// Load environment variables
dotenv.config()

// Create Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

// Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body

    // Validate amount
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      })
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // Convert ₹ to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    }

    const order = await razorpay.orders.create(options)

    return res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID
    })
  } catch (error) {
    console.error('Razorpay create order error:', error)

    return res.status(500).json({
      success: false,
      message: 'Failed to create Razorpay order',
      error: error.message
    })
  }
}

// Verify Razorpay Payment
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body

    const body = `${razorpay_order_id}|${razorpay_payment_id}`

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expectedSignature === razorpay_signature) {
      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully'
      })
    }

    return res.status(400).json({
      success: false,
      message: 'Invalid payment signature'
    })
  } catch (error) {
    console.error('Razorpay verify error:', error)

    return res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    })
  }
} 