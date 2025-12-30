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
    
    <!-- Error Handling: Show errors on screen for mobile debugging -->
    <style>
        #error-log { display: none; padding: 20px; background: #fee; color: #c00; border: 1px solid #c00; margin: 20px; font-family: monospace; white-space: pre-wrap; word-break: break-word; }
        html, body { height: 100%; margin: 0; background-color: #f5f5f5; -webkit-overflow-scrolling: touch; }
        #root { min-height: 100dvh; display: flex; flex-direction: column; }
    </style>
    <script>
        window.onerror = function(msg, url, line, col, error) {
            var el = document.getElementById('error-log');
            if (el) {
                el.style.display = 'block';
                el.innerHTML += '<div><strong>Error:</strong> ' + msg + '<br/><small>' + url + ':' + line + '</small></div><br/>';
            }
        };
    </script>

    <!-- Fonts -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

    <!-- Dependencies -->
    <!-- Prop-Types (Critical for Recharts UMD) -->
    <script src="https://cdn.jsdelivr.net/npm/prop-types@15.8.1/prop-types.min.js"></script>
    
    <!-- React -->
    <script crossorigin src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js"></script>
    <script crossorigin src="https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
    
    <!-- Babel -->
    <script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7.23.6/babel.min.js"></script>

    <!-- Recharts -->
    <script src="https://cdn.jsdelivr.net/npm/recharts@2.12.7/umd/Recharts.min.js"></script>

    <!-- Material UI & Emotion -->
    <script src="https://cdn.jsdelivr.net/npm/@emotion/react@11.11.1/dist/emotion-react.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@emotion/styled@11.11.0/dist/emotion-styled.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mui/material@5.14.20/umd/material-ui.development.js"></script>
</head>
<body>
    <div id="error-log"></div>
    <div id="root"></div>

    <script>
        try {
            window.analyticsData = ${safeData};
        } catch(e) {
            console.error("Failed to parse embedded data", e);
            document.getElementById('error-log').innerHTML += "Failed to parse data: " + e.message;
            document.getElementById('error-log').style.display = 'block';
        }
    </script>

    <script type="text/babel">
        try {
            const { useState, useMemo, useEffect } = React;
            
            // Check for library loading errors
            if (!window.MaterialUI) throw new Error("Material UI failed to load");
            if (!window.Recharts) throw new Error("Recharts failed to load");

            const { 
                createTheme, ThemeProvider, CssBaseline, AppBar, Toolbar, Typography, Container, 
                Box, Grid, Paper, Select, MenuItem, FormControl, InputLabel, Chip, Checkbox, 
                ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
                Alert, CircularProgress
            } = window.MaterialUI;
            
            const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } = window.Recharts;

            const theme = createTheme({
                palette: {
                    primary: { main: '#1976d2' },
                    background: { default: '#f5f5f5' }
                },
                components: {
                    MuiPaper: {
                        styleOverrides: {
                            root: { overflow: 'hidden' } // Prevents scroll issues on mobile
                        }
                    }
                }
            });

            // --- Dashboard Component ---
            
            const Dashboard = ({ data }) => {
                const [selectedConversationIds, setSelectedConversationIds] = useState([]);

                // Ensure data exists before processing
                if (!data) return <Alert severity="error">No analytics data available.</Alert>;

                const handleConversationChange = (event) => {
                    const { target: { value } } = event;
                    setSelectedConversationIds(typeof value === 'string' ? value.split(',') : value);
                };

                const userNameMap = data.userNamesById || {};
                const getUserName = (id) => userNameMap[id] || id;

                // Helpers
                const renderConversationSummary = () => {
                    if (selectedConversationIds.length !== 1) return null;
                    const conversationId = selectedConversationIds[0];
                    const conversation = data.all_conversations.find(c => c.id === conversationId);
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
                            <Typography variant="h4" component="div" sx={{ fontSize: { xs: '1.8rem', sm: '2.2rem' } }}>{value}</Typography>
                            <Typography variant="body1" color="text.secondary">{title}</Typography>
                        </Paper>
                    </Grid>
                );

                const renderKpiSummary = () => {
                    let totalMembers = 0;
                    if (selectedConversationIds.length === 1) {
                        const selectedConvo = data.all_conversations.find(c => c.id === selectedConversationIds[0]);
                        totalMembers = selectedConvo?.memberCount || 0;
                    } else {
                        totalMembers = data.kpis.total_members || 0;
                    }
                    return (
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            {renderKpiCard('Total Messages', (data.kpis.total_messages || 0).toLocaleString())}
                            {renderKpiCard('Total Members', totalMembers)}
                            {renderKpiCard('Avg Messages / Day', data.kpis.avg_messages_per_day || 0)}
                        </Grid>
                    );
                };

                const renderDailyChart = () => (
                    <Paper sx={{ p: { xs: 2, md: 5 }, height: 400 }}>
                        <Typography variant="h6" gutterBottom>Daily Message Activity</Typography>
                        {data.message_counts?.by_day ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={Object.entries(data.message_counts.by_day).map(([d, c]) => ({ date: d, count: c }))}>
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
                    <Paper sx={{ p: { xs: 2, md: 5 }, height: 400 }}>
                        <Typography variant="h6" gutterBottom>Hourly Activity</Typography>
                        {data.message_counts?.by_hour ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={Object.entries(data.message_counts.by_hour).map(([h, c]) => ({ hour: h, count: c }))}>
                                    <XAxis dataKey="hour" tickFormatter={(v) => \`\${parseInt(v)}:00\`} />
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
                        {data.top_conversations && data.top_conversations.length > 0 ? (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Conversation</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Msgs</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.top_conversations.map((convo) => (
                                            <TableRow key={convo.name}>
                                                <TableCell component="th" scope="row" sx={{ wordBreak: 'break-word' }}>{getUserName(convo.name)}</TableCell>
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
                                <Typography variant="h4" component="div">{(data.reactions.total_reactions || 0).toLocaleString()}</Typography>
                                <Typography variant="body1" color="text.secondary">Total Reactions</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>Top 10 Emojis</Typography>
                                {data.reactions?.top_emojis && data.reactions.top_emojis.length > 0 ? (
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Emoji</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Count</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {data.reactions.top_emojis.map((reaction) => (
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

                const renderAwardCard = (title, award) => (
                    <Grid item xs={12} sm={6} md={4} key={title}>
                        <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography variant="h6" component="div" sx={{ textAlign: 'center', fontSize: '1.1rem' }}>{title}</Typography>
                            {award.winner ? (
                                <React.Fragment>
                                    <Typography variant="body1" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', overflowWrap: 'break-word', my: 1, maxWidth: '100%', textAlign: 'center' }}>
                                        {award.winner ? getUserName(award.winner) : 'N/A'}
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
                    if (!data.awards) return null;
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
                            <Typography variant="h4" sx={{ fontWeight: 'bold', borderLeft: '6px solid #1976d2', pl: 2, mb: 2, color: '#222', background: 'linear-gradient(90deg, #f4f7fa 0%, #e3ecf7 100%)', borderRadius: 2, boxShadow: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                                Awards
                            </Typography>
                            <Grid container spacing={2}>
                                {Object.entries(data.awards).map(([key, award]) =>
                                    renderAwardCard(awardDisplayTitles[key], award)
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
                    <Box sx={{ p: { xs: 1, sm: 3 } }}>
                        {data.all_conversations && (
                            <Box sx={{ mb: 4 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="conversation-filter-label">Filter by Conversation</InputLabel>
                                    <Select
                                        labelId="conversation-filter-label"
                                        multiple
                                        value={selectedConversationIds}
                                        onChange={handleConversationChange}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => {
                                                    const conversation = data.all_conversations.find((c) => c.id === value);
                                                    return <Chip key={value} label={conversation?.name || value} />;
                                                })}
                                            </Box>
                                        )}
                                    >
                                        {data.all_conversations.map((convo) => (
                                            <MenuItem key={convo.id} value={convo.id}>
                                                <Checkbox checked={selectedConversationIds.indexOf(convo.id) > -1} />
                                                <ListItemText primary={convo.name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                {renderConversationSummary()}
                            </Box>
                        )}

                        {renderKpiSummary()}

                        <Grid container spacing={3} sx={{ mt: 2 }}>
                             <Grid item xs={12} sm={6}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', borderLeft: '6px solid #1976d2', pl: 2, mb: 2, color: '#222', background: 'linear-gradient(90deg, #f4f7fa 0%, #e3ecf7 100%)', borderRadius: 2, boxShadow: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                                    Trends
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                {renderDailyChart()}
                            </Grid>
                             <Grid item xs={12} sx={{ mb: 5 }}>
                                {renderHourlyChart()}
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                {renderTopConversations()}
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', borderLeft: '6px solid #1976d2', pl: 2, mb: 2, color: '#222', background: 'linear-gradient(90deg, #f4f7fa 0%, #e3ecf7 100%)', borderRadius: 2, boxShadow: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                                    Reactions
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ mb: 5 }}>
                                {renderReactionAnalytics()}
                            </Grid>

                            <Grid item xs={12}>
                                {renderAwards()}
                            </Grid>

                             <Grid item xs={12}>
                              <EmotionRankings
                                title="😂 Who is the Funniest? 😂"
                                data={data.funniestUsers}
                                scoreLabel="Humor Score"
                                totalReactsLabel="Total Laugh Reacts"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <EmotionRankings
                                title="❤️ Who is the Most Loved? ❤️"
                                data={data.mostLovedUsers}
                                scoreLabel="Love Score"
                                totalReactsLabel="Total Love Reacts"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <EmotionRankings
                                title="😮 Who is the Most Shocking? 😮"
                                data={data.mostShockingUsers}
                                scoreLabel="Shock Score"
                                totalReactsLabel="Total Shock Reacts"
                              />
                            </Grid>
                        </Grid>
                    </Box>
                );
            };

            const App = () => {
                return (
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <AppBar position="static">
                            <Toolbar>
                                <Typography variant="h6">Signal Snapshot Export</Typography>
                            </Toolbar>
                        </AppBar>
                        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, px: { xs: 1, sm: 3 } }}>
                            <Dashboard data={window.analyticsData} />
                        </Container>
                    </ThemeProvider>
                );
            };

            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(<App />);
            
        } catch (err) {
             console.error("Render Error:", err);
             document.getElementById('error-log').innerHTML += "<div><strong>React Error:</strong> " + err.message + "</div>";
             document.getElementById('error-log').style.display = 'block';
        }
    </script>
</body>
</html>`;
}