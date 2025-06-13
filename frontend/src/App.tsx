import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, CircularProgress, Box, Alert } from '@mui/material';
import Dashboard from './components/Dashboard';
import IndividualStats from './components/IndividualStats';
import './App.css';

function App() {
  // Shared state
  const [file, setFile] = useState<File | null>(null);
  const [dbBuffer, setDbBuffer] = useState<ArrayBuffer | null>(null);
  const [dbKey, setDbKey] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Analysis and user state
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedConversationIds, setSelectedConversationIds] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [statsData, setStatsData] = useState<any>(null);

  // Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
    setError(null);
    setDbBuffer(null);
    setDbKey(undefined);
    setAnalyticsData(null);
    setUsers([]);
    setSelectedConversationIds([]);
    setSelectedUser('');
    setStatsData(null);
    if (selectedFile) {
      selectedFile.arrayBuffer().then(buffer => {
        setDbBuffer(buffer);
      });
    }
  };

  // Auto-analyze database and fetch users when dbBuffer changes
  useEffect(() => {
    const analyze = async () => {
      if (!dbBuffer) return;
      setLoading(true);
      setError(null);
      try {
        // Try analytics first
        try {
          const { loadDatabase, loadUsers } = await import('./utils/database');
          const analytics = await loadDatabase(dbBuffer, dbKey, selectedConversationIds);
          setAnalyticsData(analytics);

          // Only load users list if it hasn't been loaded before for this db
          if (users.length === 0) {
            const userList = await loadUsers(dbBuffer, dbKey);
            setUsers(userList);
          }
        } catch (err: any) {
          if (err.message && err.message.includes('Please provide a key')) {
            const key = window.prompt('This database appears to be encrypted. Please provide your key:');
            if (key) {
              setDbKey(key);
              try {
                const { loadDatabase, loadUsers } = await import('./utils/database');
                const analytics = await loadDatabase(dbBuffer, key, selectedConversationIds);
                setAnalyticsData(analytics);
                // Only load users list if it hasn't been loaded before for this db
                if (users.length === 0) {
                    const userList = await loadUsers(dbBuffer, key);
                    setUsers(userList);
                }
              } catch (secondErr: any) {
                setError(secondErr.message || 'An unknown error occurred during decryption.');
              }
            } else {
              setError('An encryption key is required to process this file.');
            }
          } else {
            setError(err.message || 'An unknown error occurred.');
          }
        }
      } finally {
        setLoading(false);
      }
    };
    analyze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbBuffer, dbKey, selectedConversationIds]);

  // Auto-fetch stats for selected user
  useEffect(() => {
    const fetchStats = async () => {
      if (!dbBuffer || !selectedUser) return;
      setLoading(true);
      setError(null);
      try {
        const { loadIndividualStats } = await import('./utils/database');
        const stats = await loadIndividualStats(dbBuffer, dbKey, selectedUser);
        setStatsData(stats);
      } catch (err: any) {
        setError(err.message || 'Failed to get individual stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbBuffer, dbKey, selectedUser]);

  const handleUploadAndAnalyse = async () => {
    // This handler can be customized or passed down as needed
    // For now, just a placeholder to show loading
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Signal Analytics
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/individual-stats">
            Individual Stats
          </Button>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', ml: 4 }}>
            <Button variant="contained" component="label" disabled={loading}>
              Select Database
              <input type="file" accept=".db,.sqlite" hidden onChange={handleFileChange} />
            </Button>
            <Button variant="contained" color="secondary" onClick={handleUploadAndAnalyse} disabled={loading || !file}>
              {loading ? 'Processing…' : 'Upload & Analyse'}
            </Button>
            {loading && <CircularProgress size={24} />}
          </Box>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Routes>
          <Route path="/" element={<Dashboard analyticsData={analyticsData} loading={loading} error={error} selectedConversationIds={selectedConversationIds} setSelectedConversationIds={setSelectedConversationIds} />} />
          <Route path="/individual-stats" element={<IndividualStats users={users} selectedUser={selectedUser} setSelectedUser={setSelectedUser} statsData={statsData} loading={loading} error={error} />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
