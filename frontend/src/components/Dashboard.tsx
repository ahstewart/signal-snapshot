import React, { useState, useEffect, useRef } from 'react';

import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
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

import { loadDatabase, Conversation, AnalyticsData, EmotionUserData, User } from '../utils/database';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
type EmojiCount = { emoji: string; count: number };

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
interface DashboardProps {
  data: AnalyticsData | null; // Changed from any to AnalyticsData | null
  loading: boolean;
  error: string | null;
  selectedConversationIds: string[];
  onConversationSelect: React.Dispatch<React.SetStateAction<string[]>>;
  users: User[]; // Changed from any[] to User[]
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
  selectedUser,
  onUserSelect
}: DashboardProps) => {
  const handleConversationChange = (event: any, value: string | null) => {
    onConversationSelect(value ? [value] : []);
  };

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  function formatHour(hour: number): string {
    return `${hour}:00`;
  }

  // Create a map of user IDs to names
  const userNameMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    users.forEach(user => {
      map[user.id] = user.name;
    });
    return map;
  }, [users]);

  // Helper function to get user name by ID
  const getUserName = (id: string): string => {
    return userNameMap[id] || id;
  };
  
  // Use the data prop as analyticsData for backward compatibility
  const analyticsData = data;
  
  // Helper function to safely access analyticsData properties
  const getAnalyticsData = <T,>(getter: (data: AnalyticsData) => T, defaultValue: T): T => {
    return analyticsData ? getter(analyticsData) : defaultValue;
  };

  // Early return if no data is available
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

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------
  function renderConversationSummary() {
    if (selectedConversationIds.length !== 1) {
      return null;
    }
    
    const allConversations = getAnalyticsData(data => data.all_conversations, []);
    if (!allConversations) {
      return null;
    }
    
    const conversationId = selectedConversationIds[0];
    const conversation = allConversations.find((c: Conversation) => c.id === conversationId);

    if (!conversation?.summary) {
      return null;
    }

    return (
      <Paper sx={{ p: 2, mt: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          Conversation Summary
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {conversation.summary}
        </Typography>
      </Paper>
    );
  }

  function renderKpiCard(title: string, value: string | number) {
    return (
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" component="div">{value}</Typography>
          <Typography variant="body1" color="text.secondary">{title}</Typography>
        </Paper>
      </Grid>
    );
  }

  function renderKpiSummary() {
    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {renderKpiCard('Total Messages', analyticsData?.kpis.total_messages ?? '...')}
        {renderKpiCard('Total Conversations', analyticsData?.kpis.total_conversations ?? '...')}
        {renderKpiCard('Avg Messages / Day', analyticsData?.kpis.avg_messages_per_day ?? '...')}
      </Grid>
    );
  }

  function renderDailyChart() {
    return (
      <Paper sx={{ p: 2, height: 400 }}>
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
      <Paper sx={{ p: 2, height: 400 }}>
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
                  <TableCell>Conversation</TableCell>
                  <TableCell align="right">Messages</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analyticsData.top_conversations.map((convo: { name: string; count: number }) => (
                  <TableRow key={convo.name}>
                    <TableCell component="th" scope="row">
                      {getUserName(convo.name)}
                    </TableCell>
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
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>Reaction Analytics</Typography>
        </Grid>
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
                      <TableCell>Emoji</TableCell>
                      <TableCell align="right">Count</TableCell>
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
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>Top 3 Emojis by Author</Typography>
            {analyticsData?.reactions?.top_emojis_by_author && Object.keys(analyticsData.reactions.top_emojis_by_author).length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Author</TableCell>
                      <TableCell>Top Reactions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(analyticsData.reactions.top_emojis_by_author).map(([authorId, emojis]) => {
                      const userName = getUserName(authorId);
                      return (
                        <TableRow key={authorId}>
                          <TableCell component="th" scope="row" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', overflowWrap: 'break-word', maxWidth: '150px' }}>{userName}</TableCell>
                          <TableCell>{(emojis as EmojiCount[]).map(e => `${e.emoji} (${e.count})`).join(', ')}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : <Typography variant="body2" color="text.secondary">No data</Typography>}
          </Paper>
        </Grid>
      </Grid>
    );
  }

  function renderAwardCard(title: string, award: { winner: string | null; count: number }) {
    return (
      <Grid item xs={12} sm={6} md={4} key={title}>
        <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ textAlign: 'center' }}>{title}</Typography>
          {award.winner ? (
            <>
              <Typography variant="body1" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', overflowWrap: 'break-word', my: 1, maxWidth: '100%' }}>
                {award.winner ? getUserName(award.winner) : 'N/A'}
              </Typography>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                {award.count}
              </Typography>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              No data
            </Typography>
          )}
        </Paper>
      </Grid>
    );
  }

  function renderAwards() {
    if (!analyticsData?.awards) return null;

    const awardDisplayTitles: Record<keyof typeof analyticsData.awards, string> = {
      most_messages_sent: "Most Messages Sent",
      most_reactions_given: "Most Reactions Given",
      most_reactions_received: "Most Reactions Received",
      most_mentioned: "Most Mentioned",
      most_replied_to: "Most Replied To",
      most_media_sent: "Most Media Sent",
    };

    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>🏆 Awards 🏆</Typography>
        <Grid container spacing={3}>
          {Object.entries(analyticsData.awards).map(([key, award]) =>
            renderAwardCard(
              awardDisplayTitles[key as keyof typeof analyticsData.awards],
              award as { winner: string | null; count: number }
            )
          )}
        </Grid>
      </Box>
    );
  }

  function EmotionRankings({ title, data, scoreLabel, totalReactsLabel }: {
    title: string;
    data: EmotionUserData[];
    scoreLabel: string;
    totalReactsLabel: string;
  }) {
    if (!data || data.length === 0) {
      return null;
    }

    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>{title}</Typography>
        <Paper sx={{ p: 2 }}>
          <TableContainer>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell align="right">{totalReactsLabel}</TableCell>
                  <TableCell align="right">Rate</TableCell>
                  <TableCell align="right">{scoreLabel}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((user: EmotionUserData) => (
                  <TableRow key={user.name}>
                    <TableCell component="th" scope="row">
                      {user.name}
                    </TableCell>
                    <TableCell align="right">{user.totalReacts}</TableCell>
                    <TableCell align="right">{user.rate.toFixed(3)}</TableCell>
                    <TableCell align="right">{user.score.toFixed(3)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!analyticsData) {
    return <Typography>No data available.</Typography>;
  }

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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Group Chats
      </Typography>

      {analyticsData.all_conversations && (
        <Box sx={{ mb: 4 }}>
          <Autocomplete
            options={analyticsData.all_conversations.map((convo: Conversation) => convo.id)}
            getOptionLabel={(id) => {
              const conversation = analyticsData.all_conversations.find((c: Conversation) => c.id === id);
              return conversation?.name || id;
            }}
            value={selectedConversationIds[0] || null}
            onChange={handleConversationChange}
            renderInput={(params) => <TextField {...params} label="Filter by Conversation" />}
            isOptionEqualToValue={(option, value) => option === value}
          />
          {renderConversationSummary()}
        </Box>
      )}

      {renderKpiSummary()}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          {renderDailyChart()}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderTopConversations()}
        </Grid>
        <Grid item xs={12}>
           {renderHourlyChart()}
        </Grid>
        <Grid item xs={12}>
          {renderReactionAnalytics()}
        </Grid>
        <Grid item xs={12}>
          {renderAwards()}
        </Grid>
        <Grid item xs={12}>
          <EmotionRankings
            title="😂 Who is the Funniest? 😂"
            data={analyticsData.funniestUsers}
            scoreLabel="Humor Score"
            totalReactsLabel="Total Laugh Reacts"
          />
        </Grid>
        <Grid item xs={12}>
          <EmotionRankings
            title="😮 Who is the Most Shocking? 😮"
            data={analyticsData.mostShockingUsers}
            scoreLabel="Shock Score"
            totalReactsLabel="Total Shock Reacts"
          />
        </Grid>
        <Grid item xs={12}>
          <EmotionRankings
            title="❤️ Who is the Most Loved? ❤️"
            data={analyticsData.mostLovedUsers}
            scoreLabel="Love Score"
            totalReactsLabel="Total Love Reacts"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
