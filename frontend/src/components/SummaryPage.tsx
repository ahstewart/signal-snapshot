import React, { useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { AnalyticsData, User, UserActivity } from '../utils/database';
import { PageHeader } from './PageHeader';
import { theme } from '../theme/theme';

interface SummaryPageProps {
    data: AnalyticsData | null;
    loading: boolean;
    error: string | null;
    users: User[];
}

const SummaryPage: React.FC<SummaryPageProps> = ({ data, loading, error, users }) => {
    const [helpOpen, setHelpOpen] = useState(false);

    const handleHelpOpen = () => {
        setHelpOpen(true);
    };

    const handleHelpClose = () => {
        setHelpOpen(false);
    };
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
                  <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>{countLabel}</TableCell>
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
            <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #f4f7fa 70%, #e3ecf7 100%)', boxShadow: 3, borderRadius: 3, border: '1px solid #d6e0ef' }}>
                <Typography variant="h4" component="div">{value}</Typography>
                <Typography variant="body1" color="text.secondary">{title}</Typography>
            </Paper>
        </Grid>
    );

    return (
        <Box sx={{ p: 3 }}>
            {data && (
                <PageHeader 
                    title="Signal Snapshot Dashboard"
                    subtitle="Welcome to your Signal Snapshot! Explore different layers of your Signal ecosystem."
                />
            )}
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
            {!loading && !error && data ? (
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
                                            <TableCell sx={{ fontWeight: 'bold' }}>Conversation</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Messages</TableCell>
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
            ) : null}
        </Box>
    );
};

export default SummaryPage;
