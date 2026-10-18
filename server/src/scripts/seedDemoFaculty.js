import 'dotenv/config'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'

// Demo faculty credentials for local testing and the demo video.
// These are intentionally simple, documented values — not real secrets.
const email = (process.env.DEMO_FACULTY_EMAIL || 'faculty@example.com').toLowerCase().trim()
const password = (process.env.DEMO_FACULTY_PASSWORD || 'Faculty123!').trim()
const name = (process.env.DEMO_FACULTY_NAME || 'Demo Faculty').trim()

if (password.length < 8) {
  console.error('Demo faculty password must be at least 8 characters long.')
  process.exit(1)
}

await connectDB(process.env.MONGODB_URI)

try {
  const existing = await User.findOne({ email })
  if (existing) {
    if (existing.role !== 'faculty') {
      console.error(`A user with email ${email} already exists but has role "${existing.role}". Refusing to overwrite.`)
      process.exit(1)
    }
    console.log(`Demo faculty already exists: ${email}`)
  } else {
    const passwordHash = await bcrypt.hash(password, 10)
    await User.create({ name, email, passwordHash, role: 'faculty' })
    console.log(`Created demo faculty account: ${email}`)
  }
} catch (error) {
  console.error('Seeding failed:', error.message)
  process.exitCode = 1
} finally {
  await mongoose.disconnect()
}
