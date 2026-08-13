import jwt from 'jsonwebtoken'

export const signToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return null
  }
}

export const decodeToken = (token) => {
  try {
    return jwt.decode(token)
  } catch (error) {
    return null
  }
}

export const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token)
    if (!decoded || !decoded.exp) return true
    return Date.now() >= decoded.exp * 1000
  } catch (error) {
    return true
  }
}
