import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

function signToken(user) {
  // The token only carries the user id. Role and other details are read
  // fresh from the database on every authenticated request.
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1d' })
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {}

    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
      '+passwordHash'
    )
    // Same message for unknown email and wrong password: do not reveal
    // which accounts exist.
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = signToken(user)
    return res.json({ token, user })
  } catch (error) {
    next(error)
  }
}

export async function me(req, res) {
  // req.user was loaded from the database by requireAuth and its toJSON
  // transform already strips passwordHash.
  res.json({ user: req.user })
}

export async function logout(req, res) {
  // JWTs are stateless: there is no server session to destroy. The client
  // discards its token. This endpoint exists so the frontend has a clear
  // logout call and so tokens can be blacklisted later if ever needed.
  res.json({ message: 'Logged out' })
}
