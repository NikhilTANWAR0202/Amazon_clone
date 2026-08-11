import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import adminRoutes from './routes/adminRoutes.js'
import authRoutes from './routes/authRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
const app = express()
console.log('dotenv loaded, MONGO_URI present:', !!process.env.MONGO_URI)
const port = process.env.PORT || 5000

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:5173']
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
      return callback(null, true)
    }
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}))

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use(limiter)

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/users', userRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/orders', orderRoutes)

const clientDistPath = path.join(__dirname, '../client/dist')
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientDistPath))
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'))
  })
} else {
  app.get('/', (req,res) => res.json({ status:'ok' }))
}

app.use(notFound)
app.use(errorHandler)

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/amazon_clone'

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(port, () => console.log(`Server listening on port ${port}`)))
  .catch((err) => console.error('MongoDB connect error', err))
