import mongoose from 'mongoose'

export async function connectDB(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Copy .env.example to .env and fill it in.')
  }

  mongoose.set('strictQuery', true)

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  }
}
