import React, { useState } from 'react'
import { Box, Card, CardContent, Typography, TextField, Button, Link, Alert, CircularProgress, MenuItem } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    department: '',
    year: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { register } = useAuth()
  const { showNotification } = useNotification()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    console.log('Register: Starting registration process with:', { email: formData.email, name: formData.name })

    try {
      console.log('Register: Calling auth register function...')
      await register(formData)
      console.log('Register: Registration successful, navigating...')
      showNotification('Registration successful!', 'success')
      navigate('/dashboard')
    } catch (error) {
      console.error('Register: Registration failed:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Card sx={{ maxWidth: 500, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
            Register
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              name="studentId"
              label="Student ID"
              value={formData.studentId}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              name="department"
              label="Department"
              value={formData.department}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              select
              name="year"
              label="Year"
              value={formData.year}
              onChange={handleChange}
              margin="normal"
            >
              <MenuItem value="1">First Year</MenuItem>
              <MenuItem value="2">Second Year</MenuItem>
              <MenuItem value="3">Third Year</MenuItem>
              <MenuItem value="4">Fourth Year</MenuItem>
            </TextField>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
            <Box textAlign="center">
              <Link component={RouterLink} to="/login">
                Already have an account? Sign in
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Register
