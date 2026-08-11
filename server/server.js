import mongoose from 'mongoose'
import app from './app.js'

const port = process.env.PORT || 5000

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/amazon_clone'

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(port, () => console.log(`Server listening on port ${port}`)))
  .catch((err) => console.error('MongoDB connect error', err))

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/amazon_clone'

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(port, () => console.log(`Server listening on port ${port}`)))
  .catch((err) => console.error('MongoDB connect error', err))
