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
  Tabs,
  Tab,
  Box as MuiBox
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
  const [currentTab, setCurrentTab] = useState(0);

  const handleHelpOpen = () => {
    setHelpOpen(true);
  };

  const handleHelpClose = () => {
    setHelpOpen(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <MuiBox sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </MuiBox>
        )}
      </div>
    );
  }

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
                  height: '40px', 
                  width: '350px',
                  fontSize: '1rem',
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
                <Dialog open={helpOpen} onClose={handleHelpClose} maxWidth="md" fullWidth>
                  <DialogTitle>How to upload your Signal data</DialogTitle>
                  <DialogContent>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Tabs value={currentTab} onChange={handleTabChange} aria-label="signal platform tabs">
                        <Tab label="Signal Desktop" {...a11yProps(0)} />
                        <Tab label="Signal for Android" {...a11yProps(1)} />
                        <Tab label="Signal for iOS" {...a11yProps(2)} />
                      </Tabs>
                    </Box>
                    
                    <TabPanel value={currentTab} index={0}>
                      <DialogContentText sx={{ mb: 2 }}>
                        Preparing your Signal Desktop data can be broken into two steps:
                      </DialogContentText>
                      <Box component="ol" sx={{ pl: 2, m: 0, '& > li': { mb: 2 } }}>
                        <Typography component="li" variant="body1">
                          <strong>Find your Signal database</strong>
                          <Typography component="div" variant="body2" sx={{ mt: 1, pl: 2 }}>
                            Your database is located at:
                            <Box component="ul" sx={{ pl: 2, mt: 1, '& > li': { mb: 0.5 } }}>
                              <li><strong>Windows:</strong> <code>AppData\Signal\sql\db.sqlite</code></li>
                              <li><strong>macOS:</strong> <code>~/Library/Application Support/Signal/sql/db.sqlite</code></li>
                              <li><strong>Linux:</strong> <code>~/.config/Signal/sql/db.sqlite</code></li>
                            </Box>
                            <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic' }}>
                              Note: You may need to enable "Show Hidden Files" in your file explorer.
                            </Typography>
                          </Typography>
                        </Typography>
                        
                        <Typography component="li" variant="body1">
                          <strong>Decrypt your Signal database</strong>
                          <Typography component="div" variant="body2" sx={{ mt: 1, pl: 2 }}>
                            The database is encrypted. You'll need to use the Signal Decrypt tool to decrypt it before uploading.
                          </Typography>
                        </Typography>
                      </Box>
                    </TabPanel>
                    
                    <TabPanel value={currentTab} index={1}>
                      <DialogContentText sx={{ mb: 2 }}>
                        Signal Snapshot doesn't yet support Android devices.
                      </DialogContentText>
                      <Typography variant="body2" color="text.secondary">
                        If you'd like Android support, send an email over to{' '}
                        <a href="mailto:support@signalsnapshot.com" style={{ color: 'inherit' }}>support@signalsnapshot.com</a>
                        {' '}and let us know you're interested.
                      </Typography>
                    </TabPanel>
                    
                    <TabPanel value={currentTab} index={2}>
                      <DialogContentText sx={{ mb: 2 }}>
                        Signal Snapshot doesn't yet support iOS devices.
                      </DialogContentText>
                      <Typography variant="body2" color="text.secondary">
                        If you'd like iOS support, send an email over to{' '}
                        <a href="mailto:support@signalsnapshot.com" style={{ color: 'inherit' }}>support@signalsnapshot.com</a>
                        {' '}and let us know you're interested.
                      </Typography>
                    </TabPanel>
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
