/*
 Utility helpers for decrypting and processing the Signal Desktop database.
*/

// Import CryptoJS for encryption/decryption
import CryptoJS from 'crypto-js';
// We will dynamically import sql.js inside the function to ensure it's loaded correctly.
import debug from 'debug';

// Efficiently convert CryptoJS WordArray to Uint8Array (avoids memory issues for large files)
function wordArrayToUint8Array(wordArray: CryptoJS.lib.WordArray): Uint8Array {
    const words = wordArray.words;
    const sigBytes = wordArray.sigBytes;
    const u8 = new Uint8Array(sigBytes);
    let i = 0;
    while (i < sigBytes) {
        const word = words[(i / 4) | 0];
        u8[i] = (word >> (24 - (i % 4) * 8)) & 0xff;
        i++;
    }
    return u8;
}

// We need to define the type for the sql.js instance, as we can't import it directly
// in a way that satisfies all TypeScript configurations.
// This interface defines the parts of the sql.js object that we use.
export interface SqlJsStatic {
  Database: new (data?: Uint8Array | null) => {
    exec(sql: string): any[];
    close(): void;
  };
}

// Singleton pattern for SQL.js initialization
let sqlJsInitPromise: Promise<SqlJsStatic> | null = null;

export async function getSqlJs(): Promise<SqlJsStatic> {
    if (sqlJsInitPromise) {
        return sqlJsInitPromise;
    }
    sqlJsInitPromise = (async () => {
        try {
            // Dynamically import the module to get the initializer function.
            const sqlJsModule = await import('sql.js');
            // Support both ESM and CommonJS builds
            const initSqlJs: any = sqlJsModule.default || sqlJsModule;
            const SQL = await initSqlJs({
                locateFile: (file: string) => `${process.env.PUBLIC_URL}/${file}`
            });
            return SQL;
        } catch (err) {
            console.error('Failed to initialize sql.js:', err);
            // Reset promise on failure to allow future retries
            sqlJsInitPromise = null;
            throw err;
        }
    })();
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
    memberCount?: number;
    messageCount?: number;
    active_at?: string | null;
    avgMessagesPerDay?: number;
}

export interface Award {
    winner: string | null;
    count: number;
}

export interface UserActivity {
    name: string;
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
        total_members: number;
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
        most_mentions_made: Award;
        most_media_sent: Award;
    };
    funniestUsers: EmotionUserData[];
    mostShockingUsers: EmotionUserData[];
    mostLovedUsers: EmotionUserData[];
    topUsersByMessageCount: UserActivity[];
    topUsersByReactionCount: UserActivity[];
}

// Type for progress callback
export type ProgressCallback = (progress: number, description: string) => void;

// Helper function to try decrypting with given parameters
async function tryDecrypt(
    encrypted: ArrayBuffer,
    key: CryptoJS.lib.WordArray,
    iv: CryptoJS.lib.WordArray,
    mode: any,
    padding: any,
    description: string,
    onProgress?: ProgressCallback
): Promise<ArrayBuffer | null> {
    try {
        console.log(`[Decrypt] Trying decryption with ${description}`);
        if (onProgress) onProgress(0, `Starting ${description}...`);
        
        // Calculate chunk size for progress reporting (process in 1MB chunks)
        const CHUNK_SIZE = 1024 * 1024;
        const ciphertext = CryptoJS.lib.WordArray.create(encrypted.slice(iv.sigBytes / 4));
        
        if (onProgress) onProgress(10, 'Initializing decryption...');
        
        // For large files, we need to process in chunks to show progress
        let decrypted: CryptoJS.lib.WordArray;
        
        if (ciphertext.sigBytes > CHUNK_SIZE * 2) {
            // Process in chunks for large files
            if (onProgress) onProgress(20, 'Decrypting in chunks...');
            
            const totalChunks = Math.ceil(ciphertext.sigBytes / CHUNK_SIZE);
            const chunks: CryptoJS.lib.WordArray[] = [];
            
            for (let i = 0; i < totalChunks; i++) {
                const start = i * CHUNK_SIZE;
                const end = Math.min(start + CHUNK_SIZE, ciphertext.sigBytes);
                const chunk = CryptoJS.lib.WordArray.create(ciphertext.words.slice(start / 4, end / 4));
                
                if (onProgress) {
                    const progress = 20 + (i / totalChunks) * 70;
                    onProgress(progress, `Decrypting chunk ${i + 1} of ${totalChunks}...`);
                }
                
                const chunkDecrypted = CryptoJS.AES.decrypt(
                    { ciphertext: chunk } as any,
                    key,
                    { 
                        iv: i === 0 ? iv : CryptoJS.lib.WordArray.random(16), // Only use IV for first chunk
                        mode: CryptoJS.mode.CBC,
                        padding: i === totalChunks - 1 ? padding : CryptoJS.pad.NoPadding
                    }
                );
                
                chunks.push(chunkDecrypted);
                
                // Small delay to allow UI to update
                await new Promise(resolve => setTimeout(resolve, 0));
            }
            
            // Combine all chunks
            decrypted = chunks.reduce((result, chunk) => {
                result.concat(chunk);
                return result;
            }, CryptoJS.lib.WordArray.create());
            
        } else {
            // Process small files in one go
            if (onProgress) onProgress(20, 'Decrypting...');
            
            decrypted = CryptoJS.AES.decrypt(
                { ciphertext } as any,
                key,
                { iv, mode, padding }
            );
            
            if (onProgress) onProgress(90, 'Processing decrypted data...');
        }

        if (!decrypted || decrypted.sigBytes === 0) {
            console.log(`[Decrypt] Decryption with ${description} failed: empty result`);
            if (onProgress) onProgress(100, 'Decryption failed: empty result');
            return null;
        }

        if (onProgress) onProgress(95, 'Converting data...');
        const decryptedArray = wordArrayToUint8Array(decrypted);
        const decryptedBuffer = decryptedArray.slice().buffer as ArrayBuffer;

        // Quick check if this looks like a SQLite database
        if (decryptedBuffer.byteLength > 16) {
            const header = new Uint8Array(decryptedBuffer, 0, 16);
            const sqliteHeader = new TextEncoder().encode('SQLite format 3\0');
            let isSqlite = true;
            
            for (let i = 0; i < sqliteHeader.length; i++) {
                if (header[i] !== sqliteHeader[i]) {
                    isSqlite = false;
                    break;
                }
            }
            
            if (isSqlite) {
                console.log(`[Decrypt] Success! Valid SQLite database found with ${description}`);
                return decryptedBuffer;
            }
        }
        
        return null;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`[Decrypt] Error with ${description}:`, errorMessage);
        return null;
    }
}

export async function decryptDatabase(
    encrypted: ArrayBuffer,
    password: string,
    onProgress?: ProgressCallback
): Promise<ArrayBuffer> {
    console.log(`[Decrypt] Starting decryption for ${encrypted.byteLength} bytes.`);
    
    try {
        // Initialize progress
        const updateProgress = (progress: number, description: string) => {
            if (onProgress) onProgress(Math.min(100, Math.max(0, progress)), description);
        };

        updateProgress(0, 'Starting decryption...');
        
        // Clean and validate the key
        updateProgress(5, 'Validating key...');
        const cleanKey = password.replace(/\s+/g, '').toLowerCase();
        if (!/^[0-9a-f]+$/.test(cleanKey)) {
            throw new Error('Invalid key format. Key must be a hex string.');
        }
        
        // The first 16 bytes are the IV
        updateProgress(10, 'Extracting IV...');
        const iv = CryptoJS.lib.WordArray.create(encrypted.slice(0, 16));
        console.log(`[Decrypt] IV extracted: ${iv.toString(CryptoJS.enc.Hex)}`);
        
        // Try different key lengths (32, 16, 24 bytes - AES key sizes)
        const keyVariants = [
            { length: 32, desc: '32-byte key (AES-256)', weight: 3 },
            { length: 24, desc: '24-byte key (AES-192)', weight: 2 },
            { length: 16, desc: '16-byte key (AES-128)', weight: 1 },
        ];

        const totalAttempts = keyVariants.reduce((sum, v) => sum + v.weight * 3, 0);
        let currentAttempt = 0;

        // Try different key variants and decryption parameters
        for (const variant of keyVariants) {
            const keyHex = cleanKey.substring(0, variant.length * 2).padEnd(variant.length * 2, '0');
            const key = CryptoJS.enc.Hex.parse(keyHex);
            
            const variantProgress = (currentAttempt / totalAttempts) * 90 + 10; // 10-100%
            updateProgress(variantProgress, `Trying ${variant.desc}...`);
            console.log(`[Decrypt] Trying with ${variant.desc}`);
            
            // Try different modes and paddings
            const modePaddingCombinations = [
                { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, desc: 'CBC with PKCS7' },
                { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.NoPadding, desc: 'CBC with NoPadding' },
                { mode: CryptoJS.mode.CTR, padding: CryptoJS.pad.NoPadding, desc: 'CTR with NoPadding' },
            ];
            
            for (const { mode, padding, desc } of modePaddingCombinations) {
                const attemptProgress = (currentAttempt / totalAttempts) * 90 + 10;
                updateProgress(attemptProgress, `Trying ${variant.desc}, ${desc}...`);
                
                const result = await tryDecrypt(
                    encrypted,
                    key,
                    iv,
                    mode,
                    padding,
                    `${variant.desc}, ${desc}`,
                    (progress, description) => {
                        // Scale progress within this attempt's range
                        const minProgress = (currentAttempt / totalAttempts) * 90 + 10;
                        const maxProgress = ((currentAttempt + 1) / totalAttempts) * 90 + 10;
                        const scaledProgress = minProgress + (maxProgress - minProgress) * (progress / 100);
                        updateProgress(scaledProgress, description);
                    }
                );
                
                currentAttempt++;
                if (result) {
                    updateProgress(100, 'Decryption successful!');
                    return result;
                }
            }
        }
        
        // If we get here, all attempts failed
        throw new Error('Failed to decrypt database with any known method. The key may be incorrect or the file may be corrupted.');
    } catch (error) {
        console.error('[Decrypt] An error occurred during decryption:', error);
        throw new Error('Failed to decrypt database. Check if the key is correct or see console for details.');
    }
}

// New handler to support both encrypted and unencrypted databases
export async function loadDatabase(
    dbBuffer: ArrayBuffer,
    key?: string,
    conversationIds?: string[],
    onProgress?: ProgressCallback
): Promise<AnalyticsData> {
    try {
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
            if (onProgress) onProgress(50, 'Processing database...');
            const result = await processDatabase(dbBuffer, conversationIds);
            if (onProgress) onProgress(100, 'Database processed successfully');
            return result;
        } else if (key) {
            // Encrypted, so decrypt first
            if (onProgress) onProgress(0, 'Starting database decryption...');
            const decryptedBuffer = await decryptDatabase(dbBuffer, key, 
                (progress, message) => {
                    // Scale decryption progress to 0-80% range
                    const scaledProgress = Math.floor(progress * 0.8);
                    if (onProgress) onProgress(scaledProgress, message);
                }
            );
            
            // Now process the decrypted database (remaining 80-100%)
            if (onProgress) onProgress(85, 'Processing decrypted data...');
            const result = await processDatabase(decryptedBuffer, conversationIds);
            if (onProgress) onProgress(100, 'Database processed successfully');
            return result;
        } else {
            // Encrypted but no key provided
            if (onProgress) onProgress(100, 'Error: Database is encrypted but no key provided');
            throw new Error('This database is encrypted. Please provide a key.');
        }
    } catch (error) {
        console.error('Error in loadDatabase:', error);
        if (onProgress) onProgress(100, 'Error processing database');
        throw error;
    }
}

// Helper function to process database and generate analytics
export async function processDatabase(
    dbBuffer: ArrayBuffer,
    conversationIds?: string[],
    onProgress?: ProgressCallback
): Promise<AnalyticsData> {
    debug.log('Starting database processing');
    debug.log(`Buffer size: ${dbBuffer.byteLength} bytes`);
    
    // Update progress if callback provided
    if (onProgress) onProgress(0, 'Initializing database processing...');
    
    // Log first 16 bytes of the buffer for verification
    const header = new Uint8Array(dbBuffer.slice(0, 16));
    debug.log('Database header bytes:', Array.from(header).map(b => b.toString(16).padStart(2, '0')).join(' '));
    
    try {
        if (onProgress) onProgress(10, 'Creating database from buffer...');
        debug.log('Attempting to create database from buffer...');
        
        const db = await createDatabaseFromBuffer(dbBuffer).catch(error => {
            const errorMsg = `Error in createDatabaseFromBuffer: ${error instanceof Error ? error.message : String(error)}`;
            debug(errorMsg);
            // Additional debug: Try to create a file and read it back to verify the buffer
            debug.log('First 100 bytes as text:', 
                new TextDecoder().decode(dbBuffer.slice(0, 100)));
            if (onProgress) onProgress(100, 'Error creating database');
            throw new Error(errorMsg);
        });
        
        debug.log('Database created successfully');
        if (onProgress) onProgress(20, 'Database loaded, processing data...');

        const buildWhereClause = (tableAlias = '', idColumn = 'conversationId', additionalWhere = '') => {
            const hasFilters = conversationIds && conversationIds.length > 0;
            let whereClauses = [];

            if (hasFilters) {
                const ids = conversationIds.map(id => `'${id}'`).join(',');
                const prefix = tableAlias ? `${tableAlias}.` : '';
                whereClauses.push(`${prefix}${idColumn} IN (${ids})`);
            }

            if (additionalWhere) {
                whereClauses.push(additionalWhere);
            }

            if (whereClauses.length > 0) {
                return `WHERE ${whereClauses.join(' AND ')}`;
            }

            return '';
        };

        debug.log('Conversation IDs:', conversationIds || 'None provided (will process all conversations)');

        debug.log('Building WHERE clauses...');
        const messagesWhereClause = buildWhereClause('messages', 'conversationId', 'sourceServiceId IS NOT NULL');
        const reactionsWhereClause = buildWhereClause('reactions', 'conversationId', 'fromId IS NOT NULL');
        const conversationsWhereClause = buildWhereClause('', 'id');
        const messagesJoinWhereClause = buildWhereClause('m', 'conversationId');

        const analytics: AnalyticsData & { userNamesById: Record<string, string> } = {
            all_conversations: [],
            // ...
            message_counts: { by_day: {}, by_hour: {} },
            top_conversations: [],
            kpis: { total_messages: 0, total_conversations: 0, avg_messages_per_day: 0, total_members: 0 },
            reactions: { total_reactions: 0, top_emojis: [], top_emojis_by_author: {} },
            awards: {
                most_messages_sent: { winner: null, count: 0 },
                most_reactions_given: { winner: null, count: 0 },
                most_reactions_received: { winner: null, count: 0 },
                most_mentioned: { winner: null, count: 0 },
                most_mentions_made: { winner: null, count: 0 },
                most_media_sent: { winner: null, count: 0 },
            },
            funniestUsers: [],
            mostShockingUsers: [],
            mostLovedUsers: [],
            topUsersByMessageCount: [],
            topUsersByReactionCount: [],
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
        
        // Process group conversations
        if (onProgress) onProgress(25, 'Loading group conversations...');
        const groupConversationsQuery = `
            SELECT 
                id, 
                name,
                type,
                active_at,
                json_extract(json, '$.messageCount') as messageCount, 
                CASE
                    WHEN members IS NULL OR members = '' THEN 0
                    ELSE (LENGTH(members) - LENGTH(REPLACE(members, ' ', ''))) + 1
                END as memberCount
            FROM conversations 
            WHERE type != 'private' 
            ORDER BY messageCount DESC
        `;
        const groupConversationsResults = db.exec(groupConversationsQuery);
        let groupConversations: Conversation[] = [];
        if (groupConversationsResults[0]) {
            groupConversations = groupConversationsResults[0].values.map(([id, name, type, active_at, messageCount, memberCount]: [string, string, string, string, number, number]) => {
                // Calculate days active
                let daysActive = 1;
                if (active_at) {
                    const start = new Date(active_at);
                    const now = new Date();
                    const diff = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
                    daysActive = Math.max(1, Math.round(diff));
                }
                return {
                    id,
                    name: analytics.userNamesById[id] || name || 'Unknown Conversation',
                    type,
                    active_at,
                    messageCount: messageCount || 0,
                    memberCount: memberCount || 0,
                    avgMessagesPerDay: messageCount && daysActive ? Math.round(messageCount / daysActive) : 0
                };
            });
        }

        // Process private conversations with active_at not null
        const privateConversationsQuery = `
            SELECT 
                id, 
                name,
                type,
                active_at,
                json_extract(json, '$.messageCount') as messageCount, 
                NULL as memberCount, -- 1:1s
                active_at
            FROM conversations 
            WHERE type = 'private' AND active_at IS NOT NULL
            ORDER BY messageCount DESC
        `;
        const privateConversationsResults = db.exec(privateConversationsQuery);
        let privateConversations: Conversation[] = [];
        if (privateConversationsResults[0]) {
            privateConversations = privateConversationsResults[0].values.map(([id, name, type, active_at, messageCount, memberCount]: [string, string, string, string, number, number]) => {
                // Calculate days active
                let daysActive = 1;
                if (active_at) {
                    const start = new Date(active_at);
                    const now = new Date();
                    const diff = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
                    daysActive = Math.max(1, Math.round(diff));
                }
                return {
                    id,
                    name: analytics.userNamesById[id] || name || 'Unknown Conversation',
                    type,
                    active_at,
                    messageCount: messageCount || 0,
                    memberCount: memberCount || 0,
                    avgMessagesPerDay: messageCount && daysActive ? Math.round(messageCount / daysActive) : 0
                };
            });
        }

        analytics.all_conversations = [...groupConversations, ...privateConversations];

        // Standard Analytics Queries
        if (onProgress) onProgress(30, 'Analyzing message patterns...');
        const byDayResults = db.exec(`SELECT DATE(sent_at/1000, 'unixepoch') as date, COUNT(*) as count FROM messages ${messagesWhereClause} GROUP BY date ORDER BY date ASC`);
        const byHourResults = db.exec(`SELECT strftime('%H', sent_at/1000, 'unixepoch') as hour, COUNT(*) as count FROM messages ${messagesWhereClause} GROUP BY hour ORDER BY hour ASC`);
        const topConvoResults = db.exec(`SELECT COALESCE(c.name, c.profileName, c.e164, c.id) as name, COUNT(m.rowid) as count FROM messages m JOIN conversations c ON m.conversationId = c.id ${messagesJoinWhereClause} GROUP BY name ORDER BY count DESC LIMIT 5`);
        const kpiResults = db.exec(`SELECT (SELECT COUNT(*) FROM messages ${messagesWhereClause}) as total_messages, (SELECT COUNT(*) FROM conversations ${conversationsWhereClause}) as total_conversations`);
        const reactionResults = db.exec(`SELECT r.emoji, c.profileFullName, COUNT(*) as count FROM reactions as r JOIN conversations as c on r.fromId = c.id GROUP BY r.emoji, c.profileFullName`);

        // Process results
        if (byDayResults[0]) analytics.message_counts.by_day = Object.fromEntries(byDayResults[0].values);
        if (byHourResults[0]) analytics.message_counts.by_hour = Object.fromEntries(byHourResults[0].values);
                if (topConvoResults[0]) analytics.top_conversations = topConvoResults[0].values.map(([name, count]: [string, number]) => ({ name, count }));

        const total_members = analytics.all_conversations.reduce((sum, convo) => sum + (convo.memberCount || 0), 0);
        
        if (kpiResults[0]) {
            const [total_messages, total_conversations] = kpiResults[0].values[0] as [number, number];
            analytics.kpis = {
                total_messages,
                total_conversations,
                avg_messages_per_day: Object.keys(analytics.message_counts.by_day).length ? Math.round(total_messages / Object.keys(analytics.message_counts.by_day).length) : 0,
                total_members: total_members,
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

        if (onProgress) onProgress(80, 'Generating awards...');
        // Process Award Results
        const awardQueries = {
            most_messages_sent: `SELECT sourceServiceId, COUNT(*) as count FROM messages ${buildWhereClause('messages', 'conversationId', 'sourceServiceId IS NOT NULL')} GROUP BY sourceServiceId ORDER BY count DESC LIMIT 1`,
            most_reactions_given: `SELECT fromId, COUNT(*) as count FROM reactions ${buildWhereClause('reactions', 'conversationId', 'fromId IS NOT NULL')} GROUP BY fromId ORDER BY count DESC LIMIT 1`,
            most_reactions_received: `SELECT targetAuthorAci, COUNT(*) as count FROM reactions ${buildWhereClause('reactions', 'conversationId', 'targetAuthorAci IS NOT NULL')} GROUP BY targetAuthorAci ORDER BY count DESC LIMIT 1`,
            most_mentioned: `SELECT mn.mentionAci, COUNT(*) as count FROM mentions mn JOIN messages m ON mn.messageId = m.id ${buildWhereClause('m', 'conversationId', 'mn.mentionAci IS NOT NULL')} GROUP BY mn.mentionAci ORDER BY count DESC LIMIT 1`,
            most_mentions_made: `SELECT m.sourceServiceId, COUNT(mn.mentionAci) as count FROM mentions mn JOIN messages m ON mn.messageId = m.id ${buildWhereClause('m', 'conversationId', 'm.sourceServiceId IS NOT NULL')} GROUP BY m.sourceServiceId ORDER BY count DESC LIMIT 1`,
            most_media_sent: `SELECT sourceServiceId, COUNT(*) as count FROM messages ${buildWhereClause('messages', 'conversationId', 'hasAttachments = 1 AND sourceServiceId IS NOT NULL')} GROUP BY sourceServiceId ORDER BY count DESC LIMIT 1`
        };

        interface AwardResult {
            award: string;
            result: [string, number] | undefined;
        }

        const awardResults = await Promise.all<AwardResult>(
            Object.entries(awardQueries).map(async ([award, query]): Promise<AwardResult> => {
                const results = db.exec(query);
                return {
                    award,
                    result: results[0]?.values[0] as [string, number] | undefined
                };
            })
        );

        awardResults.forEach(({ award, result }: AwardResult) => {
            if (result) {
                const [winner, count] = result;
                (analytics.awards as any)[award] = { winner, count };
            }
        });

        if (onProgress) onProgress(90, 'Finalizing analysis...');
        debug.log('Analytics data generated successfully');
        if (onProgress) onProgress(100, 'Analysis complete!');

        // Calculate emotion-based user rankings
        if (onProgress) onProgress(95, 'Calculating emotion rankings...');
        const emotionRankings = calculateEmotionRankings(db, analytics.userNamesById, buildWhereClause);
        analytics.funniestUsers = emotionRankings.funniestUsers;
        analytics.mostShockingUsers = emotionRankings.mostShockingUsers;
        analytics.mostLovedUsers = emotionRankings.mostLovedUsers;

        // Calculate Top Users by Message and Reaction Count
        if (onProgress) onProgress(97, 'Calculating top users...');

        const topUsersByMessageQuery = `
            SELECT sourceServiceId, COUNT(*) as count
            FROM messages
            ${buildWhereClause('messages', 'conversationId', 'sourceServiceId IS NOT NULL')}
            GROUP BY sourceServiceId
            ORDER BY count DESC
            LIMIT 10
        `;
        const topUsersByMessageResults = db.exec(topUsersByMessageQuery);
        if (topUsersByMessageResults[0]) {
            analytics.topUsersByMessageCount = topUsersByMessageResults[0].values.map(([id, count]: [string, number]) => ({
                name: analytics.userNamesById[id] || id,
                count,
            }));
        }

        const topUsersByReactionQuery = `
            SELECT fromId, COUNT(*) as count
            FROM reactions
            ${buildWhereClause('reactions', 'conversationId', 'fromId IS NOT NULL')}
            GROUP BY fromId
            ORDER BY count DESC
            LIMIT 10
        `;
        const topUsersByReactionResults = db.exec(topUsersByReactionQuery);
        if (topUsersByReactionResults[0]) {
            analytics.topUsersByReactionCount = topUsersByReactionResults[0].values.map(([id, count]: [string, number]) => ({
                name: analytics.userNamesById[id] || id,
                count,
            }));
        }

        return analytics;
    } catch (error) {
        console.error('Error processing database:', error);
        throw new Error('Failed to process database');
    }
}

function calculateEmotionRankings(db: any, userNamesById: Record<string, string>, buildWhereClause: (tableAlias?: string, idColumn?: string) => string) {
    const laughEmojis = ['😂', '🤣'];
    const shockEmojis = ['😮', '🤯', '😱'];
    const loveEmojis = ['❤️', '😍', '🥰'];

    // Get total message counts for all users to calculate rates
    const messagesWhereClause = buildWhereClause('m', 'conversationId');
    const messageCountsQuery = `
        SELECT
            m.sourceServiceId as authorId,
            COUNT(m.id) as messageCount
        FROM messages m
        WHERE m.sourceServiceId IS NOT NULL
        GROUP BY authorId;
    `;
    const messageCountsResults = db.exec(messageCountsQuery);
    const messageCountsByAuthor: Record<string, number> = {};
    if (messageCountsResults[0] && messageCountsResults[0].values) {
        messageCountsResults[0].values.forEach(([authorId, count]: [string, number]) => {
            if (authorId) {
                messageCountsByAuthor[authorId] = count;
            }
        });
    }

    const getRanking = (emojis: string[]): EmotionUserData[] => {
        const emojiList = emojis.map(e => `'${e}'`).join(',');
        const reactionsWhereClause = buildWhereClause('r', 'conversationId');

        const query = `
            SELECT
                r.targetAuthorAci as recipientId,
                COUNT(r.emoji) as reactionCount
            FROM reactions r
            ${reactionsWhereClause}
            ${reactionsWhereClause ? 'AND' : 'WHERE'} r.emoji IN (${emojiList})
            GROUP BY recipientId
            ORDER BY reactionCount DESC;
        `;

        const results = db.exec(query);
        if (!results[0] || !results[0].values) {
            return [];
        }

        return results[0].values.map(([recipientId, totalReacts]: [string, number]) => {
            const messageCount = messageCountsByAuthor[recipientId] || 1; // Default to 1 to avoid division by zero
            const rate = totalReacts / messageCount;
            return {
                name: userNamesById[recipientId] || recipientId,
                totalReacts,
                rate: rate,
                score: rate * Math.log10(messageCount + 1) // Use a logarithmic scale to balance the score
            };
        }).sort((a: { score: number }, b: { score: number }) => b.score - a.score);
    };

    return {
        funniestUsers: getRanking(laughEmojis),
        mostShockingUsers: getRanking(shockEmojis),
        mostLovedUsers: getRanking(loveEmojis),
    };
}

export interface User {
    id: string;
    name: string;
    fromId?: string;
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
    uniqueReactions: string[];
}

export async function getUsers(dbBuffer: ArrayBuffer): Promise<User[]> {
    try {
        debug('Creating database from buffer...');
        const db = await createDatabaseFromBuffer(dbBuffer);
        const nameMap = new Map<string, string>();
        
        // Query to get user name mappings from conversations
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
        // Build users from the conversations table, mapping id/serviceId to User.id/fromId
const usersWithPotentialDuplicates: User[] = [];
if (nameMappingResults[0]) {
    nameMappingResults[0].values.forEach(([id, serviceId, profileFullName, profileName]: [string, string, string, string]) => {
        const name = (profileFullName || profileName || '').trim() || serviceId || id;
        usersWithPotentialDuplicates.push({
            id: serviceId,      // User.id is sourceServiceId
            fromId: id,         // User.fromId is the conversation id
            name
        });
    });
}
// Add any users from uniqueUserIds not already included by serviceId
uniqueUserIds.forEach(uid => {
    if (!usersWithPotentialDuplicates.some(u => u.id === uid)) {
        usersWithPotentialDuplicates.push({
            id: uid,
            fromId: undefined,
            name: nameMap.get(uid) || uid
        });
    }
});

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
            // Collect all unique emoji reactions sent by the user
            uniqueReactions: (() => {
                const uniqueEmojiQuery = `SELECT DISTINCT emoji FROM reactions WHERE fromId = '${userUUID}'`;
                const uniqueEmojiResult = db.exec(uniqueEmojiQuery);
                return uniqueEmojiResult[0]?.values.map((row: any[]) => row[0]) || [];
            })()
        };
    } catch (error) {
        console.error(`Error getting stats for user ${userId}:`, error);
        throw new Error('Failed to get individual stats.');
    }
}

export async function loadUsers(
    dbBuffer: ArrayBuffer,
    key?: string,
    onProgress?: ProgressCallback
): Promise<User[]> {
    const sqliteHeader = new Uint8Array([
        0x53, 0x51, 0x4c, 0x69, 0x74, 0x65, 0x20, 0x66, 0x6f, 0x72, 0x6d, 0x61, 0x74,
        0x20, 0x33, 0x00, // "SQLite format 3\0"
    ]);
    const fileHeader = new Uint8Array(dbBuffer.slice(0, 16));
    const isDecrypted = fileHeader.length === sqliteHeader.length && 
                       fileHeader.every((byte, i) => byte === sqliteHeader[i]);

    try {
        // First, check if we need to decrypt
        if (!isDecrypted) {
            if (!key) {
                throw new Error('This database is encrypted. Please provide a key.');
            }
            if (onProgress) onProgress(0, 'Decrypting user data...');
            // Decrypt the database
            const decryptedBuffer = await decryptDatabase(dbBuffer, key, onProgress);
            
            // After decryption, load the users
            if (onProgress) onProgress(90, 'Loading user data...');
            const users = await getUsers(decryptedBuffer);
            
            if (onProgress) onProgress(100, 'User data loaded successfully');
            return users;
        } else {
            // If already decrypted, just load the users
            if (onProgress) onProgress(50, 'Loading user data...');
            const users = await getUsers(dbBuffer);
            
            if (onProgress) onProgress(100, 'User data loaded successfully');
            return users;
        }
    } catch (error) {
        console.error('Error loading users:', error);
        if (onProgress) onProgress(100, 'Error loading users');
        throw new Error('Failed to load users. The database might be corrupted or the key is incorrect.');
    }
}

export async function loadIndividualStats(
    dbBuffer: ArrayBuffer,
    key: string | undefined,
    userId: string,
    onProgress?: ProgressCallback
): Promise<IndividualStatsData> {
    const sqliteHeader = new Uint8Array([
        0x53, 0x51, 0x4c, 0x69, 0x74, 0x65, 0x20, 0x66, 0x6f, 0x72, 0x6d, 0x61, 0x74,
        0x20, 0x33, 0x00, // "SQLite format 3\0"
    ]);
    const fileHeader = new Uint8Array(dbBuffer.slice(0, 16));
    const isDecrypted = fileHeader.length === sqliteHeader.length && 
                       fileHeader.every((byte, i) => byte === sqliteHeader[i]);

    try {
        let decryptedBuffer = dbBuffer;
        
        if (!isDecrypted) {
            if (!key) {
                throw new Error('This database is encrypted. Please provide a key.');
            }
            if (onProgress) onProgress(0, 'Decrypting user stats...');
            decryptedBuffer = await decryptDatabase(dbBuffer, key, onProgress);
        }
        
        if (onProgress) onProgress(100, 'Loading user stats...');
        return getIndividualStats(decryptedBuffer, userId);
    } catch (error) {
        console.error('Error loading user stats:', error);
        if (onProgress) onProgress(100, 'Error loading user stats');
        throw new Error('Failed to load user stats. The database might be corrupted or the key is incorrect.');
    }
}
