import { AnalyticsData } from './database';

export function createDashboardHtml(analyticsData: AnalyticsData): string {
    // Serialize data securely
    const safeData = JSON.stringify(analyticsData).replace(/<\/script>/gi, '<\\/script>');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Signal Analytics Export</title>
    
    <!-- Fonts -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

    <!-- React Dependencies (Using jsDelivr) -->
    <script crossorigin src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js"></script>
    <script crossorigin src="https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
    
    <!-- Prop-Types -->
    <script src="https://cdn.jsdelivr.net/npm/prop-types@15.8.1/prop-types.min.js"></script>
    
    <!-- Recharts -->
    <script src="https://cdn.jsdelivr.net/npm/recharts@2.12.7/umd/Recharts.min.js"></script>

    <!-- Material UI & Emotion -->
    <script src="https://cdn.jsdelivr.net/npm/@emotion/react@11.11.1/dist/emotion-react.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@emotion/styled@11.11.0/dist/emotion-styled.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mui/material@5.14.20/umd/material-ui.development.js"></script>

    <!-- Babel -->
    <script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7.23.6/babel.min.js"></script>

    <style>
        body { margin: 0; background-color: #f5f5f5; }
        #root { min-height: 100vh; display: flex; flex-direction: column; }
        /* Fix for Recharts on mobile */
        .recharts-wrapper { width: 100% !important; }
    </style>
</head>
<body>
    <div id="root"></div>

    <script>
        window.analyticsData = ${safeData};
        console.log("[Boot] Analytics Data loaded into window:", window.analyticsData);
    </script>

    <script type="text/babel">
        // --- Setup Dependencies ---
        const { useState, useMemo, useEffect } = React;
        const { 
            createTheme, ThemeProvider, CssBaseline, AppBar, Toolbar, Typography, Container, 
            Box, Grid, Paper, Select, MenuItem, FormControl, InputLabel, Chip, Checkbox, 
            ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
            Alert, CircularProgress, Autocomplete, TextField, Tabs, Tab, Divider, List, ListItem, useTheme
        } = MaterialUI;
        const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } = Recharts;

        const theme = createTheme({
            palette: {
                primary: { main: '#1976d2' },
                background: { default: '#f5f5f5', paper: '#ffffff' }
            },
            components: {
                MuiPaper: {
                    styleOverrides: {
                        root: { overflow: 'hidden' }
                    }
                }
            }
        });

        // --- Shared Components ---
        
        const PageHeader = ({ title, subtitle, children }) => (
            <Box sx={{ mb: 4, pb: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, mb: 1 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1976d2' }}>
                        {title}
                    </Typography>
                    {children}
                </Box>
                {subtitle && <Typography variant="subtitle1" color="text.secondary">{subtitle}</Typography>}
            </Box>
        );

        const KpiCard = ({ title, value }) => (
            <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #f4f7fa 70%, #e3ecf7 100%)', boxShadow: 3, borderRadius: 3, border: '1px solid #d6e0ef' }}>
                    <Typography variant="h4" component="div">{value}</Typography>
                    <Typography variant="body1" color="text.secondary">{title}</Typography>
                </Paper>
            </Grid>
        );

        // --- Individual Stats Component ---
        
        const IndividualStats = ({ data }) => {
            const [selectedUser, setSelectedUser] = useState(null);
            const [stats, setStats] = useState(null);

            // Parse users and stats
            const { users, statsMap } = useMemo(() => {
                const s = {};
                const u = [];
                
                console.log("[IndivStats] Parsing users and stats from data source...");

                // 1. Check for individual_stats array (Export from Live App)
                if (data.individual_stats && Array.isArray(data.individual_stats)) {
                    console.log("[IndivStats] Found 'individual_stats' array with " + data.individual_stats.length + " entries.");
                    data.individual_stats.forEach((item, idx) => {
                        if (item.id && item.stats) {
                            s[item.id] = item.stats;
                            u.push({ id: item.id, name: item.name });
                        } else {
                            console.warn("[IndivStats] Item " + idx + " missing id or stats:", item);
                        }
                    });
                } 
                // 2. Check for individualStats object (Static Snapshot)
                else if (data.individualStats) {
                    console.log("[IndivStats] Found 'individualStats' object (Snapshot Mode).");
                    Object.assign(s, data.individualStats);
                    if (data.users) {
                        data.users.forEach(user => {
                            if (s[user.id]) {
                                u.push(user);
                            }
                        });
                    }
                } else {
                    console.warn("[IndivStats] No individual stats structure found in data.");
                }
                
                u.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                console.log("[IndivStats] Prepared " + u.length + " users and " + Object.keys(s).length + " stat entries.");
                return { users: u, statsMap: s };
            }, [data]);

            useEffect(() => {
                if (selectedUser) {
                    console.log("[IndivStats] User selected:", selectedUser.name, "(ID: " + selectedUser.id + ")");
                    const userStats = statsMap[selectedUser.id];
                    if (userStats) {
                         console.log("[IndivStats] Stats found for user:", userStats);
                         setStats(userStats);
                    } else {
                        console.warn("[IndivStats] WARNING: No stats found in map for user ID:", selectedUser.id);
                        setStats(null);
                    }
                } else {
                    setStats(null);
                }
            }, [selectedUser, statsMap]);

            return (
                <Box sx={{ p: 3 }}>
                    <PageHeader 
                        title="Individual Statistics"
                        subtitle="Select an individual to analyze their Signal behavior."
                    >
                         <Autocomplete
                            size="small"
                            sx={{ minWidth: 300 }}
                            options={users}
                            getOptionLabel={(user) => user.name || user.id}
                            value={selectedUser}
                            onChange={(_, newValue) => {
                                console.log("[IndivStats] Autocomplete changed:", newValue);
                                setSelectedUser(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} label="Select User" variant="outlined" />}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                        />
                    </PageHeader>

                    {selectedUser && stats ? (
                        <Box>
                            <Grid container spacing={3}>
                                <KpiCard title="Total Messages Sent" value={stats.totalMessagesSent?.toLocaleString() || 0} />
                                <KpiCard title="Most Popular Day" value={stats.mostPopularDay || 'N/A'} />
                                <KpiCard title="Total Reactions Sent" value={stats.totalReactionsSent?.toLocaleString() || 0} />

                                {(stats.reactedToMost || stats.receivedMostReactionsFrom) && (
                                    <Grid container spacing={3} justifyContent="center" alignItems="stretch" sx={{ mt: 2, width: '100%' }}>
                                        {stats.reactedToMost && (
                                            <Grid item xs={12} md={6}>
                                                <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #f4f7fa 70%, #e3ecf7 100%)', boxShadow: 3, borderRadius: 3, border: '1px solid #d6e0ef', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                    <Typography variant="h6" color="text.secondary" gutterBottom>Reacted To Most</Typography>
                                                    <Typography variant="h4" sx={{ fontWeight: 'bold', my: 1 }}>{stats.reactedToMost.name}</Typography>
                                                    <Typography variant="body1" color="text.secondary">{stats.reactedToMost.count} times</Typography>
                                                    <Typography variant="h3" sx={{ mt: 2 }}>{stats.reactedToMost.emoji}</Typography>
                                                </Paper>
                                            </Grid>
                                        )}
                                        {stats.receivedMostReactionsFrom && (
                                            <Grid item xs={12} md={6}>
                                                <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #f4f7fa 70%, #e3ecf7 100%)', boxShadow: 3, borderRadius: 3, border: '1px solid #d6e0ef', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                    <Typography variant="h6" color="text.secondary" gutterBottom>Received Most Reactions From</Typography>
                                                    <Typography variant="h4" sx={{ fontWeight: 'bold', my: 1 }}>{stats.receivedMostReactionsFrom.name}</Typography>
                                                    <Typography variant="body1" color="text.secondary">{stats.receivedMostReactionsFrom.count} times</Typography>
                                                    <Typography variant="h3" sx={{ mt: 2 }}>{stats.receivedMostReactionsFrom.emoji}</Typography>
                                                </Paper>
                                            </Grid>
                                        )}
                                    </Grid>
                                )}
                            </Grid>
                            
                            {stats.mostPopularMessage && (
                                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                                    <Paper sx={{ p: 3, maxWidth: 800, width: '100%' }}>
                                        <Typography variant="h6" gutterBottom color="primary">Most Popular Message</Typography>
                                        <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, borderLeft: '4px solid #1976d2', mb: 2 }}>
                                            <Typography variant="body1" style={{ fontStyle: 'italic', fontSize: '1.1rem' }}>
                                                "{stats.mostPopularMessage.text || 'Media Message'}"
                                            </Typography>
                                        </Box>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                            {stats.mostPopularMessage.reactionCount} reactions
                                        </Typography>
                                        <Divider sx={{ mb: 1 }} />
                                        <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                                            <List dense>
                                                {stats.mostPopularMessage.reactions.map((r, i) => (
                                                    <ListItem key={i} divider={i < stats.mostPopularMessage.reactions.length - 1}>
                                                        <ListItemText 
                                                            primary={
                                                                <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>{r.emoji}</span>
                                                                    <span>from <strong>{r.sender}</strong></span>
                                                                </Box>
                                                            } 
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Box>
                                    </Paper>
                                </Box>
                            )}
                        </Box>
                    ) : selectedUser ? (
                         <Box sx={{ mt: 4 }}>
                            <Alert severity="warning">
                                No statistics available for {selectedUser.name} in this snapshot. 
                                <br/>Snapshots only include data for the top 50 most active users to keep the file size small.
                            </Alert>
                        </Box>
                    ) : null}
                </Box>
            );
        };

        // --- Dashboard Component (Group Chats) ---
        const Dashboard = ({ data }) => {
            const [selectedConversationIds, setSelectedConversationIds] = useState([]);
            
            // Handle cases where data structure differs slightly
            const analyticsData = data.analytics || data; 

            if (!analyticsData) return <Alert severity="error">No data available.</Alert>;

            const handleConversationChange = (event, value) => {
                setSelectedConversationIds(value ? [value] : []);
            };

            const userNameMap = analyticsData.userNamesById || {};
            const getUserName = (id) => userNameMap[id] || id;
            const formatHour = (hour) => \`\${hour}:00\`;

            // --- Render Helpers ---
            const renderConversationSummary = () => {
                if (selectedConversationIds.length !== 1) return null;
                const conversationId = selectedConversationIds[0];
                const conversation = analyticsData.all_conversations.find(c => c.id === conversationId);
                if (!conversation || !conversation.summary) return null;
                return (
                    <Paper sx={{ p: 2, mt: 2, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="h6" gutterBottom>Conversation Summary</Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{conversation.summary}</Typography>
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

            const renderKpiSummary = () => {
                let totalMembers = 0;
                if (selectedConversationIds.length === 1) {
                    const selectedConvo = analyticsData.all_conversations.find(c => c.id === selectedConversationIds[0]);
                    totalMembers = selectedConvo?.memberCount || 0;
                } else {
                    totalMembers = analyticsData.kpis.total_members || 0;
                }
                return (
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {renderKpiCard('Total Messages', (analyticsData.kpis.total_messages || 0).toLocaleString())}
                        {renderKpiCard('Total Members', totalMembers)}
                        {renderKpiCard('Avg Messages / Day', analyticsData.kpis.avg_messages_per_day || 0)}
                    </Grid>
                );
            };

            const renderDailyChart = () => (
                <Paper sx={{ p: 5, height: 400 }}>
                    <Typography variant="h6" gutterBottom>Daily Message Activity</Typography>
                    {analyticsData.message_counts?.by_day ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={Object.entries(analyticsData.message_counts.by_day).map(([d, c]) => ({ date: d, count: c }))}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#8884d8" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : <Typography variant="body2" color="text.secondary">No data</Typography>}
                </Paper>
            );

            const renderHourlyChart = () => (
                <Paper sx={{ p: 5, height: 400 }}>
                    <Typography variant="h6" gutterBottom>Hourly Activity</Typography>
                    {analyticsData.message_counts?.by_hour ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={Object.entries(analyticsData.message_counts.by_hour).map(([h, c]) => ({ hour: h, count: c }))}>
                                <XAxis dataKey="hour" tickFormatter={(v) => formatHour(parseInt(v, 10))} />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#8884d8" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : <Typography variant="body2" color="text.secondary">No data</Typography>}
                </Paper>
            );

            const renderTopConversations = () => (
                <Paper sx={{ p: 2, height: 'auto', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" gutterBottom>Top Conversations</Typography>
                    {analyticsData.top_conversations && analyticsData.top_conversations.length > 0 ? (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Conversation</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Msgs</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {analyticsData.top_conversations.map((convo) => (
                                        <TableRow key={convo.name}>
                                            <TableCell component="th" scope="row">{getUserName(convo.name)}</TableCell>
                                            <TableCell align="right">{convo.count}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : <Typography variant="body2" color="text.secondary">No data</Typography>}
                </Paper>
            );

            const renderReactionAnalytics = () => (
                <Grid container spacing={3} sx={{ mt: 4 }}>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2, height: '100%', textAlign: 'center' }}>
                            <Typography variant="h4" component="div">{(analyticsData.reactions.total_reactions || 0).toLocaleString()}</Typography>
                            <Typography variant="body1" color="text.secondary">Total Reactions</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>Top 10 Emojis</Typography>
                            {analyticsData.reactions?.top_emojis && analyticsData.reactions.top_emojis.length > 0 ? (
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Emoji</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Count</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {analyticsData.reactions.top_emojis.map((reaction) => (
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
                </Grid>
            );

             // Fixed definition: renderAwardCard is now a function, not a component, to match usage
             const renderAwardCard = (title, award) => (
                <Grid item xs={12} sm={6} md={4} key={title}>
                    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="h6" component="div" sx={{ textAlign: 'center', fontSize: '1.1rem' }}>{title}</Typography>
                        {award && award.winner ? (
                            <React.Fragment>
                                <Typography variant="body1" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', overflowWrap: 'break-word', my: 1, maxWidth: '100%', textAlign: 'center' }}>
                                    {getUserName(award.winner)}
                                </Typography>
                                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                                    {award.count}
                                </Typography>
                            </React.Fragment>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>No data</Typography>
                        )}
                    </Paper>
                </Grid>
            );

            const renderAwards = () => {
                if (!analyticsData.awards) return null;
                const awardDisplayTitles = {
                    most_messages_sent: "Most Messages Sent",
                    most_reactions_given: "Most Reactions Given",
                    most_reactions_received: "Most Reactions Received",
                    most_mentioned: "Most Mentioned",
                    most_mentions_made: "Most Mentions Made",
                    most_media_sent: "Most Media Sent",
                };

                return (
                    <Box sx={{ mt: 4 }}>
                         <Typography variant="h4" sx={{ fontWeight: 'bold', borderLeft: '6px solid #1976d2', pl: 2, mb: 2, color: '#222', background: 'linear-gradient(90deg, #f4f7fa 0%, #e3ecf7 100%)', borderRadius: 2, boxShadow: 1 }}>
                            Awards
                        </Typography>
                        <Grid container spacing={3}>
                            {Object.entries(analyticsData.awards).map(([key, award]) =>
                                renderAwardCard(awardDisplayTitles[key] || key, award)
                            )}
                        </Grid>
                    </Box>
                );
            };

             const EmotionRankings = ({ title, data: rankingData, scoreLabel, totalReactsLabel }) => {
                if (!rankingData || rankingData.length === 0) return null;
                return (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5" gutterBottom>{title}</Typography>
                        <Paper sx={{ p: 2, overflowX: 'auto' }}>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>{totalReactsLabel}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Rate</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>{scoreLabel}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rankingData.map((user) => (
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

            return (
                <Box sx={{ p: 2 }}>
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                        {analyticsData.all_conversations && (
                            <Autocomplete
                                size="medium"
                                sx={{ minWidth: 300, flexGrow: 1 }}
                                options={analyticsData.all_conversations.map((convo) => convo.id)}
                                getOptionLabel={(id) => {
                                    const conversation = analyticsData.all_conversations.find((c) => c.id === id);
                                    return conversation?.name || id;
                                }}
                                value={selectedConversationIds[0] || null}
                                onChange={handleConversationChange}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params} 
                                        label="Filter by Group Chat" 
                                        variant="outlined"
                                        size="medium"
                                    />
                                )}
                                isOptionEqualToValue={(option, value) => option === value}
                            />
                        )}
                    </Box>

                    {renderConversationSummary()}
                    {renderKpiSummary()}

                    <Grid container spacing={3} sx={{ mt: 2 }}>
                        {/* Trends Section */}
                        <Grid item xs={12}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', borderLeft: '6px solid #1976d2', pl: 2, mb: 2, color: '#222', background: 'linear-gradient(90deg, #f4f7fa 0%, #e3ecf7 100%)', borderRadius: 2, boxShadow: 1 }}>
                                Trends
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>{renderDailyChart()}</Grid>
                        <Grid item xs={12} sx={{ mb: 5 }}>{renderHourlyChart()}</Grid>

                        {/* Reactions Section */}
                        <Grid item xs={12}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', borderLeft: '6px solid #1976d2', pl: 2, mb: 2, color: '#222', background: 'linear-gradient(90deg, #f4f7fa 0%, #e3ecf7 100%)', borderRadius: 2, boxShadow: 1 }}>
                                Reactions
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ mb: 5 }}>{renderReactionAnalytics()}</Grid>

                        {/* Awards & Rankings */}
                        <Grid item xs={12}>
                            {renderAwards()}
                        </Grid>
                        
                        <Grid item xs={12}>
                            <EmotionRankings title="😂 Who is the Funniest? 😂" data={analyticsData.funniestUsers} scoreLabel="Humor Score" totalReactsLabel="Total Laugh Reacts" />
                        </Grid>
                        <Grid item xs={12}>
                            <EmotionRankings title="❤️ Who is the Most Loved? ❤️" data={analyticsData.mostLovedUsers} scoreLabel="Love Score" totalReactsLabel="Total Love Reacts" />
                        </Grid>
                        <Grid item xs={12}>
                            <EmotionRankings title="😮 Who is the Most Shocking? 😮" data={analyticsData.mostShockingUsers} scoreLabel="Shock Score" totalReactsLabel="Total Shock Reacts" />
                        </Grid>
                    </Grid>
                </Box>
            );
        };

        // --- Main App With Navigation ---
        const App = () => {
            const [currentTab, setCurrentTab] = useState(0);

            const handleChange = (event, newValue) => {
                setCurrentTab(newValue);
            };

            return (
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6" sx={{ flexGrow: 1 }}>Signal Snapshot Export</Typography>
                        </Toolbar>
                        <Tabs value={currentTab} onChange={(_, v) => setCurrentTab(v)} textColor="inherit" indicatorColor="secondary" centered>
                            <Tab label="Group Chats" />
                            <Tab label="Individual Stats" />
                        </Tabs>
                    </AppBar>
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        {currentTab === 0 && <Dashboard data={window.analyticsData} />}
                        {currentTab === 1 && <IndividualStats data={window.analyticsData} />}
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