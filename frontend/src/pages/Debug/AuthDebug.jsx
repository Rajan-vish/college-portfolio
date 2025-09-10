import React, { useState } from 'react'
import { Box, Card, CardContent, Typography, TextField, Button, Alert, Stack } from '@mui/material'
import api from '../../services/api'

const AuthDebug = () => {
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const testDirectApiCall = async () => {
    setLoading(true)
    setResult('')
    setError('')
    
    try {
      console.log('Testing direct API call...')
      const response = await api.post('/auth/login', {
        email: 'admin@bitmesra.ac.in',
        password: 'admin123'
      })
      console.log('Direct API call successful:', response.data)
      setResult(JSON.stringify(response.data, null, 2))
    } catch (err) {
      console.error('Direct API call failed:', err)
      setError(err.response?.data?.message || err.message || 'API call failed')
    } finally {
      setLoading(false)
    }
  }

  const testBackendHealth = async () => {
    setLoading(true)
    setResult('')
    setError('')
    
    try {
      console.log('Testing backend health...')
      const response = await fetch('http://localhost:5000/health')
      const data = await response.json()
      console.log('Backend health check:', data)
      setResult(JSON.stringify(data, null, 2))
    } catch (err) {
      console.error('Backend health check failed:', err)
      setError('Backend health check failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const testProxyConnection = async () => {
    setLoading(true)
    setResult('')
    setError('')
    
    try {
      console.log('Testing proxy connection...')
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'admin@bitmesra.ac.in',
          password: 'admin123'
        })
      })
      const data = await response.json()
      console.log('Proxy connection test:', data)
      setResult(JSON.stringify(data, null, 2))
    } catch (err) {
      console.error('Proxy connection test failed:', err)
      setError('Proxy connection failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Authentication Debug Panel
      </Typography>
      
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Test Backend Health</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Test direct connection to backend server
            </Typography>
            <Button 
              variant="outlined" 
              onClick={testBackendHealth}
              disabled={loading}
            >
              Test Backend Health
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Test Proxy Connection</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Test login through Vite proxy
            </Typography>
            <Button 
              variant="outlined" 
              onClick={testProxyConnection}
              disabled={loading}
            >
              Test Proxy Login
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Test Direct API Call</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Test login using axios instance
            </Typography>
            <Button 
              variant="outlined" 
              onClick={testDirectApiCall}
              disabled={loading}
            >
              Test Direct API Login
            </Button>
          </CardContent>
        </Card>

        {loading && (
          <Alert severity="info">Testing...</Alert>
        )}

        {error && (
          <Alert severity="error">
            <Typography variant="subtitle2">Error:</Typography>
            <Typography variant="body2">{error}</Typography>
          </Alert>
        )}

        {result && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Result:</Typography>
              <TextField
                fullWidth
                multiline
                rows={10}
                value={result}
                variant="outlined"
                sx={{ fontFamily: 'monospace' }}
              />
            </CardContent>
          </Card>
        )}
      </Stack>
    </Box>
  )
}

export default AuthDebug
