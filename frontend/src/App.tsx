import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Container, 
    Button, 
    CircularProgress, 
    Box, 
    Alert
} from '@mui/material';
import ProgressDialog from './components/ProgressDialog';
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
    const [currentDbName, setCurrentDbName] = useState<string>('No database loaded');
    
    // Progress state
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState('');
    const [showProgress, setShowProgress] = useState(false);

    // Analysis and user state
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [initialDataLoaded, setInitialDataLoaded] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedConversationIds, setSelectedConversationIds] = useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [statsData, setStatsData] = useState<IndividualStatsData | null>(null);

    // Handlers
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const selectedFile = e.target.files?.[0] ?? null;
        if (!selectedFile) return;
        
        setFile(selectedFile);
        setCurrentDbName(selectedFile.name);
        setError(null);
        setShowProgress(true);
        setProgress(0);
        setProgressMessage('Reading file...');
        
        try {
            const buffer = await selectedFile.arrayBuffer();
            setDbBuffer(buffer);
            
            // Check if the file is encrypted by looking for SQLite header
            const header = new Uint8Array(buffer, 0, 16);
            const headerStr = Array.from(header).map(b => String.fromCharCode(b)).join('');
            
            if (!headerStr.startsWith('SQLite format 3\0')) {
                // File is encrypted, prompt for key
                const key = window.prompt('Enter database decryption key:');
                if (!key) {
                    throw new Error('Decryption key is required');
                }
                setDbKey(key);
            } else {
                // File is not encrypted
                setDbKey(undefined);
            }
        } catch (err) {
            setError(`Error reading file: ${err instanceof Error ? err.message : 'Unknown error'}`);
            setShowProgress(false);
        }
    };

    // Effect 1: Load initial, unfiltered data and users when a file is ready
    useEffect(() => {
        const loadInitialData = async () => {
            if (!dbBuffer) return;
            
            setLoading(true);
            setError(null);
            setShowProgress(true);
            
            try {
                // Load users first
                setProgressMessage('Loading users...');
                const users = await loadUsers(dbBuffer, dbKey, (p, m) => {
                    setProgress(p * 0.3); // Scale to 30% for user loading
                    setProgressMessage(m);
                });
                setUsers(users);
                
                // Then load the full database
                setProgressMessage('Loading database...');
                const analytics = await loadDatabase(
                    dbBuffer, 
                    dbKey, 
                    undefined, 
                    (p, m) => {
                        setProgress(30 + p * 0.7); // Scale remaining 70% for DB loading
                        setProgressMessage(m);
                    }
                );
                
                setAnalyticsData(analytics);
                setInitialDataLoaded(true);
                setProgress(100);
                
                // Small delay before hiding to prevent flashing
                setTimeout(() => setShowProgress(false), 500);
            } catch (err) {
                setError(`Error loading data: ${err instanceof Error ? err.message : 'Unknown error'}`);
                setShowProgress(false);
            } finally {
                setLoading(false);
            }
        };
        
        if (!initialDataLoaded) {
            loadInitialData();
        }
    }, [dbBuffer, dbKey, initialDataLoaded]);

    // Effect 2: Re-run analysis with filters when selection changes
    useEffect(() => {
        if (!initialDataLoaded || !dbBuffer) return;

        const reAnalyzeWithFilter = async () => {
            setLoading(true);
            setError(null);
            setShowProgress(true);
            
            try {
                setProgressMessage('Applying filters...');
                const filteredAnalytics = await loadDatabase(
                    dbBuffer, 
                    dbKey, 
                    selectedConversationIds.length > 0 ? selectedConversationIds : undefined,
                    (p, m) => {
                        setProgress(p);
                        setProgressMessage(m);
                    }
                );
                
                setAnalyticsData(filteredAnalytics);
                setProgress(100);
                
                // Small delay before hiding to prevent flashing
                setTimeout(() => setShowProgress(false), 500);
            } catch (err) {
                setError(`Error filtering data: ${err instanceof Error ? err.message : 'Unknown error'}`);
                setShowProgress(false);
            } finally {
                setLoading(false);
            }
        };

        reAnalyzeWithFilter();
    }, [selectedConversationIds, initialDataLoaded, dbBuffer, dbKey]);

    // Effect 3: Load individual stats when user is selected
    useEffect(() => {
        if (!dbBuffer || !selectedUser) return;
        
        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            setShowProgress(true);
            setProgress(0);
            setProgressMessage('Loading user stats...');
            
            try {
                const stats = await loadIndividualStats(
                    dbBuffer, 
                    dbKey, 
                    selectedUser,
                    (p, m) => {
                        setProgress(p);
                        setProgressMessage(m);
                    }
                );
                
                setStatsData(stats);
                setProgress(100);
                
                // Small delay before hiding to prevent flashing
                setTimeout(() => setShowProgress(false), 500);
            } catch (err) {
                setError(`Error loading user stats: ${err instanceof Error ? err.message : 'Unknown error'}`);
                setShowProgress(false);
            } finally {
                setLoading(false);
            }
        };
        
        fetchStats();
    }, [dbBuffer, dbKey, selectedUser]);

    // Memoize the progress dialog to prevent unnecessary re-renders
    const progressDialog = useMemo(() => (
        <ProgressDialog 
            open={showProgress} 
            progress={progress} 
            message={progressMessage} 
            title="Processing Database"
        />
    ), [showProgress, progress, progressMessage]);

    return (
        <div className="App">
            {progressDialog}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mr: 3 }}>
                        Signal Snapshot
                    </Typography>
                    <Button color="inherit" component={Link} to="/">
                        Dashboard
                    </Button>
                    <Button color="inherit" component={Link} to="/individual">
                        Individual Stats
                    </Button>
                    
                    {/* Spacer to push the database info and button to the right */}
                    <Box sx={{ flexGrow: 1 }} />
                    
                    {/* Only show database info and change button if a database is loaded */}
                    {dbBuffer && (
                        <>
                            {/* Current database info */}
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
                            
                            {/* Hidden file input for database upload */}
                            <input
                                type="file"
                                accept=".db,.sqlite,.sqlite3"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                id="change-db-input"
                                key={currentDbName} // Force re-render to clear the input when changing files
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
            
            <Container sx={{ mt: 4 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                
                {!dbBuffer && !loading && (
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <input
                            type="file"
                            accept=".db,.sqlite,.sqlite3"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            id="db-upload"
                        />
                        <label htmlFor="db-upload">
                            <Button variant="contained" component="span">
                                Upload Signal Database
                            </Button>
                        </label>
                    </Box>
                )}
                
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Dashboard
                                data={analyticsData}
                                loading={loading}
                                error={error}
                                selectedConversationIds={selectedConversationIds}
                                onConversationSelect={setSelectedConversationIds}
                                users={users}
                                selectedUser={selectedUser}
                                onUserSelect={setSelectedUser}
                            />
                        }
                    />
                    <Route
                        path="/individual"
                        element={
                            <IndividualStats
                                data={statsData}
                                loading={loading}
                                error={error}
                                users={users}
                                selectedUser={selectedUser}
                                onUserSelect={setSelectedUser}
                            />
                        }
                    />
                </Routes>
            </Container>
        </div>
    );
}

export default App;
