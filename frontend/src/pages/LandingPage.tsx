import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="md" sx={{ 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        py: 8
      }}>
        <Box sx={{ mb: 6, maxWidth: 800 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' }
            }}
          >
            Signal Snapshot
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            Gain powerful insights into your Signal conversations
          </Typography>
        </Box>

        <Box sx={{ maxWidth: 700, mx: 'auto', mb: 6, px: 2 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
            Unlock the full potential of your Signal messaging data
          </Typography>
          <Typography paragraph sx={{ fontSize: '1.1rem', mb: 3 }}>
            Signal Snapshot provides you with detailed analytics and visualizations of your Signal conversations, 
            helping you understand your messaging patterns, engagement, and more.
          </Typography>
          <Typography paragraph sx={{ fontSize: '1.1rem', mb: 4 }}>
            Get started by uploading your Signal database to explore your messaging insights.
          </Typography>
        </Box>

        <Box sx={{ '& > :not(style)': { m: 1 } }}>
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/app/summary')}
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              },
              px: 5,
              py: 1.5,
              fontSize: '1.1rem',
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 500
            }}
          >
            Launch App
          </Button>
        </Box>

        <Box sx={{ mt: 8, color: 'text.secondary', fontSize: '0.9rem' }}>
          <Typography>Your data stays on your device. We don't store or process your messages on any server.</Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
