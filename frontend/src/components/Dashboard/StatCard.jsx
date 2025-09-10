import React from 'react'
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material'
import { alpha } from '@mui/material/styles'

const StatCard = ({ title, value, icon, color = 'primary', trend, subtitle }) => {
  const IconComponent = icon

  return (
    <Card sx={{
      height: '100%',
      borderRadius: 3,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      background: `linear-gradient(135deg, ${alpha(color === 'primary' ? '#1976d2' : color === 'secondary' ? '#dc004e' : color === 'success' ? '#2e7d32' : '#ed6c02', 0.1)} 0%, transparent 100%)`
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Typography variant="caption" sx={{
                color: trend.direction === 'up' ? 'success.main' : 'error.main',
                display: 'flex',
                alignItems: 'center',
                mt: 0.5
              }}>
                {trend.direction === 'up' ? '↗' : '↘'} {trend.value}
              </Typography>
            )}
          </Box>
          {IconComponent && (
            <Avatar sx={{
              bgcolor: alpha(color === 'primary' ? '#1976d2' : color === 'secondary' ? '#dc004e' : color === 'success' ? '#2e7d32' : '#ed6c02', 0.1),
              color: color === 'primary' ? 'primary.main' : color === 'secondary' ? 'secondary.main' : color === 'success' ? 'success.main' : 'warning.main',
              width: 56,
              height: 56
            }}>
              <IconComponent />
            </Avatar>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default StatCard
