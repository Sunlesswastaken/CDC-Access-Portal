import { Router } from 'express'
import {
  createFaculty,
  createStudent,
  getStats,
  listFaculty,
  listStudents,
} from '../controllers/admin.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.middleware.js'

const router = Router()

// Every admin route requires a valid token AND the admin role.
router.use(requireAuth, requireRole('admin'))

router.post('/faculty', createFaculty)
router.get('/faculty', listFaculty)
router.post('/students', createStudent)
router.get('/students', listStudents)
router.get('/stats', getStats)

export default router
