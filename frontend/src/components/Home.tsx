import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          Signal Snapshot
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Gain insights into your Signal conversations
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 700, mx: 'auto', mb: 6 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Welcome to Signal Snapshot, your personal analytics dashboard for Signal conversations.
        </Typography>
        <Typography paragraph>
          Upload your Signal database to visualize your messaging patterns, analyze conversation trends,
          and gain valuable insights into your communication habits.
        </Typography>
      </Box>

      <Button 
        variant="contained" 
        size="large" 
        onClick={() => navigate('/summary')}
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          },
          px: 4,
          py: 1.5,
          fontSize: '1.1rem',
          textTransform: 'none',
          borderRadius: 2
        }}
      >
        Get Started
      </Button>
    </Container>
  );
};

export default Home;
