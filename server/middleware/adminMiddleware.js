import { requireAdmin, requireUser } from './authMiddleware.js'

export const admin = requireAdmin
export const user = requireUser
