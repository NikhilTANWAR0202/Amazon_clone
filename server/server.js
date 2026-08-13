import mongoose from 'mongoose'
import dotenv from 'dotenv'
import app from './app.js'

// Load .env variables
dotenv.config()

const port = process.env.PORT || 5000

// MongoDB connection string
const mongoUri =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/amazon_clone'

// Connect to MongoDB
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('MongoDB Connected')

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`)
    })
  })
  .catch((err) => {
    console.error('MongoDB connect error', err)
  })