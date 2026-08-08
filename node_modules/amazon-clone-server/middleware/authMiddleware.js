import User from '../models/User.js'
import { verifyToken } from '../utils/tokenUtil.js'

export const protect = async (req,res,next)=>{
  try{
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]
    if(!token) return res.status(401).json({ message:'Not authorized' })
    const decoded = verifyToken(token)
    const user = await User.findById(decoded.id)
    if(!user) return res.status(401).json({ message:'Not authorized' })
    req.user = user
    next()
  }catch(err){
    res.status(401).json({ message:'Not authorized' })
  }
}

export const admin = (req,res,next)=>{
  if(req.user?.role !== 'admin') return res.status(403).json({ message:'Forbidden' })
  next()
}
