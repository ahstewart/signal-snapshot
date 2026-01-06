import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
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
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  CircularProgress, 
  Tooltip,
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import { AnalyticsData, loadConversationParticipantIds, loadDatabase, loadIndividualStats, loadUsers, User, IndividualStatsData } from '../../utils/database';
import { createDashboardHtml } from '../../utils/export';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ChatIcon from '@mui/icons-material/Chat';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import MenuIcon from '@mui/icons-material/Menu';

interface AppLayoutProps {
  dbBuffer: ArrayBuffer | null;
  currentDbName: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  error: string | null;
  loading: boolean;
  children?: React.ReactNode;
  showWelcome: boolean;
  onCloseWelcome: () => void;
  originalAnalyticsData?: AnalyticsData | null;
  basePath?: string;
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
  originalAnalyticsData,
  basePath = '/app', 
}) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const [welcomeOpen, setWelcomeOpen] = useState(showWelcome);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  
  // Export dialog state
  const [exportOpen, setExportOpen] = useState(false);
  const [exportSelectedConvo, setExportSelectedConvo] = useState<string>('');
  const [exportStartDate, setExportStartDate] = useState<string | null>(null);
  const [exportEndDate, setExportEndDate] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<string>('');

  useEffect(() => {
    setWelcomeOpen(showWelcome);
  }, [showWelcome]);

  const handleWelcomeOpen = () => setWelcomeOpen(true);
  const handleWelcomeClose = () => {
    setWelcomeOpen(false);
    onCloseWelcome();
  };

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const isSnapshotMode = basePath !== '/app';

  const menuItems = [
    ...(isSnapshotMode ? [] : [{ text: 'Summary', icon: <SummarizeIcon />, path: `${basePath}/summary` }]),
    { text: 'Group Chats', icon: <DashboardIcon />, path: `${basePath}/groupchats` },
    { text: 'Individual Stats', icon: <PersonIcon />, path: `${basePath}/individual` }
  ];

  if (!isSnapshotMode) {
    menuItems.push(
      { text: '1:1 Stats', icon: <ChatIcon />, path: `${basePath}/oneonones` },
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography 
            variant="h6" 
            component={Link} 
            to="/"
            sx={{ 
              fontWeight: 'bold', 
              mr: { xs: 1, md: 3 }, 
              color: 'inherit',
              textDecoration: 'none',
              fontSize: { xs: '1rem', sm: '1.25rem' },
              '&:hover': { textDecoration: 'none', cursor: 'pointer', opacity: 0.9 }
            }}
          >
            Signal Snapshot {isSnapshotMode && isMobile ? '2025' : isSnapshotMode ? '2025' : ''}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />

          {!isSnapshotMode && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton color="inherit" onClick={handleWelcomeOpen} aria-label="About Signal Snapshot" sx={{ mr: 1 }}>
                <HelpOutlineIcon />
              </IconButton>
              {!isMobile && dbBuffer && (
                <>
                  <Tooltip title={currentDbName}>
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
                        mr: 1,
                      }}
                    >
                      {currentDbName}
                    </Typography>
                  </Tooltip>

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
                        boxShadow:
                          '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                      },
                      textTransform: 'none',
                      fontWeight: 500,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      px: { xs: 1, sm: 2 },
                    }}
                  >
                    Change Database
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {!isSnapshotMode && (
        <Dialog open={exportOpen} onClose={() => setExportOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Export Dashboard</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', mt: 1 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Start date"
                  type="date"
                  value={exportStartDate ?? ''}
                  onChange={(e) => setExportStartDate(e.target.value || null)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  label="End date"
                  type="date"
                  value={exportEndDate ?? ''}
                  onChange={(e) => setExportEndDate(e.target.value || null)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>

              <FormControl fullWidth>
                <InputLabel id="export-convos-label">Conversation</InputLabel>
                <Select
                  labelId="export-convos-label"
                  value={exportSelectedConvo}
                  label="Conversation"
                  onChange={(e) => setExportSelectedConvo(e.target.value)}
                >
                  <MenuItem value="">
                    <em>All Conversations</em>
                  </MenuItem>
                  {(originalAnalyticsData?.all_conversations || []).map((c: any) => (
                    <MenuItem key={c.id} value={c.id}>
                      <ListItemText primary={c.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {exporting && (
                  <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <CircularProgress size={20} /> 
                          <Typography variant="body2" color="text.secondary">
                              Processing... {exportProgress}%
                          </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">{exportStatus}</Typography>
                  </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExportOpen(false)} disabled={exporting}>Cancel</Button>
            <Button onClick={async () => {
              if (!dbBuffer) return;
              setExporting(true);
              setExportProgress(0);
              setExportStatus('Analyzing database...');
              
              try {
                const dateRange: any = {};
                if (exportStartDate) { const d = new Date(exportStartDate); d.setHours(0,0,0,0); dateRange.startMs = d.getTime(); }
                if (exportEndDate) { const d = new Date(exportEndDate); d.setHours(23,59,59,999); dateRange.endMs = d.getTime(); }
                
                const convFilter = exportSelectedConvo ? [exportSelectedConvo] : undefined;
                
                const analytics = await loadDatabase(
                    dbBuffer, 
                    undefined, 
                    convFilter, 
                    Object.keys(dateRange).length ? dateRange : undefined, 
                    (p: number, m: string) => {
                        setExportProgress(Math.floor(p * 0.5));
                        setExportStatus(m);
                    }
                );
                
                if (exportSelectedConvo) {
                    analytics.all_conversations = analytics.all_conversations.filter(c => c.id === exportSelectedConvo);
                    
                    if (analytics.top_conversations) {
                        analytics.top_conversations = analytics.top_conversations.filter(c =>
                            analytics.all_conversations.some(ac => ac.name === c.name)
                        );
                    }

                    const totalMembersFiltered = analytics.all_conversations.reduce((sum, c) => sum + (c.memberCount || 0), 0);
                    const totalMessagesFiltered = Object.values(analytics.message_counts?.by_day || {}).reduce((sum, v) => sum + (v || 0), 0);
                    const dayCount = Object.keys(analytics.message_counts?.by_day || {}).length;
                    analytics.kpis = {
                      ...analytics.kpis,
                      total_messages: totalMessagesFiltered,
                      total_conversations: analytics.all_conversations.length,
                      avg_messages_per_day: dayCount ? Math.round(totalMessagesFiltered / dayCount) : 0,
                      total_members: totalMembersFiltered,
                    };
                }

                setExportStatus('Loading users...');
                const allUsers = await loadUsers(dbBuffer, undefined);

                let usersToExport: User[] = [];
                if (exportSelectedConvo) {
                    setExportStatus('Finding conversation participants...');
                    const participantIds = await loadConversationParticipantIds(
                      dbBuffer,
                      undefined,
                      convFilter,
                      Object.keys(dateRange).length ? dateRange : undefined,
                      undefined
                    );

                    const byAnyId = new Map<string, User>();
                    allUsers.forEach((u: User) => {
                      byAnyId.set(u.id, u);
                      if (u.fromId) byAnyId.set(u.fromId, u);
                    });

                    const seenIds = new Set<string>();
                    usersToExport = participantIds
                      .map((id: string) => byAnyId.get(id) || ({ id, name: id } as User))
                      .filter((u: User) => {
                        if (seenIds.has(u.id)) return false;
                        seenIds.add(u.id);
                        return true;
                      })
                      .sort((a: User, b: User) => a.name.localeCompare(b.name));
                } else {
                    const topUserNames = new Set(analytics.topUsersByMessageCount?.map(u => u.name) || []);
                    const topReactors = new Set(analytics.topUsersByReactionCount?.map(u => u.name) || []);
                    usersToExport = allUsers
                        .filter((u: User) => topUserNames.has(u.name) || topReactors.has(u.name))
                        .slice(0, 50);
                }

                const individualStatsMap: Record<string, IndividualStatsData> = {};

                if (usersToExport.length > 0) {
                    setExportStatus(`Generating stats for ${usersToExport.length} users...`);
                    
                    for (let i = 0; i <usersToExport.length; i++) {
                        const user = usersToExport[i];

                        const progress = 50 + Math.floor((i / usersToExport.length) * 40);
                        setExportProgress(progress);
                        setExportStatus(`Analyzing user: ${user.name}`);
                        
                        try {
                            const stats = await loadIndividualStats(
                              dbBuffer,
                              undefined,
                              user.id,
                              undefined,
                              {
                                conversationIds: convFilter,
                                dateRange: Object.keys(dateRange).length ? dateRange : undefined,
                              }
                            );
                            individualStatsMap[user.id] = stats;
                        } catch (e) {
                            console.warn(`Skipping stats for user ${user.name}`, e);
                        }
                    }
                }

                setExportProgress(95);
                setExportStatus('Creating HTML file...');

                try {
                  const html = createDashboardHtml(analytics, individualStatsMap, usersToExport);
                  
                  const blob = new Blob([html], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  const baseName = (currentDbName || 'signal-export').replace(/\.[^.]+$/, '');
                  a.download = `${baseName}-analytics.html`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                } catch (e) {
                  console.error('Failed to create export file', e);
                }
                setExportOpen(false);
              } catch (err) {
                console.error('Export failed', err);
              } finally {
                setExporting(false);
                setExportProgress(0);
                setExportStatus('');
              }
            }} variant="contained" disabled={exporting}>Export</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Welcome Dialog */}
      <Dialog open={welcomeOpen} onClose={handleWelcomeClose} maxWidth={false} fullWidth PaperProps={{ sx: { width: { xs: '100vw', sm: '100vw', md: '100vw', lg: '97vw' }, height: { xs: '100vh', sm: '100vh', md: '100vh', lg: '97vh' }, maxWidth: 'none', maxHeight: 'none', m: 0, borderRadius: 4, display: 'flex', flexDirection: 'column' } }}>
         <DialogContent dividers sx={{ position: 'relative', pt: 3, background: 'linear-gradient(135deg, #eaf3fb 0%, #d6e7fa 100%)', flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <IconButton onClick={handleWelcomeClose} size="small" sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
            <CloseIcon />
          </IconButton>
          <Box sx={{ maxWidth: 900, mx: 'auto', textAlign: 'center', mb: 3 }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', background: 'linear-gradient(135deg, #0099ff 0%, #0057b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 2, fontSize: { xs: '2.5rem', sm: '3.5rem', md: '3rem' }, letterSpacing: 1 }}>
              Signal Snapshot
            </Typography>
            <Typography variant="h5" sx={{ mb: 2, color: '#0057b8', fontWeight: 500 }}>
              Visualize your Signal conversations in a whole different light
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
            <Button variant="contained" color="primary" size="large" sx={{ px: 10, py: 2, fontSize: '1.15rem', fontWeight: 600, borderRadius: 3, boxShadow: 2, textTransform: 'none' }} onClick={handleWelcomeClose}>
              Create Snapshot
            </Button>
          </Box>
          <Box sx={{ maxWidth: 1200, mx: 'auto', py: 2, px: 1, textAlign: 'center', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'stretch', justifyContent: 'center' }}>
            {[
              { title: "What is it?", content: "A web tool that generates custom data visualizations from your Signal conversations." },
              { title: "How does it work?", content: `You upload your Signal data file directly to the app. The app processes it in your browser. Signal's core tenet is privacy, you'll first have to decrypt your Signal database before uploading it. A tool to facilitate this can be found <a href="https://github.com/ahstewart/signal-decrypt" target="_blank" rel="noopener noreferrer">here</a>.` },
              { title: "Is it secure?", content: `<strong>Absolutely.</strong> This app runs entirely in your browser—your data never leaves your device. Want to make sure? Press F12 while using the app and monitor the network tab. You'll notice that no requests are being made. This app's code is also open source, feel free to <a href="https://github.com/ahstewart/signal-snapshot" target="_blank" rel="noopener noreferrer">check it out on GitHub</a>.` }
            ].map((section, idx) => (
              <Box key={section.title} sx={{ flex: 1, minWidth: 0, bgcolor: '#fafdff', borderRadius: 4, boxShadow: 2, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ color: '#0057b8', fontWeight: 600, mt: 1, mb: 1 }}>{section.title}</Typography>
                <Typography paragraph sx={{ fontSize: '0.95rem', mb: 2, color: '#222', pl: 2, textAlign: 'left' }} dangerouslySetInnerHTML={idx === 2 ? { __html: section.content } : undefined}>
                  {idx !== 2 ? section.content : undefined}
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Sidebar Navigation */}
      <Drawer 
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileDrawerOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{ 
          width: drawerWidth, 
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box', 
            marginTop: isMobile ? 0 : '64px', 
            height: isMobile ? '100vh' : 'calc(100vh - 40px)', 
            backgroundColor: '#f5f5f5', 
            borderRight: '1px solid rgba(0, 0, 0, 0.12)' 
          } 
        }}
      >
        {isMobile && (
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Menu
            </Typography>
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        )}
        <List>
          {menuItems.map((item) => {
             const isActive = location.pathname === item.path || location.pathname === item.path + '/';
             return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton 
                  component={Link} 
                  to={item.path} 
                  selected={isActive} 
                  disabled={!dbBuffer && !isSnapshotMode} 
                  onClick={() => isMobile && setMobileDrawerOpen(false)}
                  sx={isActive ? { backgroundColor: '#e3ecf7', fontWeight: 600 } : {}}
                >
                  <ListItemIcon sx={{ color: isActive ? '#1976d2' : 'inherit' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
             );
          })}
          {isMobile && dbBuffer && !isSnapshotMode && (
            <>
              <Divider sx={{ my: 1 }} />
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={() => {
                    document.getElementById('change-db-input')?.click();
                    setMobileDrawerOpen(false);
                  }}
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Change Data Source" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={() => {
                    setExportOpen(true);
                    setMobileDrawerOpen(false);
                  }}
                >
                  <ListItemIcon>
                    <SummarizeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Export" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
      
      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 1, sm: 2, md: 3 }, 
          marginTop: '64px', 
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          transition: (theme) => theme.transitions.create('width', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen }),
          pb: { xs: 8, md: 3 } // Add bottom padding for mobile footer
        }}
      >
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {!dbBuffer && !loading && !isSnapshotMode && (
          <Box sx={{ textAlign: 'center', mt: { xs: 5, md: 10 } }}>
             <Button 
               variant="contained" 
               onClick={() => document.getElementById('db-upload')?.click()} 
               sx={{ 
                 height: { xs: '45px', md: '50px' }, 
                 width: { xs: '90%', sm: '300px' }, 
                 fontSize: { xs: '1rem', md: '1.1rem' },
                 maxWidth: '300px'
               }}
             >
                Upload Your Signal Data
             </Button>
             <input type="file" id="db-upload" accept=".db,.sqlite,.sqlite3" style={{ display: 'none' }} onChange={onFileChange} />
          </Box>
        )}

        {children || <Outlet />}
        
        {!isSnapshotMode && (
          <Box 
            sx={{ 
              borderTop: 1, 
              borderColor: 'divider', 
              backgroundColor: '#f0f4ff', 
              position: { xs: 'fixed', md: 'fixed' },
              bottom: 0, 
              left: { xs: 0, md: drawerWidth }, 
              right: 0, 
              minHeight: '44px',
              zIndex: (theme) => theme.zIndex.drawer - 1, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              padding: { xs: '8px 4px', md: '12px 0' },
              flexWrap: 'wrap',
              gap: { xs: 0.5, md: 2 }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 2 }, flexWrap: 'wrap', justifyContent: 'center', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
              <a href="https://github.com/ahstewart/signal-snapshot" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <GitHubIcon fontSize="small" sx={{ mr: 0.5, fontSize: { xs: '0.875rem', md: '1rem' } }} /> 
                <span style={{ fontSize: 'inherit' }}>GitHub</span>
              </a>
              {isSmUp && <span>·</span>}
              <a href="mailto:hank@signalsnapshot.com" style={{ color: 'inherit', textDecoration: 'none', fontSize: 'inherit' }}>
                hank@signalsnapshot.com
              </a>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};


export default AppLayout;