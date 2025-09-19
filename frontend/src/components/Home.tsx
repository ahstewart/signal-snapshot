import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button, useTheme, useMediaQuery } from '@mui/material';

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#002b5c', background: 'linear-gradient(135deg, #003366 0%, #0057b8 100%)' }}>
      {/* Site Header */}
      <AppBar
        position="fixed"
        color="primary"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: 'inherit',
              textDecoration: 'none',
              mr: 3,
              letterSpacing: 1,
              '&:hover': {
                textDecoration: 'none',
                cursor: 'pointer',
                opacity: 0.9
              }
            }}
          >
            Signal Snapshot
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Main Content */}
      <Box
        sx={{
          maxWidth: 800,
          mx: 'auto',
          py: isMobile ? 6 : 10,
          px: isMobile ? 2 : 4,
          textAlign: 'center',
          borderRadius: 4,
          boxShadow: 6,
          background: 'rgba(255,255,255,0.95)',
          mt: 10, // add margin to account for fixed AppBar
        }}
      >
        <Typography
          variant={isMobile ? 'h3' : 'h2'}
          component="h1"
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #0099ff 0%, #0057b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3,
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
            letterSpacing: 1,
          }}
        >
          Signal Snapshot
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, color: '#0057b8', fontWeight: 500 }}>
          Visualize your Signal conversations in a whole different light
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 500, color: '#0099ff' }}>
          A simple, lightweight tool for Signal users
        </Typography>
        <Box sx={{ textAlign: 'left', mb: 4 }}>
          <Typography variant="h6" sx={{ color: '#0057b8', fontWeight: 600, mt: 3, mb: 1 }}>
            What is it?
          </Typography>
          <Typography paragraph sx={{ fontSize: '1.1rem', mb: 3, color: '#222', pl: 2 }}>
            A simple web app that helps you see analytics and trends for your Signal conversations. Understand your messaging patterns, engagement levels, and communication habits—all while keeping your data private.
          </Typography>

          <Typography variant="h6" sx={{ color: '#0057b8', fontWeight: 600, mt: 4, mb: 1 }}>
            How does it work?
          </Typography>
          <Typography paragraph sx={{ fontSize: '1.1rem', mb: 3, color: '#222', pl: 2 }}>
            Signal's core tenet is privacy, so getting your data into a web app is intentionally tricky. To make this possible, while keeping true to Signal's roots, the app requires you to find and upload your Signal data. Click here for a guide on how to do this. Once it's uploaded to the page, built-in data analytics functions parse the data and create visualizations personalized to you.
          </Typography>

          <Typography variant="h6" sx={{ color: '#0057b8', fontWeight: 600, mt: 4, mb: 1 }}>
            Is it secure?
          </Typography>
          <Typography paragraph sx={{ fontSize: '1.1rem', mb: 2, color: '#222', pl: 2 }}>
            <strong>Absolutely.</strong> This app runs entirely in your browser—your data never leaves your device. No accounts, no servers, no data collection. Want to make sure? Press F12 while using the app and monitor the network tab. 
            You'll notice that no requests are being made to any servers. This app's code is also open source, feel free to check it out on GitHub.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button
            variant="contained"
            size={isMobile ? 'large' : 'medium'}
            sx={{
              background: 'linear-gradient(135deg, #0099ff 0%, #0057b8 100%)',
              color: '#fff',
              '&:hover': {
                background: 'linear-gradient(135deg, #0057b8 0%, #0099ff 100%)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              },
              px: isMobile ? 5 : 7,
              py: isMobile ? 2 : 1.5,
              fontSize: isMobile ? '1.1rem' : '1rem',
              borderRadius: 3,
              boxShadow: 2,
              minWidth: isMobile ? 200 : 180,
              fontWeight: 500,
              textTransform: 'none',
            }}
            onClick={() => navigate('/app/summary')}
          >
            Create Your Snapshot
          </Button>
        </Box>
        <Typography variant="body2" sx={{ fontSize: isMobile ? '0.95rem' : '1rem', mt: 2, color: '#0057b8' }}>
          Your data stays on your device. We don't store or process your messages on any server.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
