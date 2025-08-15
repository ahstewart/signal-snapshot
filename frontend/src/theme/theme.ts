import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          '&.card': {
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            border: '1px solid #dee2e6',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            transition: 'box-shadow 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }
          },
          '&.table-container': {
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }
        }
      }
    },
    MuiTable: {
      styleOverrides: {
        root: {
          '&.data-table': {
            minWidth: 650,
            '& th': {
              backgroundColor: '#f8f9fa',
              fontWeight: 600,
              color: '#495057'
            },
            '& tr:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.02)'
            }
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: '6px',
          '&.primary-button': {
            background: 'linear-gradient(135deg, #4a6cf7 0%, #2541b2 100%)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(135deg, #3a5bd9 0%, #1a2d80 100%)',
              boxShadow: '0 4px 12px rgba(74, 108, 247, 0.2)'
            }
          }
        }
      }
    }
  },
  typography: {
    h4: {
      fontWeight: 600,
      color: '#212529'
    },
    h5: {
      fontWeight: 600,
      color: '#343a40'
    },
    h6: {
      fontWeight: 500,
      color: '#495057'
    },
    body1: {
      color: '#495057'
    },
    body2: {
      color: '#6c757d'
    }
  },
  palette: {
    primary: {
      main: '#4a6cf7',
      light: '#6f8af8',
      dark: '#2541b2',
      contrastText: '#fff'
    },
    secondary: {
      main: '#6c757d',
      light: '#868e96',
      dark: '#495057',
      contrastText: '#fff'
    },
    background: {
      default: '#f8f9fa',
      paper: '#fff',
    },
    text: {
      primary: '#212529',
      secondary: '#495057',
      disabled: '#6c757d'
    }
  }
});

export const cardStyles = {
  card: {
    p: 2,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    border: '1px solid #dee2e6',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }
  },
  tableContainer: {
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    mb: 3
  },
  table: {
    minWidth: 650,
    '& th': {
      backgroundColor: '#f8f9fa',
      fontWeight: 600,
      color: '#495057'
    },
    '& tr:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.02)'
    }
  },
  sectionTitle: {
    mb: 3,
    color: '#212529',
    fontWeight: 600,
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: -8,
      left: 0,
      width: '100%',
      height: 2,
      background: 'linear-gradient(90deg, #4a6cf7, transparent)'
    }
  }
};

export const chartStyles = {
  container: {
    p: 2,
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    mb: 2,
    color: '#495057',
    fontWeight: 500
  },
  chart: {
    flex: 1,
    minHeight: '300px',
    '& .recharts-cartesian-grid-horizontal line': {
      stroke: '#e9ecef'
    }
  }
};
