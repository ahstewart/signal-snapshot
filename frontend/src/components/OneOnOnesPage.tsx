import React, { useMemo } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';
import { AnalyticsData, User, Conversation } from '../utils/database';
import UserStatsComparison from './UserStatsComparison';

interface OneOnOnesPageProps {
    data: AnalyticsData | null;
    users: User[];
    loading: boolean;
    error: string | null;
    dbBuffer?: ArrayBuffer;
    dbKey?: string;
}

const OneOnOnesPage: React.FC<OneOnOnesPageProps> = ({ data, loading, error, users, dbBuffer, dbKey }) => {
    // Query directly from the original conversations table if available
    // DEBUG: Log incoming analytics data
    console.log('[OneOnOnesPage] data:', data);
    const privateConversations: Conversation[] = useMemo(() => {
        // Prefer __rawConversations if present, otherwise fallback to all_conversations
        let allConvos = (data as any)?.privateConversations || [];
        if (!allConvos.length && data?.all_conversations) {
            allConvos = data.all_conversations;
        }
        // DEBUG: Log allConvos before filtering
        console.log('[OneOnOnesPage] allConvos:', allConvos);
        // Filter for type === 'private' only
        const filtered = allConvos.filter((c: any) => c.type === 'private');
        // DEBUG: Log filtered private conversations
        console.log('[OneOnOnesPage] filtered private conversations:', filtered);
        return filtered;
    }, [data]);

    // DEBUG: Log privateConversations after useMemo
    console.log('[OneOnOnesPage] privateConversations:', privateConversations);

    const [selectedConversationId, setSelectedConversationId] = React.useState<string | null>(null);
    const selectedConversation = privateConversations.find(c => c.id === selectedConversationId);

    // DEBUG: Log selectedConversationId and selectedConversation
    console.log('[OneOnOnesPage] selectedConversationId:', selectedConversationId);
    console.log('[OneOnOnesPage] selectedConversation:', selectedConversation);

    const totalMessages = data?.kpis?.total_messages ?? 0;
    const totalConversations = privateConversations.length;
    const totalUsers = users.length;

    const renderKpiCard = (title: string, value: string | number) => (
        <Grid item xs={12} sm={6} md={3}>
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
                Select a one-on-one chat to view its metrics.
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
                                {renderKpiCard('Total Messages', selectedConversation?.messageCount ?? '...')}
                                {renderKpiCard('Average Messages per Day', (selectedConversation && (selectedConversation as any).avgMessagesPerDay) ?? '...')}
                                {renderKpiCard('Most Popular Day', (() => {
                                    if (!selectedConversation || !data?.message_counts?.by_day) return '...';
                                    const convoId = selectedConversation.id;
                                    // Get per-day-of-week averages
                                    let dayCounts: Record<string, number> = {};
                                    let totalDays: Record<string, number> = {};
                                    // Helper: get day of week string
                                    const getDay = (dateStr: string) => {
                                        const d = new Date(dateStr);
                                        return d.toLocaleDateString('en-US', { weekday: 'long' });
                                    };
                                    // Use per-conversation if available
                                    let byDay = data.message_counts.by_day[convoId] || data.message_counts.by_day;
                                    if (!byDay || typeof Object.values(byDay)[0] !== 'number') return '...';
                                    Object.entries(byDay).forEach(([date, count]) => {
                                        const dow = getDay(date);
                                        dayCounts[dow] = (dayCounts[dow] || 0) + count;
                                        totalDays[dow] = (totalDays[dow] || 0) + 1;
                                    });
                                    const avgByDow = Object.entries(dayCounts).map(([dow, total]) => [dow, total / totalDays[dow]]);
                                    if (!avgByDow.length) return '...';
                                    const [bestDay] = avgByDow.reduce((max, curr) => curr[1] > max[1] ? curr : max);
                                    return bestDay;
                                })())}
                                {renderKpiCard('Most Popular Hour (US Pacific Time)', (() => {
                                    if (!selectedConversation || !data?.message_counts?.by_hour) return '...';
                                    const convoId = selectedConversation.id;
                                    // If by_hour is structured as { [hour]: count }, but not per-conversation, fallback to global
                                    let byHour = data.message_counts.by_hour[convoId] || data.message_counts.by_hour;
                                    if (!byHour || typeof Object.values(byHour)[0] !== 'number') return '...';
                                    const entries = Object.entries(byHour);
                                    if (!entries.length) return '...';
                                    const [maxHour, ] = entries.reduce((max, curr) => curr[1] > max[1] ? curr : max);
                                    // Format hour as 12-hour with AM/PM (Pacific Time)
                                    const hourNum = parseInt(maxHour, 10);
                                    if (isNaN(hourNum)) return maxHour;
                                    const ampm = hourNum >= 12 ? 'PM' : 'AM';
                                    const hour12 = ((hourNum + 11) % 12 + 1);
                                    return `${hour12} ${ampm}`;
                                })())}
                            </Grid>
                            {/* Two-column user stats comparison widget */}
{selectedConversation && (
  <Paper sx={{ p: 3, mt: 2 }}>
    <Typography variant="h6" gutterBottom>
      User Stats Comparison
    </Typography>
    <UserStatsComparison
      conversation={selectedConversation}
      users={users}
      dbBuffer={dbBuffer}
      dbKey={dbKey}
    />
  </Paper>
)}
                        </>
                    )}
                </>
            )}
        </Box>
    );
};

export default OneOnOnesPage;
