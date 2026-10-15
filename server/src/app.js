import cors from 'cors'
import express from 'express'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

export default app
