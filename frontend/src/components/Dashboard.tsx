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
  Tooltip as MuiTooltip,
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
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import { AnalyticsData, Conversation, User, EmotionUserData } from '../utils/database';
import { PageHeader } from './PageHeader';

interface DashboardProps {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  selectedConversationIds: string[];
  onConversationSelect: (ids: string[]) => void;
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

  function renderConversationSummary() {
    if (selectedConversationIds.length !== 1) {
      return null;
    }
    
    const conversationId = selectedConversationIds[0];
    const conversation = analyticsData?.all_conversations.find((c: Conversation) => c.id === conversationId);

    if (!conversation?.summary) {
      return null;
    }

    return (
      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          mt: 3, 
          border: '1px solid', 
          borderColor: 'primary.main', 
          backgroundColor: 'rgba(25, 118, 210, 0.04)',
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
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
        
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'text.primary', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
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
      <Grid container spacing={2} sx={{ mb: 4, mt: 1 }}>
        {renderKpiCard('Total Messages', analyticsData?.kpis.total_messages ?? '...')}
        {renderKpiCard('Total Members', totalMembers)}
        {renderKpiCard('Avg Messages / Day', analyticsData?.kpis.avg_messages_per_day ?? '...')}
      </Grid>
    );
  }

  function renderDailyChart() {
    return (
      <Paper sx={{ p: { xs: 2, sm: 5 }, height: { xs: 300, md: 400 }, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>Daily Message Activity</Typography>
        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        {analyticsData?.message_counts?.by_day ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={Object.entries(analyticsData.message_counts.by_day)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="0" />
              <YAxis width={40} />
              <Tooltip />
              <Line type="monotone" dataKey="1" stroke="#8884d8" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : <Typography variant="body2" color="text.secondary">No data</Typography>}
        </Box>
      </Paper>
    );
  }

  function renderHourlyChart() {
    // Transform UTC hours to Pacific Time (UTC-7)
    let pacificData: { hour: number; count: number }[] = [];
    
    if (analyticsData?.message_counts?.by_hour) {
      const utcData = analyticsData.message_counts.by_hour;
      for (let h = 0; h < 24; h++) {
        // Pacific Hour 'h' corresponds to UTC Hour '(h + 7)' (wrapping around 24)
        const utcHour = (h + 7) % 24;
        const utcKey = utcHour.toString().padStart(2, '0');
        const count = utcData[utcKey] || 0;
        pacificData.push({ hour: h, count });
      }
    }

    return (
      <Paper sx={{ p: { xs: 2, sm: 5 }, height: { xs: 300, md: 400 }, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>Hourly Activity (Pacific Time)</Typography>
        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        {pacificData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pacificData}>
              <XAxis 
                dataKey="hour" 
                tickFormatter={(v) => formatHour(parseInt(v as string, 10))} 
                type="number"
                domain={[0, 23]}
                tickCount={12}
              />
              <YAxis width={40} />
              <Tooltip labelFormatter={(v) => `${formatHour(v)} PT`} />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        ) : <Typography variant="body2" color="text.secondary">No data</Typography>}
        </Box>
      </Paper>
    );
  }

  function renderReactionAnalytics() {
    return (
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h4" component="div">{analyticsData?.reactions.total_reactions ?? '...'}</Typography>
            <Typography variant="body1" color="text.secondary">Total Reactions</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, overflowX: 'auto' }}>
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
                        <TableCell component="th" scope="row" sx={{ fontSize: '1.2rem' }}>{reaction.emoji}</TableCell>
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

  function renderAwardCard(title: string, award: { winner: string | null; count: number }, suffix: string = "", tooltip: string = "") {
    return (
      <Grid item xs={12} sm={6} md={4} key={title}>
        <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <MuiTooltip title={tooltip} arrow placement="top">
            <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                    textAlign: 'center', 
                    fontSize: '1.0rem',
                    textDecoration: 'underline dotted',
                    textDecorationColor: 'text.secondary',
                    cursor: 'help',
                    width: 'fit-content',
                    mb: 1,
                    fontWeight: 800,
                    color: 'text.secondary'
                }}
            >
                {title}
            </Typography>
          </MuiTooltip>
          {award.winner ? (
            <>
              <Typography 
                variant="h4" 
                component="div" 
                sx={{ 
                  fontWeight: 800, 
                  fontSize: { xs: '1.3rem', md: '1.5rem' },
                  overflowWrap: 'break-word', 
                  my: 0.5, 
                  maxWidth: '100%', 
                  textAlign: 'center',
                  color: 'primary.main'
                }}
              >
                {getUserName(award.winner)}
              </Typography>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'medium', color: 'text.secondary', fontSize: '1rem' }}>
                {award.count.toLocaleString()} {suffix && <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>{suffix}</Typography>}
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
      most_mentions_made: "Most Mentions Made",
      most_media_sent: "Most Media Sent",
      most_night_owl: "Night Owl",
      most_early_bird: "Early Bird",
      longest_avg_message: "The Rambler",
      hottest_newbie: "Hottest Newbie",
      lurker: "The Lurker",
      most_unique_emojis: "The Emoji Artist",
    };

    const awardSuffixes: Record<keyof typeof analyticsData.awards, string> = {
        most_messages_sent: "messages",
        most_reactions_given: "reactions",
        most_reactions_received: "received",
        most_mentioned: "mentions",
        most_mentions_made: "mentions",
        most_media_sent: "files",
        most_night_owl: "%", 
        most_early_bird: "%", 
        longest_avg_message: "chars/msg",
        hottest_newbie: "messages",
        lurker: "reacts/msg",
        most_unique_emojis: "unique emojis"
    };

    const awardTooltips: Record<keyof typeof analyticsData.awards, string> = {
      most_messages_sent: "Total count of messages sent.",
      most_reactions_given: "Total count of reaction emojis added to others' messages.",
      most_reactions_received: "Total count of reaction emojis received on their messages.",
      most_mentioned: "Total times tagged/mentioned by others.",
      most_mentions_made: "Total times they tagged/mentioned others.",
      most_media_sent: "Total count of images, videos, or files sent.",
      most_night_owl: "Percentage of their messages sent between 12 AM and 5 AM (Pacific).",
      most_early_bird: "Percentage of their messages sent between 5 AM and 9 AM (Pacific).",
      longest_avg_message: "Highest average character count per message (min 10 messages).",
      hottest_newbie: "Most messages sent by a user who joined in 2025.",
      lurker: "Highest ratio of reactions given to messages sent (min 5 reactions).",
      most_unique_emojis: "Highest number of unique emoji types used in reactions."
    };

    return (
      <Box sx={{ mt: 4 }}>
         <Typography variant="h4" sx={{ 
            fontWeight: 'bold', 
            borderLeft: '6px solid #1976d2', 
            pl: 2, 
            mb: 2, 
            color: '#222', 
            background: 'linear-gradient(90deg, #f4f7fa 0%, #e3ecf7 100%)', 
            borderRadius: 2, 
            boxShadow: 1,
            fontSize: { xs: '1.5rem', md: '2.125rem' }
         }}>
            Awards
         </Typography>
        <Grid container spacing={2}>
          {Object.entries(analyticsData.awards).map(([key, award]) =>
            renderAwardCard(
              awardDisplayTitles[key as keyof typeof analyticsData.awards] || key,
              award as { winner: string | null; count: number },
              awardSuffixes[key as keyof typeof analyticsData.awards] || "",
              awardTooltips[key as keyof typeof analyticsData.awards] || ""
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
        <Typography variant="h5" gutterBottom sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>{title}</Typography>
        <Paper sx={{ p: 0, overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>{totalReactsLabel}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Rate</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>{scoreLabel}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(0, 10).map((user: EmotionUserData) => (
                  <TableRow key={user.name}>
                    <TableCell component="th" scope="row">{user.name}</TableCell>
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

  return (
    <Box sx={{ p: { xs: 1, md: 2 }, overflowX: 'hidden' }}>
      <PageHeader 
        title="Group Chat Analytics"
        subtitle="Select a group chat to analyze."
      >
        {analyticsData?.all_conversations && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', mt: 2 }}>
            <Autocomplete
              fullWidth
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

      {renderConversationSummary()}

      {renderKpiSummary()}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          {renderDailyChart()}
        </Grid>
        <Grid item xs={12} sx={{ mb: 2 }}>
           {renderHourlyChart()}
        </Grid>

        <Grid item xs={12} sx={{ mb: 2 }}>
          {renderReactionAnalytics()}
        </Grid>
        
        <Grid item xs={12}>
          {renderAwards()}
        </Grid>

        {analyticsData && (
            <>
                <Grid item xs={12} md={6} lg={4}>
                <EmotionRankings
                    title="😂 Who is the Funniest? 😂"
                    data={analyticsData.funniestUsers}
                    scoreLabel="Humor Score"
                    totalReactsLabel="Total Laugh Reacts"
                />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                <EmotionRankings
                    title="❤️ Who is the Most Loved? ❤️"
                    data={analyticsData.mostLovedUsers}
                    scoreLabel="Love Score"
                    totalReactsLabel="Total Love Reacts"
                />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                <EmotionRankings
                    title="😮 Who is the Most Shocking? 😮"
                    data={analyticsData.mostShockingUsers}
                    scoreLabel="Shock Score"
                    totalReactsLabel="Total Shock Reacts"
                />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                <EmotionRankings
                    title="👎 Who is the Most Disliked? 👎"
                    data={analyticsData.mostDislikedUsers}
                    scoreLabel="Dislike Score"
                    totalReactsLabel="Total Dislikes"
                />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                <EmotionRankings
                    title="🍆 Who is the Most Randy? 🍆"
                    data={analyticsData.mostRandyUsers}
                    scoreLabel="Randy Score"
                    totalReactsLabel="Total Eggplants"
                />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                <EmotionRankings
                    title="🍆 Who is the Most Thirsty? 🍆"
                    data={analyticsData.mostThirstyUsers}
                    scoreLabel="Thirst Score"
                    totalReactsLabel="Total Eggplants"
                />
                </Grid>
            </>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;