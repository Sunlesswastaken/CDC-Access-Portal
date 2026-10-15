import 'dotenv/config'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'

const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim()
const password = process.env.ADMIN_PASSWORD || ''

if (!email || !password) {
  console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment (see .env.example).')
  process.exit(1)
}
if (password.length < 8) {
  console.error('ADMIN_PASSWORD must be at least 8 characters long.')
  process.exit(1)
}

await connectDB(process.env.MONGODB_URI)

try {
  const existing = await User.findOne({ email })
  if (existing) {
    if (existing.role !== 'admin') {
      console.error(`A user with email ${email} already exists but has role "${existing.role}". Refusing to overwrite.`)
      process.exit(1)
    }
    console.log(`Admin already exists: ${email}`)
  } else {
    const passwordHash = await bcrypt.hash(password, 10)
    await User.create({ name: 'Administrator', email, passwordHash, role: 'admin' })
    console.log(`Created admin account: ${email}`)
  }
} catch (error) {
  console.error('Seeding failed:', error.message)
  process.exitCode = 1
} finally {
  await mongoose.disconnect()
}
