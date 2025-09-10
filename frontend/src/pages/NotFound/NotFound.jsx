import React from 'react'
import { Typography, Box, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { Home } from '@mui/icons-material'

const NotFound = () => {
  return (
    <Box textAlign="center" py={8}>
      <Typography variant="h1" component="h1" gutterBottom color="primary">
        404
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        The page you're looking for doesn't exist.
      </Typography>
      <Button
        variant="contained"
        startIcon={<Home />}
        component={Link}
        to="/"
        size="large"
      >
        Go Home
      </Button>
    </Box>
  )
}

export default NotFound
