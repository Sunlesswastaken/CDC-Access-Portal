import 'dotenv/config'
import app from './app.js'
import { connectDB } from './config/db.js'

const PORT = process.env.PORT || 5000

try {
  await connectDB(process.env.MONGODB_URI)
} catch (error) {
  console.error(error.message)
  process.exit(1)
}

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
