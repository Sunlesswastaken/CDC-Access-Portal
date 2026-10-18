import path from 'node:path'
import { fileURLToPath } from 'node:url'
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

// In production (e.g. Render) Express also serves the built React client so
// everything runs as a single service. In development the client runs on the
// Vite dev server and this directory does not exist yet.
const clientDist = path.resolve(fileURLToPath(new URL('../../client/dist', import.meta.url)))
app.use(express.static(clientDist))
// SPA fallback for client-side routes (login, dashboards, ...). API 404s
// still fall through to the JSON handlers below.
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(clientDist, 'index.html'))
  }
  return next()
})

app.use(notFound)
app.use(errorHandler)

export default app
