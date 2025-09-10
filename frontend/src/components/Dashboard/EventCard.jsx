import React, { useState } from 'react'
import { Card, CardActionArea, CardContent, CardMedia, Typography, Box, Chip, Stack, Button, CircularProgress, LinearProgress } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PlaceIcon from '@mui/icons-material/Place'
import PeopleIcon from '@mui/icons-material/People'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const formatDate = (dateStr) => {
  try {
    const d = new Date(dateStr)
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  } catch (e) {
    return dateStr
  }
}

const EventCard = ({
  id,
  title,
  image,
  category,
  datetime,
  venue,
  description,
  status = 'Register Now',
  isRegistered = false,
  registeredCount = 0,
  maxCapacity = 100,
  organizer,
  onClick,
  onRegister,
  onUnregister,
}) => {
  const [registrationLoading, setRegistrationLoading] = useState(false)
  
  const handleRegistration = async (e) => {
    e.stopPropagation()
    setRegistrationLoading(true)
    try {
      if (isRegistered) {
        await onUnregister?.(id)
      } else {
        await onRegister?.(id)
      }
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setRegistrationLoading(false)
    }
  }
  
  const registrationPercentage = (registeredCount / maxCapacity) * 100
  return (
    <Card sx={{
      borderRadius: 3,
      overflow: 'hidden',
      bgcolor: 'background.paper',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: (theme) => theme.palette.mode === 'dark' 
        ? '0 8px 24px rgba(0,0,0,0.4)' 
        : '0 8px 24px rgba(0,0,0,0.08)',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      border: (theme) => theme.palette.mode === 'dark' 
        ? '1px solid rgba(255,255,255,0.1)' 
        : '1px solid rgba(0,0,0,0.05)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: (theme) => theme.palette.mode === 'dark'
          ? '0 12px 32px rgba(0,0,0,0.6)'
          : '0 12px 32px rgba(0,0,0,0.12)'
      }
    }}>
      <CardActionArea onClick={onClick} sx={{ alignItems: 'stretch', height: '100%' }}>
        {image && (
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="160"
              image={image}
              alt={title}
            />
            {isRegistered && (
              <Box sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'success.main',
                color: 'white',
                borderRadius: '50%',
                p: 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircleIcon fontSize="small" />
              </Box>
            )}
          </Box>
        )}
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            {category && (
              <Chip size="small" label={category} color="primary" variant="outlined" />
            )}
            {status && (
              <Chip 
                size="small" 
                label={status} 
                color={status.toLowerCase().includes('closed') ? 'default' : 'secondary'} 
              />
            )}
          </Stack>
          
          <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 700, mb: 1 }}>
            {title}
          </Typography>
          
          {organizer && (
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              by {organizer}
            </Typography>
          )}
          
          {description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {description}
            </Typography>
          )}
          
          <Stack direction="column" spacing={1} sx={{ mb: 1.5 }}>
            {datetime && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                <EventIcon fontSize="small" />
                <Typography variant="caption">{formatDate(datetime)}</Typography>
              </Box>
            )}
            {venue && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                <PlaceIcon fontSize="small" />
                <Typography variant="caption">{venue}</Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
              <PeopleIcon fontSize="small" />
              <Typography variant="caption">
                {registeredCount}/{maxCapacity} registered
              </Typography>
            </Box>
          </Stack>
          
          {/* Registration Progress Bar */}
          <Box sx={{ mb: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={registrationPercentage} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  bgcolor: registrationPercentage > 80 ? 'warning.main' : 'primary.main'
                }
              }} 
            />
          </Box>
          
          <Stack direction="row" spacing={1} alignItems="center">
            <Button 
              size="small" 
              variant="outlined" 
              color="primary"
              onClick={onClick}
              sx={{ flexGrow: 1 }}
            >
              View Details
            </Button>
            {status !== 'closed' && (
              <Button
                size="small"
                variant={isRegistered ? "outlined" : "contained"}
                color={isRegistered ? "error" : "primary"}
                onClick={handleRegistration}
                disabled={registrationLoading || (!isRegistered && registrationPercentage >= 100)}
                sx={{ minWidth: 100 }}
                startIcon={registrationLoading ? <CircularProgress size={16} /> : null}
              >
                {registrationLoading ? '' : isRegistered ? 'Unregister' : 'Register'}
              </Button>
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default EventCard

