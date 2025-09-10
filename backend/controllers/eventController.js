import Event from '../models/Event.js'
import Registration from '../models/Registration.js'

// @desc    Get all events with filtering, sorting, and pagination
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status = 'published',
      search,
      sortBy = 'dateTime.start',
      sortOrder = 'asc',
      upcoming = true
    } = req.query

    // Build query
    const query = {}
    
    if (status) query.status = status
    if (category) query.category = category
    if (upcoming === 'true') {
      query['dateTime.start'] = { $gte: new Date() }
    }
    
    // Text search
    if (search) {
      query.$text = { $search: search }
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit
    const sortOptions = {}
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1
    
    // Execute query
    const events = await Event.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('organizer', 'name email department')
      .select('-__v')
    
    // Get total count for pagination
    const totalEvents = await Event.countDocuments(query)
    const totalPages = Math.ceil(totalEvents / limit)
    
    res.status(200).json({
      success: true,
      data: {
        events,
        pagination: {
          current: parseInt(page),
          pages: totalPages,
          total: totalEvents,
          limit: parseInt(limit)
        }
      }
    })
    
  } catch (error) {
    console.error('Get events error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events'
    })
  }
}

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email department phone')
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      })
    }
    
    // Increment view count if user is not the organizer
    if (!req.user || req.user.id !== event.organizer._id.toString()) {
      await event.incrementViews()
    }
    
    // Check if user is registered (if authenticated)
    let isRegistered = false
    let registration = null
    
    if (req.user) {
      registration = await Registration.findOne({
        user: req.user.id,
        event: event._id
      })
      isRegistered = !!registration
    }
    
    res.status(200).json({
      success: true,
      data: {
        event,
        isRegistered,
        registration: registration?.summary
      }
    })
    
  } catch (error) {
    console.error('Get event error:', error)
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event'
    })
  }
}

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = async (req, res) => {
  try {
    // Add organizer info
    req.body.organizer = req.user.id
    req.body.organizerInfo = {
      name: req.user.name,
      email: req.user.email,
      department: req.user.department,
      contact: req.user.phone
    }
    
    const event = await Event.create(req.body)
    await event.populate('organizer', 'name email')
    
    // Emit real-time notification for new event
    const io = req.app.get('io')
    io.emit('new-event', {
      event: event,
      message: `New event "${event.title}" has been published!`
    })
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event }
    })
    
  } catch (error) {
    console.error('Create event error:', error)
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: messages[0] || 'Validation error'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create event'
    })
  }
}

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin or Event Organizer
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      })
    }
    
    // Check if user is organizer or admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own events.'
      })
    }
    
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('organizer', 'name email')
    
    // Emit real-time notification for event update
    const io = req.app.get('io')
    io.emit('event-updated', {
      event: updatedEvent,
      message: `Event "${updatedEvent.title}" has been updated!`
    })
    
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: { event: updatedEvent }
    })
    
  } catch (error) {
    console.error('Update event error:', error)
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      })
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: messages[0] || 'Validation error'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update event'
    })
  }
}

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin or Event Organizer
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      })
    }
    
    // Check if user is organizer or admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own events.'
      })
    }
    
    // Check if event has registrations
    const registrationCount = await Registration.countDocuments({ event: event._id })
    
    if (registrationCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete event with existing registrations. Cancel the event instead.'
      })
    }
    
    await Event.findByIdAndDelete(req.params.id)
    
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    })
    
  } catch (error) {
    console.error('Delete event error:', error)
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete event'
    })
  }
}

// @desc    Get events by category
// @route   GET /api/events/category/:category
// @access  Public
export const getEventsByCategory = async (req, res) => {
  try {
    const { category } = req.params
    const { limit = 10 } = req.query
    
    const events = await Event.getByCategory(category, parseInt(limit))
    
    res.status(200).json({
      success: true,
      data: {
        category,
        count: events.length,
        events
      }
    })
    
  } catch (error) {
    console.error('Get events by category error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events by category'
    })
  }
}

// @desc    Get upcoming events
// @route   GET /api/events/upcoming
// @access  Public
export const getUpcomingEvents = async (req, res) => {
  try {
    const { limit = 10 } = req.query
    
    const events = await Event.getUpcoming(parseInt(limit))
    
    res.status(200).json({
      success: true,
      data: {
        count: events.length,
        events
      }
    })
    
  } catch (error) {
    console.error('Get upcoming events error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upcoming events'
    })
  }
}

// @desc    Get event analytics
// @route   GET /api/events/analytics
// @access  Private/Admin
export const getEventAnalytics = async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query
    
    const analytics = await Event.getAnalytics(timeframe)
    
    // Additional statistics
    const totalEvents = await Event.countDocuments()
    const publishedEvents = await Event.countDocuments({ status: 'published' })
    const draftEvents = await Event.countDocuments({ status: 'draft' })
    const completedEvents = await Event.countDocuments({ status: 'completed' })
    
    res.status(200).json({
      success: true,
      data: {
        overview: {
          total: totalEvents,
          published: publishedEvents,
          draft: draftEvents,
          completed: completedEvents
        },
        analytics,
        timeframe
      }
    })
    
  } catch (error) {
    console.error('Get event analytics error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event analytics'
    })
  }
}

// @desc    Search events
// @route   GET /api/events/search
// @access  Public
export const searchEvents = async (req, res) => {
  try {
    const { q, category, dateFrom, dateTo, page = 1, limit = 10 } = req.query
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      })
    }
    
    const query = {
      status: 'published',
      $text: { $search: q }
    }
    
    if (category) query.category = category
    
    if (dateFrom || dateTo) {
      query['dateTime.start'] = {}
      if (dateFrom) query['dateTime.start'].$gte = new Date(dateFrom)
      if (dateTo) query['dateTime.start'].$lte = new Date(dateTo)
    }
    
    const skip = (page - 1) * limit
    
    const events = await Event.find(query, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('organizer', 'name email')
    
    const totalResults = await Event.countDocuments(query)
    
    res.status(200).json({
      success: true,
      data: {
        query: q,
        results: events,
        pagination: {
          current: parseInt(page),
          total: totalResults,
          pages: Math.ceil(totalResults / limit)
        }
      }
    })
    
  } catch (error) {
    console.error('Search events error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to search events'
    })
  }
}
