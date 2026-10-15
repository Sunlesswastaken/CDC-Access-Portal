import cors from 'cors'
import express from 'express'
import { errorHandler, notFound } from './middleware/error.middleware.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use(notFound)
app.use(errorHandler)

export default app
