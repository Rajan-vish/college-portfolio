import express from 'express'
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByCategory,
  getUpcomingEvents,
  getEventAnalytics,
  searchEvents
} from '../controllers/eventController.js'
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js'

const router = express.Router()

// Public routes (with optional auth for enhanced features)
router.get('/', optionalAuth, getEvents)
router.get('/upcoming', getUpcomingEvents)
router.get('/search', searchEvents)
router.get('/category/:category', getEventsByCategory)
router.get('/:id', optionalAuth, getEvent)

// Protected routes
router.use(protect)

// Admin only routes
router.post('/', adminOnly, createEvent)
router.put('/:id', adminOnly, updateEvent)
router.delete('/:id', adminOnly, deleteEvent)
router.get('/admin/analytics', adminOnly, getEventAnalytics)

export default router
