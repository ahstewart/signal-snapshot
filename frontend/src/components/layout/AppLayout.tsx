import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { 
  AppBar, 
  Box, 
  Button, 
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar, 
  Typography,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ChatIcon from '@mui/icons-material/Chat';
import HomeIcon from '@mui/icons-material/Home';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface AppLayoutProps {
  dbBuffer: ArrayBuffer | null;
  currentDbName: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  error: string | null;
  loading: boolean;
  children?: React.ReactNode;
}

const drawerWidth = 240;

const AppLayout: React.FC<AppLayoutProps> = ({
  dbBuffer,
  currentDbName,
  onFileChange,
  error,
  loading,
  children
}) => {
  const location = useLocation();
  const [helpOpen, setHelpOpen] = useState(false);

  const handleHelpOpen = () => {
    setHelpOpen(true);
  };

  const handleHelpClose = () => {
    setHelpOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/"
            sx={{ 
              fontWeight: 'bold', 
              mr: 3, 
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'none',
                cursor: 'pointer',
                opacity: 0.9
              }
            }}
          >
            Signal Snapshot
          </Typography>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {dbBuffer && (
            <>
              <Typography 
                variant="body2" 
                component="div" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  maxWidth: '200px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  mr: 1
                }}
                title={currentDbName}
              >
                {currentDbName}
              </Typography>
              
              <input
                type="file"
                accept=".db,.sqlite,.sqlite3"
                onChange={onFileChange}
                style={{ display: 'none' }}
                id="change-db-input"
                key={currentDbName}
              />
              <Button 
                variant="contained"
                color="primary"
                onClick={() => document.getElementById('change-db-input')?.click()}
                sx={{
                  ml: 2,
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'
                  },
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Change Database
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      
      {/* Sidebar Navigation */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            marginTop: '64px',
            backgroundColor: '#f5f5f5',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)'
          },
        }}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton 
              component={Link} 
              to="/app/summary"
              selected={location.pathname === '/app/summary'}
              disabled={!dbBuffer}
              sx={location.pathname === '/app/summary' ? { backgroundColor: '#e3ecf7', fontWeight: 600 } : {}}
            >
              <ListItemIcon>
                <SummarizeIcon />
              </ListItemIcon>
              <ListItemText primary="Summary" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton 
              component={Link} 
              to="/app/groupchats"
              selected={location.pathname === '/app/groupchats'}
              disabled={!dbBuffer}
              sx={location.pathname === '/app/groupchats' ? { backgroundColor: '#e3ecf7', fontWeight: 600 } : {}}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Group Chats" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton 
              component={Link} 
              to="/app/oneonones"
              selected={location.pathname === '/app/oneonones'}
              disabled={!dbBuffer}
              sx={location.pathname === '/app/oneonones' ? { backgroundColor: '#e3ecf7', fontWeight: 600 } : {}}
            >
              <ListItemIcon>
                <ChatIcon />
              </ListItemIcon>
              <ListItemText primary="One-on-Ones" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton 
              component={Link} 
              to="/app/individual" 
              selected={location.pathname === '/app/individual'}
              disabled={!dbBuffer}
              sx={location.pathname === '/app/individual' ? { backgroundColor: '#e3ecf7', fontWeight: 600 } : {}}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Individual Stats" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      
      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          marginTop: '64px',
          width: `calc(100% - ${drawerWidth}px)`,
          transition: (theme) => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          })
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {!dbBuffer && !loading && (
          <Box sx={{ position: 'relative', left: '-130px', textAlign: 'center', mt: 6}}>
            <input
              type="file"
              accept=".db,.sqlite,.sqlite3"
              onChange={onFileChange}
              style={{ display: 'none' }}
              id="db-upload"
            />
            <label htmlFor="db-upload">
              <Button 
                variant="contained" 
                component="span" 
                sx={{ 
                  height: '50px', 
                  width: '400px',
                  fontSize: '1.2rem',
                  '& .MuiButton-label': {
                    fontWeight: 'bold'
                  }
                }}
              >
                Upload Your Signal Data
              </Button>
            </label>
          
          
          <Box sx={{left: '-130px', textAlign: 'center', mt: 8}}>
              <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleHelpOpen}
                        endIcon={<HelpOutlineIcon />}
                    >
                        How do I do this?
                </Button>
                {/* Help Dialog */}
                <Dialog open={helpOpen} onClose={handleHelpClose}>
                <DialogTitle>Where to find your Signal database</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Your Signal database file is stored in different locations depending on your operating system:
                    </DialogContentText>
                    <Box component="ul" sx={{ pl: 2, m: 0, '& > li': { mb: 1.5 } }}>
                        <Typography component="li" variant="body1">
                            <strong>Windows:</strong> <code>%APPDATA%\Signal\sql\db.sqlite</code>
                        </Typography>
                        <Typography component="li" variant="body1">
                            <strong>macOS:</strong> <code>~/Library/Application Support/Signal/sql/db.sqlite</code>
                        </Typography>
                        <Typography component="li" variant="body1">
                            <strong>Linux:</strong> <code>~/.config/Signal/sql/db.sqlite</code>
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                        Note: You may need to enable "Show Hidden Files" in your file explorer to see these directories.
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                      <Button onClick={handleHelpClose} color="primary" autoFocus>
                          Got it!
                      </Button>
                  </DialogActions>
                  </Dialog>
                </Box>
            </Box>
            

        )}

        {children || <Outlet />}
      </Box>
    </Box>
  );
};

export default AppLayout;
