import express from 'express'
import { body } from 'express-validator'
import { deleteAccount, forgotPassword, getProfile, login, logout, register, resetPassword, updateProfile, verifyEmail } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

import { validationResult } from 'express-validator'
const validate = (req,res,next)=>{
	const errors = validationResult(req)
	if(!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg })
	next()
}
router.post('/register', [body('email').isEmail().withMessage('Invalid email'), body('password').isLength({ min: 6 }).withMessage('Password too short')], validate, register)
router.post('/login', [body('email').isEmail(), body('password').exists()], login)
router.post('/logout', logout)
router.get('/verify/:token', verifyEmail)
router.post('/forgot-password', [body('email').isEmail()], forgotPassword)
router.post('/reset-password/:token', [body('password').isLength({ min: 6 })], resetPassword)
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)
router.delete('/profile', protect, deleteAccount)

export default router
