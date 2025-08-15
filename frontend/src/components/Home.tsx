import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, useTheme, useMediaQuery, Grid } from '@mui/material';

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#002b5c', // Signal dark blue
      background: 'linear-gradient(135deg, #003366 0%, #0057b8 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
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
          Gain fun and interesting insights into your Signal conversations
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 500, color: '#0099ff' }}>
          A simple, lightweight tool for Signal users
        </Typography>
        <Typography paragraph sx={{ fontSize: '1.1rem', mb: 3, color: '#222' }}>
          Signal Snapshot provides you with detailed analytics and visualizations of your Signal conversations, helping you understand your messaging patterns, engagement, and more. There’s no account, no server, and no hidden tricks—just a static app that runs entirely in your browser.
        </Typography>
        <Typography paragraph sx={{ fontSize: '1.1rem', mb: 4, color: '#222' }}>
          <strong style={{ color: '#0057b8' }}>Your privacy is our priority:</strong> This app never stores, uploads, or shares your data. Everything happens locally on your computer, and your information never leaves your device.
        </Typography>
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
            Launch App
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
