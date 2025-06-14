import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, CircularProgress, Box, Alert } from '@mui/material';
import Dashboard from './components/Dashboard';
import IndividualStats from './components/IndividualStats';
import './App.css';
import { AnalyticsData, IndividualStatsData, loadDatabase, loadIndividualStats, loadUsers, User } from './utils/database';

function App() {
    // Shared state
    const [file, setFile] = useState<File | null>(null);
    const [dbBuffer, setDbBuffer] = useState<ArrayBuffer | null>(null);
    const [dbKey, setDbKey] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Analysis and user state
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [initialDataLoaded, setInitialDataLoaded] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedConversationIds, setSelectedConversationIds] = useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [statsData, setStatsData] = useState<IndividualStatsData | null>(null);

    // Handlers
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const selectedFile = e.target.files?.[0] ?? null;
        setFile(selectedFile);
        setError(null);
        setDbBuffer(null);
        setDbKey(undefined);
        setAnalyticsData(null);
        setInitialDataLoaded(false);
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

    // Effect 1: Load initial, unfiltered data and users when a file is ready
    useEffect(() => {
        const loadInitialData = async () => {
            if (!dbBuffer || initialDataLoaded) return;

            setLoading(true);
            setError(null);
            
            try {
                // Initial load is always without conversation filters
                const initialAnalytics = await loadDatabase(dbBuffer, dbKey); 
                setAnalyticsData(initialAnalytics);
                
                const userList = await loadUsers(dbBuffer, dbKey);
                setUsers(userList);
                
                setInitialDataLoaded(true); // Mark initial load as complete

            } catch (err: any) {
                if (err.message && err.message.includes('Please provide a key')) {
                    const key = window.prompt('This database appears to be encrypted. Please provide your key:');
                    if (key) {
                        setDbKey(key); // Setting key will trigger this effect to re-run
                    } else {
                        setError('An encryption key is required to process this file.');
                    }
                } else {
                    setError(err.message || 'An unknown error occurred during initial load.');
                }
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    // This effect runs only when the raw data (buffer or key) changes.
    }, [dbBuffer, dbKey, initialDataLoaded]); 


    // Effect 2: Re-run analysis with filters ONLY when the selection changes.
    useEffect(() => {
        // Do not run this effect until the initial data has been loaded.
        if (!initialDataLoaded) return;

        const reAnalyzeWithFilter = async () => {
             if (!dbBuffer) return;

            setLoading(true);
            setError(null);
            try {
                // Re-load the database, passing the current conversation filter.
                // This is where on-demand summarization will be triggered.
                const filteredAnalytics = await loadDatabase(dbBuffer, dbKey, selectedConversationIds);
                setAnalyticsData(filteredAnalytics);
            } catch (err: any) {
                 setError(err.message || 'An error occurred while filtering data.');
            } finally {
                setLoading(false);
            }
        };

        reAnalyzeWithFilter();
    // This effect runs ONLY when the conversation selection changes.
    }, [selectedConversationIds, initialDataLoaded, dbBuffer, dbKey]); 


    // Auto-fetch stats for selected user
    useEffect(() => {
        const fetchStats = async () => {
            if (!dbBuffer || !selectedUser) return;
            setLoading(true);
            setError(null);
            try {
                const stats = await loadIndividualStats(dbBuffer, dbKey, selectedUser);
                setStatsData(stats);
            } catch (err: any) {
                setError(err.message || 'Failed to get individual stats.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [dbBuffer, dbKey, selectedUser]);


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
                            {file ? `✔️ ${file.name}` : 'Select Database'}
                            <input type="file" accept=".db,.sqlite" hidden onChange={handleFileChange} />
                        </Button>
                        {loading && <CircularProgress size={24} />}
                    </Box>
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Dashboard
                                analyticsData={analyticsData}
                                loading={loading}
                                error={error}
                                selectedConversationIds={selectedConversationIds}
                                setSelectedConversationIds={setSelectedConversationIds}
                            />
                        }
                    />
                    <Route
                        path="/individual-stats"
                        element={
                            <IndividualStats
                                users={users}
                                selectedUser={selectedUser}
                                setSelectedUser={setSelectedUser}
                                statsData={statsData}
                                loading={loading}
                                error={error}
                            />
                        }
                    />
                </Routes>
            </Container>
        </div>
    );
}

export default App;
