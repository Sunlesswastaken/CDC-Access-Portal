import crypto from 'node:crypto'
import mongoose from 'mongoose'

const ROLES = ['admin', 'faculty', 'student']

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must be at most 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ROLES,
        message: 'Role must be one of: admin, faculty, student',
      },
      required: [true, 'Role is required'],
    },
    rollNumber: {
      type: String,
      trim: true,
      uppercase: true,
      // Required only for students (checked in validation below).
      index: {
        unique: true,
        partialFilterExpression: { role: 'student' },
      },
    },
    studentQrId: {
      type: String,
      unique: true,
      index: {
        unique: true,
        partialFilterExpression: { studentQrId: { $exists: true } },
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        // Never expose password hashes. studentQrId is a non-sensitive
        // identifier and is safe (and needed) to return.
        delete ret.passwordHash
        delete ret.__v
        return ret
      },
    },
  }
)

userSchema.pre('validate', function assignStudentFields() {
  if (this.role === 'student') {
    if (!this.rollNumber) {
      this.invalidate('rollNumber', 'Roll number is required for students')
    }
    if (!this.studentQrId) {
      // Random, non-sensitive identifier used only to build the student's QR code.
      this.studentQrId = `STU-${crypto.randomUUID()}`
    }
  } else {
    this.rollNumber = undefined
    this.studentQrId = undefined
  }
})

const User = mongoose.model('User', userSchema)

export default User
