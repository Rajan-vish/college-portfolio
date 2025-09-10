import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Fab,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import {
  Event as EventIcon,
  PersonAdd as PersonAddIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Notifications as NotificationIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
  Add as AddIcon,
  School as SchoolIcon,
  EmojiEvents as TrophyIcon,
  Groups as GroupsIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

import EventCard from '../../components/Dashboard/EventCard'
import StatCard from '../../components/Dashboard/StatCard'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import { mockEventService } from '../../services/eventService'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { showNotification } = useNotification()

  // State management
  const [stats, setStats] = useState({
    totalEvents: 0,
    registrations: 0,
    upcomingEvents: 0,
    completedEvents: 0
  })
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [createEventOpen, setCreateEventOpen] = useState(false)

  // Load initial data
  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Load stats, events, and announcements concurrently
      const [statsResponse, eventsResponse, announcementsResponse] = await Promise.all([
        mockEventService.getEventStats(),
        mockEventService.getAllEvents({ limit: 4 }),
        mockEventService.getAnnouncements()
      ])

      setStats(statsResponse.data)
      setUpcomingEvents(eventsResponse.data.events)
      setAnnouncements(announcementsResponse.data.announcements)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      showNotification('Failed to load dashboard data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`)
  }

  const handleRegisterForEvent = async (eventId) => {
    if (!isAuthenticated) {
      showNotification('Please login to register for events', 'warning')
      navigate('/login')
      return
    }

    try {
      await mockEventService.registerForEvent(eventId)
      showNotification('Successfully registered for event!', 'success')
      // Update the event in the local state
      setUpcomingEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, isRegistered: true, registeredCount: event.registeredCount + 1 }
          : event
      ))
    } catch (error) {
      console.error('Registration failed:', error)
      showNotification('Registration failed. Please try again.', 'error')
    }
  }

  const handleUnregisterFromEvent = async (eventId) => {
    try {
      await mockEventService.unregisterFromEvent(eventId)
      showNotification('Successfully unregistered from event', 'info')
      // Update the event in the local state
      setUpcomingEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, isRegistered: false, registeredCount: Math.max(0, event.registeredCount - 1) }
          : event
      ))
    } catch (error) {
      console.error('Unregistration failed:', error)
      showNotification('Unregistration failed. Please try again.', 'error')
    }
  }

  const handleQuickAction = (action) => {
    switch (action) {
      case 'create-event':
        setCreateEventOpen(true)
        break
      case 'my-registrations':
        navigate('/my-registrations')
        break
      case 'event-calendar':
        navigate('/events')
        break
      default:
        break
    }
  }

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category)
    // In a real app, you would filter events based on category
    // For now, we'll just show all events
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    try {
      const response = await mockEventService.getAllEvents({ search: searchQuery })
      setUpcomingEvents(response.data.events)
      showNotification(`Found ${response.data.events.length} events`, 'info')
    } catch (error) {
      showNotification('Search failed', 'error')
    }
  }

  const handleRefresh = () => {
    loadDashboardData()
    showNotification('Dashboard refreshed', 'info')
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="xl">
        {/* Hero Section */}
        <Box sx={{ mb: 4 }}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              background: (theme) => theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
                : 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              border: (theme) => theme.palette.mode === 'dark' 
                ? '1px solid rgba(255,255,255,0.1)' 
                : 'none'
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                  <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                    Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''} to BIT Mesra Events
                  </Typography>
                  {user?.department && (
                    <Typography variant="subtitle1" sx={{ opacity: 0.8, mb: 1 }}>
                      {user.department} • {user.year || 'Student'}
                    </Typography>
                  )}
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Discover and participate in exciting college events, competitions, and cultural programs
                  </Typography>
                </Box>
                <IconButton 
                  onClick={handleRefresh} 
                  sx={{ color: 'white', bgcolor: alpha('#ffffff', 0.1) }}
                >
                  <RefreshIcon />
                </IconButton>
              </Stack>
              
              {/* Search Bar */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  sx={{
                    maxWidth: 500,
                    bgcolor: 'white',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { border: 'none' },
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button onClick={handleSearch} size="small">
                          Search
                        </Button>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="contained" 
                  size="large" 
                  sx={{ bgcolor: 'white', color: 'primary.main' }}
                  onClick={() => navigate('/events')}
                >
                  Explore Events
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  sx={{ borderColor: 'white', color: 'white' }}
                  onClick={() => handleQuickAction('event-calendar')}
                >
                  View Calendar
                </Button>
              </Stack>
            </Box>
            {/* Background decoration */}
            <Box sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              bgcolor: alpha('#ffffff', 0.1),
              zIndex: 1
            }} />
          </Paper>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Events"
              value={stats.totalEvents}
              icon={EventIcon}
              color="primary"
              trend={{ direction: 'up', value: '+12%' }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Registrations"
              value={stats.registrations.toLocaleString()}
              icon={PersonAddIcon}
              color="success"
              trend={{ direction: 'up', value: '+25%' }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Upcoming Events"
              value={stats.upcomingEvents}
              icon={CalendarIcon}
              color="warning"
              subtitle="This month"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Completed"
              value={stats.completedEvents}
              icon={TrophyIcon}
              color="secondary"
              subtitle="This semester"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Upcoming Events */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 3, height: 'fit-content' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Upcoming Events
                </Typography>
                <Button endIcon={<ArrowForwardIcon />} size="small">
                  View All
                </Button>
              </Box>
              <Grid container spacing={3}>
                {upcomingEvents.map((event) => (
                  <Grid item xs={12} sm={6} key={event.id}>
                    <EventCard
                      {...event}
                      onClick={() => handleEventClick(event.id)}
                      onRegister={handleRegisterForEvent}
                      onUnregister={handleUnregisterFromEvent}
                    />
                  </Grid>
                ))}
                {upcomingEvents.length === 0 && (
                  <Grid item xs={12}>
                    <Alert severity="info" sx={{ textAlign: 'center' }}>
                      No events found. Try adjusting your search or check back later.
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Quick Actions */}
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Quick Actions
                </Typography>
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<EventIcon />}
                    sx={{ justifyContent: 'flex-start', py: 1.5 }}
                    onClick={() => handleQuickAction('create-event')}
                  >
                    Create Event
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<GroupsIcon />}
                    sx={{ justifyContent: 'flex-start', py: 1.5 }}
                    onClick={() => handleQuickAction('my-registrations')}
                  >
                    My Registrations
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<CalendarIcon />}
                    sx={{ justifyContent: 'flex-start', py: 1.5 }}
                    onClick={() => handleQuickAction('event-calendar')}
                  >
                    Event Calendar
                  </Button>
                </Stack>
              </Paper>

              {/* Announcements */}
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Recent Announcements
                </Typography>
                <List disablePadding>
                  {announcements.map((announcement, index) => (
                    <React.Fragment key={announcement.id}>
                      <ListItem disablePadding sx={{ py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <NotificationIcon
                            fontSize="small"
                            color={announcement.priority === 'high' ? 'error' : announcement.priority === 'medium' ? 'warning' : 'primary'}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={announcement.title}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                {announcement.message}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {announcement.time}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < announcements.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>

              {/* Featured Categories */}
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Event Categories
                </Typography>
                <Stack spacing={1}>
                  {[
                    { name: 'Technical', count: 15, color: 'primary' },
                    { name: 'Cultural', count: 12, color: 'secondary' },
                    { name: 'Sports', count: 8, color: 'success' },
                    { name: 'Academic', count: 7, color: 'warning' }
                  ].map((category) => (
                    <Box 
                      key={category.name} 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        py: 0.5,
                        cursor: 'pointer',
                        borderRadius: 1,
                        px: 1,
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                      onClick={() => handleCategoryFilter(category.name)}
                    >
                      <Chip
                        label={category.name}
                        color={category.color}
                        variant={selectedCategory === category.name ? "filled" : "outlined"}
                        size="small"
                        clickable
                      />
                      <Typography variant="body2" color="text.secondary">
                        {category.count} events
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          aria-label="add event"
          onClick={() => setCreateEventOpen(true)}
        >
          <AddIcon />
        </Fab>

        {/* Create Event Dialog */}
        <Dialog 
          open={createEventOpen} 
          onClose={() => setCreateEventOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Create New Event</DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 2 }}>
              Event creation functionality is in development. This will redirect you to the full event creation form.
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Features that will be available:
            </Typography>
            <Box component="ul" sx={{ mt: 1, pl: 2 }}>
              <Typography component="li" variant="body2">Event details and description</Typography>
              <Typography component="li" variant="body2">Date, time, and venue selection</Typography>
              <Typography component="li" variant="body2">Category and registration management</Typography>
              <Typography component="li" variant="body2">Image upload and event promotion</Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateEventOpen(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={() => {
                setCreateEventOpen(false)
                navigate('/admin/events/create')
              }}
            >
              Go to Event Creation
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default Dashboard
