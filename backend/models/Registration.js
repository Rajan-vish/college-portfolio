import mongoose from 'mongoose'

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event is required']
  },
  registrationData: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'attended', 'no-show'],
    default: 'confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['not-required', 'pending', 'paid', 'failed', 'refunded'],
    default: 'not-required'
  },
  paymentDetails: {
    transactionId: String,
    amount: Number,
    paymentMethod: String,
    paidAt: Date
  },
  attendance: {
    checkedIn: {
      type: Boolean,
      default: false
    },
    checkInTime: Date,
    checkedOut: {
      type: Boolean,
      default: false
    },
    checkOutTime: Date,
    notes: String
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String,
    responses: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    },
    submittedAt: Date
  },
  notifications: {
    reminderSent24h: {
      type: Boolean,
      default: false
    },
    reminderSent1h: {
      type: Boolean,
      default: false
    },
    confirmationSent: {
      type: Boolean,
      default: false
    },
    cancellationSent: {
      type: Boolean,
      default: false
    }
  },
  metadata: {
    registrationSource: {
      type: String,
      enum: ['web', 'mobile', 'admin', 'bulk'],
      default: 'web'
    },
    ipAddress: String,
    userAgent: String,
    referrer: String
  },
  qrCode: {
    type: String,
    unique: true,
    sparse: true
  },
  certificate: {
    issued: {
      type: Boolean,
      default: false
    },
    issuedAt: Date,
    certificateUrl: String
  }
}, {
  timestamps: true
})

// Compound index to prevent duplicate registrations
registrationSchema.index({ user: 1, event: 1 }, { unique: true })

// Indexes for better performance
registrationSchema.index({ status: 1 })
registrationSchema.index({ paymentStatus: 1 })
registrationSchema.index({ 'attendance.checkedIn': 1 })
registrationSchema.index({ createdAt: -1 })

// Generate QR code before saving
registrationSchema.pre('save', function(next) {
  if (!this.qrCode && this.isNew) {
    // Generate unique QR code data
    this.qrCode = `REG-${this._id}-${Date.now()}`
  }
  next()
})

// Update event participant count
registrationSchema.post('save', async function() {
  if (this.status === 'confirmed') {
    await mongoose.model('Event').findByIdAndUpdate(
      this.event,
      { $inc: { 'registration.currentParticipants': 1 } }
    )
  }
})

// Update event participant count on status change
registrationSchema.post('findOneAndUpdate', async function(doc) {
  if (doc && this.getUpdate().$set && this.getUpdate().$set.status) {
    const oldStatus = doc.status
    const newStatus = this.getUpdate().$set.status
    
    if (oldStatus === 'confirmed' && newStatus !== 'confirmed') {
      await mongoose.model('Event').findByIdAndUpdate(
        doc.event,
        { $inc: { 'registration.currentParticipants': -1 } }
      )
    } else if (oldStatus !== 'confirmed' && newStatus === 'confirmed') {
      await mongoose.model('Event').findByIdAndUpdate(
        doc.event,
        { $inc: { 'registration.currentParticipants': 1 } }
      )
    }
  }
})

// Virtual for registration summary
registrationSchema.virtual('summary').get(function() {
  return {
    id: this._id,
    userId: this.user,
    eventId: this.event,
    status: this.status,
    paymentStatus: this.paymentStatus,
    registeredAt: this.createdAt,
    attended: this.attendance.checkedIn,
    qrCode: this.qrCode
  }
})

// Instance method to mark attendance
registrationSchema.methods.markAttendance = function(checkIn = true, notes = '') {
  if (checkIn) {
    this.attendance.checkedIn = true
    this.attendance.checkInTime = new Date()
    if (this.status === 'confirmed') {
      this.status = 'attended'
    }
  } else {
    this.attendance.checkedOut = true
    this.attendance.checkOutTime = new Date()
  }
  
  if (notes) {
    this.attendance.notes = notes
  }
  
  return this.save()
}

// Instance method to submit feedback
registrationSchema.methods.submitFeedback = function(rating, comments, responses = {}) {
  this.feedback.rating = rating
  this.feedback.comments = comments
  this.feedback.responses = responses
  this.feedback.submittedAt = new Date()
  
  return this.save()
}

// Instance method to cancel registration
registrationSchema.methods.cancelRegistration = function(reason = '') {
  this.status = 'cancelled'
  this.metadata.cancellationReason = reason
  this.metadata.cancelledAt = new Date()
  
  return this.save()
}

// Static method to get registration statistics
registrationSchema.statics.getStats = async function(eventId = null) {
  const matchCondition = eventId ? { event: eventId } : {}
  
  return await this.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalFee: { $sum: '$paymentDetails.amount' }
      }
    },
    {
      $group: {
        _id: null,
        statusCounts: {
          $push: {
            status: '$_id',
            count: '$count',
            totalFee: '$totalFee'
          }
        },
        totalRegistrations: { $sum: '$count' },
        totalRevenue: { $sum: '$totalFee' }
      }
    }
  ])
}

// Static method to get registrations by date range
registrationSchema.statics.getByDateRange = function(startDate, endDate, eventId = null) {
  const matchCondition = {
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }
  
  if (eventId) {
    matchCondition.event = eventId
  }
  
  return this.find(matchCondition)
    .populate('user', 'name email studentId department')
    .populate('event', 'title dateTime.start venue.name')
    .sort({ createdAt: -1 })
}

// Static method for bulk operations
registrationSchema.statics.bulkUpdateStatus = async function(registrationIds, status) {
  return await this.updateMany(
    { _id: { $in: registrationIds } },
    { 
      $set: { 
        status,
        updatedAt: new Date()
      }
    }
  )
}

// Ensure virtual fields are serialized
registrationSchema.set('toJSON', { virtuals: true })
registrationSchema.set('toObject', { virtuals: true })

export default mongoose.model('Registration', registrationSchema)
