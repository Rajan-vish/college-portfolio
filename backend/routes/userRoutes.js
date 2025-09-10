import express from 'express'
import User from '../models/User.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication and admin privileges
router.use(protect, adminOnly)

// @desc    Get all users with filtering and pagination
// @route   GET /api/users
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, role, verified, search } = req.query
    
    // Build query
    const query = {}
    if (role) query.role = role
    if (verified !== undefined) query.isVerified = verified === 'true'
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ]
    }
    
    const skip = (page - 1) * limit
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('registeredEvents', 'title dateTime.start')
    
    const totalUsers = await User.countDocuments(query)
    
    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          current: parseInt(page),
          total: totalUsers,
          pages: Math.ceil(totalUsers / limit)
        }
      }
    })
    
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    })
  }
})

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('registeredEvents', 'title dateTime venue category')
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }
    
    res.status(200).json({
      success: true,
      data: { user }
    })
    
  } catch (error) {
    console.error('Get user error:', error)
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    })
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
router.put('/:id', async (req, res) => {
  try {
    const allowedUpdates = ['name', 'email', 'role', 'isVerified', 'department', 'year', 'phone']
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
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password')
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    })
    
  } catch (error) {
    console.error('Update user error:', error)
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
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
      message: 'Failed to update user'
    })
  }
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }
    
    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      })
    }
    
    await User.findByIdAndDelete(req.params.id)
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    })
    
  } catch (error) {
    console.error('Delete user error:', error)
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    })
  }
})

export default router
