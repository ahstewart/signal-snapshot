import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress, Alert, Divider } from '@mui/material';
import { loadIndividualStats, User, Conversation, IndividualStatsData } from '../utils/database';

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

const UserStatsComparison: React.FC<UserStatsComparisonProps> = ({ conversation, users, dbBuffer, dbKey }) => {
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
  );
};

export default UserStatsComparison;
