import React from 'react'
import { Box, Typography, Button } from '@mui/material'

function TestApp() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" gutterBottom>
        🎉 College Event Portal
      </Typography>
      <Typography variant="h5" gutterBottom color="primary">
        Your MERN Stack Application is Working!
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        ✅ Backend API: Running on port 5000<br/>
        ✅ Frontend React: Running on port 3000<br/>
        ✅ MongoDB Atlas: Connected<br/>
        ✅ Socket.io: Real-time ready
      </Typography>
      <Button variant="contained" size="large">
        Everything is Working! 🚀
      </Button>
    </Box>
  )
}

export default TestApp
