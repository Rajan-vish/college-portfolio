import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
  Pagination,
  CircularProgress,
  Alert
} from '@mui/material'
import { Search as SearchIcon, FilterList as FilterIcon, Refresh as RefreshIcon, CalendarToday as CalendarIcon } from '@mui/icons-material'
import EventCard from '../../components/Dashboard/EventCard'
import { useNotification } from '../../context/NotificationContext'
import { useAuth } from '../../context/AuthContext'
import { eventService } from '../../services/eventService'
import { useNavigate } from 'react-router-dom'

const Events = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { showNotification } = useNotification()

  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [page, setPage] = useState(1)
  const pageSize = 8

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    setLoading(true)
    try {
      const response = await eventService.getAllEvents()
      const events = response.data.events || response.data || []
      setEvents(events)
      console.log('Events: Loaded', events.length, 'events from API')
    } catch (err) {
      console.warn('Events: API failed, using mock data:', err.message)
      showNotification('Loading offline events data', 'warning')
      
      // Use mock events data as fallback
      const mockEvents = [
        {
          id: 1,
          title: 'Technical Symposium 2024',
          category: 'Technical',
          datetime: '2024-03-15T09:00:00',
          venue: 'Main Auditorium',
          description: 'Annual technical symposium featuring innovative projects.',
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop',
          registeredCount: 245,
          maxCapacity: 500,
          isRegistered: false,
          status: 'open'
        },
        {
          id: 2,
          title: 'Cultural Night - Bitotsav',
          category: 'Cultural',
          datetime: '2024-03-20T18:00:00',
          venue: 'Open Air Theatre',
          description: 'Grand cultural celebration with music, dance, and entertainment.',
          image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&h=300&fit=crop',
          registeredCount: 892,
          maxCapacity: 1000,
          isRegistered: false,
          status: 'open'
        },
        {
          id: 3,
          title: 'Sports Meet 2024',
          category: 'Sports',
          datetime: '2024-03-25T08:00:00',
          venue: 'Sports Complex',
          description: 'Inter-college sports competition across multiple disciplines.',
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop',
          registeredCount: 156,
          maxCapacity: 300,
          isRegistered: true,
          status: 'open'
        },
        {
          id: 4,
          title: 'Hackathon - CodeCrush',
          category: 'Technical',
          datetime: '2024-04-01T10:00:00',
          venue: 'Computer Center',
          description: '48-hour coding marathon to build innovative solutions.',
          image: 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=500&h=300&fit=crop',
          registeredCount: 78,
          maxCapacity: 100,
          isRegistered: false,
          status: 'upcoming'
        }
      ]
      setEvents(mockEvents)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = useMemo(() => {
    let list = [...events]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q))
    }
    if (category !== 'All') {
      list = list.filter(e => e.category.toLowerCase() === category.toLowerCase())
    }
    if (status !== 'all') {
      if (status === 'open') list = list.filter(e => e.status === 'open')
      if (status === 'upcoming') list = list.filter(e => e.status === 'upcoming')
      if (status === 'closed') list = list.filter(e => e.status === 'closed')
      if (status === 'registered') list = list.filter(e => e.isRegistered)
    }
    if (sortBy === 'date') {
      list.sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
    } else if (sortBy === 'popularity') {
      list.sort((a, b) => b.registeredCount - a.registeredCount)
    }
    return list
  }, [events, searchQuery, category, status, sortBy])

  const maxPage = Math.max(1, Math.ceil(filteredEvents.length / pageSize))
  const paginated = filteredEvents.slice((page - 1) * pageSize, page * pageSize)

  const handleRegister = async (eventId) => {
    if (!isAuthenticated) {
      showNotification('Please login to register', 'warning')
      navigate('/login')
      return
    }
    try {
      await eventService.registerForEvent(eventId)
      showNotification('Registered successfully', 'success')
      setEvents(prev => prev.map(e => e.id === eventId ? { ...e, isRegistered: true, registeredCount: e.registeredCount + 1 } : e))
    } catch (err) {
      showNotification('Registration failed', 'error')
    }
  }

  const handleUnregister = async (eventId) => {
    try {
      await eventService.unregisterFromEvent(eventId)
      showNotification('Unregistered successfully', 'info')
      setEvents(prev => prev.map(e => e.id === eventId ? { ...e, isRegistered: false, registeredCount: Math.max(0, e.registeredCount - 1) } : e))
    } catch (err) {
      showNotification('Unregistration failed', 'error')
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} sx={{ mb: 2 }}>
        <Typography variant="h4">All Events</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <TextField 
            size="small" 
            placeholder="Search events" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && setPage(1)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Category</InputLabel>
            <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
              {['All', 'Technical', 'Cultural', 'Sports', 'Academic'].map(c => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="upcoming">Upcoming</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
              <MenuItem value="registered">Registered</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Sort by</InputLabel>
            <Select value={sortBy} label="Sort by" onChange={(e) => setSortBy(e.target.value)}>
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="popularity">Popularity</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadEvents}>Refresh</Button>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {paginated.map(event => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
            <EventCard 
              {...event}
              onClick={() => navigate(`/events/${event.id}`)}
              onRegister={handleRegister}
              onUnregister={handleUnregister}
            />
          </Grid>
        ))}
        {paginated.length === 0 && (
          <Grid item xs={12}>
            <Alert severity="info">No events match your filters.</Alert>
          </Grid>
        )}
      </Grid>

      {filteredEvents.length > pageSize && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination count={maxPage} page={page} onChange={(_, val) => setPage(val)} color="primary" />
        </Box>
      )}
    </Box>
  )
}

export default Events
