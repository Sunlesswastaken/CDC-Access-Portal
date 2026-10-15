import bcrypt from 'bcrypt'
import User from '../models/User.js'

const MIN_PASSWORD_LENGTH = 8

function validateAccountInput(body, { requireRollNumber }) {
  const { name, email, password, rollNumber } = body || {}

  if (typeof name !== 'string' || !name.trim()) return 'Name is required'
  if (typeof email !== 'string' || !email.trim()) return 'Email is required'
  if (typeof password !== 'string' || !password) return 'Password is required'
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
  }
  if (requireRollNumber && (typeof rollNumber !== 'string' || !rollNumber.trim())) {
    return 'Roll number is required for students'
  }
  return null
}

async function createUserWithRole(req, res, role, { requireRollNumber }) {
  const error = validateAccountInput(req.body, { requireRollNumber })
  if (error) {
    return res.status(400).json({ message: error })
  }

  const { name, email, password, rollNumber } = req.body

  // The role is decided by which endpoint was called, never by the request
  // body, so a client cannot ask for an admin account here.
  const passwordHash = await bcrypt.hash(password, 10)

  const user = await User.create({
    name: name.trim(),
    email: email.trim(),
    passwordHash,
    role,
    ...(role === 'student' ? { rollNumber: rollNumber.trim() } : {}),
  })

  return res.status(201).json({
    message: `${role === 'student' ? 'Student' : 'Faculty'} account created`,
    user,
  })
}

export async function createFaculty(req, res, next) {
  try {
    return await createUserWithRole(req, res, 'faculty', { requireRollNumber: false })
  } catch (error) {
    next(error)
  }
}

export async function createStudent(req, res, next) {
  try {
    return await createUserWithRole(req, res, 'student', { requireRollNumber: true })
  } catch (error) {
    next(error)
  }
}

export async function listFaculty(req, res, next) {
  try {
    const users = await User.find({ role: 'faculty' }).sort({ createdAt: -1 })
    return res.json({ users })
  } catch (error) {
    next(error)
  }
}

export async function listStudents(req, res, next) {
  try {
    const users = await User.find({ role: 'student' }).sort({ createdAt: -1 })
    return res.json({ users })
  } catch (error) {
    next(error)
  }
}
