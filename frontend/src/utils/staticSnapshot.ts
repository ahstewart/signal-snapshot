import { AnalyticsData, User } from './database';

// ---------------------------------------------------------------------------
// INSTRUCTIONS:
// 1. Run your app locally and upload a database to generate the dashboard.
// 2. Open the Browser Console (F12) and copy the data.
//    (You might need to console.log(analyticsData) and console.log(users) in App.tsx to grab them easily).
// 3. Paste the objects below.
// ---------------------------------------------------------------------------

export interface Snapshot {
    analytics: AnalyticsData;
    users: User[];
}

export const STATIC_SNAPSHOT: Snapshot | null = null;

/* Example format:
export const STATIC_SNAPSHOT: Snapshot = {
    analytics: {
        all_conversations: [...],
        message_counts: { ... },
        kpis: { ... },
        // ... rest of analytics data
    },
    users: [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' }
    ]
};
*/