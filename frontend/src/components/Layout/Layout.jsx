import React from 'react'
import { Box, AppBar, Toolbar, Typography, Button, IconButton, Avatar, Menu, MenuItem, Container } from '@mui/material'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AccountCircle, Event, Dashboard, ExitToApp } from '@mui/icons-material'
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
                  
                  <IconButton
                    size="large"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    {user?.avatar ? (
                      <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
                    ) : (
                      <AccountCircle />
                    )}
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <ExitToApp sx={{ mr: 1 }} />
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
