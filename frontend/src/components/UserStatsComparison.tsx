import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress, Alert, Divider } from '@mui/material';
import { loadIndividualStats, User, Conversation, IndividualStatsData } from '../utils/database';
export {};

interface UserStatsComparisonProps {
  conversation: Conversation;
  users: User[];
  dbBuffer?: ArrayBuffer;
  dbKey?: string;
}

// Helper: Find the two participants for a 1:1 conversation
async function getParticipants(conversation: Conversation, users: User[], dbBuffer?: ArrayBuffer): Promise<User[]> {
  if (!conversation || !users.length) return [];
  // Try to find the verified user from the database
  let verifiedUser: User | undefined;
  if (dbBuffer) {
    try {
      const SQL = await import('sql.js');
      const sqlJs = await (await import('../utils/database')).getSqlJs();
      const db = new sqlJs.Database(new Uint8Array(dbBuffer));
      const query = `SELECT id, profileFullName, profileName FROM conversations WHERE json_extract(json, '$.verified') = 1 LIMIT 1`;
      const res = db.exec(query);
      if (res[0] && res[0].values && res[0].values.length > 0) {
        const [id, profileFullName, profileName] = res[0].values[0];
        const name = (profileFullName || profileName || '').trim();
        verifiedUser = users.find(u => u.id === id || u.name === name);
      }
      db.close();
    } catch (err) {
      // ignore and fallback
    }
  }
  // Heuristic for the first participant: match conversation name
  const nameMatches = users.filter(
    u => u.name === conversation.name || (u as any).profileFullName === conversation.name
  );
  let firstUser = nameMatches[0] || users[0];
  // If verifiedUser is found and not the same as firstUser, use as second participant
  if (verifiedUser && verifiedUser.id !== firstUser.id) {
    return [firstUser, verifiedUser];
  }
  // Fallback to previous logic
  if (nameMatches.length === 1) {
    const others = users.filter(u => u.id !== nameMatches[0].id);
    if (others.length) return [nameMatches[0], others[0]];
  }
  return users.slice(0, 2);
}

export const UserStatsComparison: React.FC<UserStatsComparisonProps> = ({ conversation, users, dbBuffer, dbKey }) => {
  const [stats, setStats] = useState<(IndividualStatsData | null)[]>([null, null]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [participants, setParticipants] = useState<User[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const found = await getParticipants(conversation, users, dbBuffer);
      if (!cancelled) setParticipants(found);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation.id, dbBuffer, users.map(u => u.id).join(',')]);

  useEffect(() => {
    let cancelled = false;
    async function fetchStatsForConversation() {
      setLoading(true);
      setError(null);
      async function getStatsForUser(userId: string, convoId: string): Promise<IndividualStatsData | null> {
        if (!dbBuffer) return null;
        try {
          const sqlJs = await (await import('../utils/database')).getSqlJs();
          const db = new sqlJs.Database(new Uint8Array(dbBuffer));
          // For 1:1 Signal, messages.conversationId is the OTHER participant's user id
          const otherUser = participants.find(p => p.id !== userId);
          const convoIdToQuery = otherUser ? otherUser.id : convoId;
          // Total messages sent by user in this 1:1
          const msgCountQuery = `SELECT COUNT(*) FROM messages WHERE sourceServiceId = '${userId}' AND conversationId = '${convoIdToQuery}'`;
          const msgCountResult = db.exec(msgCountQuery);
          const totalMessagesSent = msgCountResult[0]?.values[0]?.[0] ?? 0;
          // Total reactions sent by user in this 1:1
          const reactCountQuery = `SELECT COUNT(*) FROM reactions WHERE authorId = '${userId}' AND conversationId = '${convoIdToQuery}'`;
          const reactCountResult = db.exec(reactCountQuery);
          const totalReactionsSent = reactCountResult[0]?.values[0]?.[0] ?? 0;
          // Most common reaction sent by user in this 1:1
          const topReactionQuery = `SELECT emoji, COUNT(*) as count FROM reactions WHERE authorId = '${userId}' AND conversationId = '${convoIdToQuery}' GROUP BY emoji ORDER BY count DESC LIMIT 1`;
          const topReactionResult = db.exec(topReactionQuery);
          const reactedToMost = topReactionResult[0]?.values[0] ? {
            emoji: topReactionResult[0].values[0][0],
            count: topReactionResult[0].values[0][1],
            name: ''
          } : null;
          // Most popular message sent by user in this 1:1
          const popMsgQuery = `SELECT id, body FROM messages WHERE sourceServiceId = '${userId}' AND conversationId = '${convoIdToQuery}' ORDER BY (SELECT COUNT(*) FROM reactions WHERE messageId = messages.id) DESC LIMIT 1`;
          const popMsgResult = db.exec(popMsgQuery);
          let mostPopularMessage = null;
          if (popMsgResult[0] && popMsgResult[0].values[0]) {
            const [msgId, text] = popMsgResult[0].values[0];
            // Get all reactions for this message
            const reactionsQuery = `SELECT emoji, authorId FROM reactions WHERE messageId = '${msgId}'`;
            const reactionsResult = db.exec(reactionsQuery);
            const reactions = reactionsResult[0]?.values.map(([emoji, sender]: [string, string]) => ({ emoji, sender })) || [];
            mostPopularMessage = {
              text: text ?? '',
              reactionCount: reactions.length,
              reactions
            };
          }
          db.close();
          return {
            totalMessagesSent,
            mostPopularDay: '', // Not implemented per-conversation for now
            totalReactionsSent,
            reactedToMost,
            receivedMostReactionsFrom: null, // Not implemented per-conversation for now
            mostPopularMessage
          };
        } catch (err) {
          return null;
        }
      }
      try {
        const results = await Promise.all(
          participants.map(u => getStatsForUser(u.id, conversation.id))
        );
        if (!cancelled) {
          setStats(results);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load user stats.');
          setLoading(false);
        }
      }
    }
    if (participants.length === 2 && dbBuffer) {
      fetchStatsForConversation();
    } else {
      setStats([null, null]);
      setLoading(false);
    }
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation.id, dbBuffer, dbKey, participants.map(u => u.id).join(',')]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  if (participants.length !== 2) {
    return <Alert severity="warning">Could not determine both participants for this conversation.</Alert>;
  }

  return (
    <>
      <Grid container spacing={2}>
        {participants.map((user, idx) => (
          <Grid item xs={12} md={6} key={user.id}>
            <Paper sx={{ p: 2, minHeight: 260 }}>
              <Typography variant="h6" align="center" gutterBottom>
                {user.name}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {stats[idx] ? (
                <Box>
                  <Typography variant="body1"><b>Total Messages Sent:</b> {stats[idx]?.totalMessagesSent ?? 'N/A'}</Typography>
                  <Typography variant="body1"><b>Total Reactions Sent:</b> {stats[idx]?.totalReactionsSent ?? 'N/A'}</Typography>
                  <Typography variant="body1"><b>Unique Reactions Used:</b> {stats[idx]?.mostPopularMessage?.reactions ? [...new Set(stats[idx]!.mostPopularMessage!.reactions.map(r => r.emoji))].join(', ') : 'N/A'}</Typography>
                  <Typography variant="body1"><b>Most Common Reaction:</b> {stats[idx]?.reactedToMost ? `${stats[idx]!.reactedToMost!.emoji} (${stats[idx]!.reactedToMost!.count})` : 'N/A'}</Typography>
                </Box>
              ) : (
                <Typography color="text.secondary">No stats available.</Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
      {/* Donut Chart for message comparison */}
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" gutterBottom>Messages Sent Comparison</Typography>
        <DonutChart
          labels={participants.map(u => u.name)}
          values={stats.map(s => s?.totalMessagesSent ?? 0)}
          colors={["#1976d2", "#d32f2f"]}
        />
      </Box>
    </>
  );
};

// Simple DonutChart component using SVG
interface DonutChartProps {
  labels: string[];
  values: number[];
  colors: string[];
}
const DonutChart: React.FC<DonutChartProps> = ({ labels, values, colors }) => {
  const total = values.reduce((a, b) => a + b, 0);
  const radius = 48;
  const stroke = 24;
  const size = (radius + stroke) * 2;
  let startAngle = 0;
  const segments = values.map((val, i) => {
    const angle = total > 0 ? (val / total) * 360 : 0;
    const x1 = radius + stroke + radius * Math.cos((Math.PI * (startAngle - 90)) / 180);
    const y1 = radius + stroke + radius * Math.sin((Math.PI * (startAngle - 90)) / 180);
    const x2 = radius + stroke + radius * Math.cos((Math.PI * (startAngle + angle - 90)) / 180);
    const y2 = radius + stroke + radius * Math.sin((Math.PI * (startAngle + angle - 90)) / 180);
    const largeArc = angle > 180 ? 1 : 0;
    const path = `M${x1},${y1} A${radius},${radius} 0 ${largeArc},1 ${x2},${y2}`;
    const segment = (
      <path
        key={i}
        d={path}
        fill="none"
        stroke={colors[i % colors.length]}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${(angle / 360) * (2 * Math.PI * radius)} ${(2 * Math.PI * radius)}`}
        strokeDashoffset={-((startAngle / 360) * (2 * Math.PI * radius))}
      />
    );
    startAngle += angle;
    return segment;
  });
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={radius + stroke}
          cy={radius + stroke}
          r={radius}
          fill="#eee"
          stroke="#fff"
          strokeWidth={stroke}
        />
        {segments}
      </svg>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        {labels.map((label, i) => (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: colors[i % colors.length] }} />
            <Typography variant="body2">{label} ({values[i]})</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

