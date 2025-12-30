import React from 'react';

import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from '@mui/material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Autocomplete, TextField } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // Import the icon

import { AnalyticsData, Conversation, User } from '../utils/database';
import { PageHeader } from './PageHeader';

interface DashboardProps {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  selectedConversationIds: string[];
  onConversationSelect: React.Dispatch<React.SetStateAction<string[]>>;
  users: User[];
  selectedUser: string;
  onUserSelect: (user: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  data, 
  loading, 
  error, 
  selectedConversationIds, 
  onConversationSelect,
  users,
}: DashboardProps) => {
  const handleConversationChange = (event: any, value: string | null) => {
    onConversationSelect(value ? [value] : []);
  };

  function formatHour(hour: number): string {
    return `${hour}:00`;
  }

  const userNameMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    users.forEach(user => {
      map[user.id] = user.name;
    });
    return map;
  }, [users]);

  const getUserName = (id: string): string => {
    return userNameMap[id] || id;
  };
  
  const analyticsData = data;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!analyticsData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No data available. Please upload a Signal database to get started.</Alert>
      </Box>
    );
  }

  // --- NEW: AI Summary Widget ---
  function renderConversationSummary() {
    // Only show if exactly one conversation is selected
    if (selectedConversationIds.length !== 1) {
      return null;
    }
    
    const conversationId = selectedConversationIds[0];
    const conversation = analyticsData?.all_conversations.find((c: Conversation) => c.id === conversationId);

    // If no summary exists yet, we simply don't render the card (or you could render a loading state)
    if (!conversation?.summary) {
      return null;
    }

    return (
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mt: 3, 
          border: '1px solid', 
          borderColor: 'primary.main', 
          backgroundColor: 'rgba(25, 118, 210, 0.04)', // Light primary color background
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative background element */}
        <Box sx={{ 
            position: 'absolute', 
            top: -20, 
            right: -20, 
            opacity: 0.1, 
            transform: 'rotate(15deg)' 
        }}>
            <AutoAwesomeIcon sx={{ fontSize: 100, color: 'primary.main' }} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <AutoAwesomeIcon color="primary" />
            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                AI Conversation Summary
            </Typography>
            <Chip label="BETA" size="small" color="primary" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
        </Box>
        
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'text.primary' }}>
          {conversation.summary}
        </Typography>
        
        <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary', fontStyle: 'italic' }}>
          Generated privately on your device using the DistilBART model.
        </Typography>
      </Paper>
    );
  }

  function renderKpiCard(title: string, value: string | number) {
    return (
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #f4f7fa 70%, #e3ecf7 100%)', boxShadow: 3, borderRadius: 3, border: '1px solid #d6e0ef' }}>
          <Typography variant="h4" component="div">{value}</Typography>
          <Typography variant="body1" color="text.secondary">{title}</Typography>
        </Paper>
      </Grid>
    );
  }

  function renderKpiSummary() {
    let totalMembers = 0;
    if (selectedConversationIds.length === 1) {
      const selectedConvo = analyticsData?.all_conversations.find(c => c.id === selectedConversationIds[0]);
      totalMembers = selectedConvo?.memberCount || 0;
    } else {
      totalMembers = analyticsData?.kpis.total_members || 0;
    }

    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {renderKpiCard('Total Messages', analyticsData?.kpis.total_messages ?? '...')}
        {renderKpiCard('Total Members', totalMembers)}
        {renderKpiCard('Avg Messages / Day', analyticsData?.kpis.avg_messages_per_day ?? '...')}
      </Grid>
    );
  }

  function renderDailyChart() {
    return (
      <Paper sx={{ p: 5, height: 400 }}>
        <Typography variant="h6" gutterBottom>Daily Message Activity</Typography>
        {analyticsData?.message_counts?.by_day ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={Object.entries(analyticsData.message_counts.by_day)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="0" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="1" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        ) : <Typography variant="body2" color="text.secondary">No data</Typography>}
      </Paper>
    );
  }

  function renderHourlyChart() {
    return (
      <Paper sx={{ p: 5, height: 400 }}>
        <Typography variant="h6" gutterBottom>Hourly Activity</Typography>
        {analyticsData?.message_counts?.by_hour ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={Object.entries(analyticsData.message_counts.by_hour)}>
              <XAxis dataKey="0" tickFormatter={(v) => formatHour(parseInt(v as string, 10))} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="1" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        ) : <Typography variant="body2" color="text.secondary">No data</Typography>}
      </Paper>
    );
  }

  function renderTopConversations() {
    return (
      <Paper sx={{ p: 2, height: 'calc(100% - 32px)', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>Top Conversations</Typography>
        {analyticsData?.top_conversations && analyticsData.top_conversations.length > 0 ? (
          <TableContainer sx={{ flexGrow: 1 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Conversation</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Messages</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analyticsData.top_conversations.map((convo: { name: string; count: number }) => (
                  <TableRow key={convo.name}>
                    <TableCell component="th" scope="row">{getUserName(convo.name)}</TableCell>
                    <TableCell align="right">{convo.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : <Typography variant="body2" color="text.secondary">No data</Typography>}
      </Paper>
    );
  }

  function renderReactionAnalytics() {
    return (
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%', textAlign: 'center' }}>
            <Typography variant="h4" component="div">{analyticsData?.reactions.total_reactions ?? '...'}</Typography>
            <Typography variant="body1" color="text.secondary">Total Reactions</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Top 10 Emojis</Typography>
            {analyticsData?.reactions?.top_emojis && analyticsData.reactions.top_emojis.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Emoji</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analyticsData.reactions.top_emojis.map((reaction: { emoji: string; count: number }) => (
                      <TableRow key={reaction.emoji}>
                        <TableCell component="th" scope="row">{reaction.emoji}</TableCell>
                        <TableCell align="right">{reaction.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : <Typography variant="body2" color="text.secondary">No data</Typography>}
          </Paper>
        </Grid>
      </Grid>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <PageHeader 
        title="Group Chat Analytics"
        subtitle="Select a group chat to analyze its content and behavior of the members."
      >
        {analyticsData?.all_conversations && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Autocomplete
              sx={{ minWidth: 300, mt: { xs: 2, sm: 0 } }}
              options={analyticsData.all_conversations.map((convo: Conversation) => convo.id)}
              getOptionLabel={(id) => {
                const conversation = analyticsData.all_conversations.find((c: Conversation) => c.id === id);
                return conversation?.name || id;
              }}
              value={selectedConversationIds[0] || null}
              onChange={handleConversationChange}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Select Group Chat" 
                  variant="outlined"
                  size="small"
                />
              )}
              isOptionEqualToValue={(option, value) => option === value}
            />
          </Box>
        )}
      </PageHeader>

      {/* Render the AI Summary here */}
      {renderConversationSummary()}

      {renderKpiSummary()}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          {renderDailyChart()}
        </Grid>
        <Grid item xs={12} sx={{ mb: 5 }}>
           {renderHourlyChart()}
        </Grid>

        <Grid item xs={12} md={4}>
          {renderTopConversations()}
        </Grid>

        <Grid item xs={12} sx={{ mb: 5 }}>
          {renderReactionAnalytics()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;