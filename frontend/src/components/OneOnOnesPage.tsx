import React, { useMemo } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';
import { AnalyticsData, User, Conversation } from '../utils/database';
import { UserStatsComparison } from './UserStatsComparison';
import { PageHeader } from './PageHeader';

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

    // State for conversation messages and KPIs
    const [conversationKPIs, setConversationKPIs] = React.useState({
        totalMessages: '...',
        avgMessagesPerDay: '...',
        mostPopularDay: '...',
        mostPopularHour: '...',
        loading: false,
        error: null as string | null
    });

    // Fetch and calculate KPIs when conversation changes
    React.useEffect(() => {
        const fetchAndCalculateKPIs = async () => {
            if (!selectedConversation || !dbBuffer) {
                setConversationKPIs(prev => ({
                    ...prev,
                    loading: false,
                    error: 'No conversation selected or database not available'
                }));
                return;
            }

            setConversationKPIs(prev => ({ ...prev, loading: true, error: null }));

            try {
                const SQL = await import('sql.js');
                const databaseModule = await import('../utils/database');
                const sqlJs = await databaseModule.getSqlJs();
                const db = new sqlJs.Database(new Uint8Array(dbBuffer));

                try {
                    // Query messages for the selected conversation
                    const query = `
                        SELECT 
                            COUNT(*) as total_messages,
                            MIN(received_at) as first_message,
                            MAX(received_at) as last_message
                        FROM messages 
                        WHERE conversationId = '${selectedConversation.id}'
                        AND sourceServiceId IS NOT NULL
                    `;
                    
                    const result = db.exec(query);
                    
                    if (result.length === 0 || !result[0].values || result[0].values.length === 0) {
                        throw new Error('No message data found for conversation');
                    }

                    const [totalMessages, firstMessage, lastMessage] = result[0].values[0];

                    // Calculate average messages per day
                    let avgMessagesPerDay = '...';
                    if (firstMessage && lastMessage) {
                        const firstDate = new Date(firstMessage);
                        const lastDate = new Date(lastMessage);
                        const diffTime = Math.abs(lastDate.getTime() - firstDate.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
                        avgMessagesPerDay = (totalMessages / diffDays).toFixed(1);
                    }

                    // Query for most popular day and hour
                    const statsQuery = `
                        SELECT 
                            strftime('%w', datetime(received_at/1000, 'unixepoch')) as day_of_week,
                            strftime('%H', datetime(received_at/1000, 'unixepoch')) as hour_of_day,
                            COUNT(*) as message_count
                        FROM messages 
                        WHERE conversationId = '${selectedConversation.id}'
                        AND sourceServiceId IS NOT NULL
                        GROUP BY day_of_week, hour_of_day
                        ORDER BY message_count DESC
                        LIMIT 1
                    `;

                    const statsResult = db.exec(statsQuery);
                    
                    let mostPopularDay = '...';
                    let mostPopularHour = '...';

                    if (statsResult.length > 0 && statsResult[0].values && statsResult[0].values.length > 0) {
                        const [dayOfWeek, hourOfDay] = statsResult[0].values[0];
                        
                        // Convert day of week (0-6, where 0 is Sunday) to day name
                        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        mostPopularDay = days[parseInt(dayOfWeek, 10)] || '...';
                        
                        // Convert 24-hour format to 12-hour format
                        const hourNum = parseInt(hourOfDay, 10);
                        const ampm = hourNum >= 12 ? 'PM' : 'AM';
                        const hour12 = ((hourNum + 11) % 12 + 1);
                        mostPopularHour = `${hour12} ${ampm}`;
                    }

                    setConversationKPIs({
                        totalMessages,
                        avgMessagesPerDay,
                        mostPopularDay,
                        mostPopularHour,
                        loading: false,
                        error: null
                    });
                } finally {
                    db.close();
                }
            } catch (error) {
                console.error('Error calculating conversation KPIs:', error);
                setConversationKPIs(prev => ({
                    ...prev,
                    loading: false,
                    error: 'Failed to load conversation statistics'
                }));
            }
        };

        fetchAndCalculateKPIs();
    }, [selectedConversation, dbBuffer]);

    const renderKpiCard = (title: string, value: string | number) => (
        <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #f4f7fa 70%, #e3ecf7 100%)', boxShadow: 3, borderRadius: 3, border: '1px solid #d6e0ef' }}>
                <Typography variant="h4" component="div">{value}</Typography>
                <Typography variant="body1" color="text.secondary">{title}</Typography>
            </Paper>
        </Grid>
    );

    return (
        <Box sx={{ p: 3 }}>
            <PageHeader 
                title="1:1 Conversations"
                subtitle="Select a user to analyze your private chat patterns and statistics."
            >
                <Autocomplete
                    size="small"
                    sx={{ minWidth: 300, mt: { xs: 2, sm: 0 } }}
                    options={privateConversations.map(c => c.id)}
                    getOptionLabel={id => {
                        const convo = privateConversations.find(c => c.id === id);
                        return convo?.name || id;
                    }}
                    value={selectedConversationId}
                    onChange={(_e, value) => setSelectedConversationId(value)}
                    renderInput={params => (
                        <TextField 
                            {...params} 
                            label="Select Conversation" 
                            variant="outlined"
                            size="small"
                        />
                    )}
                    isOptionEqualToValue={(option, value) => option === value}
                />
            </PageHeader>
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

                    {selectedConversationId && (
                        <>
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                {renderKpiCard('Total Messages', conversationKPIs.totalMessages)}
                                {renderKpiCard('Average Messages per Day', conversationKPIs.avgMessagesPerDay)}
                                {renderKpiCard('Most Active Day', conversationKPIs.mostPopularDay)}
                                {renderKpiCard('Most Active Hour (PT)', conversationKPIs.mostPopularHour)}
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
