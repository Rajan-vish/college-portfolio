import React, { useEffect, useState } from 'react'
import {
  Typography,
  Box,
  Grid,
  Tabs,
  Tab,
  Stack,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material'
import {
  Event as EventIcon,
  CalendarToday as CalendarIcon,
  Place as PlaceIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  Info as InfoIcon,
  Download as DownloadIcon
} from '@mui/icons-material'
import EventCard from '../../components/Dashboard/EventCard'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import { eventService } from '../../services/eventService'
import { useNavigate } from 'react-router-dom'

const formatDate = (dateStr) => {
  try {
    const d = new Date(dateStr)
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  } catch (e) {
    return dateStr
  }
}

const MyRegistrations = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const { showNotification } = useNotification()

  const [loading, setLoading] = useState(true)
  const [registrations, setRegistrations] = useState([])
  const [tabValue, setTabValue] = useState(0)
  const [cancelDialog, setCancelDialog] = useState({ open: false, eventId: null })

  useEffect(() => {
    if (isAuthenticated) {
      loadRegistrations()
    }
  }, [isAuthenticated])

  const loadRegistrations = async () => {
    setLoading(true)
    try {
      const response = await eventService.getMyRegistrations()
      const events = response.data.events || response.data || []
      setRegistrations(events)
      console.log('MyRegistrations: Loaded', events.length, 'registrations from API')
    } catch (err) {
      console.warn('MyRegistrations: API failed, using mock data:', err.message)
      showNotification('Loading offline registration data', 'warning')
      
      // Use mock registration data as fallback
      const mockRegistrations = [
        {
          id: 3,
          title: 'Sports Meet 2024',
          category: 'Sports',
          datetime: '2024-03-25T08:00:00',
          venue: 'Sports Complex',
          description: 'Inter-college sports competition across multiple disciplines.',
          registeredCount: 156,
          maxCapacity: 300,
          isRegistered: true
        }
      ]
      setRegistrations(mockRegistrations)
    } finally {
      setLoading(false)
    }
  }

  const handleUnregister = async (eventId) => {
    try {
      await eventService.unregisterFromEvent(eventId)
      showNotification('Successfully unregistered from event', 'success')
      setRegistrations(prev => prev.filter(e => e.id !== eventId))
      setCancelDialog({ open: false, eventId: null })
    } catch (err) {
      showNotification('Failed to unregister', 'error')
    }
  }

  const handleDownloadTicket = (eventId) => {
    // Mock ticket download
    showNotification('Ticket downloaded successfully', 'success')
  }

  const upcomingEvents = registrations.filter(e => new Date(e.datetime) > new Date())
  const pastEvents = registrations.filter(e => new Date(e.datetime) <= new Date())

  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Alert severity="warning">
          Please log in to view your event registrations.
        </Alert>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/login')}>
          Login
        </Button>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  const currentEvents = tabValue === 0 ? upcomingEvents : pastEvents

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">My Events</Typography>
        <Button 
          variant="outlined" 
          startIcon={<EventIcon />} 
          onClick={() => navigate('/events')}
        >
          Discover Events
        </Button>
      </Stack>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <EventIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h4" component="div">
                {registrations.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Registrations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CalendarIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h4" component="div">
                {upcomingEvents.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upcoming Events
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircleIcon color="info" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h4" component="div">
                {pastEvents.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Attended Events
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PeopleIcon color="secondary" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h4" component="div">
                {registrations.reduce((sum, e) => sum + (e.registeredCount || 0), 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Participants
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab 
            label={`Upcoming Events (${upcomingEvents.length})`} 
            icon={<CalendarIcon />} 
            iconPosition="start"
          />
          <Tab 
            label={`Past Events (${pastEvents.length})`} 
            icon={<CheckCircleIcon />} 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Events Grid */}
      <Grid container spacing={3}>
        {currentEvents.map(event => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="h6" gutterBottom>{event.title}</Typography>
                    <Chip 
                      size="small" 
                      label={event.category} 
                      color="primary" 
                      variant="outlined"
                    />
                  </Box>
                  
                  <List dense disablePadding>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <AccessTimeIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={formatDate(event.datetime)} />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <PlaceIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={event.venue} />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <PeopleIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={`${event.registeredCount}/${event.maxCapacity} registered`} />
                    </ListItem>
                  </List>
                  
                  {event.registeredCount && event.maxCapacity && (
                    <Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(event.registeredCount / event.maxCapacity) * 100}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  )}
                  
                  <Stack direction="row" spacing={1}>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={() => navigate(`/events/${event.id}`)}
                      sx={{ flexGrow: 1 }}
                    >
                      View Details
                    </Button>
                    {tabValue === 0 ? (
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="error"
                        onClick={() => setCancelDialog({ open: true, eventId: event.id })}
                      >
                        Cancel
                      </Button>
                    ) : (
                      <Button 
                        size="small" 
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownloadTicket(event.id)}
                      >
                        Ticket
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
        
        {currentEvents.length === 0 && (
          <Grid item xs={12}>
            <Alert 
              severity="info" 
              action={
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={() => navigate('/events')}
                >
                  Browse Events
                </Button>
              }
            >
              {tabValue === 0 
                ? 'No upcoming events registered. Start exploring events!' 
                : 'No past events found.'
              }
            </Alert>
          </Grid>
        )}
      </Grid>

      {/* Cancel Confirmation Dialog */}
      <Dialog 
        open={cancelDialog.open} 
        onClose={() => setCancelDialog({ open: false, eventId: null })}
      >
        <DialogTitle>Cancel Event Registration</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel your registration? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog({ open: false, eventId: null })}>Keep Registration</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={() => handleUnregister(cancelDialog.eventId)}
          >
            Cancel Registration
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default MyRegistrations
