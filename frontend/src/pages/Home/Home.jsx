import React from 'react'
import { Box, Typography, Button, Container, Grid, Card, CardContent, CardActions } from '@mui/material'
import { Link } from 'react-router-dom'
import { Event, People, Schedule, Analytics } from '@mui/icons-material'

const Home = () => {
  const features = [
    {
      icon: <Event fontSize="large" color="primary" />,
      title: 'Discover Events',
      description: 'Browse and explore upcoming college events across all categories and departments.'
    },
    {
      icon: <People fontSize="large" color="primary" />,
      title: 'Easy Registration',
      description: 'Register for events with just a few clicks and get instant confirmations.'
    },
    {
      icon: <Schedule fontSize="large" color="primary" />,
      title: 'Real-time Updates',
      description: 'Receive instant notifications about event changes and reminders.'
    },
    {
      icon: <Analytics fontSize="large" color="primary" />,
      title: 'Event Management',
      description: 'Comprehensive dashboard for organizers to manage events and track analytics.'
    }
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 8,
          mb: 6,
          borderRadius: 2
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Typography variant="h2" component="h1" gutterBottom fontWeight={700}>
              College Event Portal
            </Typography>
            <Typography variant="h5" component="p" sx={{ mb: 4, opacity: 0.9 }}>
              Discover, register, and manage college events all in one place
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/events"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'grey.100' }
                }}
              >
                Browse Events
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/register"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': { borderColor: 'grey.100', bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Get Started
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Why Choose Our Platform?
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
          Everything you need for seamless event management and discovery
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  p: 2
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 6, borderRadius: 2 }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h4" component="h2" gutterBottom>
              Ready to Get Started?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Join thousands of students already using our platform to discover and participate in college events.
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/register"
            >
              Create Account
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Home
