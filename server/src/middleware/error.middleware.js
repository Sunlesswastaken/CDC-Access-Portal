export function notFound(req, res) {
  res.status(404).json({ message: 'Route not found' })
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Mongoose duplicate-key error (unique indexes on email / rollNumber / studentQrId)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field'
    const label =
      field === 'rollNumber' ? 'roll number' : field === 'email' ? 'email' : field
    return res.status(409).json({ message: `A user with that ${label} already exists` })
  }

  // Mongoose schema validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ')
    return res.status(400).json({ message })
  }

  // Invalid MongoDB id in the request
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid id provided' })
  }

  console.error(err)
  return res.status(500).json({ message: 'Internal server error' })
}
