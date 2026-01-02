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

    <!-- React Dependencies -->
    <script crossorigin src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js"></script>
    <script crossorigin src="https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prop-types@15.8.1/prop-types.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/recharts@2.12.7/umd/Recharts.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@emotion/react@11.11.1/dist/emotion-react.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@emotion/styled@11.11.0/dist/emotion-styled.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mui/material@5.14.20/umd/material-ui.development.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7.23.6/babel.min.js"></script>

    <style>
        body { margin: 0; background-color: #f5f5f5; }
        #root { min-height: 100vh; display: flex; flex-direction: column; }
        .recharts-wrapper { width: 100% !important; }
    </style>
</head>
<body>
    <div id="root"></div>

    <script>
        window.analyticsData = ${safeData};
        console.log("[Boot] Loaded data.");
    </script>

    <script type="text/babel">
        const { useState, useMemo, useEffect } = React;
        const { 
            createTheme, ThemeProvider, CssBaseline, AppBar, Toolbar, Typography, Container, 
            Box, Grid, Paper, Select, MenuItem, FormControl, InputLabel, Chip, Checkbox, 
            ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
            Alert, CircularProgress, Autocomplete, TextField, Tabs, Tab, Divider, List, ListItem, useTheme,
            Tooltip: MuiTooltip
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
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1976d2' }}>{title}</Typography>
                    {children}
                </Box>
                {subtitle && <Typography variant="subtitle1" color="text.secondary">{subtitle}</Typography>}
            </Box>
        );

        // --- Individual Stats Component ---
        const IndividualStats = ({ data }) => {
            const [selectedUser, setSelectedUser] = useState(null);
            const [stats, setStats] = useState(null);

            const { users, statsMap } = useMemo(() => {
                const s = {};
                const u = [];
                
                if (data.individual_stats && Array.isArray(data.individual_stats)) {
                    data.individual_stats.forEach((item) => {
                        if (item.id && item.stats) {
                            s[item.id] = item.stats;
                            u.push({ id: item.id, name: item.name });
                        }
                    });
                } else if (data.individualStats) {
                    Object.assign(s, data.individualStats);
                    if (data.users) {
                        data.users.forEach(user => {
                            if (s[user.id]) {
                                u.push(user);
                            }
                        });
                    }
                }
                
                u.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                return { users: u, statsMap: s };
            }, [data]);

            useEffect(() => {
                if (selectedUser) {
                    setStats(statsMap[selectedUser.id] || null);
                } else {
                    setStats(null);
                }
            }, [selectedUser, statsMap]);

            const KpiCard = ({ title, value }) => (
                <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #f4f7fa 70%, #e3ecf7 100%)', boxShadow: 3, borderRadius: 3, border: '1px solid #d6e0ef' }}>
                        <Typography variant="h4" component="div">{value}</Typography>
                        <Typography variant="body1" color="text.secondary">{title}</Typography>
                    </Paper>
                </Grid>
            );

            return (
                <Box sx={{ p: 3 }}>
                    <PageHeader title="Individual Statistics" subtitle="Select an individual to analyze their Signal behavior.">
                         <Autocomplete
                            size="small"
                            sx={{ minWidth: 300 }}
                            options={users}
                            getOptionLabel={(user) => user.name || user.id}
                            value={selectedUser}
                            onChange={(_, newValue) => setSelectedUser(newValue)}
                            renderInput={(params) => <TextField {...params} label="Select User" variant="outlined" />}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                        />
                    </PageHeader>

                    {selectedUser && stats ? (
                        <Box>
                             {stats.summary && (
                                <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid', borderColor: 'primary.main', backgroundColor: 'rgba(25, 118, 210, 0.04)', borderRadius: 2 }}>
                                    <Box sx={{ mb: 2 }}><Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>Snapshot Summary</Typography></Box>
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'text.primary' }}>{stats.summary}</Typography>
                                </Paper>
                            )}

                            <Grid container spacing={3}>
                                <KpiCard title="Total Messages Sent" value={stats.totalMessagesSent?.toLocaleString() || 0} />
                                <KpiCard title="Most Popular Day" value={stats.mostPopularDay || 'N/A'} />
                                <KpiCard title="Total Reactions Sent" value={stats.totalReactionsSent?.toLocaleString() || 0} />
                            </Grid>
                        </Box>
                    ) : selectedUser ? (
                         <Box sx={{ mt: 4 }}><Alert severity="warning">No statistics available for this user in the export.</Alert></Box>
                    ) : null}
                </Box>
            );
        };

        // --- Dashboard Component ---
        const Dashboard = ({ data }) => {
            const [selectedConversationIds, setSelectedConversationIds] = useState([]);
            const analyticsData = data; 

            if (!analyticsData) return <Alert severity="error">No data available.</Alert>;

            const handleConversationChange = (event, value) => {
                setSelectedConversationIds(value ? [value.id] : []);
            };

            const userNameMap = analyticsData.userNamesById || {};
            const getUserName = (id) => userNameMap[id] || id;
            const formatHour = (hour) => \`\${hour}:00\`;

            // --- Render Helpers (Simplified for brevity as exact same logic as main app) ---
            // ... (Rest of Dashboard logic mirrors main App structure) ...
            
            // Re-implementing key renderers for self-containment
            const renderAwardCard = (title, award, suffix = "", tooltip = "") => (
                <Grid item xs={12} sm={6} md={4} key={title}>
                    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                         <MuiTooltip title={tooltip} arrow placement="top">
                            <Typography variant="h6" component="div" sx={{ textAlign: 'center', fontSize: '1.0rem', textDecoration: 'underline dotted', textDecorationColor: 'text.secondary', cursor: 'help', width: 'fit-content', mb: 1, fontWeight: 800, color: 'text.secondary' }}>{title}</Typography>
                         </MuiTooltip>
                        {award && award.winner ? (
                            <React.Fragment>
                                <Typography variant="h4" component="div" sx={{ fontWeight: 800, fontSize: '1.5rem', overflowWrap: 'break-word', my: 0.5, maxWidth: '100%', textAlign: 'center', color: 'primary.main' }}>{getUserName(award.winner)}</Typography>
                                <Typography variant="h6" component="div" sx={{ fontWeight: 'medium', color: 'text.secondary', fontSize: '1rem' }}>{award.count.toLocaleString()} {suffix}</Typography>
                            </React.Fragment>
                        ) : <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>No data</Typography>}
                    </Paper>
                </Grid>
            );

            const renderAwards = () => {
                if (!analyticsData.awards) return null;
                const awardDisplayTitles = { most_messages_sent: "Most Messages Sent", most_reactions_given: "Most Reactions Given", most_reactions_received: "Most Reactions Received", most_mentioned: "Most Mentioned", most_mentions_made: "Most Mentions Made", most_media_sent: "Most Media Sent", most_night_owl: "Night Owl", most_early_bird: "Early Bird", longest_avg_message: "The Rambler", hottest_newbie: "Hottest Newbie", lurker: "The Lurker", most_unique_emojis: "The Emoji Artist" };
                const awardSuffixes = { most_messages_sent: "messages", most_reactions_given: "reactions", most_reactions_received: "received", most_mentioned: "mentions", most_mentions_made: "mentions", most_media_sent: "files", most_night_owl: "%", most_early_bird: "%", longest_avg_message: "chars/msg", hottest_newbie: "messages", lurker: "reacts/msg", most_unique_emojis: "unique emojis" };
                return (
                    <Box sx={{ mt: 4 }}>
                         <Typography variant="h4" sx={{ fontWeight: 'bold', borderLeft: '6px solid #1976d2', pl: 2, mb: 2, color: '#222', background: 'linear-gradient(90deg, #f4f7fa 0%, #e3ecf7 100%)', borderRadius: 2, boxShadow: 1 }}>Awards</Typography>
                        <Grid container spacing={3}>
                            {Object.entries(analyticsData.awards).map(([key, award]) => renderAwardCard(awardDisplayTitles[key] || key, award, awardSuffixes[key] || ""))}
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
                                    <TableHead><TableRow><TableCell sx={{ fontWeight: 'bold' }}>User</TableCell><TableCell align="right" sx={{ fontWeight: 'bold' }}>{totalReactsLabel}</TableCell><TableCell align="right" sx={{ fontWeight: 'bold' }}>Rate</TableCell><TableCell align="right" sx={{ fontWeight: 'bold' }}>{scoreLabel}</TableCell></TableRow></TableHead>
                                    <TableBody>
                                        {rankingData.slice(0, 10).map((user) => (
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

            // Simplified chart renders for export
            const renderDailyChart = () => (
                <Paper sx={{ p: 5, height: 400 }}>
                    <Typography variant="h6" gutterBottom>Daily Message Activity</Typography>
                    <ResponsiveContainer width="100%" height="100%"><LineChart data={Object.entries(analyticsData.message_counts.by_day).map(([d, c]) => ({ date: d, count: c }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Line type="monotone" dataKey="count" stroke="#8884d8" dot={false} /></LineChart></ResponsiveContainer>
                </Paper>
            );

            const renderHourlyChart = () => {
                let pacificData = [];
                if (analyticsData.message_counts?.by_hour) {
                    const utcData = analyticsData.message_counts.by_hour;
                    for (let h = 0; h < 24; h++) {
                        const utcHour = (h + 7) % 24;
                        const utcKey = utcHour.toString().padStart(2, '0');
                        pacificData.push({ hour: h, count: utcData[utcKey] || 0 });
                    }
                }
                return (
                    <Paper sx={{ p: 5, height: 400 }}>
                        <Typography variant="h6" gutterBottom>Hourly Activity (Pacific Time)</Typography>
                        <ResponsiveContainer width="100%" height="100%"><LineChart data={pacificData}><XAxis dataKey="hour" tickFormatter={(v) => formatHour(parseInt(v, 10))} type="number" domain={[0, 23]} tickCount={12} /><YAxis /><Tooltip labelFormatter={(v) => \`\${formatHour(v)} PT\`} /><Line type="monotone" dataKey="count" stroke="#8884d8" dot={false} /></LineChart></ResponsiveContainer>
                    </Paper>
                );
            };

            return (
                <Box sx={{ p: 2 }}>
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                        {analyticsData.all_conversations && (
                            <Autocomplete
                                options={analyticsData.all_conversations}
                                getOptionLabel={(convo) => convo.name || convo.id}
                                value={analyticsData.all_conversations.find(c => selectedConversationIds.includes(c.id)) || null}
                                onChange={handleConversationChange}
                                renderInput={(params) => <TextField {...params} label="Filter by Group Chat" variant="outlined" size="medium" />}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                sx={{ minWidth: 300, flexGrow: 1 }}
                            />
                        )}
                    </Box>

                    <Grid container spacing={3} sx={{ mt: 2 }}>
                        <Grid item xs={12}>{renderDailyChart()}</Grid>
                        <Grid item xs={12} sx={{ mb: 5 }}>{renderHourlyChart()}</Grid>
                        <Grid item xs={12}>{renderAwards()}</Grid>
                        
                        <Grid item xs={12} md={6} lg={4}><EmotionRankings title="😂 Who is the Funniest? 😂" data={analyticsData.funniestUsers} scoreLabel="Humor Score" totalReactsLabel="Total Laugh Reacts" /></Grid>
                        <Grid item xs={12} md={6} lg={4}><EmotionRankings title="❤️ Who is the Most Loved? ❤️" data={analyticsData.mostLovedUsers} scoreLabel="Love Score" totalReactsLabel="Total Love Reacts" /></Grid>
                        <Grid item xs={12} md={6} lg={4}><EmotionRankings title="😮 Who is the Most Shocking? 😮" data={analyticsData.mostShockingUsers} scoreLabel="Shock Score" totalReactsLabel="Total Shock Reacts" /></Grid>
                        <Grid item xs={12} md={6} lg={4}><EmotionRankings title="👎 Who is the Most Disliked? 👎" data={analyticsData.mostDislikedUsers} scoreLabel="Dislike Score" totalReactsLabel="Total Dislikes" /></Grid>
                        <Grid item xs={12} md={6} lg={4}><EmotionRankings title="🍆 Who is the Most Randy? 🍆" data={analyticsData.mostRandyUsers} scoreLabel="Randy Score" totalReactsLabel="Total Eggplants" /></Grid>
                        <Grid item xs={12} md={6} lg={4}><EmotionRankings title="🍆 Who is the Most Thirsty? 🍆" data={analyticsData.mostThirstyUsers} scoreLabel="Thirst Score" totalReactsLabel="Total Eggplants" /></Grid>
                    </Grid>
                </Box>
            );
        };

        // --- Main App ---
        const App = () => {
            const [currentTab, setCurrentTab] = useState(0);
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