/*
 Utility helpers for decrypting and processing the Signal Desktop database.
*/

// Import CryptoJS for encryption/decryption
import CryptoJS from 'crypto-js';
import { summarize } from './ai';

// Singleton pattern for SQL.js initialization
let sqlJsInstance: any = null;
let sqlJsInitPromise: Promise<any> | null = null;

export async function getSqlJs() {
    if (sqlJsInstance) return sqlJsInstance;
    if (!sqlJsInitPromise) {
        sqlJsInitPromise = (async () => {
            try {
                const [SQLModule, wasmBinary] = await Promise.all([
                    import('sql.js'),
                    fetch('/sql-wasm.wasm').then(res => {
                        if (!res.ok) {
                            throw new Error(`Failed to fetch wasm file: ${res.statusText}`);
                        }
                        return res.arrayBuffer();
                    })
                ]);

                const initSqlJs = SQLModule.default as unknown as (config: any) => Promise<any>;
                const SQL = await initSqlJs({ wasmBinary });
                sqlJsInstance = SQL;
                return SQL;
            } catch (err) {
                console.error('Failed to initialize sql.js:', err);
                throw err;
            }
        })();
    }
    return sqlJsInitPromise;
}

export const initializeSQL = async () => {
    return getSqlJs();
};

// Helper to create a new SQL.js Database instance from ArrayBuffer
export async function createDatabaseFromBuffer(dbBuffer: ArrayBuffer) {
    const SQL = await getSqlJs();
    return new SQL.Database(new Uint8Array(dbBuffer));
}

export interface Conversation {
    id: string;
    name: string;
    summary?: string;
}

export interface Award {
    winner: string | null;
    count: number;
}

export interface EmotionUserData {
    name: string;
    totalReacts: number;
    rate: number;
    score: number;
}

export interface AnalyticsData {
    all_conversations: Conversation[];
    message_counts: {
        by_day: Record<string, number>;
        by_hour: Record<string, number>;
    };
    top_conversations: {
        name: string;
        count: number;
    }[];
    kpis: {
        total_messages: number;
        total_conversations: number;
        avg_messages_per_day: number;
    };
    reactions: {
        total_reactions: number;
        top_emojis: { emoji: string; count: number }[];
        top_emojis_by_author: Record<string, { emoji: string; count: number }[]>;
    };
    awards: {
        most_messages_sent: Award;
        most_reactions_given: Award;
        most_reactions_received: Award;
        most_mentioned: Award;
        most_replied_to: Award;
        most_media_sent: Award;
    };
    funniestUsers: EmotionUserData[];
    mostShockingUsers: EmotionUserData[];
    mostLovedUsers: EmotionUserData[];
}

export async function decryptDatabase(
    encrypted: ArrayBuffer,
    password: string
): Promise<ArrayBuffer> {
    try {
        // The key from Signal's config is a long hex string. We only need the first 32 bytes (64 hex chars) for the AES key.
        const keyHex = password.substring(0, 64);
        const key = CryptoJS.enc.Hex.parse(keyHex);

        // The first 16 bytes of the encrypted file are the IV
        const iv = CryptoJS.lib.WordArray.create(encrypted.slice(0, 16));

        // The rest of the file is the ciphertext
        const ciphertext = CryptoJS.lib.WordArray.create(encrypted.slice(16));

        // Decrypt using AES-256-CBC
        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: ciphertext } as any,
            key,
            {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            }
        );

        // Convert the decrypted WordArray back to a Uint8Array
        const decryptedBytes = decrypted.toString(CryptoJS.enc.Latin1);
        const decryptedArray = new Uint8Array(decryptedBytes.length);
        for (let i = 0; i < decryptedBytes.length; i++) {
            decryptedArray[i] = decryptedBytes.charCodeAt(i);
        }

        return decryptedArray.buffer;
    } catch (error) {
        console.error('Error decrypting database:', error);
        throw new Error('Failed to decrypt database. Check if the key is correct.');
    }
}

// New handler to support both encrypted and unencrypted databases
export async function loadDatabase(
    dbBuffer: ArrayBuffer,
    key?: string,
    conversationIds?: string[]
): Promise<AnalyticsData> {
    // Check for the SQLite header by comparing the first 16 bytes of the file
    const sqliteHeader = new Uint8Array([
        0x53, 0x51, 0x4c, 0x69, 0x74, 0x65, 0x20, 0x66, 0x6f, 0x72, 0x6d, 0x61, 0x74,
        0x20, 0x33, 0x00, // "SQLite format 3\0"
    ]);
    const fileHeader = new Uint8Array(dbBuffer.slice(0, 16));

    const isDecrypted =
        fileHeader.length === sqliteHeader.length &&
        fileHeader.every((byte, i) => byte === sqliteHeader[i]);

    if (isDecrypted) {
        // Already decrypted, process directly
        return processDatabase(dbBuffer, conversationIds);
    } else if (key) {
        // Encrypted, so decrypt first
        const decryptedBuffer = await decryptDatabase(dbBuffer, key);
        return processDatabase(decryptedBuffer, conversationIds);
    } else {
        // Encrypted but no key provided
        throw new Error('This database is encrypted. Please provide a key.');
    }
}

export async function processDatabase(
    dbBuffer: ArrayBuffer,
    conversationIds?: string[]
): Promise<AnalyticsData> {
    try {
        const db = await createDatabaseFromBuffer(dbBuffer);
        const buildWhereClause = (tableAlias?: string, idColumn: string = 'conversationId') => {
            if (!conversationIds || conversationIds.length === 0) return '';
            const prefix = tableAlias ? `${tableAlias}.` : '';
            const ids = conversationIds.map(id => `'${id}'`).join(',');
            return `WHERE ${prefix}${idColumn} IN (${ids})`;
        };

        const messagesWhereClause = buildWhereClause();
        const reactionsWhereClause = buildWhereClause();
        const conversationsWhereClause = buildWhereClause(undefined, 'id');
        const messagesJoinWhereClause = buildWhereClause('m');

        const analytics: AnalyticsData & { userNamesById: Record<string, string> } = {
            all_conversations: [],
            message_counts: { by_day: {}, by_hour: {} },
            top_conversations: [],
            kpis: { total_messages: 0, total_conversations: 0, avg_messages_per_day: 0 },
            reactions: { total_reactions: 0, top_emojis: [], top_emojis_by_author: {} },
            awards: {
                most_messages_sent: { winner: null, count: 0 },
                most_reactions_given: { winner: null, count: 0 },
                most_reactions_received: { winner: null, count: 0 },
                most_mentioned: { winner: null, count: 0 },
                most_replied_to: { winner: null, count: 0 },
                most_media_sent: { winner: null, count: 0 },
            },
            funniestUsers: [],
            mostShockingUsers: [],
            mostLovedUsers: [],
            userNamesById: {},
        };

        // Build user ID to name mapping from conversations
        const nameMappingQuery = `
            SELECT id, serviceId, profileFullName, profileName
            FROM conversations
            WHERE type = 'private'
        `;
        const nameMappingResults = db.exec(nameMappingQuery);
        if (nameMappingResults[0]) {
            nameMappingResults[0].values.forEach(([id, serviceId, profileFullName, profileName]: [string, string, string, string]) => {
                const name = (profileFullName || profileName || '').trim();
                if (name) {
                    if (id) analytics.userNamesById[id] = name;
                    if (serviceId) analytics.userNamesById[serviceId] = name;
                }
            });
        }
        console.log('Constructed userNamesById mapping:', analytics.userNamesById);

        // Get all conversations
        const conversationsQuery = `SELECT id, name FROM conversations ${conversationsWhereClause}`;
        const conversationsResults = db.exec(conversationsQuery);
        if (conversationsResults[0]) {
            const conversations: Conversation[] = conversationsResults[0].values.map(([id, name]: [string, string]) => ({
                id,
                name: analytics.userNamesById[id] || name || 'Unknown',
            }));
            analytics.all_conversations = conversations;

            // --- FIXED SUMMARIZATION LOGIC ---
            // Only run the expensive summarization if the user has filtered to exactly one conversation.
            if (conversationIds && conversationIds.length === 1) {
                const conversationToSummarize = analytics.all_conversations.find(c => c.id === conversationIds[0]);

                if (conversationToSummarize) {
                    console.log(`Fetching messages to summarize conversation: ${conversationToSummarize.name}`);
                    const messagesQuery = `
                        SELECT 
                            json_extract(json, '$.sourceName') as author, 
                            json_extract(json, '$.body') as body 
                        FROM messages 
                        WHERE conversationId = '${conversationToSummarize.id}' AND json_extract(json, '$.body') IS NOT NULL 
                        ORDER BY sent_at ASC
                    `;
                    const messageResults = db.exec(messagesQuery);

                    if (messageResults[0] && messageResults[0].values.length > 0) {
                        const messages = messageResults[0].values.slice(-500); // Take last 500 messages
                        
                        const chatMessages: { Author: string, Body: string }[] = messages
                            .map(([author, body]: [string, string]) => ({
                                Author: author || 'Unknown',
                                Body: body || ''
                            }))
                            .filter((msg: { Body: { trim: () => { (): any; new(): any; length: number; }; }; }) => msg.Body.trim().length > 0);

                        if (chatMessages.length > 0) {
                            try {
                                const summary = await summarize(chatMessages);
                                if (summary) {
                                    // Find the conversation in the original array and update it
                                    const index = analytics.all_conversations.findIndex(c => c.id === conversationToSummarize.id);
                                    if (index !== -1) {
                                        analytics.all_conversations[index].summary = summary;
                                    }
                                    console.log(`Generated summary for conversation ${conversationToSummarize.name}`);
                                }
                            } catch (e) {
                                console.error(`Failed to summarize conversation ${conversationToSummarize.name}`, e);
                            }
                        }
                    }
                }
            }
        }

        // Standard Analytics Queries
        const byDayResults = db.exec(`SELECT DATE(sent_at/1000, 'unixepoch') as date, COUNT(*) as count FROM messages ${messagesWhereClause} GROUP BY date ORDER BY date ASC`);
        const byHourResults = db.exec(`SELECT strftime('%H', sent_at/1000, 'unixepoch') as hour, COUNT(*) as count FROM messages ${messagesWhereClause} GROUP BY hour ORDER BY hour ASC`);
        const topConvoResults = db.exec(`SELECT COALESCE(c.name, c.profileName, c.e164, c.id) as name, COUNT(m.rowid) as count FROM messages m JOIN conversations c ON m.conversationId = c.id ${messagesJoinWhereClause} GROUP BY name ORDER BY count DESC LIMIT 5`);
        const kpiResults = db.exec(`SELECT (SELECT COUNT(*) FROM messages ${messagesWhereClause}) as total_messages, (SELECT COUNT(*) FROM conversations ${conversationsWhereClause}) as total_conversations`);
        const reactionResults = db.exec(`SELECT emoji, fromId, COUNT(*) as count FROM reactions ${reactionsWhereClause} GROUP BY emoji, fromId`);

        // Award Queries
        const mostMessagesSentQuery = `SELECT sourceServiceId, COUNT(*) as count FROM messages ${messagesWhereClause ? `${messagesWhereClause} AND` : 'WHERE'} sourceServiceId IS NOT NULL GROUP BY sourceServiceId ORDER BY count DESC LIMIT 1`;
        const mostReactionsGivenQuery = `SELECT fromId, COUNT(*) as count FROM reactions ${reactionsWhereClause ? `${reactionsWhereClause} AND` : 'WHERE'} fromId IS NOT NULL GROUP BY fromId ORDER BY count DESC LIMIT 1`;
        const mostReactionsReceivedQuery = `SELECT targetAuthorAci, COUNT(*) as count FROM reactions ${reactionsWhereClause ? `${reactionsWhereClause} AND` : 'WHERE'} targetAuthorAci IS NOT NULL GROUP BY targetAuthorAci ORDER BY count DESC LIMIT 1`;
        const mostMentionedQuery = `SELECT mn.mentionAci, COUNT(*) as count FROM mentions mn JOIN messages m ON mn.messageId = m.id JOIN conversations c ON mn.mentionAci = c.serviceId ${messagesJoinWhereClause} ${messagesJoinWhereClause ? 'AND' : 'WHERE'} mn.mentionAci IS NOT NULL GROUP BY mn.mentionAci ORDER BY count DESC LIMIT 1`;
        const mostRepliedToQuery = `SELECT json_extract(m.json, '$.quote.author') as repliedToAuthor, COUNT(*) as count FROM messages m ${messagesJoinWhereClause} ${messagesJoinWhereClause ? 'AND' : 'WHERE'} json_extract(m.json, '$.quote.author') IS NOT NULL GROUP BY repliedToAuthor ORDER BY count DESC LIMIT 1`;
        const mostMediaSentQuery = `SELECT sourceServiceId, COUNT(*) as count FROM messages ${messagesWhereClause ? `${messagesWhereClause} AND` : 'WHERE'} hasAttachments = 1 AND sourceServiceId IS NOT NULL GROUP BY sourceServiceId ORDER BY count DESC LIMIT 1`;

        const [mostMessagesSent, mostReactionsGiven, mostReactionsReceived, mostMentioned, mostRepliedTo, mostMediaSent] = [
            db.exec(mostMessagesSentQuery),
            db.exec(mostReactionsGivenQuery),
            db.exec(mostReactionsReceivedQuery),
            db.exec(mostMentionedQuery),
            db.exec(mostRepliedToQuery),
            db.exec(mostMediaSentQuery),
        ];

        // Process results
        if (byDayResults[0]) analytics.message_counts.by_day = Object.fromEntries(byDayResults[0].values);
        if (byHourResults[0]) analytics.message_counts.by_hour = Object.fromEntries(byHourResults[0].values);
        if (topConvoResults[0]) analytics.top_conversations = topConvoResults[0].values.map(([name, count]: [string, number]) => ({ name, count }));
        if (kpiResults[0]) {
            const [total_messages, total_conversations] = kpiResults[0].values[0] as [number, number];
            analytics.kpis = {
                total_messages,
                total_conversations,
                avg_messages_per_day: Object.keys(analytics.message_counts.by_day).length ? Math.round(total_messages / Object.keys(analytics.message_counts.by_day).length) : 0,
            };
        }
        if (reactionResults[0]) {
            const emojiCounts: Record<string, number> = {};
            const authorEmojiCounts: Record<string, Record<string, number>> = {};
            reactionResults[0].values.forEach(([emoji, fromId, count]: [string, string, number]) => {
                analytics.reactions.total_reactions += count;
                emojiCounts[emoji] = (emojiCounts[emoji] || 0) + count;
                if (!authorEmojiCounts[fromId]) authorEmojiCounts[fromId] = {};
                authorEmojiCounts[fromId][emoji] = (authorEmojiCounts[fromId][emoji] || 0) + count;
            });
            analytics.reactions.top_emojis = Object.entries(emojiCounts).sort(([, a], [, b]) => b - a).slice(0, 10).map(([emoji, count]) => ({ emoji, count }));
            for (const authorId in authorEmojiCounts) {
                analytics.reactions.top_emojis_by_author[authorId] = Object.entries(authorEmojiCounts[authorId]).sort(([, a], [, b]) => b - a).slice(0, 3).map(([emoji, count]) => ({ emoji, count }));
            }
        }

        // Process Award Results
        if (mostMessagesSent[0]?.values[0]) {
            const [winner, count] = mostMessagesSent[0].values[0] as [string, number];
            analytics.awards.most_messages_sent = { winner, count };
        }
        if (mostReactionsGiven[0]?.values[0]) {
            const [winner, count] = mostReactionsGiven[0].values[0] as [string, number];
            analytics.awards.most_reactions_given = { winner, count };
        }
        if (mostReactionsReceived[0]?.values[0]) {
            const [winner, count] = mostReactionsReceived[0].values[0] as [string, number];
            analytics.awards.most_reactions_received = { winner, count };
        }
        if (mostMentioned[0]?.values[0]) {
            const [winner, count] = mostMentioned[0].values[0] as [string, number];
            analytics.awards.most_mentioned = { winner, count };
        }
        if (mostRepliedTo[0]?.values[0]) {
            const [winner, count] = mostRepliedTo[0].values[0] as [string, number];
            analytics.awards.most_replied_to = { winner, count };
        }
        if (mostMediaSent[0]?.values[0]) {
            const [winner, count] = mostMediaSent[0].values[0] as [string, number];
            analytics.awards.most_media_sent = { winner, count };
        }

        // KPI: Emotion-based Rankings
        const calculateEmotionMetrics = (emojis: string[]): EmotionUserData[] => {
            const query = `
                WITH user_message_counts AS (
                    SELECT sourceServiceId, COUNT(*) as total_messages_sent
                    FROM messages
                    GROUP BY sourceServiceId
                ),
                latest_emotion_reactions AS (
                    SELECT
                        messageId, targetAuthorAci, emoji,
                        ROW_NUMBER() OVER(PARTITION BY fromId, messageId ORDER BY messageReceivedAt DESC) as rn
                    FROM reactions
                    WHERE emoji IN (${emojis.map(e => `'${e}'`).join(',')})
                ),
                user_emotion_reacts_received AS (
                    SELECT targetAuthorAci, COUNT(*) as total_reacts
                    FROM latest_emotion_reactions
                    WHERE rn = 1
                    GROUP BY targetAuthorAci
                ),
                global_avg_stats AS (
                    SELECT
                        AVG(COALESCE(uerr.total_reacts, 0)) as avg_reacts,
                        AVG(COALESCE(umc.total_messages_sent, 0)) as avg_messages
                    FROM user_message_counts umc
                    LEFT JOIN user_emotion_reacts_received uerr ON umc.sourceServiceId = uerr.targetAuthorAci
                )
                SELECT
                    c.profileFullName as name,
                    COALESCE(uerr.total_reacts, 0) as total_reacts,
                    CASE
                        WHEN umc.total_messages_sent > 0 THEN CAST(COALESCE(uerr.total_reacts, 0) AS REAL) / umc.total_messages_sent
                        ELSE 0
                    END as rate,
                    (CAST(COALESCE(uerr.total_reacts, 0) AS REAL) + (SELECT avg_reacts FROM global_avg_stats)) /
                    (COALESCE(umc.total_messages_sent, 0) + (SELECT avg_messages FROM global_avg_stats)) as score
                FROM conversations c
                LEFT JOIN user_message_counts umc ON c.serviceId = umc.sourceServiceId
                LEFT JOIN user_emotion_reacts_received uerr ON c.serviceId = uerr.targetAuthorAci
                WHERE c.type = 'private' AND c.serviceId IS NOT NULL AND umc.total_messages_sent > 0
                ORDER BY score DESC;
            `;
            const results = db.exec(query);
            return results[0]
                ? results[0].values.map((row: any) => ({
                    name: row[0],
                    totalReacts: row[1],
                    rate: row[2],
                    score: row[3],
                }))
                : [];
        };

        const laughEmojis = ['😂', '🤣', '😆', '😄'];
        analytics.funniestUsers = calculateEmotionMetrics(laughEmojis);

        const shockEmojis = ['😮', '😲'];
        analytics.mostShockingUsers = calculateEmotionMetrics(shockEmojis);

        const loveEmojis = ['❤️', '😍', '🥰', '♥️'];
        analytics.mostLovedUsers = calculateEmotionMetrics(loveEmojis);

        return analytics;
    } catch (error) {
        console.error('Error processing database:', error);
        throw new Error('Failed to process database');
    }
}

export interface User {
    id: string;
    name: string;
}

export interface IndividualStatsData {
    totalMessagesSent: number;
    mostPopularDay: string;
    totalReactionsSent: number;
    reactedToMost: {
        name: string;
        count: number;
        emoji: string;
    } | null;
    receivedMostReactionsFrom: {
        name: string;
        count: number;
        emoji: string;
    } | null;
    mostPopularMessage: {
        text: string | null;
        reactionCount: number;
        reactions: {
            emoji: string;
            sender: string;
        }[];
    } | null;
}

export async function getUsers(dbBuffer: ArrayBuffer): Promise<User[]> {
    try {
        const db = await createDatabaseFromBuffer(dbBuffer);

        // Build a comprehensive name mapping from the conversations table
        const nameMap = new Map<string, string>();
        const nameMappingQuery = `
            SELECT id, serviceId, profileFullName, profileName
            FROM conversations
            WHERE type = 'private'
        `;
        const nameMappingResults = db.exec(nameMappingQuery);
        if (nameMappingResults[0]) {
            nameMappingResults[0].values.forEach(([id, serviceId, profileFullName, profileName]: [string, string, string, string]) => {
                const name = (profileFullName || profileName || '').trim();
                if (name) {
                    if (id) nameMap.set(id, name);
                    if (serviceId) nameMap.set(serviceId, name);
                }
            });
        }

        // Collect all unique user IDs from messages and reactions
        const messageSendersQuery = `SELECT DISTINCT sourceServiceId FROM messages WHERE sourceServiceId IS NOT NULL`;
        const messageSendersResult = db.exec(messageSendersQuery);
        const messageSenders = messageSendersResult[0]?.values.map(([id]: [string]) => id) || [];

        const reactionGiversQuery = `SELECT DISTINCT fromId FROM reactions WHERE fromId IS NOT NULL`;
        const reactionGiversResult = db.exec(reactionGiversQuery);
        const reactionGivers = reactionGiversResult[0]?.values.map(([id]: [string]) => id) || [];

        const reactionReceiversQuery = `SELECT DISTINCT targetAuthorAci FROM reactions WHERE targetAuthorAci IS NOT NULL`;
        const reactionReceiversResult = db.exec(reactionReceiversQuery);
        const reactionReceivers = reactionReceiversResult[0]?.values.map(([id]: [string]) => id) || [];

        const allUserIds = [...new Set([...messageSenders, ...reactionGivers, ...reactionReceivers])];
        const uniqueUserIds = Array.from(new Set(allUserIds.filter(id => typeof id === 'string' && id)));

        // Create the User[] array, using the name map
        const usersWithPotentialDuplicates: User[] = uniqueUserIds
            .map(id => ({
                id,
                name: nameMap.get(id) || id, // Use mapped name, fallback to ID
            }));

        // Deduplicate users by name, keeping the first occurrence
        const uniqueUsersByName = new Map<string, User>();
        for (const user of usersWithPotentialDuplicates) {
            if (!uniqueUsersByName.has(user.name)) {
                uniqueUsersByName.set(user.name, user);
            }
        }

        const users = Array.from(uniqueUsersByName.values())
            .sort((a, b) => a.name.localeCompare(b.name));

        return users;
    } catch (error) {
        console.error('Error getting users:', error);
        throw new Error('Failed to get users from the database.');
    }
}


export async function getIndividualStats(dbBuffer: ArrayBuffer, userId: string): Promise<IndividualStatsData> {
    if (!userId) {
        throw new Error('User ID is required to get individual stats.');
    }

    try {
        const db = await createDatabaseFromBuffer(dbBuffer);

        // Find the canonical serviceId AND id for the given user ID
        const getIdsQuery = `SELECT id, serviceId FROM conversations WHERE id = '${userId}' OR serviceId = '${userId}' LIMIT 1`;
        const getIdsResult = db.exec(getIdsQuery);
        const userUUID = getIdsResult[0]?.values[0]?.[0] as string || userId;
        const userServiceId = getIdsResult[0]?.values[0]?.[1] as string || userId;

        const totalMessagesQuery = `SELECT COUNT(*) FROM messages WHERE sourceServiceId = '${userServiceId}'`;
        const totalMessagesResult = db.exec(totalMessagesQuery);
        const totalMessagesSent = totalMessagesResult[0]?.values[0]?.[0] as number || 0;

        // Calculate most popular day in JS for robustness
        const allTimestampsQuery = `SELECT sent_at FROM messages WHERE sourceServiceId = '${userServiceId}'`;
        const timestampsResult = db.exec(allTimestampsQuery);
        let mostPopularDay = 'N/A';
        if (timestampsResult[0]?.values.length > 0) {
            const dayCounts = Array(7).fill(0); // Sunday - Saturday
            timestampsResult[0].values.forEach((row: any[]) => {
                const ts = row[0] as number;
                const date = new Date(ts);
                dayCounts[date.getDay()]++;
            });
            const maxCount = Math.max(...dayCounts);
            const popularDayIndex = dayCounts.indexOf(maxCount);
            const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            mostPopularDay = dayMap[popularDayIndex];
        }

        // Use the user's UUID (conversations.id) for reactions, as per the user's view
        const totalReactionsQuery = `SELECT COUNT(*) FROM reactions WHERE fromId = '${userUUID}'`;
        const totalReactionsResult = db.exec(totalReactionsQuery);
        const totalReactionsSent = totalReactionsResult[0]?.values[0]?.[0] as number || 0;

        // KPI: Reacted To Most
        const reactedToMostQuery = `
            SELECT r.targetAuthorAci, c.profileFullName, COUNT(*) as count
            FROM reactions r
            JOIN conversations c ON r.targetAuthorAci = c.serviceId
            WHERE r.fromId = '${userUUID}'
            GROUP BY r.targetAuthorAci, c.profileFullName
            ORDER BY count DESC
            LIMIT 1;
        `;
        const reactedToMostResult = db.exec(reactedToMostQuery);
        let reactedToMost = null;
        if (reactedToMostResult[0]?.values[0]) {
            const targetSvcId = reactedToMostResult[0].values[0][0] as string;
            const name = reactedToMostResult[0].values[0][1] as string;
            const count = reactedToMostResult[0].values[0][2] as number;

            const topEmojiQuery = `
                SELECT emoji, COUNT(*) as count
                FROM reactions
                WHERE fromId = '${userUUID}' AND targetAuthorAci = '${targetSvcId}'
                GROUP BY emoji
                ORDER BY count DESC
                LIMIT 1;
            `;
            const topEmojiResult = db.exec(topEmojiQuery);
            const emoji = topEmojiResult[0]?.values[0]?.[0] as string || '??';
            reactedToMost = { name, count, emoji };
        }

        // KPI: Received Most Reactions From
        const receivedMostQuery = `
            SELECT r.fromId, c.profileFullName, COUNT(*) as count
            FROM reactions r
            JOIN conversations c ON r.fromId = c.id
            WHERE r.targetAuthorAci = '${userServiceId}'
            GROUP BY r.fromId, c.profileFullName
            ORDER BY count DESC
            LIMIT 1;
        `;
        const receivedMostResult = db.exec(receivedMostQuery);
        let receivedMostReactionsFrom = null;
        if (receivedMostResult[0]?.values[0]) {
            const fromId = receivedMostResult[0].values[0][0] as string;
            const name = receivedMostResult[0].values[0][1] as string;
            const count = receivedMostResult[0].values[0][2] as number;

            const topEmojiQuery = `
                SELECT emoji, COUNT(*) as count
                FROM reactions
                WHERE fromId = '${fromId}' AND targetAuthorAci = '${userServiceId}'
                GROUP BY emoji
                ORDER BY count DESC
                LIMIT 1;
            `;
            const topEmojiResult = db.exec(topEmojiQuery);
            const emoji = topEmojiResult[0]?.values[0]?.[0] as string || '??';
            receivedMostReactionsFrom = { name, count, emoji };
        }

        // KPI: Most Popular Message
        const popularMessageQuery = `
            WITH numbered_reactions AS (
                SELECT
                    messageId,
                    ROW_NUMBER() OVER(PARTITION BY fromId, messageId ORDER BY messageReceivedAt DESC) as rn
                FROM reactions
                WHERE emoji IS NOT NULL AND emoji != ''
            )
            SELECT
                nr.messageId,
                m.body,
                COUNT(*) as reaction_count
            FROM numbered_reactions nr
            JOIN messages m ON nr.messageId = m.id
            WHERE nr.rn = 1
                AND m.sourceServiceId = '${userServiceId}'
                AND m.body IS NOT NULL AND m.body != ''
            GROUP BY nr.messageId, m.body
            ORDER BY reaction_count DESC
            LIMIT 1;
        `;
        const popularMessageResult = db.exec(popularMessageQuery);
        let mostPopularMessage = null;
        if (popularMessageResult[0]?.values[0]) {
            const messageId = popularMessageResult[0].values[0][0] as string;
            const text = popularMessageResult[0].values[0][1] as string | null;
            const reactionCount = popularMessageResult[0].values[0][2] as number;

            const reactionsForMessageQuery = `
                WITH numbered_reactions AS (
                    SELECT
                        emoji,
                        fromId,
                        ROW_NUMBER() OVER(PARTITION BY fromId, messageId ORDER BY messageReceivedAt DESC) as rn
                    FROM reactions
                    WHERE messageId = '${messageId}' AND emoji IS NOT NULL AND emoji != ''
                )
                SELECT
                    nr.emoji,
                    c.profileFullName as sender_name
                FROM numbered_reactions nr
                JOIN conversations c ON nr.fromId = c.id
                WHERE nr.rn = 1;
            `;
            const reactionsForMessageResult = db.exec(reactionsForMessageQuery);
            const reactions = reactionsForMessageResult[0] ? reactionsForMessageResult[0].values.map((row: any) => ({ emoji: row[0], sender: row[1] })) : [];
            mostPopularMessage = { text, reactionCount, reactions };
        }

        return {
            totalMessagesSent,
            mostPopularDay,
            totalReactionsSent,
            reactedToMost,
            receivedMostReactionsFrom,
            mostPopularMessage,
        };
    } catch (error) {
        console.error(`Error getting stats for user ${userId}:`, error);
        throw new Error('Failed to get individual stats.');
    }
}

export async function loadUsers(
    dbBuffer: ArrayBuffer,
    key?: string
): Promise<User[]> {
    const sqliteHeader = new Uint8Array([
        0x53, 0x51, 0x4c, 0x69, 0x74, 0x65, 0x20, 0x66, 0x6f, 0x72, 0x6d, 0x61, 0x74,
        0x20, 0x33, 0x00,
    ]);
    const fileHeader = new Uint8Array(dbBuffer.slice(0, 16));
    const isDecrypted = fileHeader.length === sqliteHeader.length && fileHeader.every((byte, i) => byte === sqliteHeader[i]);

    if (isDecrypted) {
        return getUsers(dbBuffer);
    } else if (key) {
        const decryptedBuffer = await decryptDatabase(dbBuffer, key);
        return getUsers(decryptedBuffer);
    } else {
        throw new Error('This database is encrypted. Please provide a key.');
    }
}

export async function loadIndividualStats(
    dbBuffer: ArrayBuffer,
    key: string | undefined,
    userId: string
): Promise<IndividualStatsData> {
    const sqliteHeader = new Uint8Array([
        0x53, 0x51, 0x4c, 0x69, 0x74, 0x65, 0x20, 0x66, 0x6f, 0x72, 0x6d, 0x61, 0x74,
        0x20, 0x33, 0x00,
    ]);
    const fileHeader = new Uint8Array(dbBuffer.slice(0, 16));
    const isDecrypted = fileHeader.length === sqliteHeader.length && fileHeader.every((byte, i) => byte === sqliteHeader[i]);

    if (isDecrypted) {
        return getIndividualStats(dbBuffer, userId);
    } else if (key) {
        const decryptedBuffer = await decryptDatabase(dbBuffer, key);
        return getIndividualStats(decryptedBuffer, userId);
    } else {
        throw new Error('This database is encrypted. Please provide a key.');
    }
}
