import 'dotenv/config'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'

// Demo student credentials for local testing and the demo video.
// These are intentionally simple, documented values — not real secrets.
const email = (process.env.DEMO_STUDENT_EMAIL || 'student@example.com').toLowerCase().trim()
const password = process.env.DEMO_STUDENT_PASSWORD || 'Student123!'
const name = process.env.DEMO_STUDENT_NAME || 'Demo Student'
const rollNumber = (process.env.DEMO_STUDENT_ROLL || 'DEMO-001').toUpperCase().trim()

if (password.length < 8) {
  console.error('Demo student password must be at least 8 characters long.')
  process.exit(1)
}

await connectDB(process.env.MONGODB_URI)

try {
  const existing = await User.findOne({ email })
  if (existing) {
    if (existing.role !== 'student') {
      console.error(`A user with email ${email} already exists but has role "${existing.role}". Refusing to overwrite.`)
      process.exit(1)
    }
    console.log(`Demo student already exists: ${email}`)
  } else {
    const passwordHash = await bcrypt.hash(password, 10)
    await User.create({ name, email, passwordHash, role: 'student', rollNumber })
    console.log(`Created demo student account: ${email} (roll number ${rollNumber})`)
  }
} catch (error) {
  console.error('Seeding failed:', error.message)
  process.exitCode = 1
} finally {
  await mongoose.disconnect()
}
