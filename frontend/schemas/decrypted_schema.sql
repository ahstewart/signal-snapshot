CREATE TABLE sqlite_stat1(tbl,idx,stat);
CREATE TABLE sqlite_stat4(tbl,idx,neq,nlt,ndlt,sample);
CREATE TABLE conversations(
        id STRING PRIMARY KEY ASC,
        json TEXT,

        active_at INTEGER,
        type STRING,
        members TEXT,
        name TEXT,
        profileName TEXT
      , profileFamilyName TEXT, profileFullName TEXT, e164 TEXT, serviceId TEXT, groupId TEXT, profileLastFetchedAt INTEGER, expireTimerVersion INTEGER NOT NULL DEFAULT 1);
CREATE TABLE identityKeys(
        id STRING PRIMARY KEY ASC,
        json TEXT
      );
CREATE TABLE items(
        id STRING PRIMARY KEY ASC,
        json TEXT
      );
CREATE TABLE emojis(
        shortName TEXT PRIMARY KEY,
        lastUsage INTEGER
      );
CREATE TABLE messages(
        rowid INTEGER PRIMARY KEY ASC,
        id STRING UNIQUE,
        json TEXT,
        readStatus INTEGER,
        expires_at INTEGER,
        sent_at INTEGER,
        schemaVersion INTEGER,
        conversationId STRING,
        received_at INTEGER,
        source STRING,
        hasAttachments INTEGER,
        hasFileAttachments INTEGER,
        hasVisualMediaAttachments INTEGER,
        expireTimer INTEGER,
        expirationStartTimestamp INTEGER,
        type STRING,
        body TEXT,
        messageTimer INTEGER,
        messageTimerStart INTEGER,
        messageTimerExpiresAt INTEGER,
        isErased INTEGER,
        isViewOnce INTEGER,
        sourceServiceId TEXT, serverGuid STRING NULL, sourceDevice INTEGER, storyId STRING, isStory INTEGER
        GENERATED ALWAYS AS (type IS 'story'), isChangeCreatedByUs INTEGER NOT NULL DEFAULT 0, isTimerChangeFromSync INTEGER
        GENERATED ALWAYS AS (
          json_extract(json, '$.expirationTimerUpdate.fromSync') IS 1
        ), seenStatus NUMBER default 0, storyDistributionListId STRING, expiresAt INT
        GENERATED ALWAYS
        AS (ifnull(
          expirationStartTimestamp + (expireTimer * 1000),
          9007199254740991
        )), isUserInitiatedMessage INTEGER
        GENERATED ALWAYS AS (
          type IS NULL
          OR
          type NOT IN (
            'change-number-notification',
            'contact-removed-notification',
            'conversation-merge',
            'group-v1-migration',
            'group-v2-change',
            'keychange',
            'message-history-unsynced',
            'profile-change',
            'story',
            'universal-timer-notification',
            'verified-change'
          )
        ), mentionsMe INTEGER NOT NULL DEFAULT 0, isGroupLeaveEvent INTEGER
        GENERATED ALWAYS AS (
          type IS 'group-v2-change' AND
          json_array_length(json_extract(json, '$.groupV2Change.details')) IS 1 AND
          json_extract(json, '$.groupV2Change.details[0].type') IS 'member-remove' AND
          json_extract(json, '$.groupV2Change.from') IS NOT NULL AND
          json_extract(json, '$.groupV2Change.from') IS json_extract(json, '$.groupV2Change.details[0].aci')
        ), isGroupLeaveEventFromOther INTEGER
        GENERATED ALWAYS AS (
          isGroupLeaveEvent IS 1
          AND
          isChangeCreatedByUs IS 0
        ), callId TEXT
        GENERATED ALWAYS AS (
          json_extract(json, '$.callId')
        ), shouldAffectPreview INTEGER
        GENERATED ALWAYS AS (
      type IS NULL
      OR
      type NOT IN (
        'change-number-notification',
        'contact-removed-notification',
        'conversation-merge',
        'group-v1-migration',
        'keychange',
        'message-history-unsynced',
        'profile-change',
        'story',
        'universal-timer-notification',
        'verified-change'
      )
      AND NOT (
        type IS 'message-request-response-event'
        AND json_extract(json, '$.messageRequestResponseEvent') IN ('ACCEPT', 'BLOCK', 'UNBLOCK')
      )
    ), shouldAffectActivity INTEGER
        GENERATED ALWAYS AS (
      type IS NULL
      OR
      type NOT IN (
        'change-number-notification',
        'contact-removed-notification',
        'conversation-merge',
        'group-v1-migration',
        'keychange',
        'message-history-unsynced',
        'profile-change',
        'story',
        'universal-timer-notification',
        'verified-change'
      )
      AND NOT (
        type IS 'message-request-response-event'
        AND json_extract(json, '$.messageRequestResponseEvent') IN ('ACCEPT', 'BLOCK', 'UNBLOCK')
      )
    ), isAddressableMessage INTEGER
        GENERATED ALWAYS AS (
          type IS NULL
          OR
          type IN (
            'incoming',
            'outgoing'
          )
        ));
CREATE TABLE jobs(
        id TEXT PRIMARY KEY,
        queueType TEXT STRING NOT NULL,
        timestamp INTEGER NOT NULL,
        data STRING TEXT
      );
CREATE TABLE reactions(
        conversationId STRING,
        emoji STRING,
        fromId STRING,
        messageReceivedAt INTEGER,
        targetAuthorAci STRING,
        targetTimestamp INTEGER,
        unread INTEGER
      , messageId STRING, timestamp NUMBER);
CREATE TABLE senderKeys(
        id TEXT PRIMARY KEY NOT NULL,
        senderId TEXT NOT NULL,
        distributionId TEXT NOT NULL,
        data BLOB NOT NULL,
        lastUpdatedDate NUMBER NOT NULL
      );
CREATE TABLE unprocessed(
        id STRING PRIMARY KEY ASC,
        timestamp INTEGER,
        version INTEGER,
        attempts INTEGER,
        envelope TEXT,
        decrypted TEXT,
        source TEXT,
        serverTimestamp INTEGER,
        sourceServiceId STRING
      , serverGuid STRING NULL, sourceDevice INTEGER, receivedAtCounter INTEGER, urgent INTEGER, story INTEGER);
CREATE TABLE sendLogPayloads(
        id INTEGER PRIMARY KEY ASC,

        timestamp INTEGER NOT NULL,
        contentHint INTEGER NOT NULL,
        proto BLOB NOT NULL
      , urgent INTEGER, hasPniSignatureMessage INTEGER DEFAULT 0 NOT NULL);
CREATE TABLE sendLogRecipients(
        payloadId INTEGER NOT NULL,

        recipientServiceId STRING NOT NULL,
        deviceId INTEGER NOT NULL,

        PRIMARY KEY (payloadId, recipientServiceId, deviceId),

        CONSTRAINT sendLogRecipientsForeignKey
          FOREIGN KEY (payloadId)
          REFERENCES sendLogPayloads(id)
          ON DELETE CASCADE
      );
CREATE TABLE sendLogMessageIds(
        payloadId INTEGER NOT NULL,

        messageId STRING NOT NULL,

        PRIMARY KEY (payloadId, messageId),

        CONSTRAINT sendLogMessageIdsForeignKey
          FOREIGN KEY (payloadId)
          REFERENCES sendLogPayloads(id)
          ON DELETE CASCADE
      );
CREATE TABLE preKeys(
        id STRING PRIMARY KEY ASC,
        json TEXT
      , ourServiceId NUMBER
        GENERATED ALWAYS AS (json_extract(json, '$.ourServiceId')));
CREATE TABLE signedPreKeys(
        id STRING PRIMARY KEY ASC,
        json TEXT
      , ourServiceId NUMBER
        GENERATED ALWAYS AS (json_extract(json, '$.ourServiceId')));
CREATE TABLE uninstalled_sticker_packs (
        id STRING NOT NULL PRIMARY KEY,
        uninstalledAt NUMBER NOT NULL,
        storageID STRING,
        storageVersion NUMBER,
        storageUnknownFields BLOB,
        storageNeedsSync INTEGER NOT NULL
      );
CREATE TABLE IF NOT EXISTS 'messages_fts_data'(id INTEGER PRIMARY KEY, block BLOB);
CREATE TABLE IF NOT EXISTS 'messages_fts_idx'(segid, term, pgno, PRIMARY KEY(segid, term)) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS 'messages_fts_content'(id INTEGER PRIMARY KEY, c0);
CREATE TABLE IF NOT EXISTS 'messages_fts_docsize'(id INTEGER PRIMARY KEY, sz BLOB);
CREATE TABLE IF NOT EXISTS 'messages_fts_config'(k PRIMARY KEY, v) WITHOUT ROWID;
CREATE TABLE edited_messages(
        messageId STRING REFERENCES messages(id)
          ON DELETE CASCADE,
        sentAt INTEGER,
        readStatus INTEGER
      , conversationId STRING);
CREATE TABLE mentions (
        messageId REFERENCES messages(id) ON DELETE CASCADE,
        mentionAci STRING,
        start INTEGER,
        length INTEGER
      );
CREATE TABLE kyberPreKeys(
        id STRING PRIMARY KEY NOT NULL,
        json TEXT NOT NULL, ourServiceId NUMBER
        GENERATED ALWAYS AS (json_extract(json, '$.ourServiceId')));
CREATE TABLE syncTasks(
        id TEXT PRIMARY KEY NOT NULL,
        attempts INTEGER NOT NULL,
        createdAt INTEGER NOT NULL,
        data TEXT NOT NULL,
        envelopeId TEXT NOT NULL,
        sentAt INTEGER NOT NULL,
        type TEXT NOT NULL
      ) STRICT;
CREATE TABLE sessions (
        id TEXT NOT NULL PRIMARY KEY,
        ourServiceId TEXT NOT NULL,
        serviceId TEXT NOT NULL,
        conversationId TEXT NOT NULL,
        deviceId INTEGER NOT NULL,
        record BLOB NOT NULL
      ) STRICT;
CREATE INDEX conversations_active ON conversations (
        active_at
      ) WHERE active_at IS NOT NULL;
CREATE INDEX conversations_type ON conversations (
        type
      ) WHERE type IS NOT NULL;
CREATE INDEX emojis_lastUsage
        ON emojis (
          lastUsage
      );
CREATE INDEX conversations_e164 ON conversations(e164);
CREATE INDEX conversations_groupId ON conversations(groupId);
CREATE INDEX messages_id ON messages (id ASC);
CREATE INDEX messages_receipt ON messages (sent_at);
CREATE INDEX messages_schemaVersion ON messages (schemaVersion);
CREATE INDEX messages_view_once ON messages
        (isErased) WHERE isViewOnce = 1;
CREATE INDEX messages_searchOrder on messages(received_at, sent_at);
CREATE INDEX jobs_timestamp ON jobs (timestamp);
CREATE INDEX unprocessed_timestamp ON unprocessed (
        timestamp
      );
CREATE INDEX messages_unexpectedly_missing_expiration_start_timestamp ON messages (
        expireTimer, expirationStartTimestamp, type
      )
      WHERE expireTimer IS NOT NULL AND expirationStartTimestamp IS NULL;
CREATE INDEX sendLogPayloadsByTimestamp ON sendLogPayloads (timestamp);
CREATE INDEX sendLogMessageIdsByMessage
        ON sendLogMessageIds (messageId);
CREATE INDEX messages_hasAttachments
        ON messages (conversationId, hasAttachments, received_at)
        WHERE type IS NOT 'story' AND storyId IS NULL;
CREATE INDEX messages_hasFileAttachments
        ON messages (conversationId, hasFileAttachments, received_at)
        WHERE type IS NOT 'story' AND storyId IS NULL;
CREATE INDEX messages_conversation ON messages
        (conversationId, isStory, storyId, received_at, sent_at);
CREATE INDEX messages_unread ON messages
        (conversationId, readStatus, isStory, storyId, received_at, sent_at) WHERE readStatus IS NOT NULL;
CREATE INDEX messages_conversation_no_story_id ON messages
        (conversationId, isStory, received_at, sent_at);
CREATE INDEX messages_unread_no_story_id ON messages
        (conversationId, readStatus, isStory, received_at, sent_at)
        WHERE readStatus IS NOT NULL;
CREATE INDEX messages_unseen_no_story ON messages
        (conversationId, seenStatus, isStory, received_at, sent_at)
        WHERE
          seenStatus IS NOT NULL;
CREATE INDEX messages_unseen_with_story ON messages
        (conversationId, seenStatus, isStory, storyId, received_at, sent_at)
        WHERE
          seenStatus IS NOT NULL;
CREATE INDEX unprocessed_byReceivedAtCounter ON unprocessed
          (receivedAtCounter)
      ;
CREATE INDEX expiring_message_by_conversation_and_received_at
        ON messages
        (
          conversationId,
          storyId,
          expirationStartTimestamp,
          expireTimer,
          received_at
        )
        WHERE isStory IS 0 AND type IS 'incoming';
CREATE INDEX messages_by_distribution_list
        ON messages(storyDistributionListId, received_at)
        WHERE storyDistributionListId IS NOT NULL;
CREATE INDEX messages_by_storyId ON messages (storyId);
CREATE INDEX reactions_unread ON reactions (
        conversationId,
        unread
      );
CREATE INDEX messages_expires_at ON messages (
        expiresAt
      );
CREATE INDEX messages_hasVisualMediaAttachments
        ON messages (
          conversationId, isStory, storyId,
          hasVisualMediaAttachments, received_at, sent_at
        )
        WHERE hasVisualMediaAttachments IS 1;
CREATE INDEX edited_messages_sent_at ON edited_messages (sentAt);
CREATE INDEX edited_messages_unread ON edited_messages (readStatus, conversationId);
CREATE INDEX messages_unread_mentions ON messages
        (conversationId, readStatus, mentionsMe, isStory, storyId, received_at, sent_at)
        WHERE readStatus IS NOT NULL;
CREATE INDEX messages_unread_mentions_no_story_id ON messages
        (conversationId, readStatus, mentionsMe, isStory, received_at, sent_at)
        WHERE isStory IS 0 AND readStatus IS NOT NULL;
CREATE INDEX messages_story_replies
        ON messages (storyId, received_at, sent_at)
        WHERE isStory IS 0;
CREATE INDEX conversations_serviceId ON conversations(serviceId);
CREATE INDEX messages_sourceServiceId on messages(sourceServiceId);
CREATE INDEX reaction_identifier ON reactions (
        emoji,
        targetAuthorAci,
        targetTimestamp
      );
CREATE INDEX sendLogRecipientsByRecipient
        ON sendLogRecipients (recipientServiceId, deviceId);
CREATE INDEX mentions_aci ON mentions (mentionAci);
CREATE INDEX preKeys_ourServiceId ON preKeys (ourServiceId);
CREATE INDEX kyberPreKeys_ourServiceId ON kyberPreKeys (ourServiceId);
CREATE INDEX signedPreKeys_ourServiceId ON signedPreKeys (ourServiceId);
CREATE INDEX reactions_byTimestamp
      ON reactions
      (fromId, timestamp);
CREATE INDEX messages_preview ON messages
        (conversationId, shouldAffectPreview, isGroupLeaveEventFromOther,
         received_at, sent_at);
CREATE INDEX messages_preview_without_story ON messages
        (conversationId, shouldAffectPreview, isGroupLeaveEventFromOther,
         received_at, sent_at) WHERE storyId IS NULL;
CREATE INDEX messages_activity ON messages
        (conversationId, shouldAffectActivity, isTimerChangeFromSync,
         isGroupLeaveEventFromOther, received_at, sent_at);
CREATE INDEX message_user_initiated ON messages (conversationId, isUserInitiatedMessage);
CREATE INDEX messages_by_date_addressable
        ON messages (
          conversationId, isAddressableMessage, received_at, sent_at
      );
CREATE INDEX messages_by_date_addressable_nondisappearing
        ON messages (
          conversationId, isAddressableMessage, received_at, sent_at
      ) WHERE expireTimer IS NULL;
CREATE INDEX reactions_messageId
        ON reactions (messageId);
CREATE INDEX messages_callHistory_seenStatus
        ON messages (type, seenStatus)
        WHERE type IS 'call-history';
CREATE INDEX messages_call ON messages
        (type, conversationId, callId, sent_at)
        WHERE type IS 'call-history';
CREATE INDEX messages_callHistory_markReadByConversationBefore
        ON messages (type, conversationId, seenStatus, sent_at DESC)
        WHERE type IS 'call-history';
CREATE INDEX edited_messages_messageId
        ON edited_messages(messageId);
CREATE INDEX mentions_messageId
        ON mentions(messageId);
CREATE INDEX messages_isStory
        ON messages(received_at, sent_at)
        WHERE isStory = 1;
CREATE INDEX messages_callHistory_markReadBefore
        ON messages (type, seenStatus, received_at DESC)
        WHERE type IS 'call-history';
CREATE INDEX syncTasks_delete ON syncTasks (attempts DESC);
CREATE TRIGGER messages_on_view_once_update AFTER UPDATE ON messages
      WHEN
        new.body IS NOT NULL AND new.isViewOnce = 1
      BEGIN
        DELETE FROM messages_fts WHERE rowid = old.rowid;
      END;
CREATE TRIGGER messages_on_insert AFTER INSERT ON messages
      WHEN new.isViewOnce IS NOT 1 AND new.storyId IS NULL
      BEGIN
        INSERT INTO messages_fts
          (rowid, body)
        VALUES
          (new.rowid, new.body);
      END;
CREATE VIRTUAL TABLE messages_fts USING fts5(
        body,
        tokenize = 'signal_tokenizer'
      );
CREATE TRIGGER messages_on_update AFTER UPDATE ON messages
      WHEN
        (new.body IS NULL OR old.body IS NOT new.body) AND
         new.isViewOnce IS NOT 1 AND new.storyId IS NULL
      BEGIN
        DELETE FROM messages_fts WHERE rowid = old.rowid;
        INSERT INTO messages_fts
          (rowid, body)
        VALUES
          (new.rowid, new.body);
      END;
CREATE TRIGGER messages_on_insert_insert_mentions AFTER INSERT ON messages
      BEGIN
        INSERT INTO mentions (messageId, mentionAci, start, length)
        
    SELECT messages.id, bodyRanges.value ->> 'mentionAci' as mentionAci,
      bodyRanges.value ->> 'start' as start,
      bodyRanges.value ->> 'length' as length
    FROM messages, json_each(messages.json ->> 'bodyRanges') as bodyRanges
    WHERE bodyRanges.value ->> 'mentionAci' IS NOT NULL
  
        AND messages.id = new.id;
      END;
CREATE TRIGGER messages_on_update_update_mentions AFTER UPDATE ON messages
      BEGIN
        DELETE FROM mentions WHERE messageId = new.id;
        INSERT INTO mentions (messageId, mentionAci, start, length)
        
    SELECT messages.id, bodyRanges.value ->> 'mentionAci' as mentionAci,
      bodyRanges.value ->> 'start' as start,
      bodyRanges.value ->> 'length' as length
    FROM messages, json_each(messages.json ->> 'bodyRanges') as bodyRanges
    WHERE bodyRanges.value ->> 'mentionAci' IS NOT NULL
  
        AND messages.id = new.id;
      END;
CREATE TRIGGER messages_on_delete AFTER DELETE ON messages BEGIN
        DELETE FROM messages_fts WHERE rowid = old.rowid;
        DELETE FROM sendLogPayloads WHERE id IN (
          SELECT payloadId FROM sendLogMessageIds
          WHERE messageId = old.id
        );
        DELETE FROM reactions WHERE rowid IN (
          SELECT rowid FROM reactions
          WHERE messageId = old.id
        );
        DELETE FROM storyReads WHERE storyId = old.storyId;
      END;
CREATE VIEW messages_clean AS select u.rowid, u.id, u.type, u.sent_at, DATETIME(ROUND(u.sent_at/1000), 'unixepoch', 'localtime') as date_sent, u.body, u.hasAttachments, u.hasFileAttachments, u.hasVisualMediaAttachments, u.sourceDevice, c.name, c.profileName, c.profileFamilyName, c.profileFullName from messages u INNER JOIN conversations c on u.sourceServiceId = c.serviceId where u.conversationId = '7666311e-a841-4ee2-b0cb-ac92463eb0d5' and u.body not like '≡ƒñû%' and u.body not like 'Nick AI:%' and u.body not like '≡ƒªä%' and date_sent between '2024-01-01 00:00:00' and '2024-12-31 00:00:00'
/* messages_clean(rowid,id,type,sent_at,date_sent,body,hasAttachments,hasFileAttachments,hasVisualMediaAttachments,sourceDevice,name,profileName,profileFamilyName,profileFullName) */;
CREATE VIEW reactions_clean AS select r.emoji, r.messageReceivedAt, r.targetTimestamp, r.emoji_sender, r.emoji_receiver, m.body from (select r.*, c.profileFullName as emoji_receiver from (select r.emoji, r.messageId, r.messageReceivedAt, r.targetAuthorAci, r.targetTimestamp, c.profileFullName as emoji_sender from reactions r INNER JOIN conversations c on r.fromId = c.id where r.conversationId='7666311e-a841-4ee2-b0cb-ac92463eb0d5') r INNER JOIN 
conversations c on r.targetAuthorAci = c.serviceId) r INNER JOIN messages m on r.messageId = m.id
/* reactions_clean(emoji,messageReceivedAt,targetTimestamp,emoji_sender,emoji_receiver,body) */;
CREATE VIEW mentions_clean AS select m.id, m.profileFullName as mentioner, c.profileFullName as mentioned from mentions men INNER JOIN messages_clean m on men.messageId = m.id INNER JOIN conversations c on c.serviceId = men.mentionAci
/* mentions_clean(id,mentioner,mentioned) */;
CREATE VIEW units AS select * from messages where conversationId = '7666311e-a841-4ee2-b0cb-ac92463eb0d5'
/* units(rowid,id,json,readStatus,expires_at,sent_at,schemaVersion,conversationId,received_at,source,hasAttachments,hasFileAttachments,hasVisualMediaAttachments,expireTimer,expirationStartTimestamp,type,body,messageTimer,messageTimerStart,messageTimerExpiresAt,isErased,isViewOnce,sourceServiceId,serverGuid,sourceDevice,storyId,isStory,isChangeCreatedByUs,isTimerChangeFromSync,seenStatus,storyDistributionListId,expiresAt,isUserInitiatedMessage,mentionsMe,isGroupLeaveEvent,isGroupLeaveEventFromOther,callId,shouldAffectPreview,shouldAffectActivity,isAddressableMessage) */;
CREATE VIEW messages_date_counts AS select count(*) as num_messages, DATE(date_sent) as date, case cast (strftime('%w', `date_sent`) as integer) when 0 then 'Sunday' when 1 then 'Monday' when 2 then 'Tuesday' when 3 then 'Wednesday' when 4 then 'Thursday' when 5 then 'Friday' else 'Saturday' end as weekday from messages_clean group by weekday 

ORDER BY 
  CASE weekday
    WHEN 'Sunday' THEN 0
    WHEN 'Monday' THEN 1
    WHEN 'Tuesday' THEN 2
    WHEN 'Wednesday' THEN 3
    WHEN 'Thursday' THEN 4
    WHEN 'Friday' THEN 5
    WHEN 'Saturday' THEN 6
  END
/* messages_date_counts(num_messages,date,weekday) */;
CREATE VIEW total_counts AS select profileFullName, count(*) as num_messages from messages_clean group by profileFullName order by num_messages desc
/* total_counts(profileFullName,num_messages) */;
