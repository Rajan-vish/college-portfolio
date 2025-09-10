import User from '../models/User.js'
import { generateToken } from '../middleware/auth.js'

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, role, studentId, department, year, phone } = req.body
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      })
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      })
    }
    
    // Check if student ID is provided and unique for students
    if (role !== 'admin' && studentId) {
      const existingStudentId = await User.findOne({ studentId })
      if (existingStudentId) {
        return res.status(400).json({
          success: false,
          message: 'Student ID already exists'
        })
      }
    }
    
    // Create user
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || 'student'
    }
    
    // Add optional fields
    if (studentId) userData.studentId = studentId
    if (department) userData.department = department
    if (year) userData.year = year
    if (phone) userData.phone = phone
    
    const user = await User.create(userData)
    
    // Generate token
    const token = generateToken(user._id)
    
    // Remove password from response
    user.password = undefined
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.profile,
        token
      }
    })
    
  } catch (error) {
    console.error('Register error:', error)
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: messages[0] || 'Validation error'
      })
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      })
    }
    
    // Find user and include password
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }
    
    // Check password
    const isPasswordMatch = await user.comparePassword(password)
    
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }
    
    // Update last login
    user.lastLogin = new Date()
    await user.save()
    
    // Generate token
    const token = generateToken(user._id)
    
    // Remove password from response
    user.password = undefined
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.profile,
        token
      }
    })
    
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    })
  }
}

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('registeredEvents', 'title dateTime.start venue.name category')
    
    res.status(200).json({
      success: true,
      data: {
        user: {
          ...user.profile,
          registeredEvents: user.registeredEvents
        }
      }
    })
    
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    })
  }
}

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ['name', 'phone', 'department', 'year', 'avatar', 'preferences']
    const updates = {}
    
    // Filter allowed updates
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key]
      }
    })
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid updates provided'
      })
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { 
        new: true, 
        runValidators: true 
      }
    )
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.profile
      }
    })
    
  } catch (error) {
    console.error('Update profile error:', error)
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: messages[0] || 'Validation error'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    })
  }
}

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    
    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      })
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      })
    }
    
    // Get user with password
    const user = await User.findById(req.user.id).select('+password')
    
    // Check current password
    const isCurrentPasswordMatch = await user.comparePassword(currentPassword)
    
    if (!isCurrentPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      })
    }
    
    // Update password
    user.password = newPassword
    await user.save()
    
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    })
    
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    })
  }
}

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    // In a stateless JWT system, logout is typically handled client-side
    // However, we can track this for analytics or perform cleanup
    
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    })
    
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    })
  }
}

// @desc    Get user statistics (admin only)
// @route   GET /api/auth/stats
// @access  Private/Admin
export const getUserStats = async (req, res) => {
  try {
    const stats = await User.getStats()
    
    const totalUsers = await User.countDocuments()
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt')
    
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        stats,
        recentUsers
      }
    })
    
  } catch (error) {
    console.error('Get user stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get user statistics'
    })
  }
}
