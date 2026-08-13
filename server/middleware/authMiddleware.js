import User from '../models/User.js'
import { isTokenExpired, verifyToken } from '../utils/tokenUtil.js'

export const extractToken = (req) => {
  if (req.cookies?.token) return req.cookies.token
  if (req.headers.authorization?.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1]
  }
  return null
}

export const invalidToken = (req, res, next) => {
  const token = extractToken(req)
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' })
  }
  if (isTokenExpired(token)) {
    return res.status(401).json({ message: 'Token expired, please log in again' })
  }
  next()
}

export const protect = async (req, res, next) => {
  const token = extractToken(req)
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' })
  }

  if (isTokenExpired(token)) {
    res.clearCookie('token')
    return res.status(401).json({ message: 'Not authorized, token expired' })
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(401).json({ message: 'Not authorized, invalid token' })
  }

  const user = await User.findById(decoded.id).select('-password')
  if (!user) {
    return res.status(401).json({ message: 'Not authorized, user not found' })
  }

  req.user = user
  req.token = token
  next()
}

export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    next()
  }
}

export const requireAdmin = requireRole('admin')
export const requireUser = requireRole('user')
