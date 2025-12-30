import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Alert } from '@mui/material';
import ProgressDialog from './components/ProgressDialog';
import Dashboard from './components/Dashboard';
import IndividualStats from './components/IndividualStats';
import SummaryPage from './components/SummaryPage';
import OneOnOnesPage from './components/OneOnOnesPage';
import AppLayout from './components/layout/AppLayout';
import './App.css';
import { AnalyticsData, IndividualStatsData, loadDatabase, loadIndividualStats, loadUsers, User } from './utils/database';
import * as gtag from './gtag';
import { STATIC_SNAPSHOT } from './utils/staticSnapshot';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [dbBuffer, setDbBuffer] = useState<ArrayBuffer | null>(null);
  const [dbKey, setDbKey] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDbName, setCurrentDbName] = useState<string>('No database loaded');
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [showProgress, setShowProgress] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedConversationIds, setSelectedConversationIds] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [statsData, setStatsData] = useState<IndividualStatsData | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [originalAnalyticsData, setOriginalAnalyticsData] = useState<AnalyticsData | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isSnapshotMode = location.pathname.startsWith('/snapshot');

  useEffect(() => {
    if (isSnapshotMode && !initialDataLoaded && STATIC_SNAPSHOT) {
      setLoading(true);
      try {
        console.log("Loading Static Snapshot...");
        setAnalyticsData(STATIC_SNAPSHOT.analytics);
        setOriginalAnalyticsData(STATIC_SNAPSHOT.analytics);
        setUsers(STATIC_SNAPSHOT.users);
        setDbBuffer(new ArrayBuffer(0));
        setCurrentDbName("Shared Snapshot");
        setInitialDataLoaded(true);
        setShowWelcome(false);
      } catch (err: any) {
        setError("Failed to load snapshot data: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  }, [isSnapshotMode, initialDataLoaded]);

  useEffect(() => {
    if (!isSnapshotMode && (location.pathname === '/' || location.pathname === '/app' || location.pathname === '/app/')) {
      setShowWelcome(true);
    }
  }, [location.pathname, isSnapshotMode]);

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
      const header = new Uint8Array(buffer, 0, 16);
      const headerStr = Array.from(header).map(b => String.fromCharCode(b)).join('');
      if (!headerStr.startsWith('SQLite format 3\0')) {
        const key = window.prompt('Enter database decryption key:');
        if (!key) throw new Error('Decryption key is required');
        setDbKey(key);
      } else {
        setDbKey(undefined);
      }
      navigate('/app/summary');
    } catch (err) {
      setError(`Error reading file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setShowProgress(false);
    }
  };

  useEffect(() => {
    if (isSnapshotMode) return; 

    const loadInitialData = async () => {
      if (!dbBuffer) return;
      setLoading(true);
      setError(null);
      setShowProgress(true);
      try {
        setProgressMessage('Loading users...');
        const loadedUsers = await loadUsers(dbBuffer, dbKey, (p: number, m: string) => {
          setProgress(p * 0.3);
          setProgressMessage(m);
        });
        setUsers(loadedUsers);
        
        setProgressMessage('Loading database...');
        const analytics = await loadDatabase(
          dbBuffer, 
          dbKey, 
          undefined,
          undefined,
          (p: number, m: string) => {
            setProgress(30 + p * 0.7);
            setProgressMessage(m);
          }
        );
        setAnalyticsData(analytics);
        setOriginalAnalyticsData(analytics);
        setInitialDataLoaded(true);
        setProgress(100);
        setTimeout(() => setShowProgress(false), 500);
      } catch (err) {
        setError(`Error loading data: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setShowProgress(false);
      } finally {
        setLoading(false);
      }
    };
    if (!initialDataLoaded) loadInitialData();
  }, [dbBuffer, dbKey, initialDataLoaded, isSnapshotMode]);

  useEffect(() => {
    if (isSnapshotMode || !initialDataLoaded || !dbBuffer) return;

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
          undefined,
          (p: number, m: string) => {
            setProgress(p);
            setProgressMessage(m);
          }
        );
        setAnalyticsData(filteredAnalytics);
        setProgress(100);
        setTimeout(() => setShowProgress(false), 500);
      } catch (err) {
        setError(`Error filtering data: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setShowProgress(false);
      } finally {
        setLoading(false);
      }
    };
    reAnalyzeWithFilter();
  }, [selectedConversationIds, initialDataLoaded, dbBuffer, dbKey, isSnapshotMode]);

  useEffect(() => {
    if (isSnapshotMode) return;
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
          (p: number, m: string) => {
            setProgress(p);
            setProgressMessage(m);
          }
        );
        setStatsData(stats);
        setProgress(100);
        setTimeout(() => setShowProgress(false), 500);
      } catch (err) {
        setError(`Error loading user stats: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setShowProgress(false);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [dbBuffer, dbKey, selectedUser, isSnapshotMode]);

  const progressDialog = useMemo(() => (
    <ProgressDialog open={showProgress} progress={progress} message={progressMessage} title="Processing Database" />
  ), [showProgress, progress, progressMessage]);

  useEffect(() => {
    gtag.pageview(location.pathname + location.search);
  }, [location]);

  return (
    <>
      {progressDialog}
      <Routes>
        <Route path="/" element={<Navigate to="/app/summary" replace />} />
        <Route path="/app" element={<Navigate to="/app/summary" replace />} />
        <Route 
          path="/snapshot" 
          element={
            <AppLayout 
              dbBuffer={dbBuffer}
              currentDbName={currentDbName}
              onFileChange={handleFileChange}
              error={error}
              loading={loading}
              showWelcome={false}
              onCloseWelcome={() => setShowWelcome(false)}
              originalAnalyticsData={originalAnalyticsData}
              basePath="/snapshot"
            />
          }
        >
          <Route index element={<Navigate to="summary" replace />} />
          <Route path="summary" element={<SummaryPage data={originalAnalyticsData} loading={loading} error={error} users={users} />} />
          <Route path="groupchats" element={<Dashboard data={analyticsData} loading={loading} error={error} selectedConversationIds={selectedConversationIds} onConversationSelect={setSelectedConversationIds} users={users} selectedUser={selectedUser} onUserSelect={setSelectedUser} />} />
          <Route path="*" element={<Navigate to="summary" replace />} />
        </Route>
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
              originalAnalyticsData={originalAnalyticsData}
              basePath="/app"
            />
          }
        >
          <Route index element={<Navigate to="summary" replace />} />
          <Route path="summary" element={<SummaryPage data={originalAnalyticsData} loading={loading} error={error} users={users} />} />
          <Route path="groupchats" element={<Dashboard data={analyticsData} loading={loading} error={error} selectedConversationIds={selectedConversationIds} onConversationSelect={setSelectedConversationIds} users={users} selectedUser={selectedUser} onUserSelect={setSelectedUser} />} />
          <Route path="oneonones" element={<OneOnOnesPage data={analyticsData} loading={loading} error={error} users={users} dbBuffer={dbBuffer || undefined} dbKey={dbKey} selectedConversationId={selectedConversationId} onConversationSelect={setSelectedConversationId} />} />
          <Route path="individual" element={<IndividualStats data={statsData} loading={loading} error={error} users={users} selectedUser={selectedUser} onUserSelect={setSelectedUser} />} />
        </Route>
        <Route path="*" element={<Navigate to="/app/summary" replace />} />
      </Routes>
    </>
  );
};

export default App;