import { Router } from 'express'
import { getOwnProfile } from '../controllers/profile.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/me', requireAuth, getOwnProfile)

export default router
