import { AnalyticsData } from './database';
export {};

/**
 * Creates the full HTML content for a self-contained, interactive dashboard.
 * @param analyticsData The analytics data to embed in the page.
 * @returns A string containing the full HTML document.
 */
function createDashboardHtml(analyticsData: AnalyticsData): string {
    // Sanitize the JSON data to prevent special characters from breaking the script tag.
    const embeddedData = JSON.stringify(analyticsData).replace(/</g, '\\u003c');

    // This template literal contains the entire standalone HTML file.
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Signal Analytics Export</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://unpkg.com/recharts@2.12.7/umd/Recharts.min.js"></script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <style>
        body { font-family: 'Roboto', sans-serif; background-color: #f4f6f8; margin: 0; padding: 24px; color: #333; }
        .recharts-wrapper { font-size: 12px; }
        .container { max-width: 1200px; margin: auto; }
        .grid { display: grid; gap: 24px; }
        .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
        .col-span-2 { grid-column: span 2 / span 2; }
        .paper { background-color: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        h1, h2, h3, h4 { margin: 0 0 16px 0; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #e0e0e0; }
        th { font-weight: 500; }
        td:last-child { text-align: right; }
        @media (max-width: 768px) {
            .grid-cols-3 { grid-template-columns: 1fr; }
            .col-span-2 { grid-column: span 1 / span 1; }
        }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/javascript">
        // Embed the analytics data directly into the page.
        window.analyticsData = ${embeddedData};
    </script>

    <script type="text/babel">
        // FIX: Wrap the entire application in a function that runs on window load.
        // This ensures all libraries (React, Recharts) and the 'root' div are ready before we try to render.
        function renderDashboard() {
            const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = window.Recharts;

            const Dashboard = ({ analyticsData }) => {
                if (!analyticsData) {
                    return <div>No data found in this file.</div>;
                }
                
                const KpiCard = ({ title, value }) => (
                    <div className="paper" style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{value}</h2>
                        <p style={{ color: '#666', margin: 0 }}>{title}</p>
                    </div>
                );

                const AwardCard = ({ title, award }) => (
                    <div className="paper" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                        <h4>{title}</h4>
                        {award && award.winner ? (
                            <div>
                                <p style={{ fontFamily: 'monospace', wordBreak: 'break-all', margin: '8px 0', fontSize: '0.9em' }}>
                                    {analyticsData.userNamesById?.[award.winner] || award.winner}
                                </p>
                                <h3 style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{award.count.toLocaleString()}</h3>
                            </div>
                        ) : <p style={{ color: '#888' }}>No data</p>}
                    </div>
                );

                const EmotionRankings = ({ title, data }) => (
                    <div className="paper">
                        <h3>{title}</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Total Reacts</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.slice(0, 5).map(user => (
                                    <tr key={user.name}>
                                        <td>{user.name}</td>
                                        <td>{user.totalReacts}</td>
                                        <td>{user.score.toFixed(3)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

                return (
                    <div className="container">
                        <h1 style={{ textAlign: 'center' }}>Signal Analytics Dashboard</h1>
                        
                        <div className="grid grid-cols-3">
                            <KpiCard title="Total Messages" value={analyticsData.kpis.total_messages.toLocaleString()} />
                            <KpiCard title="Total Conversations" value={analyticsData.kpis.total_conversations.toLocaleString()} />
                            <KpiCard title="Avg Messages / Day" value={analyticsData.kpis.avg_messages_per_day} />
                        </div>

                        <div className="grid grid-cols-3" style={{marginTop: '24px'}}>
                            <div className="paper col-span-2">
                                <h3>Daily Message Activity</h3>
                                <div style={{ height: '350px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={Object.entries(analyticsData.message_counts.by_day).map(([date, count]) => ({ date, count }))}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="count" stroke="#8884d8" name="Messages" dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="paper">
                                 <h3>Top Conversations</h3>
                                 <table>
                                    <thead><tr><th>Conversation</th><th>Messages</th></tr></thead>
                                    <tbody>
                                        {analyticsData.top_conversations.map(c => (
                                            <tr key={c.name}><td>{c.name}</td><td>{c.count.toLocaleString()}</td></tr>
                                        ))}
                                    </tbody>
                                 </table>
                            </div>
                        </div>

                        <div className="paper" style={{marginTop: '24px'}}>
                            <h3>🏆 Awards 🏆</h3>
                            <div className="grid grid-cols-3">
                                <AwardCard title="Most Messages Sent" award={analyticsData.awards.most_messages_sent} />
                                <AwardCard title="Most Reactions Given" award={analyticsData.awards.most_reactions_given} />
                                <AwardCard title="Most Reactions Received" award={analyticsData.awards.most_reactions_received} />
                            </div>
                        </div>

                        <div className="grid grid-cols-3" style={{marginTop: '24px'}}>
                            <EmotionRankings title="😂 Funniest Users" data={analyticsData.funniestUsers} />
                            <EmotionRankings title="😮 Most Shocking Users" data={analyticsData.mostShockingUsers} />
                            <EmotionRankings title="❤️ Most Loved Users" data={analyticsData.mostLovedUsers} />
                        </div>

                    </div>
                );
            };

            const container = document.getElementById('root');
            const root = ReactDOM.createRoot(container);
            root.render(<Dashboard analyticsData={window.analyticsData} />);
        }

        window.addEventListener('load', renderDashboard);
    </script>
</body>
</html>
    `;
}

/**
 * Triggers a browser download of the self-contained interactive dashboard.
 * @param analyticsData The analytics data to embed in the file.
 */
export function exportDashboardToHtml(analyticsData: AnalyticsData) {
    if (!analyticsData) {
        console.error("Export failed: analyticsData is null.");
        return;
    }

    const htmlContent = createDashboardHtml(analyticsData);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'signal-analytics-dashboard.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
