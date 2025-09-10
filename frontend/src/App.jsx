import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

// Context
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { SocketProvider } from './context/SocketContext'

// Layout Components
import Layout from './components/Layout/Layout'
import ProtectedRoute from './components/Auth/ProtectedRoute'

// Pages
import Home from './pages/Home/Home'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Events from './pages/Events/Events'
import EventDetails from './pages/Events/EventDetails'
import Dashboard from './pages/Dashboard/Dashboard'
import AdminDashboard from './pages/Admin/AdminDashboard'
import Profile from './pages/Profile/Profile'
import MyRegistrations from './pages/Registrations/MyRegistrations'
// import AuthDebug from './pages/Debug/AuthDebug'
import NotFound from './pages/NotFound/NotFound'

// Create dark theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
    },
    secondary: {
      main: '#f48fb1',
      light: '#fce4ec',
      dark: '#e91e63',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
    divider: '#333333',
    action: {
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.12)',
      disabled: 'rgba(255, 255, 255, 0.3)',
    },
    success: {
      main: '#66bb6a',
      dark: '#4caf50',
    },
    warning: {
      main: '#ffa726',
      dark: '#ff9800',
    },
    error: {
      main: '#ef5350',
      dark: '#f44336',
    },
    info: {
      main: '#29b6f6',
      dark: '#03a9f4',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    h1: { fontWeight: 700, color: '#ffffff' },
    h2: { fontWeight: 600, color: '#ffffff' },
    h3: { fontWeight: 600, color: '#ffffff' },
    h4: { fontWeight: 500, color: '#ffffff' },
    h5: { fontWeight: 500, color: '#ffffff' },
    h6: { fontWeight: 500, color: '#ffffff' },
  },
  components: {
    MuiButton: { 
      styleOverrides: { 
        root: { 
          textTransform: 'none', 
          fontWeight: 500,
          borderRadius: 8,
        } 
      } 
    },
    MuiCard: { 
      styleOverrides: { 
        root: { 
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          backgroundColor: '#1e1e1e',
          border: '1px solid #333333',
        } 
      } 
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          border: '1px solid #333333',
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#444444',
            },
            '&:hover fieldset': {
              borderColor: '#666666',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#90caf9',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#333333',
          color: '#ffffff',
          '&.MuiChip-colorPrimary': {
            backgroundColor: '#1976d2',
            color: '#ffffff',
          },
        },
      },
    },
  },
})

// Create a client
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <NotificationProvider>
            <SocketProvider>
              <Router>
                <Layout>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/events/:id" element={<EventDetails />} />
                    {/* <Route path="/debug" element={<AuthDebug />} /> */}

                    {/* Protected Routes */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-registrations"
                      element={
                        <ProtectedRoute>
                          <MyRegistrations />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin Routes */}
                    <Route
                      path="/admin/*"
                      element={
                        <ProtectedRoute adminOnly>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </Router>
            </SocketProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
