import bcrypt from 'bcrypt'
import User from '../models/User.js'

const MIN_PASSWORD_LENGTH = 8
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateAccountInput(body, { requireRollNumber }) {
  const { name, email, password, rollNumber } = body || {}

  if (typeof name !== 'string' || !name.trim()) return 'Name is required'
  if (typeof email !== 'string' || !email.trim()) return 'Email is required'
  if (!EMAIL_RE.test(email.trim())) return 'Enter a valid email address'
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

const ROLES = ['admin', 'faculty', 'student']
const TREND_WINDOW_DAYS = 14

// Real, aggregated counts for the admin dashboard. Nothing here is mocked:
// every number comes from the User collection.
export async function getStats(req, res, next) {
  try {
    const [byRoleRaw, total] = await Promise.all([
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
      User.countDocuments(),
    ])

    const counts = { admin: 0, faculty: 0, student: 0 }
    for (const entry of byRoleRaw) {
      if (entry._id in counts) counts[entry._id] = entry.count
    }

    // Group accounts by the calendar day they were created over the last two weeks.
    const since = new Date()
    since.setHours(0, 0, 0, 0)
    since.setDate(since.getDate() - (TREND_WINDOW_DAYS - 1))

    const trendRaw = await User.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    return res.json({
      totals: {
        users: total,
        students: counts.student,
        faculty: counts.faculty,
        roles: ROLES.length,
      },
      byRole: ROLES.map((role) => ({ role, count: counts[role] })),
      createdByDate: trendRaw.map((entry) => ({ date: entry._id, count: entry.count })),
      windowDays: TREND_WINDOW_DAYS,
    })
  } catch (error) {
    next(error)
  }
}
