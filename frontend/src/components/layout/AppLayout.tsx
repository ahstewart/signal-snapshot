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
  Box as MuiBox, 
  IconButton, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  CircularProgress, 
  Tooltip 
} from '@mui/material';
import { AnalyticsData, loadDatabase, loadIndividualStats, loadUsers } from '../../utils/database';
import { createDashboardHtml } from '../../utils/export';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ChatIcon from '@mui/icons-material/Chat';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';

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
  const [welcomeOpen, setWelcomeOpen] = useState(showWelcome);
  
  // Export dialog state
  const [exportOpen, setExportOpen] = useState(false);
  const [exportSelectedConvos, setExportSelectedConvos] = useState<string>('');
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

  const isSnapshotMode = basePath !== '/app';

  const menuItems = [
    { text: 'Summary', icon: <SummarizeIcon />, path: `${basePath}/summary` },
    { text: 'Group Chats', icon: <DashboardIcon />, path: `${basePath}/groupchats` },
    // Include Individual stats in both modes
    { text: 'Individual', icon: <PersonIcon />, path: `${basePath}/individual` }
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
          <Typography 
            variant="h6" 
            component={Link} 
            to="/"
            sx={{ 
              fontWeight: 'bold', 
              mr: 3, 
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'none', cursor: 'pointer', opacity: 0.9 }
            }}
          >
            Signal Snapshot {isSnapshotMode && '(Units 2025)'}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          
          <IconButton color="inherit" onClick={handleWelcomeOpen} aria-label="About Signal Snapshot" sx={{ mr: 1 }}>
            <HelpOutlineIcon />
          </IconButton>

          {dbBuffer && !isSnapshotMode && (
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
                    mr: 1
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
                    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'
                  },
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Change Data Source
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                sx={{ ml: 2, borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}
                onClick={() => setExportOpen(true)}
              >
                Export
              </Button>
            </>
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
                  value={exportSelectedConvos}
                  label="Conversation"
                  onChange={(e) => setExportSelectedConvos(typeof e.target.value === 'string' ? e.target.value : String(e.target.value))}
                >
                  <MenuItem value="">All Conversations</MenuItem>
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
                const convFilter = exportSelectedConvos && exportSelectedConvos.length > 0 ? [exportSelectedConvos] : undefined;
                
                // 1. Re-query database for the main analytics export
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
                
                if (exportSelectedConvos && exportSelectedConvos.length > 0) {
                    (analytics as any).all_conversations = (analytics as any).all_conversations.filter((c: any) => c.id === exportSelectedConvos);
                }

                // 2. Fetch Users
                setExportStatus('Loading users...');
                const allUsers = await loadUsers(dbBuffer, undefined);

                // 3. Export stats for Top 50 Users (Increased from 20)
                const topUserNames = new Set(analytics.topUsersByMessageCount?.map(u => u.name) || []);
                // Add top reaction users as well to ensure better coverage
                const topReactors = new Set(analytics.topUsersByReactionCount?.map(u => u.name) || []);
                
                const usersToExport = allUsers
                    .filter(u => topUserNames.has(u.name) || topReactors.has(u.name))
                    .slice(0, 50);

                if (usersToExport.length > 0) {
                    setExportStatus(`Generating stats for ${usersToExport.length} users...`);
                    const individualStatsArray = [];
                    
                    for (let i = 0; i < usersToExport.length; i++) {
                        const user = usersToExport[i];
                        const progress = 50 + Math.floor((i / usersToExport.length) * 40);
                        setExportProgress(progress);
                        setExportStatus(`Analyzing user: ${user.name}`);
                        
                        try {
                            const stats = await loadIndividualStats(dbBuffer, undefined, user.id);
                            individualStatsArray.push({
                                id: user.id,
                                name: user.name,
                                stats: stats
                            });
                        } catch (e) {
                            console.warn(`Skipping stats for user ${user.name}`, e);
                        }
                    }
                    
                    (analytics as any)['individual_stats'] = individualStatsArray;
                }

                setExportProgress(95);
                setExportStatus('Creating HTML file...');

                try {
                  const html = createDashboardHtml(analytics);
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
              { title: "How does it work?", content: "You upload your Signal data file directly to the app. The app processes it in your browser." },
              { title: "Is it secure?", content: `<strong>Absolutely.</strong> This app runs entirely in your browser—your data never leaves your device.` }
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
      <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, height: 'calc(100vh - 40px)', [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', marginTop: '64px', height: 'calc(100vh - 40px)', backgroundColor: '#f5f5f5', borderRight: '1px solid rgba(0, 0, 0, 0.12)' } }}>
        <List>
          {menuItems.map((item) => {
             const isActive = location.pathname === item.path || location.pathname === item.path + '/';
             return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton component={Link} to={item.path} selected={isActive} disabled={!dbBuffer && !isSnapshotMode} sx={isActive ? { backgroundColor: '#e3ecf7', fontWeight: 600 } : {}}>
                  <ListItemIcon sx={{ color: isActive ? '#1976d2' : 'inherit' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
             );
          })}
        </List>
      </Drawer>
      
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '64px', width: `calc(100% - ${drawerWidth}px)`, transition: (theme) => theme.transitions.create('width', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen }) }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {!dbBuffer && !loading && !isSnapshotMode && (
          <Box sx={{ textAlign: 'center', mt: 10 }}>
             <Button variant="contained" onClick={() => document.getElementById('db-upload')?.click()} sx={{ height: '50px', width: '300px', fontSize: '1.1rem' }}>
                Upload Your Signal Data
             </Button>
             <input type="file" id="db-upload" accept=".db,.sqlite,.sqlite3" style={{ display: 'none' }} onChange={onFileChange} />
          </Box>
        )}

        {children || <Outlet />}
        
        {/* Footer */}
        <Box sx={{ borderTop: 1, borderColor: 'divider', backgroundColor: '#f0f4ff', position: 'fixed', bottom: 0, left: drawerWidth, right: 0, height: '20px', zIndex: (theme) => theme.zIndex.drawer - 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '12px 0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <a href="https://github.com/ahstewart/signal-snapshot" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>
              <GitHubIcon fontSize="small" sx={{ mr: .5 }} /> GitHub
            </a>
            ·
            <a href="mailto:hank@signalsnapshot.com" style={{ color: 'inherit', marginLeft: '5px' }}>hank@signalsnapshot.com</a>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;

