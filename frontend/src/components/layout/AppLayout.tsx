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
  Box as MuiBox,
  IconButton
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ChatIcon from '@mui/icons-material/Chat';
import HomeIcon from '@mui/icons-material/Home';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import GitHubIcon from '@mui/icons-material/GitHub';
import CloseIcon from '@mui/icons-material/Close';

interface AppLayoutProps {
  dbBuffer: ArrayBuffer | null;
  currentDbName: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  error: string | null;
  loading: boolean;
  children?: React.ReactNode;
  showWelcome: boolean;
  onCloseWelcome: () => void;
}

const drawerWidth = 240;

const AppLayout: React.FC<AppLayoutProps> = ({
  dbBuffer,
  currentDbName,
  onFileChange,
  error,
  loading,
  children,
  showWelcome,
  onCloseWelcome,
}) => {
  const location = useLocation();
  const [helpOpen, setHelpOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [welcomeOpen, setWelcomeOpen] = useState(showWelcome);

  React.useEffect(() => {
    setWelcomeOpen(showWelcome);
  }, [showWelcome]);

  const handleHelpOpen = () => {
    setHelpOpen(true);
  };

  const handleHelpClose = () => {
    setHelpOpen(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleWelcomeOpen = () => setWelcomeOpen(true);
  const handleWelcomeClose = () => {
    setWelcomeOpen(false);
    onCloseWelcome();
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
          {/* Help Icon */}
          <IconButton color="inherit" onClick={handleWelcomeOpen} aria-label="About Signal Snapshot" sx={{ mr: 1 }}>
            <HelpOutlineIcon />
          </IconButton>
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
                Change Data Source
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      
      {/* Welcome Dialog */}
      <Dialog
        open={welcomeOpen}
        onClose={handleWelcomeClose}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            width: { xs: '100vw', sm: '100vw', md: '100vw', lg: '97vw' },
            height: { xs: '100vh', sm: '100vh', md: '100vh', lg: '97vh' },
            maxWidth: 'none',
            maxHeight: 'none',
            m: 0,
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <DialogContent
          dividers
          sx={{
            position: 'relative',
            pt: 3,
            background: 'linear-gradient(135deg, #eaf3fb 0%, #d6e7fa 100%)',
            flex: 1,
            minHeight: 0,
            overflowY: 'auto'
          }}
        >
          {/* Close button in the top-right corner, absolutely positioned */}
          <IconButton
            onClick={handleWelcomeClose}
            size="small"
            aria-label="Close"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          {/* Branding and subtitle at the top */}
          <Box sx={{ maxWidth: 900, mx: 'auto', textAlign: 'center', mb: 3 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #0099ff 0%, #0057b8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '3rem' },
                letterSpacing: 1,
              }}
            >
              Signal Snapshot
            </Typography>
            <Typography variant="h5" sx={{ mb: 2, color: '#0057b8', fontWeight: 500 }}>
              Visualize your Signal conversations in a whole different light
            </Typography>
          </Box>
          {/* Centered Create Snapshot button above the containers */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                px: 10,
                py: 2,
                fontSize: '1.15rem',
                fontWeight: 600,
                borderRadius: 3,
                boxShadow: 2,
                textTransform: 'none'
              }}
              onClick={handleWelcomeClose}
            >
              Create Snapshot
            </Button>
          </Box>
          <Box
            sx={{
              maxWidth: 1200,
              mx: 'auto',
              py: 2,
              px: 1,
              textAlign: 'center',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3,
              alignItems: 'stretch',
              justifyContent: 'center',
            }}
          >
            {/* All containers use the same color */}
            {[
              {
                title: "What is it?",
                content: "A web tool that generates custom data visualizations from your Signal conversations. If it helps, think of it as a kind of \"Spotify Wrapped\" for Signal."
              },
              {
                title: "How does it work?",
                content: "Signal's core tenet is privacy, so getting your data into a web app is intentionally tricky. To keep true to Signal's roots, the app requires you to find and upload your Signal data. Once it's uploaded to the page, the application uses this data to create personalized analytics."
              },
              {
                title: "Is it secure?",
                content: `<strong>Absolutely.</strong> This app runs entirely in your browser—your data never leaves your device. Want to make sure? Press F12 while using the app and monitor the network tab. You'll notice that no requests are being made. This app's code is also open source, feel free to <a href="https://github.com/ahstewart/signal-snapshot" target="_blank" rel="noopener noreferrer">check it out on GitHub</a>.`
              }
            ].map((section, idx) => (
              <Box
                key={section.title}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  bgcolor: '#fafdff', // unified very light blue/white for all
                  borderRadius: 4,
                  boxShadow: 2,
                  p: { xs: 2, md: 3 },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mb: { xs: 2, md: 0 },
                }}
              >
                <Typography variant="h6" sx={{ color: '#0057b8', fontWeight: 600, mt: 1, mb: 1 }}>
                  {section.title}
                </Typography>
                <Typography
                  paragraph
                  sx={{
                    fontSize: '0.95rem',
                    mb: 2,
                    color: '#222',
                    pl: 2,
                    textAlign: 'left',
                  }}
                  // For the "Is it secure?" section, allow HTML for <strong>
                  dangerouslySetInnerHTML={idx === 2 ? { __html: section.content } : undefined}
                >
                  {idx !== 2 ? section.content : undefined}
                </Typography>
              </Box>
            ))}
          </Box>
          {/* Move the privacy text below the containers */}
          <Box sx={{ maxWidth: 900, mx: 'auto', textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ fontSize: { xs: '0.95rem', sm: '1rem' }, color: '#0057b8' }}>
              Your data stays on your device. We don't store or process your messages on any server.
            </Typography>
          </Box>
        </DialogContent>
        {/* No DialogActions */}
      </Dialog>
      {/* Sidebar Navigation */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          height: 'calc(100vh - 40px)', // Stop at the top of the footer (assuming footer height ~40px)
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop: '64px',
            height: 'calc(100vh - 40px)', // Match Drawer height to stop above footer
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
                              <li><strong>Windows:</strong> <code>AppData\Roaming\Signal\sql\db.sqlite</code></li>
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
                            This is the hard part. The database is encrypted (which, since you're a Signal user, is a good thing). But 
                            it means that to visualize your data, you'll need to decrypt it. Regardless of your
                            operating system, the decryption process will be made up of two tasks: 
                            <strong> decrypting the key</strong> and
                            <strong> decrypting the database.</strong>
                          </Typography>
                          <Typography component="div" variant="body2" sx={{ mt: 1, pl: 2 }}>
                            To make this process easier, you can use <a href="https://github.com/ahstewart/signal-decrypt" target="_blank" rel="noopener noreferrer">this Signal Decrypt tool</a>. It's a simple C# program that will automatically decrypt your key, then output a decrypted copy of your database. Click a link below to download this program, then simply double click the file to run it:
                            <ul style={{ marginTop: 8, marginBottom: 8 }}>
                              <li>
                                <a href={`${process.env.PUBLIC_URL}/decrypt/win-64/signal-decrypt.exe`} download>
                                  Download for Windows 64-bit (.exe)
                                </a>
                              </li>
                              <li>
                                <a href={`${process.env.PUBLIC_URL}/decrypt/osx-64/signal-decrypt`} download>
                                  Download for macOS 64-bit (.zip)
                                </a>
                              </li>
                              <li>
                                <a href={`${process.env.PUBLIC_URL}/decrypt/linux-64/signal-decrypt`} download>
                                  Download for Linux 64-bit (.tar.gz)
                                </a>
                              </li>
                            </ul>
                          </Typography>
                          <Typography component="div" variant="body2" sx={{ mt: 1, pl: 2 }}>
                            <strong>The database created by this tool can be directly uploaded into Signal Snapshot.</strong>
                          </Typography>
                          <Typography component="div" variant="body2" sx={{ mt: 1, pl: 2 }}>
                            If you'd like to try doing the decryption yourself, there are a few resources online that detail the process. You can also try to have your favorite LLM write a script for it if you're especially brave.
                          </Typography>
                      {/*   <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic' }}>
                            Note: You can use the{' '}
                            <a href="https://github.com/ahstew/signal-snapshot" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                              Signal Snapshot
                            </a>{' '}
                            tool to decrypt your database.
                          </Typography> */}
                        </Typography>
                      </Box>
                    </TabPanel>
                    
                    <TabPanel value={currentTab} index={1}>
                      <DialogContentText sx={{ mb: 2 }}>
                        Signal Snapshot doesn't yet support Android devices.
                      </DialogContentText>
                      <Typography variant="body2" color="text.secondary">
                        <br/>
                        If you'd like Android support, send an email over to{' '}
                        <a href="mailto:hank@signalsnapshot.com" style={{ color: 'inherit' }}>hank@signalsnapshot.com</a>
                        {' '}and let me know you're interested. Pull requests are also welcome!
                      </Typography>
                    </TabPanel>
                    
                    <TabPanel value={currentTab} index={2}>
                      <DialogContentText sx={{ mb: 2 }}>
                        Signal Snapshot doesn't yet support iOS devices.
                      </DialogContentText>
                      <Typography variant="body2" color="text.secondary">
                        <br/>
                        If you'd like iOS support, send an email over to{' '}
                        <a href="mailto:hank@signalsnapshot.com" style={{ color: 'inherit' }}>hank@signalsnapshot.com</a>
                        {' '}and let me know you're interested. Pull requests are also welcome!
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
        
        {/* Footer */}
        <Box
          sx={{
            borderTop: 1,
            borderColor: 'divider',
            backgroundColor: '#f0f4ff',
            position: 'fixed',
            bottom: 0,
            left: drawerWidth,
            right: 0,
            height: '20px',
            zIndex: (theme) => theme.zIndex.drawer - 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '12px 0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginRight: '265px' }}>
            <a 
              href="https://github.com/ahstewart/signal-snapshot" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}
            >
              <GitHubIcon fontSize="small" sx={{ mr: .5 }} /> GitHub
            </a>
            ·
            <a 
              href="mailto:hank@signalsnapshot.com" 
              style={{ color: 'inherit', marginLeft: '5px' }}
            >
              hank@signalsnapshot.com
            </a>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
