import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import ProgressDialog from './components/ProgressDialog';
import Dashboard from './components/Dashboard';
import IndividualStats from './components/IndividualStats';
import SummaryPage from './components/SummaryPage';
import OneOnOnesPage from './components/OneOnOnesPage';
import AppLayout from './components/layout/AppLayout';
import './App.css';
import { AnalyticsData, IndividualStatsData, loadDatabase, loadIndividualStats, loadUsers, User } from './utils/database';
import * as gtag from './gtag';

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
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [showWelcome, setShowWelcome] = useState(true);

    // For SummaryPage, always pass the original, unfiltered analyticsData
    // Store the original analyticsData when loaded
    const [originalAnalyticsData, setOriginalAnalyticsData] = useState<AnalyticsData | null>(null);

    const navigate = useNavigate();
    const location = useLocation();

    // Show welcome dialog only on first load to /app/summary or "/"
    useEffect(() => {
        if (location.pathname === '/' || location.pathname === '/app' || location.pathname === '/app/') {
            setShowWelcome(true);
        }
    }, [location.pathname]);

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

            // After successful file upload, navigate to app summary page
            navigate('/app/summary');
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
                setOriginalAnalyticsData(analytics); // Save the original, unfiltered data
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

    // Auto-select first user when users are loaded and no user is selected
    // Only auto-select if users are loaded AND selectedUser is undefined (not empty string)
    useEffect(() => {
        // Remove auto-select logic to allow empty selection
    }, [users, selectedUser]);

    // Effect 3: Load individual stats when user is selected
    useEffect(() => {
        console.debug('App: Individual stats effect triggered', { dbBuffer, selectedUser });
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

    // send a pageview to GA when the route changes
    useEffect(() => {
        gtag.pageview(location.pathname + location.search);
    }, [location]);

    const drawerWidth = 240;

    return (
        <>
            {progressDialog}
            <Routes>
                {/* Redirect "/" and "/app" to summary, show welcome */}
                <Route path="/" element={<Navigate to="/app/summary" replace />} />
                <Route path="/app" element={<Navigate to="/app/summary" replace />} />
                {/* App routes */}
                <Route 
                    path="/app"
                    element={
                        <AppLayout 
                            dbBuffer={dbBuffer}
                            currentDbName={currentDbName}
                            onFileChange={handleFileChange}
                            error={error}
                            loading={loading}
                            showWelcome={showWelcome}
                            onCloseWelcome={() => setShowWelcome(false)}
                        />
                    }
                >
                    <Route 
                        index 
                        element={
                            dbBuffer ? (
                                <Navigate to="summary" replace />
                            ) : (
                                <Navigate to="summary" replace />
                            )
                        } 
                    />
                    <Route
                        path="summary"
                        element={
                            <SummaryPage
                                data={originalAnalyticsData}
                                loading={loading}
                                error={error}
                                users={users}
                            />
                        }
                    />
                    <Route
                        path="groupchats"
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
                        path="oneonones"
                        element={
                            <OneOnOnesPage
                                data={analyticsData}
                                loading={loading}
                                error={error}
                                users={users}
                                dbBuffer={dbBuffer || undefined}
                                dbKey={dbKey}
                                selectedConversationId={selectedConversationId}
                                onConversationSelect={setSelectedConversationId}
                            />
                        }
                    />
                    <Route
                        path="individual"
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
                </Route>
                {/* Redirect all other routes to summary */}
                <Route path="*" element={<Navigate to="/app/summary" replace />} />
            </Routes>
        </>
    );
};

export default App;
