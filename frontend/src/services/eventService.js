import api from './api'

// Event CRUD operations
export const eventService = {
  // Get all events
  getAllEvents: async (params = {}) => {
    try {
      const response = await api.get('/events', { params })
      return response.data
    } catch (error) {
      console.error('Get events error:', error)
      throw error
    }
  },

  // Get event by ID
  getEventById: async (id) => {
    try {
      const response = await api.get(`/events/${id}`)
      return response.data
    } catch (error) {
      console.error('Get event error:', error)
      throw error
    }
  },

  // Create new event
  createEvent: async (eventData) => {
    try {
      const response = await api.post('/events', eventData)
      return response.data
    } catch (error) {
      console.error('Create event error:', error)
      throw error
    }
  },

  // Update event
  updateEvent: async (id, eventData) => {
    try {
      const response = await api.put(`/events/${id}`, eventData)
      return response.data
    } catch (error) {
      console.error('Update event error:', error)
      throw error
    }
  },

  // Delete event
  deleteEvent: async (id) => {
    try {
      const response = await api.delete(`/events/${id}`)
      return response.data
    } catch (error) {
      console.error('Delete event error:', error)
      throw error
    }
  },

  // Event registration operations
  registerForEvent: async (eventId) => {
    try {
      const response = await api.post(`/events/${eventId}/register`)
      return response.data
    } catch (error) {
      console.error('Event registration error:', error)
      throw error
    }
  },

  // Unregister from event
  unregisterFromEvent: async (eventId) => {
    try {
      const response = await api.delete(`/events/${eventId}/register`)
      return response.data
    } catch (error) {
      console.error('Event unregistration error:', error)
      throw error
    }
  },

  // Get user's registered events
  getMyRegistrations: async () => {
    try {
      const response = await api.get('/events/my-registrations')
      return response.data
    } catch (error) {
      console.error('Get registrations error:', error)
      throw error
    }
  },

  // Get events by category
  getEventsByCategory: async (category) => {
    try {
      const response = await api.get(`/events?category=${category}`)
      return response.data
    } catch (error) {
      console.error('Get events by category error:', error)
      throw error
    }
  },

  // Search events
  searchEvents: async (query) => {
    try {
      const response = await api.get(`/events/search?q=${query}`)
      return response.data
    } catch (error) {
      console.error('Search events error:', error)
      throw error
    }
  },

  // Get event statistics
  getEventStats: async () => {
    try {
      const response = await api.get('/events/stats')
      return response.data
    } catch (error) {
      console.error('Get event stats error:', error)
      throw error
    }
  },

  // Get announcements
  getAnnouncements: async () => {
    try {
      const response = await api.get('/announcements')
      return response.data
    } catch (error) {
      console.error('Get announcements error:', error)
      throw error
    }
  }
}

// Mock data service (fallback when API is not available)
export const mockEventService = {
  events: [
    {
      id: 1,
      title: 'Technical Symposium 2024',
      category: 'Technical',
      datetime: '2024-03-15T09:00:00',
      venue: 'Main Auditorium',
      description: 'Annual technical symposium featuring innovative projects and research presentations.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop',
      status: 'open',
      registeredCount: 245,
      maxCapacity: 500,
      registrationDeadline: '2024-03-10T23:59:59',
      organizer: 'Technical Club',
      isRegistered: false
    },
    {
      id: 2,
      title: 'Cultural Night - Bitotsav',
      category: 'Cultural',
      datetime: '2024-03-20T18:00:00',
      venue: 'Open Air Theatre',
      description: 'Grand cultural celebration with music, dance, and entertainment.',
      image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&h=300&fit=crop',
      status: 'open',
      registeredCount: 892,
      maxCapacity: 1000,
      registrationDeadline: '2024-03-18T23:59:59',
      organizer: 'Cultural Committee',
      isRegistered: false
    },
    {
      id: 3,
      title: 'Sports Meet 2024',
      category: 'Sports',
      datetime: '2024-03-25T08:00:00',
      venue: 'Sports Complex',
      description: 'Inter-college sports competition across multiple disciplines.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop',
      status: 'open',
      registeredCount: 156,
      maxCapacity: 300,
      registrationDeadline: '2024-03-20T23:59:59',
      organizer: 'Sports Council',
      isRegistered: true
    },
    {
      id: 4,
      title: 'Hackathon - CodeCrush',
      category: 'Technical',
      datetime: '2024-04-01T10:00:00',
      venue: 'Computer Center',
      description: '48-hour coding marathon to build innovative solutions.',
      image: 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=500&h=300&fit=crop',
      status: 'upcoming',
      registeredCount: 78,
      maxCapacity: 100,
      registrationDeadline: '2024-03-28T23:59:59',
      organizer: 'Coding Club',
      isRegistered: false
    },
    {
      id: 5,
      title: 'Photography Contest - Shutterbugs',
      category: 'Cultural',
      datetime: '2024-03-12T14:00:00',
      venue: 'Campus Garden',
      description: 'Capture the beauty of college life through your lens.',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=300&fit=crop',
      status: 'open',
      registeredCount: 89,
      maxCapacity: 150,
      registrationDeadline: '2024-03-10T23:59:59',
      organizer: 'Photography Club',
      isRegistered: true
    },
    {
      id: 6,
      title: 'AI/ML Workshop',
      category: 'Technical',
      datetime: '2024-04-05T10:00:00',
      venue: 'AI Lab',
      description: 'Hands-on workshop on machine learning fundamentals and applications.',
      image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=500&h=300&fit=crop',
      status: 'upcoming',
      registeredCount: 45,
      maxCapacity: 60,
      registrationDeadline: '2024-04-01T23:59:59',
      organizer: 'AI Society',
      isRegistered: false
    },
    {
      id: 7,
      title: 'Annual Food Festival',
      category: 'Cultural',
      datetime: '2024-03-30T11:00:00',
      venue: 'Central Lawn',
      description: 'Taste delicious food from various cultures and cuisines.',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&h=300&fit=crop',
      status: 'open',
      registeredCount: 234,
      maxCapacity: 400,
      registrationDeadline: '2024-03-28T23:59:59',
      organizer: 'Cultural Committee',
      isRegistered: true
    },
    {
      id: 8,
      title: 'Debate Championship',
      category: 'Academic',
      datetime: '2024-04-10T15:00:00',
      venue: 'Debate Hall',
      description: 'Inter-college debate championship on current affairs.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop',
      status: 'open',
      registeredCount: 32,
      maxCapacity: 40,
      registrationDeadline: '2024-04-08T23:59:59',
      organizer: 'Debate Society',
      isRegistered: false
    },
    {
      id: 9,
      title: 'Basketball Tournament',
      category: 'Sports',
      datetime: '2024-03-18T09:00:00',
      venue: 'Basketball Court',
      description: 'Annual inter-department basketball championship.',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&h=300&fit=crop',
      status: 'open',
      registeredCount: 16,
      maxCapacity: 20,
      registrationDeadline: '2024-03-16T23:59:59',
      organizer: 'Sports Council',
      isRegistered: false
    },
    {
      id: 10,
      title: 'Startup Pitch Competition',
      category: 'Academic',
      datetime: '2024-04-15T13:00:00',
      venue: 'Innovation Hub',
      description: 'Present your startup ideas to industry experts.',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500&h=300&fit=crop',
      status: 'upcoming',
      registeredCount: 28,
      maxCapacity: 50,
      registrationDeadline: '2024-04-12T23:59:59',
      organizer: 'Entrepreneurship Cell',
      isRegistered: true
    }
  ],

  announcements: [
    {
      id: 1,
      title: 'Registration deadline extended',
      message: 'Technical Symposium registration deadline has been extended to March 10th.',
      time: '2 hours ago',
      priority: 'high',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 2,
      title: 'New venue for Cultural Night',
      message: 'Cultural Night venue changed to Open Air Theatre for better experience.',
      time: '1 day ago',
      priority: 'medium',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: 3,
      title: 'Winner announcement',
      message: 'Photography contest winners will be announced this Friday.',
      time: '2 days ago',
      priority: 'low',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }
  ],

  stats: {
    totalEvents: 52,
    registrations: 1850,
    upcomingEvents: 10,
    completedEvents: 42
  },

  getAllEvents: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
    let filteredEvents = [...mockEventService.events]
    
    if (params.category) {
      filteredEvents = filteredEvents.filter(event => 
        event.category.toLowerCase() === params.category.toLowerCase()
      )
    }
    
    if (params.search) {
      filteredEvents = filteredEvents.filter(event =>
        event.title.toLowerCase().includes(params.search.toLowerCase()) ||
        event.description.toLowerCase().includes(params.search.toLowerCase())
      )
    }
    
    return { data: { events: filteredEvents, total: filteredEvents.length } }
  },

  getEventById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const event = mockEventService.events.find(e => e.id === parseInt(id))
    if (!event) throw new Error('Event not found')
    return { data: { event } }
  },

  createEvent: async (eventData) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const newEvent = {
      id: mockEventService.events.length + 1,
      ...eventData,
      registeredCount: 0,
      isRegistered: false,
      status: 'open'
    }
    mockEventService.events.push(newEvent)
    return { data: { event: newEvent } }
  },

  registerForEvent: async (eventId) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const event = mockEventService.events.find(e => e.id === parseInt(eventId))
    if (!event) throw new Error('Event not found')
    event.isRegistered = true
    event.registeredCount += 1
    return { data: { message: 'Successfully registered for event' } }
  },

  unregisterFromEvent: async (eventId) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const event = mockEventService.events.find(e => e.id === parseInt(eventId))
    if (!event) throw new Error('Event not found')
    event.isRegistered = false
    event.registeredCount = Math.max(0, event.registeredCount - 1)
    return { data: { message: 'Successfully unregistered from event' } }
  },

  getMyRegistrations: async () => {
    await new Promise(resolve => setTimeout(resolve, 400))
    const registeredEvents = mockEventService.events.filter(e => e.isRegistered)
    return { data: { events: registeredEvents } }
  },

  getEventStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return { data: mockEventService.stats }
  },

  getAnnouncements: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return { data: { announcements: mockEventService.announcements } }
  }
}

export default eventService
