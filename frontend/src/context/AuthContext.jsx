import React, { createContext, useContext, useReducer, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  isAuthenticated: false
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true }
    case 'AUTH_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token
      }
    case 'AUTH_ERROR':
    case 'LOGOUT':
      return { ...state, loading: false, isAuthenticated: false, user: null, token: null }
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    if (state.token) {
      localStorage.setItem('token', state.token)
      api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`
      // Load user profile on app start if token exists
      loadUser()
    } else {
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    }
  }, [state.token])

  const loadUser = async () => {
    if (!state.token) return
    
    try {
      dispatch({ type: 'AUTH_START' })
      const response = await api.get('/auth/profile')
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: response.data.data.user, token: state.token }
      })
    } catch (error) {
      console.error('Load user error:', error)
      dispatch({ type: 'AUTH_ERROR' })
    }
  }

  const login = async (credentials) => {
    try {
      dispatch({ type: 'AUTH_START' })
      const response = await api.post('/auth/login', credentials)
      const { user, token } = response.data.data
      
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } })
      return { success: true }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR' })
      throw error
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' })
      const response = await api.post('/auth/register', userData)
      const { user, token } = response.data.data
      
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } })
      return { success: true }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR' })
      throw error
    }
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  const updateProfile = async (updates) => {
    try {
      const response = await api.put('/auth/profile', updates)
      dispatch({ type: 'UPDATE_USER', payload: response.data.data.user })
      return { success: true }
    } catch (error) {
      throw error
    }
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    loadUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
