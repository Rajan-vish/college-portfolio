import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: [
      'Academic',
      'Cultural',
      'Sports',
      'Technical',
      'Social',
      'Workshop',
      'Seminar',
      'Competition',
      'Festival',
      'Other'
    ]
  },
  tags: [{
    type: String,
    trim: true
  }],
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organizerInfo: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    department: String,
    contact: String
  },
  venue: {
    name: {
      type: String,
      required: [true, 'Venue name is required']
    },
    address: String,
    capacity: {
      type: Number,
      required: [true, 'Venue capacity is required'],
      min: [1, 'Capacity must be at least 1']
    },
    location: {
      latitude: Number,
      longitude: Number
    }
  },
  dateTime: {
    start: {
      type: Date,
      required: [true, 'Start date and time is required']
    },
    end: {
      type: Date,
      required: [true, 'End date and time is required']
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Registration deadline is required']
    }
  },
  registration: {
    isRequired: {
      type: Boolean,
      default: true
    },
    maxParticipants: {
      type: Number,
      default: 0 // 0 means unlimited
    },
    currentParticipants: {
      type: Number,
      default: 0
    },
    fee: {
      type: Number,
      default: 0,
      min: [0, 'Fee cannot be negative']
    },
    fields: [{
      name: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['text', 'email', 'number', 'select', 'checkbox', 'textarea'],
        required: true
      },
      required: {
        type: Boolean,
        default: false
      },
      options: [String] // For select fields
    }]
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'department'],
    default: 'public'
  },
  targetAudience: [{
    type: String,
    enum: ['all', 'first-year', 'second-year', 'third-year', 'fourth-year', 'faculty', 'staff']
  }],
  images: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number
  }],
  requirements: [String],
  prizes: [{
    position: String,
    prize: String,
    value: Number
  }],
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    interests: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    }
  },
  feedback: {
    enabled: {
      type: Boolean,
      default: true
    },
    questions: [{
      question: String,
      type: {
        type: String,
        enum: ['rating', 'text', 'multiple-choice'],
        default: 'text'
      },
      required: {
        type: Boolean,
        default: false
      }
    }]
  },
  notifications: {
    reminder24h: {
      type: Boolean,
      default: true
    },
    reminder1h: {
      type: Boolean,
      default: true
    },
    updateNotifications: {
      type: Boolean,
      default: true
    }
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    interval: Number,
    endDate: Date
  }
}, {
  timestamps: true
})

// Indexes for better performance
eventSchema.index({ title: 'text', description: 'text', tags: 'text' })
eventSchema.index({ category: 1 })
eventSchema.index({ status: 1 })
eventSchema.index({ 'dateTime.start': 1 })
eventSchema.index({ 'dateTime.registrationDeadline': 1 })
eventSchema.index({ organizer: 1 })
eventSchema.index({ visibility: 1 })

// Generate slug from title
eventSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  }
  
  // Validate end date is after start date
  if (this.dateTime.end <= this.dateTime.start) {
    return next(new Error('End date must be after start date'))
  }
  
  if (this.dateTime.registrationDeadline > this.dateTime.start) {
    return next(new Error('Registration deadline must be before event start'))
  }
  
  next()
})

// Virtual for event duration
eventSchema.virtual('duration').get(function() {
  const start = new Date(this.dateTime.start)
  const end = new Date(this.dateTime.end)
  return end - start // Duration in milliseconds
})

// Virtual for registration status
eventSchema.virtual('registrationStatus').get(function() {
  const now = new Date()
  const deadline = new Date(this.dateTime.registrationDeadline)
  const eventStart = new Date(this.dateTime.start)
  
  if (now > eventStart) return 'closed'
  if (now > deadline) return 'expired'
  if (this.registration.maxParticipants > 0 && 
      this.registration.currentParticipants >= this.registration.maxParticipants) {
    return 'full'
  }
  return 'open'
})

// Virtual for availability
eventSchema.virtual('isAvailable').get(function() {
  return this.registrationStatus === 'open'
})

// Static method to get upcoming events
eventSchema.statics.getUpcoming = function(limit = 10) {
  return this.find({
    status: 'published',
    'dateTime.start': { $gte: new Date() }
  })
  .sort({ 'dateTime.start': 1 })
  .limit(limit)
  .populate('organizer', 'name email')
}

// Static method to get events by category
eventSchema.statics.getByCategory = function(category, limit = 10) {
  return this.find({
    category,
    status: 'published',
    'dateTime.start': { $gte: new Date() }
  })
  .sort({ 'dateTime.start': 1 })
  .limit(limit)
  .populate('organizer', 'name email')
}

// Static method for event analytics
eventSchema.statics.getAnalytics = async function(timeframe = '30d') {
  const daysBack = parseInt(timeframe.replace('d', ''))
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - daysBack)
  
  return await this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalViews: { $sum: '$analytics.views' },
        totalRegistrations: { $sum: '$registration.currentParticipants' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ])
}

// Instance method to increment views
eventSchema.methods.incrementViews = function() {
  this.analytics.views += 1
  return this.save()
}

// Instance method to check if user can register
eventSchema.methods.canUserRegister = function(userId) {
  // Check if registration is open
  if (this.registrationStatus !== 'open') {
    return { canRegister: false, reason: 'Registration is not open' }
  }
  
  // Check if already registered (this would be checked in the registration model)
  return { canRegister: true }
}

// Ensure virtual fields are serialized
eventSchema.set('toJSON', { virtuals: true })
eventSchema.set('toObject', { virtuals: true })

export default mongoose.model('Event', eventSchema)
