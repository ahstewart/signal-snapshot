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

import { loadDatabase, Conversation, AnalyticsData, EmotionUserData } from '../utils/database';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
type EmojiCount = { emoji: string; count: number };

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
interface DashboardProps {
  analyticsData: any;
  loading: boolean;
  error: string | null;
  selectedConversationIds: string[];
  setSelectedConversationIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const Dashboard: React.FC<DashboardProps> = ({ analyticsData, loading, error, selectedConversationIds, setSelectedConversationIds }) => {
  const handleConversationChange = (event: SelectChangeEvent<string[]>) => {
    const { target: { value } } = event;
    setSelectedConversationIds(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  function formatHour(hour: number): string {
    return `${hour}:00`;
  }

  // No local state or handlers needed; all data comes from props

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------
  function renderConversationSummary() {
    if (selectedConversationIds.length !== 1) {
      return null;
    }
    const conversationId = selectedConversationIds[0];
    const conversation = analyticsData.all_conversations.find((c: Conversation) => c.id === conversationId);

    if (!conversation || !conversation.summary) {
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
                      {analyticsData.userNamesById?.[convo.name] || convo.name}
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
                      const userName = analyticsData.userNamesById?.[authorId] || authorId;
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
                {analyticsData.userNamesById?.[award.winner as string] || award.winner}
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Signal Analytics Dashboard
      </Typography>

      {analyticsData?.all_conversations && (
        <Box sx={{ mb: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="conversation-filter-label">Filter by Conversation</InputLabel>
            <Select
              labelId="conversation-filter-label"
              multiple
              value={selectedConversationIds}
              onChange={handleConversationChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((value) => {
                    const conversation = analyticsData.all_conversations.find((c: Conversation) => c.id === value);
                    return <Chip key={value} label={conversation?.name || value} />;
                  })}
                </Box>
              )}
            >
              {analyticsData.all_conversations.map((convo: Conversation) => (
                <MenuItem key={convo.id} value={convo.id}>
                  <Checkbox checked={selectedConversationIds.indexOf(convo.id) > -1} />
                  <ListItemText primary={convo.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
