export const notFound = (req,res,next) => {
  res.status(404).json({ message: `Not Found - ${req.originalUrl}` })
}

export const errorHandler = (err, req, res, next) => {
  console.error(err)
  const status = res.statusCode === 200 ? 500 : res.statusCode
  res.status(status).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
}
