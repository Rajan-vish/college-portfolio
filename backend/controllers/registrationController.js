import Registration from '../models/Registration.js'
import Event from '../models/Event.js'
import User from '../models/User.js'

// @desc    Register for an event
// @route   POST /api/registrations
// @access  Private
export const registerForEvent = async (req, res) => {
  try {
    const { eventId, registrationData } = req.body
    
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required'
      })
    }
    
    // Check if event exists and is available for registration
    const event = await Event.findById(eventId)
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      })
    }
    
    if (event.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Event is not available for registration'
      })
    }
    
    // Check registration availability
    const canRegister = event.canUserRegister(req.user.id)
    if (!canRegister.canRegister) {
      return res.status(400).json({
        success: false,
        message: canRegister.reason
      })
    }
    
    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      user: req.user.id,
      event: eventId
    })
    
    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      })
    }
    
    // Create registration
    const registration = await Registration.create({
      user: req.user.id,
      event: eventId,
      registrationData: registrationData || {},
      paymentStatus: event.registration.fee > 0 ? 'pending' : 'not-required',
      metadata: {
        registrationSource: 'web',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    })
    
    await registration.populate([
      { path: 'user', select: 'name email studentId' },
      { path: 'event', select: 'title dateTime venue' }
    ])
    
    // Add event to user's registered events
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { registeredEvents: eventId }
    })
    
    // Emit real-time notification
    const io = req.app.get('io')
    io.to('admin').emit('new-registration', {
      registration,
      user: req.user,
      event,
      message: `${req.user.name} registered for "${event.title}"`
    })
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: { registration }
    })
    
  } catch (error) {
    console.error('Registration error:', error)
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    })
  }
}

// @desc    Get user's registrations
// @route   GET /api/registrations/my-registrations
// @access  Private
export const getMyRegistrations = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    
    const query = { user: req.user.id }
    if (status) query.status = status
    
    const skip = (page - 1) * limit
    
    const registrations = await Registration.find(query)
      .populate('event', 'title description dateTime venue category status images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
    
    const totalRegistrations = await Registration.countDocuments(query)
    
    res.status(200).json({
      success: true,
      data: {
        registrations,
        pagination: {
          current: parseInt(page),
          total: totalRegistrations,
          pages: Math.ceil(totalRegistrations / limit)
        }
      }
    })
    
  } catch (error) {
    console.error('Get my registrations error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations'
    })
  }
}

// @desc    Get single registration
// @route   GET /api/registrations/:id
// @access  Private
export const getRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('user', 'name email studentId department')
      .populate('event', 'title description dateTime venue organizer')
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      })
    }
    
    // Check if user owns this registration or is admin
    if (registration.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }
    
    res.status(200).json({
      success: true,
      data: { registration }
    })
    
  } catch (error) {
    console.error('Get registration error:', error)
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registration'
    })
  }
}

// @desc    Cancel registration
// @route   PUT /api/registrations/:id/cancel
// @access  Private
export const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('event', 'title dateTime')
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      })
    }
    
    // Check if user owns this registration
    if (registration.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }
    
    // Check if registration can be cancelled
    if (registration.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Registration is already cancelled'
      })
    }
    
    if (registration.status === 'attended') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel registration after attending the event'
      })
    }
    
    // Check cancellation deadline (e.g., 24 hours before event)
    const eventStart = new Date(registration.event.dateTime.start)
    const now = new Date()
    const hoursUntilEvent = (eventStart - now) / (1000 * 60 * 60)
    
    if (hoursUntilEvent < 24) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel registration less than 24 hours before the event'
      })
    }
    
    // Cancel registration
    await registration.cancelRegistration(req.body.reason)
    
    // Remove event from user's registered events
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { registeredEvents: registration.event._id }
    })
    
    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully',
      data: { registration }
    })
    
  } catch (error) {
    console.error('Cancel registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to cancel registration'
    })
  }
}

// @desc    Submit feedback for attended event
// @route   PUT /api/registrations/:id/feedback
// @access  Private
export const submitFeedback = async (req, res) => {
  try {
    const { rating, comments, responses } = req.body
    
    const registration = await Registration.findById(req.params.id)
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      })
    }
    
    // Check if user owns this registration
    if (registration.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }
    
    // Check if user attended the event
    if (registration.status !== 'attended') {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be submitted for attended events'
      })
    }
    
    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      })
    }
    
    // Submit feedback
    await registration.submitFeedback(rating, comments, responses)
    
    res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: { registration }
    })
    
  } catch (error) {
    console.error('Submit feedback error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback'
    })
  }
}

// @desc    Get event registrations (Admin only)
// @route   GET /api/registrations/event/:eventId
// @access  Private/Admin
export const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params
    const { status, page = 1, limit = 20 } = req.query
    
    // Check if event exists
    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      })
    }
    
    const query = { event: eventId }
    if (status) query.status = status
    
    const skip = (page - 1) * limit
    
    const registrations = await Registration.find(query)
      .populate('user', 'name email studentId department phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
    
    const totalRegistrations = await Registration.countDocuments(query)
    const stats = await Registration.getStats(eventId)
    
    res.status(200).json({
      success: true,
      data: {
        event: {
          id: event._id,
          title: event.title,
          dateTime: event.dateTime
        },
        registrations,
        stats: stats[0] || { totalRegistrations: 0, statusCounts: [] },
        pagination: {
          current: parseInt(page),
          total: totalRegistrations,
          pages: Math.ceil(totalRegistrations / limit)
        }
      }
    })
    
  } catch (error) {
    console.error('Get event registrations error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event registrations'
    })
  }
}

// @desc    Mark attendance (Admin only)
// @route   PUT /api/registrations/:id/attendance
// @access  Private/Admin
export const markAttendance = async (req, res) => {
  try {
    const { checkIn = true, notes } = req.body
    
    const registration = await Registration.findById(req.params.id)
      .populate('user', 'name email')
      .populate('event', 'title')
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      })
    }
    
    await registration.markAttendance(checkIn, notes)
    
    res.status(200).json({
      success: true,
      message: `Attendance ${checkIn ? 'marked' : 'updated'} successfully`,
      data: { registration }
    })
    
  } catch (error) {
    console.error('Mark attendance error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to mark attendance'
    })
  }
}

// @desc    Get registration analytics (Admin only)
// @route   GET /api/registrations/analytics
// @access  Private/Admin
export const getRegistrationAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, eventId } = req.query
    
    const stats = await Registration.getStats(eventId)
    
    // Get registrations by date range
    const dateRangeStart = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const dateRangeEnd = endDate || new Date()
    
    const recentRegistrations = await Registration.getByDateRange(
      dateRangeStart,
      dateRangeEnd,
      eventId
    ).limit(10)
    
    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || { totalRegistrations: 0, statusCounts: [] },
        recentRegistrations,
        dateRange: {
          start: dateRangeStart,
          end: dateRangeEnd
        }
      }
    })
    
  } catch (error) {
    console.error('Get registration analytics error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registration analytics'
    })
  }
}
