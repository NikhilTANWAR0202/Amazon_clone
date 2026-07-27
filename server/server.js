import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()
const app = express()
console.log('dotenv loaded, MONGO_URI present:', !!process.env.MONGO_URI)
const port = process.env.PORT || 5000

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use(limiter)

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)

app.get('/', (req,res)=>res.json({status:'ok'}))

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> app.listen(port, ()=> console.log(`Server listening on port ${port}`)))
  .catch(err=> console.error('MongoDB connect error', err))
