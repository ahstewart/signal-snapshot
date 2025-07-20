import React from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { AnalyticsData, User, Conversation } from '../utils/database';

interface OneOnOnesPageProps {
    data: AnalyticsData | null;
    loading: boolean;
    error: string | null;
    users: User[];
}

const OneOnOnesPage: React.FC<OneOnOnesPageProps> = ({ data, loading, error, users }) => {
    // Filter conversations of type=private
    const privateConversations: Conversation[] = (data?.all_conversations || []).filter(
        (c: any) => c.type === 'private'
    );

    // KPIs for private conversations
    const totalMessages = data?.kpis?.total_messages ?? 0;
    const totalConversations = privateConversations.length;
    const totalUsers = users.length;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                One-on-Ones
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
                This page shows metrics for all one-on-one conversations (type=private).
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
            {!loading && !error && (
                <>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={4}>
                            <Paper sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="h4" component="div">{totalMessages}</Typography>
                                <Typography variant="body1" color="text.secondary">Total Messages</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Paper sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="h4" component="div">{totalConversations}</Typography>
                                <Typography variant="body1" color="text.secondary">Total One-on-One Conversations</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Paper sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="h4" component="div">{totalUsers}</Typography>
                                <Typography variant="body1" color="text.secondary">Total Users</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Paper sx={{ p: 3, mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            One-on-One Conversations
                        </Typography>
                        {privateConversations.length > 0 ? (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Conversation</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {privateConversations.map((convo) => (
                                            <TableRow key={convo.id}>
                                                <TableCell>{convo.name}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography variant="body2" color="text.secondary">No one-on-one conversations found.</Typography>
                        )}
                    </Paper>
                </>
            )}
        </Box>
    );
};

export default OneOnOnesPage;
