import express from 'express'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// basic user endpoints (profile management forwarded to auth routes)
router.get('/', protect, (req,res)=>{
  res.json({ message: 'User route placeholder' })
})

export default router
