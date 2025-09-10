// Test authentication functionality
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

const testAuth = async () => {
  try {
    console.log('Testing login...')
    const loginResponse = await api.post('/auth/login', {
      email: 'admin@bitmesra.ac.in',
      password: 'admin123'
    })
    console.log('Login successful:', loginResponse.data)
    
    // Test token
    const token = loginResponse.data.data.token
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    
    console.log('Testing profile fetch...')
    const profileResponse = await api.get('/auth/profile')
    console.log('Profile successful:', profileResponse.data)
    
  } catch (error) {
    console.error('Auth test failed:', error.response?.data || error.message)
  }
}

testAuth()
