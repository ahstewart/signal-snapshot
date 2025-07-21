import React from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { AnalyticsData, User, UserActivity } from '../utils/database';

interface SummaryPageProps {
    data: AnalyticsData | null;
    loading: boolean;
    error: string | null;
    users: User[];
}

const SummaryPage: React.FC<SummaryPageProps> = ({ data, loading, error, users }) => {
    function renderTopUsersTable(title: string, data: UserActivity[], countLabel: string) {
    if (!data || data.length === 0) return null;

    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Paper sx={{ p: 2 }}>
          <TableContainer>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell align="right">{countLabel}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((user: UserActivity) => (
                  <TableRow key={user.name}>
                    <TableCell component="th" scope="row">
                      {user.name}
                    </TableCell>
                    <TableCell align="right">{user.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    );
  }
    // Always use the full analytics data, not filtered by selection
    const renderKpiCard = (title: string, value: string | number) => (
        <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" component="div">{value}</Typography>
                <Typography variant="body1" color="text.secondary">{title}</Typography>
            </Paper>
        </Grid>
    );

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Summary
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
                Welcome to your Signal Snapshot! Use the navigation menu to your left to explore different layers of your Signal ecosystem. The top view is "Group Chats", which are defined as conversations with more than 2 members. Next are "One-on-Ones", which are all chats between you and one other person. Lastly, there is an "Individuals" view, which dives deep into an individual person's Signal usage.
            </Typography>
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                    <CircularProgress />
                </Box>
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {!loading && !error && data && (
                <>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {renderKpiCard('Total Messages', data.kpis.total_messages)}
                        {renderKpiCard('Total Conversations', data.kpis.total_conversations)}
                        {renderKpiCard('Total Users', users.length)}
                    </Grid>
                    <Paper sx={{ p: 3, mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Top Conversations by Message Count
                        </Typography>
                        {data.top_conversations && data.top_conversations.length > 0 ? (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Conversation</TableCell>
                                            <TableCell align="right">Messages</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.top_conversations.map((convo) => (
                                            <TableRow key={convo.name}>
                                                <TableCell>{convo.name}</TableCell>
                                                <TableCell align="right">{convo.count}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography variant="body2" color="text.secondary">No data</Typography>
                        )}
                    </Paper>
                    <Grid container spacing={3} sx={{ mt: 0 }}>
                         <Grid item xs={12} md={6}>
                            {renderTopUsersTable(
                                'Top Users by Message Count',
                                data.topUsersByMessageCount,
                                'Messages Sent'
                            )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {renderTopUsersTable(
                                'Top Users by Reaction Count',
                                data.topUsersByReactionCount,
                                'Reactions Given'
                            )}
                        </Grid>
                    </Grid>
                </>
            )}
        </Box>
    );
};

export default SummaryPage;
