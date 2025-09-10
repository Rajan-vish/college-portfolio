import React from 'react'
import { Box, AppBar, Toolbar, Typography, Button, IconButton, Avatar, Menu, MenuItem, Container, Chip } from '@mui/material'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AccountCircle, Event, Dashboard, ExitToApp, SwapHoriz } from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'

const Layout = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleClose()
    navigate('/')
  }

  const toggleAuthState = () => {
    if (isAuthenticated) {
      logout()
    } else {
      // Mock login for development
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@bitmesra.ac.in',
        role: 'student',
        department: 'Computer Science & Engineering',
        year: '3rd Year',
        rollNumber: '20BCS001'
      }
      // This would normally call the login function, but for development we'll just set auth state
      // login({ email: 'john.doe@bitmesra.ac.in', password: 'password' })
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" elevation={1}>
        <Container maxWidth="xl">
          <Toolbar>
            <Event sx={{ mr: 2 }} />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                flexGrow: 1,
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 700
              }}
            >
              College Events
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              
              <Button
                color="inherit"
                component={Link}
                to="/events"
                sx={{ fontWeight: isActive('/events') ? 600 : 400 }}
              >
                Events
              </Button>

              {isAuthenticated ? (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/dashboard"
                    sx={{ fontWeight: isActive('/dashboard') ? 600 : 400 }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/my-registrations"
                    sx={{ fontWeight: isActive('/my-registrations') ? 600 : 400 }}
                  >
                    My Events
                  </Button>
                  {user?.role === 'admin' && (
                    <Button
                      color="inherit"
                      component={Link}
                      to="/admin"
                      sx={{ fontWeight: location.pathname.startsWith('/admin') ? 600 : 400 }}
                    >
                      Admin
                    </Button>
                  )}
                  
                  {user?.name && (
                    <Typography variant="body2" sx={{ mr: 2, opacity: 0.9 }}>
                      Welcome, {user.name.split(' ')[0]}!
                    </Typography>
                  )}
                  <IconButton
                    size="large"
                    onClick={handleMenu}
                    color="inherit"
                    sx={{ 
                      border: '2px solid rgba(255,255,255,0.2)',
                      '&:hover': { borderColor: 'rgba(255,255,255,0.4)' }
                    }}
                  >
                    {user?.avatar ? (
                      <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
                    ) : (
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                        {user?.name?.charAt(0) || 'U'}
                      </Avatar>
                    )}
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    sx={{ mt: 1 }}
                  >
                    <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                      <AccountCircle sx={{ mr: 2 }} />
                      Profile
                    </MenuItem>
                    <MenuItem onClick={() => { navigate('/my-registrations'); handleClose(); }}>
                      <Event sx={{ mr: 2 }} />
                      My Events
                    </MenuItem>
                    <MenuItem onClick={() => { navigate('/dashboard'); handleClose(); }}>
                      <Dashboard sx={{ mr: 2 }} />
                      Dashboard
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <ExitToApp sx={{ mr: 2 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/login">
                    Login
                  </Button>
                  <Button color="inherit" component={Link} to="/register">
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
    </Box>
  )
}

export default Layout
