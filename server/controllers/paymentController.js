import dotenv from 'dotenv'
import Razorpay from 'razorpay'
import crypto from 'crypto'

dotenv.config()

console.log('Razorpay Key:', process.env.RAZORPAY_KEY_ID)

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_TNF9PWOtPiv1OY',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'pRRSTSPPmiPl25jKfw3CR7A3'
})

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    }

    const order = await razorpay.orders.create(options)

    res.json({
      success: true,
      order
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Unable to create Razorpay order'
    })
  }
}

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      })
    }

    res.json({
      success: true,
      message: 'Payment verified successfully'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Verification failed'
    })
  }
}