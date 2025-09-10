import express from 'express'
import {
  registerForEvent,
  getMyRegistrations,
  getRegistration,
  cancelRegistration,
  submitFeedback,
  getEventRegistrations,
  markAttendance,
  getRegistrationAnalytics
} from '../controllers/registrationController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication
router.use(protect)

// Student routes
router.post('/', registerForEvent)
router.get('/my-registrations', getMyRegistrations)
router.get('/:id', getRegistration)
router.put('/:id/cancel', cancelRegistration)
router.put('/:id/feedback', submitFeedback)

// Admin routes
router.get('/event/:eventId', adminOnly, getEventRegistrations)
router.put('/:id/attendance', adminOnly, markAttendance)
router.get('/admin/analytics', adminOnly, getRegistrationAnalytics)

export default router
