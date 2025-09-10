import React, { useState } from 'react'
import { Box, Card, CardContent, Typography, TextField, Button, Link, Alert, CircularProgress } from '@mui/material'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const { showNotification } = useNotification()
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = location.state?.from?.pathname || '/dashboard'

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

    console.log('Login: Starting login process with:', { email: formData.email })

    try {
      console.log('Login: Calling auth login function...')
      await login(formData)
      console.log('Login: Login successful, navigating...')
      showNotification('Login successful!', 'success')
      navigate(from, { replace: true })
    } catch (error) {
      console.error('Login: Login failed:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Login failed'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
            Login
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit}>
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
            <Box textAlign="center">
              <Link component={RouterLink} to="/register">
                Don't have an account? Sign up
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Login
