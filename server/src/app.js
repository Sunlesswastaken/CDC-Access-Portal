import cors from 'cors'
import express from 'express'
import { errorHandler, notFound } from './middleware/error.middleware.js'
import adminRoutes from './routes/admin.routes.js'
import authRoutes from './routes/auth.routes.js'
import profileRoutes from './routes/profile.routes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/profile', profileRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
