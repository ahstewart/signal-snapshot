import { Box, Typography, useTheme } from '@mui/material';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, children }) => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{
        mb: 4,
        pb: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box 
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 1,
        }}
      >
        <Typography 
          variant="h4" 
          component="h1"
          sx={{
            fontWeight: 700,
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(45deg, #90caf9, #64b5f6)'
              : 'linear-gradient(45deg, #1976d2, #0d47a1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            display: 'inline-block',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
          }}
        >
          {title}
        </Typography>
        {children}
      </Box>
      {subtitle && (
        <Typography 
          variant="subtitle1" 
          color="text.secondary"
          sx={{
            maxWidth: '800px',
            lineHeight: 1.6,
            fontSize: { xs: '0.875rem', md: '1rem' },
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default PageHeader;
