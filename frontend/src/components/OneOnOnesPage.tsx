import React, { useMemo } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';
import { AnalyticsData, User, Conversation } from '../utils/database';

interface OneOnOnesPageProps {
    data: AnalyticsData | null;
    loading: boolean;
    error: string | null;
    users: User[];
}

const OneOnOnesPage: React.FC<OneOnOnesPageProps> = ({ data, loading, error, users }) => {
    // Query directly from the original conversations table if available
    const privateConversations: Conversation[] = useMemo(() => {
        // Prefer __rawConversations if present, otherwise fallback to all_conversations
        let allConvos = (data as any)?.__rawConversations || [];
        if (!allConvos.length && data?.all_conversations) {
            allConvos = data.all_conversations;
        }
        // Filter for type === 'private'
        const filtered = allConvos.filter((c: any) => c.type === 'private');
        return filtered;
    }, [data]);

    const [selectedConversationId, setSelectedConversationId] = React.useState<string | null>(null);
    const selectedConversation = privateConversations.find(c => c.id === selectedConversationId);

    const totalMessages = data?.kpis?.total_messages ?? 0;
    const totalConversations = privateConversations.length;
    const totalUsers = users.length;

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
                1:1s
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
                    <Autocomplete
                        options={privateConversations.map(c => c.id)}
                        getOptionLabel={id => {
                            const convo = privateConversations.find(c => c.id === id);
                            return convo?.name || id;
                        }}
                        value={selectedConversationId}
                        onChange={(_e, value) => setSelectedConversationId(value)}
                        renderInput={params => <TextField {...params} label="Filter by 1:1 Conversation" />}
                        isOptionEqualToValue={(option, value) => option === value}
                        sx={{ mb: 4, maxWidth: 400 }}
                    />
                    {selectedConversationId && (
                        <>
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                {renderKpiCard('Total Messages', totalMessages)}
                                {renderKpiCard('Total 1:1s', totalConversations)}
                                {renderKpiCard('Total Users', totalUsers)}
                            </Grid>
                            <Paper sx={{ p: 3, mt: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    1:1 Conversation Details
                                </Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Conversation</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>{selectedConversation?.name}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </>
                    )}
                </>
            )}
        </Box>
    );
};

export default OneOnOnesPage;
