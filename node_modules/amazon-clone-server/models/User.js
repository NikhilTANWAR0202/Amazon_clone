import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
  label: String,
  firstName: String,
  lastName: String,
  phone: String,
  country: String,
  state: String,
  city: String,
  pincode: String,
  addressLine: String,
  apartment: String,
  isDefault: { type: Boolean, default: false }
})

const paymentSchema = new mongoose.Schema({
  type: String,
  provider: String,
  maskedNumber: String,
  expiry: String,
  isDefault: { type: Boolean, default: false }
})

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: String,
  email: { type: String, required: true, unique: true },
  phone: String,
  password: { type: String, required: true },
  dob: String,
  gender: String,
  country: String,
  state: String,
  city: String,
  pincode: String,
  address: String,
  apartment: String,
  avatar: String,
  role: { type: String, default: 'user' },
  emailVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetToken: String,
  resetTokenExpiry: Date,
  addresses: [addressSchema],
  payments: [paymentSchema],
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('User', userSchema)
