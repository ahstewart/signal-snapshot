import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress, Alert, Divider } from '@mui/material';
import { loadIndividualStats, User, Conversation, IndividualStatsData } from '../utils/database';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

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
      console.debug(`[UserStatsComparison] Participants query results: ${JSON.stringify(res)}`);
      if (res[0] && res[0].values && res[0].values.length > 0) {
        const [id, profileFullName, profileName] = res[0].values[0];
        const name = (profileFullName || profileName || '').trim();
        verifiedUser = users.find(u => u.id === id || u.name === name);
        if (verifiedUser) {
          verifiedUser.fromId = id;
        }
        console.debug(`[UserStatsComparison] Found verified user: sourceServiceId = ${verifiedUser?.id}, name = ${verifiedUser?.name}, fromId=${verifiedUser?.fromId}`)
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
  console.debug(`[UserStatsComparison] nameMatches: ${JSON.stringify(nameMatches)}`);
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
      console.log('[UserStatsComparison] Participants loaded:', found);
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
      async function getStatsForUser(userId: string, convoId: string, fromId: string): Promise<IndividualStatsData | null> {
        console.log(`[UserStatsComparison] getStatsForUser: userId=`, userId, 'fromId=', fromId);
        if (!dbBuffer) return null;
        try {
          const sqlJs = await (await import('../utils/database')).getSqlJs();
          const db = new sqlJs.Database(new Uint8Array(dbBuffer));
          // For 1:1 Signal, use the conversation.id as the conversationId in all queries
          const convoIdToQuery = convoId;

          console.debug(`[UserStatsComparison] Querying total messages for userId=${userId}, convoIdToQuery=${convoIdToQuery}`);
          // Total messages sent by user in this 1:1
          const msgCountQuery = `SELECT COUNT(*) FROM messages WHERE sourceServiceId = '${userId}' AND conversationId = '${convoIdToQuery}'`;
          const msgCountResult = db.exec(msgCountQuery);
          console.debug(`[UserStatsComparison] totalMessagesSent result:`, msgCountResult);
          const totalMessagesSent = msgCountResult[0]?.values[0]?.[0] ?? 0;
          console.debug(`[UserStatsComparison] totalMessagesSent:`, totalMessagesSent);

          console.debug(`[UserStatsComparison] Querying total reactions for userId=${userId}, convoIdToQuery=${convoIdToQuery}`);
          // Total reactions sent by user in this 1:1
          const reactCountQuery = `SELECT COUNT(*) FROM reactions WHERE fromId = '${fromId}' AND conversationId = '${convoIdToQuery}'`;
          const reactCountResult = db.exec(reactCountQuery);
          console.debug(`[UserStatsComparison] totalReactionsSent result:`, reactCountResult);
          const totalReactionsSent = reactCountResult[0]?.values[0]?.[0] ?? 0;
          console.debug(`[UserStatsComparison] totalReactionsSent:`, totalReactionsSent);

          console.debug(`[UserStatsComparison] Querying most common reaction for userId=${userId}, convoIdToQuery=${convoIdToQuery}`);
          // Most common reaction sent by user in this 1:1
          const topReactionQuery = `SELECT emoji, COUNT(*) as count FROM reactions WHERE fromId = '${fromId}' AND conversationId = '${convoIdToQuery}' GROUP BY emoji ORDER BY count DESC LIMIT 1`;
          const topReactionResult = db.exec(topReactionQuery);
          console.debug(`[UserStatsComparison] reactedToMost result:`, topReactionResult);
          const reactedToMost = topReactionResult[0]?.values[0] ? {
            emoji: topReactionResult[0].values[0][0],
            count: topReactionResult[0].values[0][1],
            name: ''
          } : null;

          console.debug(`[UserStatsComparison] Querying set of unique reactions for userId=${userId}, convoIdToQuery=${convoIdToQuery}`);
          // Unique reactions sent by user in this 1:1
          const uniqueReactionsQuery = `SELECT DISTINCT emoji FROM reactions WHERE fromId = '${fromId}' AND conversationId = '${convoIdToQuery}'`;
          const uniqueReactionsResult = db.exec(uniqueReactionsQuery);
          console.debug(`[UserStatsComparison] uniqueReactionsResult result:`, uniqueReactionsResult);
          const uniqueReactions = uniqueReactionsResult[0]?.values.map(([emoji]: [string]) => emoji) || [];
          console.debug(`[UserStatsComparison] uniqueReactions:`, uniqueReactions);

          console.debug(`[UserStatsComparison] Querying most popular message for userId=${userId}, convoIdToQuery=${convoIdToQuery}`);
          // Most popular message sent by user in this 1:1
          const popMsgQuery = `SELECT id, body FROM messages WHERE sourceServiceId = '${userId}' AND conversationId = '${convoIdToQuery}' ORDER BY (SELECT COUNT(*) FROM reactions WHERE messageId = messages.id) DESC LIMIT 1`;
          const popMsgResult = db.exec(popMsgQuery);
          console.debug(`[UserStatsComparison] mostPopularMessage result:`, popMsgResult);
          let mostPopularMessage = null;
          if (popMsgResult[0] && popMsgResult[0].values[0]) {
            const [msgId, text] = popMsgResult[0].values[0];
            // Get all reactions for this message
            const reactionsQuery = `SELECT emoji, fromId FROM reactions WHERE messageId = '${msgId}'`;
            const reactionsResult = db.exec(reactionsQuery);
            console.debug(`[UserStatsComparison] reactions result:`, reactionsResult);
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
            mostPopularMessage,
            uniqueReactions,
          };
        } catch (err) {
          console.error('[UserStatsComparison] Error in getStatsForUser:', err);
          return null;
        }
      }
      try {
        const results = await Promise.all(
          participants.map(u => getStatsForUser(u.id, conversation.id, u.fromId!))
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
                  <Typography variant="body1"><b>Unique Reactions Used:</b> {stats[idx]?.uniqueReactions.join(', ') ?? 'N/A'}</Typography>
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
  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };
  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Doughnut data={data} options={options} style={{ maxWidth: 200, maxHeight: 200 }} />
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        {[...labels].map((_, idx, arr) => {
          const i = arr.length - 1 - idx;
          return (
            <Box key={labels[i]} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: colors[i % colors.length] }} />
              <Typography variant="body2">{labels[i]} ({values[i]})</Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

