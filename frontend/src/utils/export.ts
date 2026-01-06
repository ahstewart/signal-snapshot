import { AnalyticsData, IndividualStatsData, User } from './database';

// Helper to escape JSON for embedding in HTML to prevent XSS/breaking scripts
const escapeScript = (data: any) => {
    return JSON.stringify(data).replace(/<\/script>/g, '<\\/script>');
};

/**
 * Generates a standalone HTML file containing the Signal Snapshot dashboard.
 * 
 * @param analyticsData The main analytics object
 * @param individualStats A map of userId -> IndividualStatsData (calculated for all users)
 * @param users The list of users
 */
export function createDashboardHtml(
    analyticsData: AnalyticsData, 
    individualStats: Record<string, IndividualStatsData> = {}, 
    users: User[] = []
): string {
    
    // We bundle all data into one object for the snapshot
    const snapshotData = {
        analytics: analyticsData,
        individualStats: individualStats,
        users: users
    };

    const safeData = escapeScript(snapshotData);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Signal Snapshot - Export</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- React Dependencies (jsDelivr) -->
    <script crossorigin src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js"></script>
    <script crossorigin src="https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prop-types@15.8.1/prop-types.min.js"></script>
    
    <!-- Material UI (jsDelivr) -->
    <script crossorigin src="https://cdn.jsdelivr.net/npm/@mui/material@5.15.0/umd/material-ui.production.min.js"></script>
    <script crossorigin src="https://cdn.jsdelivr.net/npm/@emotion/react@11.11.1/dist/emotion-react.umd.min.js"></script>
    <script crossorigin src="https://cdn.jsdelivr.net/npm/@emotion/styled@11.11.0/dist/emotion-styled.umd.min.js"></script>
    
    <!-- Recharts (jsDelivr) -->
    <script crossorigin src="https://cdn.jsdelivr.net/npm/recharts@2.12.7/umd/Recharts.min.js"></script>
    
    <!-- Babel for JSX compilation in browser -->
    <script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7.23.6/babel.min.js"></script>

    <style>
        body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; background-color: #f5f5f5; }
        #root { min-height: 100vh; }
        
        /* Scrollbar styling */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }
    </style>
</head>
<body>
    <div id="root"></div>

    <!-- Inject Data -->
    <script>
        window.SNAPSHOT_DATA = ${safeData};
    </script>

    <script type="text/babel">
        const { useState, useMemo, useEffect } = React;
        const { 
            createTheme, ThemeProvider, CssBaseline, Box, Container, Grid, Paper, Typography, 
            AppBar, Toolbar, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, 
            TableRow, Chip, Tooltip: MuiTooltip, Divider, Autocomplete, TextField, Alert, 
            List, ListItem, ListItemText, useTheme, useMediaQuery 
        } = MaterialUI;

        const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } = Recharts;

        // --- Mock Icons (SVG) to avoid loading heavy icon fonts ---
        const AutoAwesomeIcon = (props) => (
            <svg {...props} viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 6 6.5 9.5 3 12l3.5 2.5L9 18l2.5-3.5L15 12l-3.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"/>
            </svg>
        );

        // --- Theme ---
        const theme = createTheme({
            palette: {
                primary: { main: '#1976d2' },
                secondary: { main: '#dc004e' },
                background: { default: '#f5f5f5' }
            },
            typography: {
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            },
            components: {
                MuiPaper: {
                    styleOverrides: {
                        root: { borderRadius: 12 }
                    }
                }
            }
        });

        const PageHeader = ({ title, subtitle, children }) => (
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-start' }, gap: 2 }}>
                    <Box>
                        <Typography variant="h4" component="h1" fontWeight="700" color="text.primary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {subtitle}
                        </Typography>
                    </Box>
                    <Box sx={{ width: { xs: '100%', md: 'auto' }, minWidth: 300 }}>
                        {children}
                    </Box>
                </Box>
                <Divider sx={{ mt: 3 }} />
            </Box>
        );

        // --- Sub-Components ---

        const EmotionRankings = ({ title, subtitle, data, scoreLabel, totalReactsLabel }) => {
            if (!data || data.length === 0) return null;

            return (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>{title}</Typography>
                    <Typography variant="subtitle2" color="text.secondary">{subtitle}</Typography>
                    <Paper sx={{ p: 0, overflow: 'hidden', mt: 1 }}>
                        <TableContainer sx={{ maxHeight: { xs: 400, md: 'none' }, overflowX: 'auto' }}>
                            <Table stickyHeader size="small" sx={{ minWidth: { xs: 400, md: 650 } }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>{totalReactsLabel}</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Rate</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>{scoreLabel}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.slice(0, 50).map((user) => (
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
        };

        // --- Main Views ---

        const Dashboard = ({ data, users }) => {
            // FIX: Initialize state to the single conversation if only one exists
            // This ensures components like AI Summary (which checks selectedConversationIds.length === 1) work immediately.
            const [selectedConversationIds, setSelectedConversationIds] = useState([]);
            
            useEffect(() => {
                if (data.all_conversations && data.all_conversations.length === 1) {
                    setSelectedConversationIds([data.all_conversations[0].id]);
                }
            }, [data.all_conversations]);

            const theme = useTheme();
            const isMobile = useMediaQuery(theme.breakpoints.down('md'));
            const tickFontSize = isMobile ? 10 : 12;
            const chartMargin = isMobile ? { top: 5, right: 5, bottom: 20, left: -20 } : { top: 5, right: 20, bottom: 0, left: 0 };

            const handleConversationChange = (event, value) => {
                setSelectedConversationIds(value ? [value] : []);
            };

            const getUserName = (id) => {
               const user = users.find(u => u.id === id);
               return user ? user.name : id;
            };

            const formatHour = (hour) => \`\${hour}:00\`;

            // Render Logic
            const renderConversationSummary = () => {
                // Check filtering state to decide if we show summary
                if (selectedConversationIds.length !== 1) return null;
                
                const conversationId = selectedConversationIds[0];
                const conversation = data.all_conversations.find(c => c.id === conversationId);
                
                if (!conversation?.summary) return null;

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
                        <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1, transform: 'rotate(15deg)' }}>
                            <AutoAwesomeIcon sx={{ fontSize: 100, color: 'primary.main' }} />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <AutoAwesomeIcon color="primary" />
                            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                                AI Conversation Summary
                            </Typography>
                            <Chip label="SNAPSHOT" size="small" color="primary" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                        </Box>
                        
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'text.primary' }}>
                            {conversation.summary}
                        </Typography>
                    </Paper>
                );
            };

            const renderKpiCard = (title, value) => (
                <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #f4f7fa 70%, #e3ecf7 100%)', boxShadow: 3, borderRadius: 3, border: '1px solid #d6e0ef' }}>
                        <Typography variant="h4" component="div">{value}</Typography>
                        <Typography variant="body1" color="text.secondary">{title}</Typography>
                    </Paper>
                </Grid>
            );

            const renderDailyChart = () => (
                <Paper sx={{ p: { xs: 2, sm: 5 }, height: { xs: 300, md: 400 }, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <Typography variant="h6" gutterBottom>Daily Message Activity</Typography>
                    <Box sx={{ flexGrow: 1, minHeight: 0, width: '100%' }}>
                        {data.message_counts?.by_day ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={Object.entries(data.message_counts.by_day)} margin={chartMargin}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="0" angle={-45} textAnchor="end" height={60} tick={{ fontSize: tickFontSize }} />
                                    <YAxis width={40} tick={{ fontSize: tickFontSize }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="1" stroke="#8884d8" dot={false} strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : <Typography>No data</Typography>}
                    </Box>
                </Paper>
            );

            const renderHourlyChart = () => {
                let pacificData = [];
                if (data.message_counts?.by_hour) {
                    const utcData = data.message_counts.by_hour;
                    for (let h = 0; h < 24; h++) {
                        const utcHour = (h + 7) % 24;
                        const utcKey = utcHour.toString().padStart(2, '0');
                        pacificData.push({ hour: h, count: utcData[utcKey] || 0 });
                    }
                }
                return (
                    <Paper sx={{ p: { xs: 2, sm: 5 }, height: { xs: 300, md: 400 }, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <Typography variant="h6" gutterBottom>Average Hourly Activity (Pacific Time)</Typography>
                        <Box sx={{ flexGrow: 1, minHeight: 0, width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={pacificData} margin={chartMargin}>
                                    <XAxis dataKey="hour" tickFormatter={(v) => formatHour(parseInt(v))} type="number" domain={[0, 23]} tickCount={12} tick={{ fontSize: tickFontSize }} />
                                    <YAxis width={40} tick={{ fontSize: tickFontSize }} />
                                    <Tooltip labelFormatter={(v) => \`\${formatHour(v)} PT\`} />
                                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                );
            };

            const renderAwardCard = (title, award, suffix = "", tooltip = "") => (
                <Grid item xs={12} sm={6} md={4} key={title}>
                    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
                            <MuiTooltip title={tooltip} arrow placement="top">
                                <Typography variant="h6" component="div" sx={{ textAlign: 'center', textDecoration: 'underline dotted', cursor: 'help', fontWeight: 800, color: 'text.secondary', width: 'fit-content' }}>
                                    {title}
                                </Typography>
                            </MuiTooltip>
                        </Box>
                        {award.winner ? (
                            <>
                                <Typography variant="h4" component="div" sx={{ fontWeight: 800, fontSize: { xs: '1.3rem', md: '1.5rem' }, overflowWrap: 'break-word', my: 0.5, textAlign: 'center', color: 'primary.main' }}>
                                    {getUserName(award.winner)}
                                </Typography>
                                <Typography variant="h6" component="div" sx={{ fontWeight: 'medium', color: 'text.secondary', fontSize: '1rem' }}>
                                    {award.count.toLocaleString()} {suffix && <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>{suffix}</Typography>}
                                </Typography>
                            </>
                        ) : <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>No data</Typography>}
                    </Paper>
                </Grid>
            );

            const renderAwards = () => {
                if (!data.awards) return null;
                const awardDisplayTitles = {
                    most_messages_sent: "Most Messages Sent",
                    most_reactions_given: "Most Reactions Given",
                    most_reactions_received: "Most Reactions Received",
                    most_mentioned: "Most Mentioned",
                    most_mentions_made: "Most Mentions Made",
                    most_media_sent: "Most Media Sent",
                    most_night_owl: "Night Bird",
                    most_early_bird: "Early Owl",
                    longest_avg_message: "The Rambler",
                    hottest_newbie: "Newb of the Year",
                    lurker: "The Lurker",
                    most_unique_emojis: "The Fuzz",
                };
                const awardSuffixes = {
                    most_messages_sent: "messages",
                    most_reactions_given: "reactions",
                    most_reactions_received: "received",
                    most_mentioned: "mentions",
                    most_mentions_made: "mentions",
                    most_media_sent: "files sent",
                    most_night_owl: "%",
                    most_early_bird: "%",
                    longest_avg_message: "chars/msg",
                    hottest_newbie: "messages",
                    lurker: "reacts/msg",
                    most_unique_emojis: "emojis sent"
                };

                return (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', borderLeft: '6px solid #1976d2', pl: 2, mb: 2, color: '#222', background: 'linear-gradient(90deg, #f4f7fa 0%, #e3ecf7 100%)', borderRadius: 2, boxShadow: 1 }}>
                            Awards
                        </Typography>
                        <Grid container spacing={2}>
                            {Object.entries(data.awards).map(([key, award]) => 
                                renderAwardCard(awardDisplayTitles[key] || key, award, awardSuffixes[key] || "")
                            )}
                        </Grid>
                    </Box>
                );
            };

            return (
                <Box sx={{ p: { xs: 1, md: 2 } }}>
                    <PageHeader title="Snapshot Analytics" subtitle="Static export of your group chat data.">
                        {data.all_conversations && data.all_conversations.length > 1 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', mt: { xs: 1, md: 2 } }}>
                                <Autocomplete
                                    fullWidth
                                    options={data.all_conversations.map(c => c.id)}
                                    getOptionLabel={(id) => {
                                        const c = data.all_conversations.find(conv => conv.id === id);
                                        return c ? c.name : id;
                                    }}
                                    value={selectedConversationIds[0] || null}
                                    onChange={(event, value) => handleConversationChange(event, value)}
                                    renderInput={(params) => (
                                        <TextField 
                                            {...params} 
                                            label="Select Group Chat" 
                                            variant="outlined" 
                                            size="small"
                                        />
                                    )}
                                />
                            </Box>
                        )}
                    </PageHeader>
                    
                    {renderConversationSummary()}

                    <Grid container spacing={2} sx={{ mb: 4, mt: 1 }}>
                        {renderKpiCard('Total Messages', data.kpis.total_messages)}
                        {renderKpiCard('Total Members', data.kpis.total_members)}
                        {renderKpiCard('Avg Messages / Day', data.kpis.avg_messages_per_day)}
                    </Grid>

                    <Grid container spacing={3} sx={{ mt: 2 }}>
                        <Grid item xs={12}>{renderDailyChart()}</Grid>
                        <Grid item xs={12} sx={{ mb: 2 }}>{renderHourlyChart()}</Grid>
                        <Grid item xs={12}>{renderAwards()}</Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <EmotionRankings title="😂 Who is the Funniest? 😂" subtitle="Laugh reactions received." data={data.funniestUsers} scoreLabel="Humor Score" totalReactsLabel="Laughs" />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <EmotionRankings title="❤️ Who is the Most Loved? ❤️" subtitle="Hearts received." data={data.mostLovedUsers} scoreLabel="Love Score" totalReactsLabel="Hearts" />
                        </Grid>
                         <Grid item xs={12} md={6} lg={4}>
                            <EmotionRankings title="😮 Who is the Most Shocking? 😮" subtitle="Shock reactions received." data={data.mostShockingUsers} scoreLabel="Shock Score" totalReactsLabel="Shocks" />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <EmotionRankings title="👎 Who is the Most Disliked? 👎" subtitle="Downvotes received." data={data.mostDislikedUsers} scoreLabel="Dislike Score" totalReactsLabel="Dislikes" />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <EmotionRankings title="🍆 Who is the Most Randy? 🍆" subtitle="Eggplants given." data={data.mostRandyUsers} scoreLabel="Randy Score" totalReactsLabel="Eggplants" />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <EmotionRankings title="😩 Who is the Most Doable? 😩" subtitle="Eggplants received." data={data.mostThirstyUsers} scoreLabel="Thirst Score" totalReactsLabel="Eggplants" />
                        </Grid>
                    </Grid>
                </Box>
            );
        };

        const IndividualStats = ({ users, dataMap }) => {
            const [selectedUser, setSelectedUser] = useState(users[0]?.id || '');
            const data = dataMap[selectedUser];

            const handleUserChange = (event, value) => {
                if (value) setSelectedUser(value.id);
            };

            const renderKpiCard = (title, value) => (
                <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: { xs: 1.5, md: 2 }, textAlign: 'center', background: 'linear-gradient(135deg, #f4f7fa 70%, #e3ecf7 100%)', boxShadow: 3, borderRadius: 3, border: '1px solid #d6e0ef' }}>
                        <Typography variant="h4" component="div" sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>{value}</Typography>
                        <Typography variant="body1" color="text.secondary">{title}</Typography>
                    </Paper>
                </Grid>
            );

            return (
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                    <PageHeader title="Individual Statistics" subtitle="Select an individual to analyze.">
                        <Autocomplete
                            size="medium"
                            sx={{ width: '100%', maxWidth: { xs: '100%', md: 600 }, mt: { xs: 1, md: 2 } }}
                            options={users}
                            getOptionLabel={(u) => u.name}
                            value={users.find(u => u.id === selectedUser) || null}
                            onChange={handleUserChange}
                            renderInput={(params) => <TextField {...params} label="Select User" variant="outlined" />}
                        />
                    </PageHeader>

                    {data && (
                        <Box>
                             {data.summary && (
                                <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid', borderColor: 'primary.main', backgroundColor: 'rgba(25, 118, 210, 0.04)', borderRadius: 2 }}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                                            Personality Analysis
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                        {data.summary}
                                    </Typography>
                                </Paper>
                            )}

                            <Grid container spacing={3}>
                                {renderKpiCard('Total Messages Sent', data.totalMessagesSent)}
                                {renderKpiCard('Most Popular Day', data.mostPopularDay)}
                                {renderKpiCard('Total Reactions Sent', data.totalReactionsSent)}
                            </Grid>

                             {(data.reactedToMost || data.receivedMostReactionsFrom) && (
                                <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
                                    {data.reactedToMost && (
                                    <Grid item xs={12} md={6} lg={4} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                        <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #f4f7fa 70%, #e3ecf7 100%)', boxShadow: 3, borderRadius: 3, border: '1px solid #d6e0ef', width: '100%' }}>
                                        <Typography variant="h6" color="text.secondary">Reacted To Most</Typography>
                                        <Typography variant="h4">{data.reactedToMost.name}</Typography>
                                        <Typography variant="body1" color="text.secondary">{data.reactedToMost.count} times</Typography>
                                        <Typography variant="h5" sx={{ mt: 1 }}>{data.reactedToMost.emoji}</Typography>
                                        </Paper>
                                    </Grid>
                                    )}
                                    {data.receivedMostReactionsFrom && (
                                    <Grid item xs={12} md={6} lg={4} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                        <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #f4f7fa 70%, #e3ecf7 100%)', boxShadow: 3, borderRadius: 3, border: '1px solid #d6e0ef', width: '100%' }}>
                                        <Typography variant="h6" color="text.secondary">Received Most Reactions From</Typography>
                                        <Typography variant="h4">{data.receivedMostReactionsFrom.name}</Typography>
                                        <Typography variant="body1" color="text.secondary">{data.receivedMostReactionsFrom.count} times</Typography>
                                        <Typography variant="h5" sx={{ mt: 1 }}>{data.receivedMostReactionsFrom.emoji}</Typography>
                                        </Paper>
                                    </Grid>
                                    )}
                                </Grid>
                            )}

                             {data.mostPopularMessage && (
                                <Grid item sx={{ display: 'flex', justifyContent: 'center', mt: 4, width: '100%' }}>
                                <Paper 
                                    sx={{ 
                                    p: { xs: 2, md: 4 }, 
                                    width: '100%',
                                    maxWidth: '800px',
                                    boxShadow: 2
                                    }}
                                >
                                    <Typography variant="h5" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
                                    Most Popular Message
                                    </Typography>
                                    <Box 
                                    sx={{ 
                                        p: 2, 
                                        mb: 2, 
                                        borderRadius: 1, 
                                        bgcolor: 'rgba(0,0,0,0.05)',
                                        borderLeft: \`4px solid \${theme.palette.primary.main}\`
                                    }}
                                    >
                                    <Typography variant="body1" sx={{ fontStyle: 'italic', fontSize: { xs: '0.9rem', md: '1rem' } }}>
                                        "{data.mostPopularMessage.text || 'Media message'}"
                                    </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                                        {data.mostPopularMessage.reactionCount} reaction{data.mostPopularMessage.reactionCount !== 1 ? 's' : ''}
                                    </Typography>
                                    </Box>
                                    <Divider sx={{ my: 2 }} />
                                    <Box sx={{ maxHeight: 200, overflow: 'auto', pr: 1 }}>
                                    <List dense disablePadding>
                                        {data.mostPopularMessage.reactions.map((reaction, index) => (
                                        <ListItem 
                                            key={index} 
                                            disableGutters 
                                            sx={{ 
                                            py: 1,
                                            '&:not(:last-child)': {
                                                borderBottom: \`1px solid \${theme.palette.divider}\`
                                            }
                                            }}
                                        >
                                            <ListItemText 
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography component="span" sx={{ fontSize: '1.25rem', mr: 1 }}>
                                                    {reaction.emoji}
                                                </Typography>
                                                <Typography component="span" variant="body2">
                                                    from {reaction.sender}
                                                </Typography>
                                                </Box>
                                            }
                                            />
                                        </ListItem>
                                        ))}
                                    </List>
                                    </Box>
                                </Paper>
                                </Grid>
                            )}
                        </Box>
                    )}
                </Box>
            );
        };

        const App = () => {
            const [tab, setTab] = useState(0);
            const snapshotData = window.SNAPSHOT_DATA;

            return (
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Signal Snapshot
                            </Typography>
                            <Tabs value={tab} onChange={(e, v) => setTab(v)} textColor="inherit" indicatorColor="secondary">
                                <Tab label="Group Dashboard" />
                                <Tab label="Individual Stats" />
                            </Tabs>
                        </Toolbar>
                    </AppBar>
                    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                        {tab === 0 && <Dashboard data={snapshotData.analytics} users={snapshotData.users} />}
                        {tab === 1 && <IndividualStats users={snapshotData.users} dataMap={snapshotData.individualStats} />}
                    </Container>
                </ThemeProvider>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>`;
}