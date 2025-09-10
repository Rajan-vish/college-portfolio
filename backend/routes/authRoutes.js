import express from 'express'
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  getUserStats
} from '../controllers/authController.js'
import { protect, adminOnly, authRateLimit } from '../middleware/auth.js'

const router = express.Router()

// Public routes with rate limiting
router.post('/register', authRateLimit(5, 15 * 60 * 1000), register)
router.post('/login', authRateLimit(5, 15 * 60 * 1000), login)

// Protected routes
router.use(protect) // Apply to all routes below

router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.put('/change-password', changePassword)
router.post('/logout', logout)

// Admin only routes
router.get('/stats', adminOnly, getUserStats)

export default router
