import { AnalyticsData, User, IndividualStatsData } from './database';
import { getUserSummaryByName } from './userSummaries';

// ---------------------------------------------------------------------------
// Static Snapshot Data
// ---------------------------------------------------------------------------

type RawSnapshotData = AnalyticsData & { 
    individual_stats?: Array<{ id: string; name: string; stats: IndividualStatsData }>;
};

type PastedSnapshotData =
    | {
          analytics: RawSnapshotData;
          users?: User[];
          individualStats?: Record<string, IndividualStatsData>;
      }
    | RawSnapshotData;

const SNAPSHOT_DATA: PastedSnapshotData = {
  "analytics": {
    "all_conversations": [
      {
        "id": "7666311e-a841-4ee2-b0cb-ac92463eb0d5",
        "name": "🍆 Absolute Units 🍆",
        "active_at": "1758782408027",
        "messageCount": 38930,
        "memberCount": 24,
        "avgMessagesPerDay": 382
      }
    ],
    "message_counts": {
      "by_day": {
        "2024-12-31": 1,
        "2025-01-01": 15,
        "2025-01-02": 66,
        "2025-01-03": 153,
        "2025-01-04": 75,
        "2025-01-05": 142,
        "2025-01-06": 44,
        "2025-01-07": 40,
        "2025-01-08": 70,
        "2025-01-09": 62,
        "2025-01-10": 59,
        "2025-01-11": 37,
        "2025-01-12": 96,
        "2025-01-13": 124,
        "2025-01-14": 61,
        "2025-01-15": 50,
        "2025-01-16": 32,
        "2025-01-17": 41,
        "2025-01-18": 4,
        "2025-01-19": 41,
        "2025-01-20": 113,
        "2025-01-21": 238,
        "2025-01-22": 56,
        "2025-01-23": 49,
        "2025-01-24": 51,
        "2025-01-25": 54,
        "2025-01-26": 20,
        "2025-01-27": 67,
        "2025-01-28": 80,
        "2025-01-29": 30,
        "2025-01-30": 29,
        "2025-01-31": 40,
        "2025-02-01": 10,
        "2025-02-02": 36,
        "2025-02-03": 32,
        "2025-02-04": 13,
        "2025-02-05": 92,
        "2025-02-06": 70,
        "2025-02-07": 86,
        "2025-02-08": 20,
        "2025-02-09": 47,
        "2025-02-10": 15,
        "2025-02-11": 32,
        "2025-02-12": 70,
        "2025-02-13": 70,
        "2025-02-14": 91,
        "2025-02-15": 10,
        "2025-02-16": 40,
        "2025-02-17": 53,
        "2025-02-18": 35,
        "2025-02-19": 126,
        "2025-02-20": 42,
        "2025-02-21": 147,
        "2025-02-22": 135,
        "2025-02-23": 67,
        "2025-02-24": 49,
        "2025-02-25": 30,
        "2025-02-26": 124,
        "2025-02-27": 78,
        "2025-02-28": 50,
        "2025-03-01": 130,
        "2025-03-02": 40,
        "2025-03-03": 29,
        "2025-03-04": 52,
        "2025-03-05": 72,
        "2025-03-06": 99,
        "2025-03-07": 58,
        "2025-03-08": 24,
        "2025-03-09": 66,
        "2025-03-10": 119,
        "2025-03-11": 47,
        "2025-03-12": 38,
        "2025-03-13": 17,
        "2025-03-14": 46,
        "2025-03-15": 14,
        "2025-03-16": 27,
        "2025-03-17": 159,
        "2025-03-18": 75,
        "2025-03-19": 91,
        "2025-03-20": 154,
        "2025-03-21": 110,
        "2025-03-22": 29,
        "2025-03-23": 33,
        "2025-03-24": 30,
        "2025-03-25": 227,
        "2025-03-26": 107,
        "2025-03-27": 72,
        "2025-03-28": 101,
        "2025-03-29": 108,
        "2025-03-30": 48,
        "2025-03-31": 60,
        "2025-04-01": 73,
        "2025-04-02": 130,
        "2025-04-03": 71,
        "2025-04-04": 107,
        "2025-04-05": 78,
        "2025-04-06": 26,
        "2025-04-07": 88,
        "2025-04-08": 60,
        "2025-04-09": 35,
        "2025-04-10": 92,
        "2025-04-11": 126,
        "2025-04-12": 22,
        "2025-04-13": 100,
        "2025-04-14": 24,
        "2025-04-15": 69,
        "2025-04-16": 141,
        "2025-04-17": 95,
        "2025-04-18": 107,
        "2025-04-19": 34,
        "2025-04-20": 57,
        "2025-04-21": 258,
        "2025-04-22": 211,
        "2025-04-23": 66,
        "2025-04-24": 111,
        "2025-04-25": 77,
        "2025-04-26": 92,
        "2025-04-27": 11,
        "2025-04-28": 12,
        "2025-04-29": 306,
        "2025-04-30": 86,
        "2025-05-01": 87,
        "2025-05-02": 239,
        "2025-05-03": 18,
        "2025-05-04": 109,
        "2025-05-05": 225,
        "2025-05-06": 63,
        "2025-05-07": 170,
        "2025-05-08": 116,
        "2025-05-09": 116,
        "2025-05-10": 90,
        "2025-05-11": 79,
        "2025-05-12": 130,
        "2025-05-13": 47,
        "2025-05-14": 58,
        "2025-05-15": 54,
        "2025-05-16": 22,
        "2025-05-17": 7,
        "2025-05-18": 45,
        "2025-05-19": 122,
        "2025-05-20": 88,
        "2025-05-21": 120,
        "2025-05-22": 150,
        "2025-05-23": 38,
        "2025-05-24": 14,
        "2025-05-25": 36,
        "2025-05-26": 29,
        "2025-05-27": 46,
        "2025-05-28": 44,
        "2025-05-29": 126,
        "2025-05-30": 31,
        "2025-05-31": 48,
        "2025-06-01": 10,
        "2025-06-02": 2,
        "2025-06-03": 49,
        "2025-06-04": 38,
        "2025-06-05": 174,
        "2025-06-06": 71,
        "2025-06-07": 308,
        "2025-06-08": 53,
        "2025-06-09": 393,
        "2025-06-10": 407,
        "2025-06-11": 283,
        "2025-06-12": 211,
        "2025-06-13": 319,
        "2025-06-14": 376,
        "2025-06-15": 173,
        "2025-06-16": 120,
        "2025-06-17": 62,
        "2025-06-18": 284,
        "2025-06-19": 106,
        "2025-07-21": 31,
        "2025-07-22": 129,
        "2025-07-23": 100,
        "2025-07-24": 131,
        "2025-07-25": 158,
        "2025-07-26": 89,
        "2025-07-27": 45,
        "2025-07-28": 54,
        "2025-07-29": 81,
        "2025-07-30": 201,
        "2025-07-31": 17,
        "2025-08-01": 61,
        "2025-08-02": 113,
        "2025-08-03": 66,
        "2025-08-04": 172,
        "2025-08-05": 264,
        "2025-08-06": 135,
        "2025-08-07": 244,
        "2025-08-08": 91,
        "2025-08-09": 70,
        "2025-08-10": 88,
        "2025-08-11": 78,
        "2025-08-12": 203,
        "2025-08-13": 115,
        "2025-08-14": 29,
        "2025-08-15": 89,
        "2025-08-16": 115,
        "2025-08-17": 60,
        "2025-08-18": 20,
        "2025-08-19": 106,
        "2025-08-20": 48,
        "2025-08-21": 61,
        "2025-08-22": 130,
        "2025-08-23": 48,
        "2025-08-24": 20,
        "2025-09-25": 32,
        "2025-12-23": 1
      },
      "by_hour": {
        "10": 5,
        "11": 16,
        "12": 23,
        "13": 164,
        "14": 497,
        "15": 926,
        "16": 1322,
        "17": 1592,
        "18": 1621,
        "19": 1442,
        "20": 1154,
        "21": 1193,
        "22": 1026,
        "23": 1039,
        "00": 1160,
        "01": 984,
        "02": 1192,
        "03": 1230,
        "04": 802,
        "05": 470,
        "06": 243,
        "07": 78,
        "08": 70,
        "09": 9
      }
    },
    "top_conversations": [
      {
        "name": "🍆 Absolute Units 🍆",
        "count": 18258
      }
    ],
    "kpis": {
      "total_messages": 18258,
      "total_conversations": 1,
      "avg_messages_per_day": 88,
      "total_members": 24
    },
    "reactions": {
      "total_reactions": 58223,
      "top_emojis": [
        {
          "emoji": "😂",
          "count": 41069
        },
        {
          "emoji": "❤️",
          "count": 6114
        },
        {
          "emoji": "💯",
          "count": 2394
        },
        {
          "emoji": "👍",
          "count": 2301
        },
        {
          "emoji": "😮",
          "count": 2174
        },
        {
          "emoji": "👎",
          "count": 911
        },
        {
          "emoji": "😢",
          "count": 748
        },
        {
          "emoji": "📂",
          "count": 214
        },
        {
          "emoji": "🔥",
          "count": 158
        },
        {
          "emoji": "‼️",
          "count": 124
        }
      ],
      "top_emojis_by_author": {
        "James Davis": [
          {
            "emoji": "😂",
            "count": 5499
          },
          {
            "emoji": "💯",
            "count": 725
          },
          {
            "emoji": "❤️",
            "count": 707
          }
        ],
        "Nick": [
          {
            "emoji": "😂",
            "count": 4529
          },
          {
            "emoji": "❤️",
            "count": 740
          },
          {
            "emoji": "👍",
            "count": 549
          }
        ],
        "Andrew": [
          {
            "emoji": "😂",
            "count": 6640
          },
          {
            "emoji": "❤️",
            "count": 818
          },
          {
            "emoji": "👍",
            "count": 514
          }
        ],
        "Austin Fisher": [
          {
            "emoji": "😂",
            "count": 2425
          },
          {
            "emoji": "❤️",
            "count": 235
          },
          {
            "emoji": "😮",
            "count": 183
          }
        ],
        "Chris Moffitt": [
          {
            "emoji": "😂",
            "count": 6159
          },
          {
            "emoji": "❤️",
            "count": 645
          },
          {
            "emoji": "👍",
            "count": 280
          }
        ],
        "Lorrin Stone": [
          {
            "emoji": "😂",
            "count": 2587
          },
          {
            "emoji": "❤️",
            "count": 392
          },
          {
            "emoji": "💯",
            "count": 109
          }
        ],
        "Matt Nelson": [
          {
            "emoji": "😂",
            "count": 846
          },
          {
            "emoji": "👍",
            "count": 172
          },
          {
            "emoji": "👎",
            "count": 88
          }
        ],
        "Denver Rogers": [
          {
            "emoji": "😂",
            "count": 2647
          },
          {
            "emoji": "❤️",
            "count": 855
          },
          {
            "emoji": "😮",
            "count": 175
          }
        ],
        "Hank": [
          {
            "emoji": "😂",
            "count": 760
          },
          {
            "emoji": "❤️",
            "count": 70
          },
          {
            "emoji": "👍",
            "count": 31
          }
        ],
        "Holland Stewart": [
          {
            "emoji": "😂",
            "count": 3738
          },
          {
            "emoji": "❤️",
            "count": 757
          },
          {
            "emoji": "💯",
            "count": 213
          }
        ],
        "Zack": [
          {
            "emoji": "😂",
            "count": 1077
          },
          {
            "emoji": "❤️",
            "count": 407
          },
          {
            "emoji": "👍",
            "count": 154
          }
        ],
        "will hardy": [
          {
            "emoji": "😂",
            "count": 2585
          },
          {
            "emoji": "❤️",
            "count": 290
          },
          {
            "emoji": "😮",
            "count": 128
          }
        ],
        "Allen": [
          {
            "emoji": "😂",
            "count": 41
          },
          {
            "emoji": "❤️",
            "count": 6
          },
          {
            "emoji": "👍",
            "count": 4
          }
        ],
        "Andrew Saghian": [
          {
            "emoji": "😂",
            "count": 1215
          },
          {
            "emoji": "❤️",
            "count": 63
          },
          {
            "emoji": "😮",
            "count": 17
          }
        ],
        "Citizen Toxxie": [
          {
            "emoji": "😂",
            "count": 228
          },
          {
            "emoji": "❤️",
            "count": 57
          },
          {
            "emoji": "😮",
            "count": 21
          }
        ],
        "Dan": [
          {
            "emoji": "😂",
            "count": 56
          },
          {
            "emoji": "❤️",
            "count": 12
          },
          {
            "emoji": "👍",
            "count": 5
          }
        ],
        "Scott Moreland": [
          {
            "emoji": "😂",
            "count": 16
          },
          {
            "emoji": "❤️",
            "count": 7
          },
          {
            "emoji": "😮",
            "count": 4
          }
        ],
        "Vic Telesino": [
          {
            "emoji": "😂",
            "count": 11
          },
          {
            "emoji": "❤️",
            "count": 1
          },
          {
            "emoji": "👍",
            "count": 1
          }
        ],
        "Will K.": [
          {
            "emoji": "❤️",
            "count": 11
          },
          {
            "emoji": "😂",
            "count": 6
          },
          {
            "emoji": "😢",
            "count": 2
          }
        ],
        "Jake Larsen": [
          {
            "emoji": "👍",
            "count": 2
          },
          {
            "emoji": "😂",
            "count": 1
          }
        ],
        "Josh Kursky": [
          {
            "emoji": "😂",
            "count": 3
          },
          {
            "emoji": "💪",
            "count": 1
          }
        ]
      }
    },
    "awards": {
      "most_messages_sent": {
        "winner": "Denver Rogers",
        "count": 2551
      },
      "most_reactions_given": {
        "winner": "Andrew",
        "count": 3367
      },
      "most_reactions_received": {
        "winner": "Holland Stewart",
        "count": 3259
      },
      "most_mentioned": {
        "winner": "James Davis",
        "count": 156
      },
      "most_mentions_made": {
        "winner": "Denver Rogers",
        "count": 564
      },
      "most_media_sent": {
        "winner": "Nick",
        "count": 369
      },
      "most_night_owl": {
        "winner": "Citizen Toxxie",
        "count": 4.5
      },
      "most_early_bird": {
        "winner": "Citizen Toxxie",
        "count": 32
      },
      "longest_avg_message": {
        "winner": "Will K.",
        "count": 179
      },
      "hottest_newbie": {
        "winner": "Citizen Toxxie",
        "count": 0
      },
      "lurker": {
        "winner": "Andrew",
        "count": 3367
      },
      "most_unique_emojis": {
        "winner": "Denver Rogers",
        "count": 4
      }
    },
    "funniestUsers": [
      {
        "name": "Allen",
        "totalReacts": 391,
        "rate": 2.160220994475138,
        "score": 4.8822536613379235
      },
      {
        "name": "Austin Fisher",
        "totalReacts": 4535,
        "rate": 0.9416528239202658,
        "score": 3.4678970288695927
      },
      {
        "name": "Zack",
        "totalReacts": 1403,
        "rate": 0.8549664838513101,
        "score": 2.7490362787051437
      },
      {
        "name": "Citizen Toxxie",
        "totalReacts": 322,
        "rate": 1.00625,
        "score": 2.5221706888574027
      },
      {
        "name": "Holland Stewart",
        "totalReacts": 5394,
        "rate": 0.6210708117443868,
        "score": 2.446286026043912
      },
      {
        "name": "Matt Nelson",
        "totalReacts": 2946,
        "rate": 0.6096854304635762,
        "score": 2.246213302665385
      },
      {
        "name": "Andrew Saghian",
        "totalReacts": 522,
        "rate": 0.786144578313253,
        "score": 2.219145932000332
      },
      {
        "name": "will hardy",
        "totalReacts": 2057,
        "rate": 0.5983129726585223,
        "score": 2.115893247721315
      },
      {
        "name": "Dan",
        "totalReacts": 121,
        "rate": 0.9758064516129032,
        "score": 2.0461783191449583
      },
      {
        "name": "Lorrin Stone",
        "totalReacts": 1305,
        "rate": 0.5878378378378378,
        "score": 1.9672278688764677
      },
      {
        "name": "Nick",
        "totalReacts": 4990,
        "rate": 0.4770554493307839,
        "score": 1.917559300043713
      },
      {
        "name": "Chris Moffitt",
        "totalReacts": 5113,
        "rate": 0.47333827069061285,
        "score": 1.9092309197327362
      },
      {
        "name": "Andrew",
        "totalReacts": 5046,
        "rate": 0.44909220363118546,
        "score": 1.8191155056816757
      },
      {
        "name": "Will K.",
        "totalReacts": 35,
        "rate": 1.206896551724138,
        "score": 1.7827325487995924
      },
      {
        "name": "Josh Kursky",
        "totalReacts": 68,
        "rate": 0.9315068493150684,
        "score": 1.7412021498863888
      },
      {
        "name": "James Davis",
        "totalReacts": 4185,
        "rate": 0.4157147114333962,
        "score": 1.664082380130865
      },
      {
        "name": "Denver Rogers",
        "totalReacts": 2349,
        "rate": 0.3128662759722962,
        "score": 1.2125389402059408
      },
      {
        "name": "Vic Telesino",
        "totalReacts": 18,
        "rate": 0.9,
        "score": 1.1899973652605274
      },
      {
        "name": "Hank",
        "totalReacts": 219,
        "rate": 0.3945945945945946,
        "score": 1.0831916745161634
      },
      {
        "name": "Scott Moreland",
        "totalReacts": 49,
        "rate": 0.28160919540229884,
        "score": 0.6316601401472898
      },
      {
        "name": "Jake Larsen",
        "totalReacts": 8,
        "rate": 0.25806451612903225,
        "score": 0.38842580085674994
      }
    ],
    "mostShockingUsers": [
      {
        "name": "Vic Telesino",
        "totalReacts": 6,
        "rate": 0.3,
        "score": 0.3966657884201758
      },
      {
        "name": "Austin Fisher",
        "totalReacts": 323,
        "rate": 0.06706810631229236,
        "score": 0.24699685563944399
      },
      {
        "name": "Matt Nelson",
        "totalReacts": 224,
        "rate": 0.046357615894039736,
        "score": 0.1707915070594183
      },
      {
        "name": "will hardy",
        "totalReacts": 146,
        "rate": 0.04246655031995346,
        "score": 0.15018007494764804
      },
      {
        "name": "Zack",
        "totalReacts": 75,
        "rate": 0.04570383912248629,
        "score": 0.14695489729357505
      },
      {
        "name": "Scott Moreland",
        "totalReacts": 10,
        "rate": 0.05747126436781609,
        "score": 0.12891023268312038
      },
      {
        "name": "Chris Moffitt",
        "totalReacts": 295,
        "rate": 0.027309757452323644,
        "score": 0.11015511858422788
      },
      {
        "name": "Citizen Toxxie",
        "totalReacts": 14,
        "rate": 0.04375,
        "score": 0.10965959516771313
      },
      {
        "name": "Lorrin Stone",
        "totalReacts": 71,
        "rate": 0.03198198198198198,
        "score": 0.10702925570132507
      },
      {
        "name": "Denver Rogers",
        "totalReacts": 196,
        "rate": 0.02610548748002131,
        "score": 0.10117396010232627
      },
      {
        "name": "Nick",
        "totalReacts": 241,
        "rate": 0.023040152963671127,
        "score": 0.09261158142495689
      },
      {
        "name": "Andrew",
        "totalReacts": 249,
        "rate": 0.022160911356354576,
        "score": 0.0897661040259091
      },
      {
        "name": "Allen",
        "totalReacts": 7,
        "rate": 0.03867403314917127,
        "score": 0.0874060757784283
      },
      {
        "name": "Andrew Saghian",
        "totalReacts": 19,
        "rate": 0.0286144578313253,
        "score": 0.08077351093487799
      },
      {
        "name": "Holland Stewart",
        "totalReacts": 172,
        "rate": 0.01980426021876799,
        "score": 0.07800541276966128
      },
      {
        "name": "Josh Kursky",
        "totalReacts": 3,
        "rate": 0.0410958904109589,
        "score": 0.07681774190675245
      },
      {
        "name": "Dan",
        "totalReacts": 4,
        "rate": 0.03225806451612903,
        "score": 0.06764225848413084
      },
      {
        "name": "James Davis",
        "totalReacts": 141,
        "rate": 0.01400615873646568,
        "score": 0.056065857968566786
      },
      {
        "name": "Jake Larsen",
        "totalReacts": 1,
        "rate": 0.03225806451612903,
        "score": 0.04855322510709374
      },
      {
        "name": "Hank",
        "totalReacts": 3,
        "rate": 0.005405405405405406,
        "score": 0.01483824211665977
      }
    ],
    "mostLovedUsers": [
      {
        "name": "Josh Kursky",
        "totalReacts": 26,
        "rate": 0.3561643835616438,
        "score": 0.6657537631918545
      },
      {
        "name": "Zack",
        "totalReacts": 304,
        "rate": 0.18525289457647776,
        "score": 0.5956571836966241
      },
      {
        "name": "Vic Telesino",
        "totalReacts": 9,
        "rate": 0.45,
        "score": 0.5949986826302637
      },
      {
        "name": "Austin Fisher",
        "totalReacts": 767,
        "rate": 0.1592607973421927,
        "score": 0.5865219451252431
      },
      {
        "name": "Allen",
        "totalReacts": 44,
        "rate": 0.2430939226519337,
        "score": 0.5494096191786921
      },
      {
        "name": "Lorrin Stone",
        "totalReacts": 307,
        "rate": 0.1382882882882883,
        "score": 0.462788471835307
      },
      {
        "name": "Scott Moreland",
        "totalReacts": 30,
        "rate": 0.1724137931034483,
        "score": 0.3867306980493611
      },
      {
        "name": "Matt Nelson",
        "totalReacts": 501,
        "rate": 0.10368377483443708,
        "score": 0.3819935046284311
      },
      {
        "name": "will hardy",
        "totalReacts": 330,
        "rate": 0.09598603839441536,
        "score": 0.33944811460769764
      },
      {
        "name": "Andrew",
        "totalReacts": 879,
        "rate": 0.07823068707725168,
        "score": 0.3168851624047152
      },
      {
        "name": "Will K.",
        "totalReacts": 6,
        "rate": 0.20689655172413793,
        "score": 0.30561129407993015
      },
      {
        "name": "Andrew Saghian",
        "totalReacts": 71,
        "rate": 0.10692771084337349,
        "score": 0.3018378566513862
      },
      {
        "name": "Citizen Toxxie",
        "totalReacts": 37,
        "rate": 0.115625,
        "score": 0.2898146443718133
      },
      {
        "name": "Holland Stewart",
        "totalReacts": 629,
        "rate": 0.07242371905584341,
        "score": 0.2852639804192845
      },
      {
        "name": "Denver Rogers",
        "totalReacts": 547,
        "rate": 0.07285562067128397,
        "score": 0.2823579396733289
      },
      {
        "name": "Dan",
        "totalReacts": 16,
        "rate": 0.12903225806451613,
        "score": 0.2705690339365234
      },
      {
        "name": "James Davis",
        "totalReacts": 547,
        "rate": 0.05433594914075693,
        "score": 0.21750371850217043
      },
      {
        "name": "Chris Moffitt",
        "totalReacts": 557,
        "rate": 0.05156452508794668,
        "score": 0.2079878001742879
      },
      {
        "name": "Nick",
        "totalReacts": 492,
        "rate": 0.04703632887189293,
        "score": 0.18906596705841822
      },
      {
        "name": "Hank",
        "totalReacts": 27,
        "rate": 0.04864864864864865,
        "score": 0.13354417904993793
      },
      {
        "name": "Jake Larsen",
        "totalReacts": 2,
        "rate": 0.06451612903225806,
        "score": 0.09710645021418748
      }
    ],
    "mostDislikedUsers": [
      {
        "name": "Denver Rogers",
        "totalReacts": 301,
        "rate": 0.040090570058604155,
        "score": 0.15537429587142962
      },
      {
        "name": "Allen",
        "totalReacts": 5,
        "rate": 0.027624309392265192,
        "score": 0.06243291127030593
      },
      {
        "name": "Holland Stewart",
        "totalReacts": 137,
        "rate": 0.01577432354634427,
        "score": 0.06213221831071857
      },
      {
        "name": "Chris Moffitt",
        "totalReacts": 128,
        "rate": 0.011849657470838734,
        "score": 0.047796119250105656
      },
      {
        "name": "Nick",
        "totalReacts": 89,
        "rate": 0.008508604206500956,
        "score": 0.034200957455689476
      },
      {
        "name": "James Davis",
        "totalReacts": 78,
        "rate": 0.007748087811661865,
        "score": 0.031015155471973116
      },
      {
        "name": "Matt Nelson",
        "totalReacts": 38,
        "rate": 0.007864238410596027,
        "score": 0.02897355923329418
      },
      {
        "name": "Andrew",
        "totalReacts": 63,
        "rate": 0.0056069775720897115,
        "score": 0.022711905837880613
      },
      {
        "name": "Austin Fisher",
        "totalReacts": 28,
        "rate": 0.005813953488372093,
        "score": 0.02141149212973508
      },
      {
        "name": "Zack",
        "totalReacts": 10,
        "rate": 0.006093845216331505,
        "score": 0.019593986305810007
      },
      {
        "name": "will hardy",
        "totalReacts": 18,
        "rate": 0.005235602094240838,
        "score": 0.018515351705874417
      },
      {
        "name": "Citizen Toxxie",
        "totalReacts": 2,
        "rate": 0.00625,
        "score": 0.01566565645253045
      },
      {
        "name": "Hank",
        "totalReacts": 3,
        "rate": 0.005405405405405406,
        "score": 0.01483824211665977
      },
      {
        "name": "Lorrin Stone",
        "totalReacts": 9,
        "rate": 0.004054054054054054,
        "score": 0.013567088750872192
      },
      {
        "name": "Andrew Saghian",
        "totalReacts": 2,
        "rate": 0.0030120481927710845,
        "score": 0.008502474835250315
      }
    ],
    "mostRandyUsers": [
      {
        "name": "Denver Rogers",
        "totalReacts": 38,
        "rate": 38,
        "score": 11.439139835231286
      },
      {
        "name": "Nick",
        "totalReacts": 38,
        "rate": 38,
        "score": 11.439139835231286
      },
      {
        "name": "Zack",
        "totalReacts": 18,
        "rate": 18,
        "score": 5.418539921951662
      },
      {
        "name": "Lorrin Stone",
        "totalReacts": 8,
        "rate": 8,
        "score": 2.4082399653118496
      },
      {
        "name": "Andrew",
        "totalReacts": 6,
        "rate": 6,
        "score": 1.806179973983887
      },
      {
        "name": "Chris Moffitt",
        "totalReacts": 5,
        "rate": 5,
        "score": 1.505149978319906
      },
      {
        "name": "Citizen Toxxie",
        "totalReacts": 3,
        "rate": 3,
        "score": 0.9030899869919435
      },
      {
        "name": "Matt Nelson",
        "totalReacts": 2,
        "rate": 2,
        "score": 0.6020599913279624
      },
      {
        "name": "will hardy",
        "totalReacts": 2,
        "rate": 2,
        "score": 0.6020599913279624
      },
      {
        "name": "Holland Stewart",
        "totalReacts": 1,
        "rate": 1,
        "score": 0.3010299956639812
      },
      {
        "name": "James Davis",
        "totalReacts": 1,
        "rate": 1,
        "score": 0.3010299956639812
      },
      {
        "name": "Austin Fisher",
        "totalReacts": 1,
        "rate": 1,
        "score": 0.3010299956639812
      }
    ],
    "mostThirstyUsers": [
      {
        "name": "Scott Moreland",
        "totalReacts": 1,
        "rate": 0.005747126436781609,
        "score": 0.012891023268312037
      },
      {
        "name": "Allen",
        "totalReacts": 1,
        "rate": 0.0055248618784530384,
        "score": 0.012486582254061185
      },
      {
        "name": "Denver Rogers",
        "totalReacts": 23,
        "rate": 0.003063399041022909,
        "score": 0.011872454501803593
      },
      {
        "name": "Hank",
        "totalReacts": 2,
        "rate": 0.0036036036036036037,
        "score": 0.009892161411106513
      },
      {
        "name": "Holland Stewart",
        "totalReacts": 18,
        "rate": 0.002072538860103627,
        "score": 0.008163357150313388
      },
      {
        "name": "Citizen Toxxie",
        "totalReacts": 1,
        "rate": 0.003125,
        "score": 0.007832828226265225
      },
      {
        "name": "Austin Fisher",
        "totalReacts": 9,
        "rate": 0.0018687707641196014,
        "score": 0.006882265327414848
      },
      {
        "name": "James Davis",
        "totalReacts": 16,
        "rate": 0.0015893513459819212,
        "score": 0.006362083173738075
      },
      {
        "name": "Chris Moffitt",
        "totalReacts": 17,
        "rate": 0.0015737826328457694,
        "score": 0.006347922087904658
      },
      {
        "name": "Lorrin Stone",
        "totalReacts": 4,
        "rate": 0.0018018018018018018,
        "score": 0.0060298172226098635
      },
      {
        "name": "will hardy",
        "totalReacts": 5,
        "rate": 0.0014543339150668994,
        "score": 0.005143153251631782
      },
      {
        "name": "Andrew",
        "totalReacts": 12,
        "rate": 0.001067995728017088,
        "score": 0.0043260773024534505
      },
      {
        "name": "Nick",
        "totalReacts": 10,
        "rate": 0.0009560229445506692,
        "score": 0.003842804208504435
      },
      {
        "name": "Matt Nelson",
        "totalReacts": 4,
        "rate": 0.0008278145695364238,
        "score": 0.0030498483403467555
      }
    ],
    "topUsersByMessageCount": [
      {
        "name": "Chris Moffitt",
        "count": 5788
      },
      {
        "name": "Andrew",
        "count": 4955
      },
      {
        "name": "Nick",
        "count": 4872
      },
      {
        "name": "Denver Rogers",
        "count": 4590
      },
      {
        "name": "James Davis",
        "count": 4535
      },
      {
        "name": "Holland Stewart",
        "count": 3894
      },
      {
        "name": "Austin Fisher",
        "count": 3323
      },
      {
        "name": "Matt Nelson",
        "count": 2152
      },
      {
        "name": "will hardy",
        "count": 2141
      },
      {
        "name": "Lorrin Stone",
        "count": 1049
      }
    ],
    "topUsersByReactionCount": [
      {
        "name": "Andrew",
        "count": 9007
      },
      {
        "name": "Chris Moffitt",
        "count": 8029
      },
      {
        "name": "James Davis",
        "count": 7798
      },
      {
        "name": "Nick",
        "count": 7605
      },
      {
        "name": "Holland Stewart",
        "count": 5191
      },
      {
        "name": "Denver Rogers",
        "count": 4249
      },
      {
        "name": "Austin Fisher",
        "count": 3454
      },
      {
        "name": "Lorrin Stone",
        "count": 3413
      },
      {
        "name": "will hardy",
        "count": 3361
      },
      {
        "name": "Zack",
        "count": 1984
      }
    ],
    "userNamesById": {
      "f25e55ad-675f-4d26-8bcf-3cb897883309": "Hank",
      "005c39ec-08ba-4434-857e-b21abbe6d9c9": "Hank",
      "bf214373-2ebf-497a-bbbc-5db4f6474ca1": "Holland Stewart",
      "a331642f-5c41-4110-a4be-96cef678e448": "Holland Stewart",
      "d5959504-47e2-4bef-8717-7916cf05e66b": "Ben Davis",
      "7158d97d-d5b6-40a1-80ca-4e7e13afbfde": "Ben Davis",
      "afe18691-0152-4d97-a27e-a6f8b624f368": "Matt Nelson",
      "a4ca791b-ac2d-4b2b-aff0-ccef8fc9ef23": "Matt Nelson",
      "9abbc2ce-f8d4-4fb9-a159-5f6ee046769b": "James Davis",
      "02437289-7909-4aa4-b497-912dca8ccd29": "James Davis",
      "50e5aa4b-5b06-4cea-81a6-fc0b27080201": "amoffitt",
      "c234f5b0-8341-46aa-ac4e-258301000619": "amoffitt",
      "7f413767-0113-4658-a3c4-bd72ef50c0af": "Tanner Yould",
      "414b269d-a5dd-4c11-86a3-f18ff50bf372": "Tanner Yould",
      "3a184195-5e71-4a90-ab08-602aeefd49da": "Lorrin Stone",
      "b4b4145b-cb94-47c7-856e-30cf0aa0f2fb": "Lorrin Stone",
      "256a9d3f-4a02-4367-8d04-95f44f7d990d": "Shelby Stewart",
      "0e3f3801-47a2-4c5e-84c8-fe55a4688ae1": "Shelby Stewart",
      "63b05661-1081-418d-bcb5-4c7f9071e6fd": "thethrillcankill",
      "4357b24c-5526-4728-849a-8fb88e60cd59": "thethrillcankill",
      "eb51dbfb-9323-49a7-99e7-e170419c6a3a": "Austin Brown",
      "d06b3be0-2919-40dd-80ca-9c529464e3c0": "Austin Brown",
      "343e7dfa-11eb-4e3a-ab13-88fdfdf45b62": "Louis",
      "8baf9a64-d512-46d3-97cf-c96b05885161": "Louis",
      "9972774f-c7af-4e8c-8632-781897d63a2d": "Denver Rogers",
      "a08ce189-5425-45ce-a8d2-f7c0a8db47e4": "Denver Rogers",
      "d14fcfff-d350-4e78-8562-3c19d6e5e71a": "Micah Moreland",
      "11075676-8bcc-4da5-a12e-d15b4f2de00c": "Micah Moreland",
      "32ac2251-bc1f-4b74-b2c8-0adea1649a61": "Josh Kursky",
      "f3f052b1-52b2-446a-b2b8-ed491fbd7b43": "Josh Kursky",
      "4ade7a42-d34b-4e44-9794-a59e3c5b6469": "Jenny",
      "5e513362-61b3-4a03-97be-723f7dedda42": "Jenny",
      "4c577d0a-0f7f-4c9c-b052-f3fb32b6e63d": "Michelle Burns",
      "a0b333f7-2ed2-45d9-9c6a-c8360cfaff5a": "Michelle Burns",
      "ae5fa7d7-9eab-49dd-85b7-d34a2fa7087b": "M Stewart",
      "8533a0cb-0958-47e9-a7b4-97957668c662": "M Stewart",
      "49fc8acb-fb62-4eae-ab0c-632cd5d25068": "Andrew",
      "5c470283-5af8-4756-991e-95fcab5c0772": "Andrew",
      "04e231b7-f55f-477e-9a90-36dd2b5a79e3": "Jenni Duran",
      "adcfbc33-53da-4072-8d3b-dbedf6a4f488": "Jenni Duran",
      "bb8c1805-3d5f-4522-9ed3-0d23b3c29336": "Andrew Saghian",
      "eddd9597-96a2-4131-8681-01c822340ce1": "Andrew Saghian",
      "69b077a2-1445-4c3e-9519-7f9615660fb8": "Austin Fisher",
      "c96a7819-49ff-47b9-84d7-c8cfc374297f": "Austin Fisher",
      "902bf0a8-1952-434b-a4bd-6cc4f1b54e28": "Wendy",
      "8f4648b0-5744-4d78-9de4-6e4befc51d92": "Wendy",
      "6bc52f75-d7db-403e-b6a5-baddc030e28b": "Breck",
      "18da84df-a2ab-4991-bd52-6a9b951444fb": "Breck",
      "210cdef4-7e03-4042-89ac-8aa5e5189d3e": "Jessica",
      "21fa67f4-275e-4a60-a653-759de2c4fb79": "Jessica",
      "d1c27e73-1611-4db5-bcad-54163322b7e6": "Zack",
      "c17f103a-c92c-4739-b2c9-bab18143a5da": "Zack",
      "a27ebade-45ef-4cbd-8690-8d85e6a30b51": "Kelly Patton",
      "ae93a0ea-44dc-43dc-9d8d-5c96be39df64": "Kelly Patton",
      "6c4f8f93-6dc4-455c-adc9-adc95939bbb5": "Jackie Stewart",
      "e46d9a61-ef3d-485f-bd81-c527141d41f2": "Jackie Stewart",
      "1f1e6dbb-4a02-415e-bdf0-ddca726e7679": "Grace Stewart",
      "fc662a97-f1e6-499c-9aff-a40855a1d7a1": "Grace Stewart",
      "989ac7c0-1497-4eb0-a664-d8fdce008b49": "Kara Torbert",
      "6ecdd0d6-daac-45f7-8fc1-21e773393bbd": "Kara Torbert",
      "fa61fc94-52c1-4d05-8cf7-4726a652753e": "Alex Hollander",
      "f8952f4a-4790-45ad-b6bd-135c041af172": "Alex Hollander",
      "da5cdb00-1b68-41fa-910e-e1b372ba254d": "Scott Moreland",
      "91abab1d-2e83-475a-a44f-4aa50881bfce": "Scott Moreland",
      "06b37aa6-42c7-4e75-9385-b31e97920cbd": "Nick",
      "efb4532e-3609-4adb-88ac-38f46d16dd1f": "Nick",
      "9649f7e1-eb6b-4e80-9f06-3fa3ecb9ae57": "Dan",
      "69afb978-a9cc-4419-8418-cebb8d801b58": "Dan",
      "88ed5b2c-6c3c-4ba8-a05a-6a91f952e1fa": "will hardy",
      "0ecdf31e-c2c6-4712-bd23-670da4e793e9": "will hardy",
      "443ff401-890f-4911-b25c-7df396996d91": "Rita M",
      "8ab4938b-cd23-4d21-974c-a03f800b4454": "Rita M",
      "9e565062-37b9-4e56-8cdf-9387fdc71311": "Chris Moffitt",
      "0ae5c8ff-6237-4eb1-a78c-1ae2c2b6c88e": "Chris Moffitt",
      "d85ed1c8-b098-497f-9bcb-669ed64f5c2c": "Ana Hardy",
      "b49809bd-4aaf-429a-a04c-30f0fbd9cbd2": "Ana Hardy",
      "6eccdc3c-4acc-488c-a20d-fed8e780c123": "Kaylee",
      "5ed0c726-8c6c-4ed2-bd3a-cea9105bb5bb": "Kaylee",
      "8081b020-529b-48e3-9d71-c658bc35e0a7": "Ana Hardy",
      "fc7835c2-2487-4461-83ce-a63e60fb4f0c": "Ana Hardy",
      "309f535f-f1af-412d-b4ac-11bed2c3deec": "Jennifer Byus",
      "5cb80fdc-44fe-4142-85d8-780662f012f6": "Jennifer Byus",
      "4a1daaeb-a2f4-43c5-b68e-3332679372b1": "Steven Adams",
      "510221c2-7cd9-4646-816f-3a94ec693bcb": "Steven Adams",
      "e759a01d-5dc8-4fd4-98b5-44d4bd86599e": "Melissa Doloksaribu",
      "8d60bcbd-ee82-4cb6-bfa9-6e9276b0edb9": "Melissa Doloksaribu",
      "4eb0bb81-1b44-4eb5-a9a1-0e9d71460db7": "Lucas Sutter",
      "4272d767-2bb9-4961-9a37-795eacbfc474": "Lucas Sutter",
      "ece47209-c202-4f8b-b9db-2ed8fec5819c": "Gerard",
      "1002dcb7-80e7-45e0-bb6c-26be66bf31d3": "Gerard",
      "568152bd-bab3-46f9-9b38-77e1675e921b": "Signal",
      "11111111-1111-4111-8111-111111111111": "Signal",
      "f90b97ea-ce4c-4d75-b627-0847de71e892": "Shirlee Fisher",
      "d0306e54-30f0-47b6-9c16-90ad628e14ac": "Shirlee Fisher",
      "861b354a-a5bd-4fbb-9a59-64a3c7e77201": "Lexi",
      "44a85754-42d2-4e8b-b75c-dcb14c5c0848": "Lexi",
      "f1a32fae-937c-460d-8dcf-2f2b096c2a2b": "Zach Smith",
      "f7a8d123-8454-4fe5-bbd7-f2128a6a502e": "Zach Smith",
      "b407606f-3728-4d82-8877-9d63adcfa0f5": "Jake Larsen",
      "26b78b3c-349e-46d6-b3cf-14bd6313567f": "Jake Larsen",
      "904d017b-5fe5-4a24-9d32-4c827fc157a4": "Vic Telesino",
      "50957f06-21bd-41fb-b96e-992e0451f88d": "Vic Telesino",
      "e1a35beb-2018-406e-ba22-57072346cb08": "Mitch Makinson",
      "c6d23c4f-47cf-439e-8a20-8d562693fd10": "Mitch Makinson",
      "4001cab4-861a-40fe-a03c-edcebc377e07": "Melissa Doloksaribu",
      "a035044e-5392-4ae0-bdc4-2a32c009f968": "Melissa Doloksaribu",
      "ad32ea4c-b987-4ce4-b383-61807b95b36a": "Crystal",
      "1a249672-f69f-475f-85f7-90ae13f3d15b": "Crystal",
      "d3809ac6-d885-4e23-9008-cbf9734b6130": "Will K.",
      "8b6b1420-a267-4667-b2b3-821c8e03f748": "Will K.",
      "9aad85f3-44db-41e2-87f2-1853f4a5b6a6": "Citizen Toxxie",
      "f76388d5-5a98-4daa-bb1a-96fd45ea7b4a": "Citizen Toxxie",
      "30410cf4-52d9-4165-8665-eff2eb200c25": "Amy Stone",
      "05d91792-ba4f-4dae-a3f1-cb2ac7762202": "Amy Stone",
      "cf29e178-459f-49a0-9936-ac8a7b9c99f5": "Allen",
      "bb46d450-142a-42fe-bedc-7269c063ed01": "Allen",
      "9a1179db-583c-4170-be88-eac3fd754601": "Ellis Weiner",
      "8f58f21b-1c55-41aa-9d00-09addfd539ff": "Ellis Weiner"
    }
  },
  "individualStats": {
    "bb46d450-142a-42fe-bedc-7269c063ed01": {
      "totalMessagesSent": 144,
      "mostPopularDay": "Wednesday",
      "totalReactionsSent": 57,
      "reactedToMost": {
        "name": "Holland Stewart",
        "count": 15,
        "emoji": "😂"
      },
      "receivedMostReactionsFrom": {
        "name": "Holland Stewart",
        "count": 81,
        "emoji": "😂"
      },
      "mostPopularMessage": {
        "text": "All of my sex has been really good and hot. All the people I've had sex with always say, wow, Allen, you are so good and hot at sex. And I say, well yeah, I have a lot of sex, that's why I'm so good and hot at it. Then they say, hey, what are those bumps, and I tell them I'm ribbed for their pleasure....then they lose a lot of weight and I don't hear from them ever again.",
        "reactionCount": 11,
        "reactions": [
          {
            "emoji": "😂",
            "sender": "Lorrin Stone"
          },
          {
            "emoji": "😂",
            "sender": "Andrew"
          },
          {
            "emoji": "😂",
            "sender": "Austin Fisher"
          },
          {
            "emoji": "😂",
            "sender": "will hardy"
          },
          {
            "emoji": "😂",
            "sender": "Denver Rogers"
          },
          {
            "emoji": "😂",
            "sender": "Citizen Toxxie"
          },
          {
            "emoji": "😂",
            "sender": "James Davis"
          },
          {
            "emoji": "😂",
            "sender": "Matt Nelson"
          },
          {
            "emoji": "😂",
            "sender": "Andrew Saghian"
          },
          {
            "emoji": "😂",
            "sender": "Holland Stewart"
          },
          {
            "emoji": "😂",
            "sender": "Hank"
          }
        ]
      },
      "uniqueReactions": [
        "😂",
        "❤️",
        "👍",
        "👎",
        "🤔",
        "😢"
      ]
    },
    "5c470283-5af8-4756-991e-95fcab5c0772": {
      "totalMessagesSent": 2055,
      "mostPopularDay": "Friday",
      "totalReactionsSent": 3367,
      "reactedToMost": {
        "name": "Holland Stewart",
        "count": 514,
        "emoji": "😂"
      },
      "receivedMostReactionsFrom": {
        "name": "Chris Moffitt",
        "count": 483,
        "emoji": "😂"
      },
      "mostPopularMessage": {
        "text": "Alright details for Jenni’s job offer \n\nK-3rd rsp (sped) teacher at a school in Atwater (neighbor town - it’s where sign guys is) \n\nShe was hoping for a different school where her sister works which also higher pay. Today she was told didn’t get that one so she accepted the job offer from the Atwater school. \n\nAlthough not choice 1, choice 2 is still dope as hell. Our income goes up by ~33%, which is a hell of a raise, and she finally gets to do the job she’s wanted for years \n\nSuper proud of the work she’s put in. Being a teacher requires jumping through so many god damn hoops",
        "reactionCount": 12,
        "reactions": [
          {
            "emoji": "🥳",
            "sender": "Nick"
          },
          {
            "emoji": "❤️",
            "sender": "Lorrin Stone"
          },
          {
            "emoji": "❤️",
            "sender": "Austin Fisher"
          },
          {
            "emoji": "❤️",
            "sender": "will hardy"
          },
          {
            "emoji": "❤️",
            "sender": "Denver Rogers"
          },
          {
            "emoji": "❤️",
            "sender": "Citizen Toxxie"
          },
          {
            "emoji": "❤️",
            "sender": "James Davis"
          },
          {
            "emoji": "❤️",
            "sender": "Chris Moffitt"
          },
          {
            "emoji": "❤️",
            "sender": "Andrew Saghian"
          },
          {
            "emoji": "❤️",
            "sender": "Holland Stewart"
          },
          {
            "emoji": "❤️",
            "sender": "Zack"
          },
          {
            "emoji": "❤️",
            "sender": "Hank"
          }
        ]
      },
      "uniqueReactions": [
        "😂",
        "❤️",
        "👍",
        "�",
        "�",
        "😮",
        "❓",
        "�",
        "‼️",
        "�",
        "�‍♂️",
        "🫡",
        "🙏",
        "🔥",
        "9️⃣",
        "🥜",
        "😍",
        "🤨",
        "🥲",
        "🏔️",
        "🧦",
        "💦",
        "🤦‍♂️",
        "🎯",
        "🌮",
        "🥪",
        "🗿",
        "🎨",
        "🚩",
        "🤦🏾‍♂️",
        "🗑️",
        "🆗",
        "🫰",
        "💡",
        "🥴",
        "😩",
        "🪩",
        "🛢️",
        "3️⃣",
        "👀",
        "1️⃣",
        "🪱",
        "🔟",
        "🏳️‍🌈"
      ]
    },
    "eddd9597-96a2-4131-8681-01c822340ce1": {
      "totalMessagesSent": 168,
      "mostPopularDay": "Tuesday",
      "totalReactionsSent": 694,
      "reactedToMost": {
        "name": "Holland Stewart",
        "count": 156,
        "emoji": "😂"
      },
      "receivedMostReactionsFrom": {
        "name": "James Davis",
        "count": 60,
        "emoji": "😂"
      },
      "mostPopularMessage": {
        "text": "Gotta love Stanley Mosk Courthouse",
        "reactionCount": 9,
        "reactions": [
          {
            "emoji": "😂",
            "sender": "Lorrin Stone"
          },
          {
            "emoji": "😂",
            "sender": "Andrew"
          },
          {
            "emoji": "😂",
            "sender": "Austin Fisher"
          },
          {
            "emoji": "😂",
            "sender": "Denver Rogers"
          },
          {
            "emoji": "😂",
            "sender": "James Davis"
          },
          {
            "emoji": "😂",
            "sender": "Chris Moffitt"
          },
          {
            "emoji": "😂",
            "sender": "Holland Stewart"
          },
          {
            "emoji": "😂",
            "sender": "Zack"
          },
          {
            "emoji": "😂",
            "sender": "Hank"
          }
        ]
      },
      "uniqueReactions": [
        "😂",
        "👎",
        "💯",
        "❤️",
        "🦞",
        "😮",
        "💔",
        "👀",
        "🇦🇲",
        "😢",
        "🙋‍♂️",
        "🙈",
        "🇺🇸",
        "🤔",
        "🔥",
        "👍",
        "😡",
        "🤦‍♂️"
      ]
    },
    "c96a7819-49ff-47b9-84d7-c8cfc374297f": {
      "totalMessagesSent": 1506,
      "mostPopularDay": "Monday",
      "totalReactionsSent": 1636,
      "reactedToMost": {
        "name": "Holland Stewart",
        "count": 223,
        "emoji": "😂"
      },
      "receivedMostReactionsFrom": {
        "name": "Andrew",
        "count": 404,
        "emoji": "😂"
      },
      "mostPopularMessage": {
        "text": "Had a funny conversation with Shirlee. \n\nWe were sharing the trashy content social media feeds us that we actually enjoy. I confessed that mine was cringe cult/religious content, but the content can't be satire, the people have to actually believe what they share. \n\nShirlee's was \"mismatched couples\". As she described it, the more opposite the better. Like a gay couple where one is a Finnish little person and the other is a NBA player.\n\nWe learned a lot about each other.",
        "reactionCount": 10,
        "reactions": [
          {
            "emoji": "😂",
            "sender": "Nick"
          },
          {
            "emoji": "😂",
            "sender": "Andrew"
          },
          {
            "emoji": "❤️",
            "sender": "Denver Rogers"
          },
          {
            "emoji": "😂",
            "sender": "James Davis"
          },
          {
            "emoji": "😂",
            "sender": "Chris Moffitt"
          },
          {
            "emoji": "😂",
            "sender": "Matt Nelson"
          },
          {
            "emoji": "😂",
            "sender": "Andrew Saghian"
          },
          {
            "emoji": "😂",
            "sender": "Holland Stewart"
          },
          {
            "emoji": "❤️",
            "sender": "Zack"
          },
          {
            "emoji": "😂",
            "sender": "Hank"
          }
        ]
      },
      "uniqueReactions": [
        "😂",
        "🥳",
        "👍",
        "💪",
        "👵",
        "😮",
        "😢",
        "🐍",
        "❤️",
        "‼️",
        "👀",
        "♟️",
        "🫦",
        "📁",
        "💯",
        "🫡",
        "🍻",
        "🐶",
        "🔥",
        "🚀",
        "🤝",
        "🫂",
        "🎉",
        "👎",
        "👑",
        "🍆",
        "😬",
        "🚴",
        "📂",
        "🚨",
        "🤮",
        "❓",
        "👨‍🦲",
        "🧠",
        "🛢️",
        "☝️",
        "🤙",
        "🥹",
        "🌈",
        "⛪",
        "🥜",
        "😍",
        "🤨",
        "🥲",
        "🏔️",
        "🧦",
        "�",
        "🤦‍♂️",
        "🎯",
        "�",
        "�",
        "🗿",
        "�",
        "�",
        "�🏾‍♂️",
        "🗑️",
        "🆗",
        "🫰",
        "�",
        "🥴",
        "😩",
        "�",
        "🛢️",
        "3️⃣",
        "�",
        "1️⃣",
        "�",
        "🔟",
        "🏳️‍🌈"
      ]
    },
    "0ae5c8ff-6237-4eb1-a78c-1ae2c2b6c88e": {
      "totalMessagesSent": 2445,
      "mostPopularDay": "Wednesday",
      "totalReactionsSent": 2995,
      "reactedToMost": {
        "name": "Andrew",
        "count": 483,
        "emoji": "😂"
      },
      "receivedMostReactionsFrom": {
        "name": "Nick",
        "count": 455,
        "emoji": "😂"
      },
      "mostPopularMessage": {
        "text": "fat shamed you into getting solar?  \"you look like you have a lot of chest freezers, big boy...\"",
        "reactionCount": 9,
        "reactions": [
          {
            "emoji": "😂",
            "sender": "Lorrin Stone"
          },
          {
            "emoji": "😂",
            "sender": "Andrew"
          },
          {
            "emoji": "😂",
            "sender": "Austin Fisher"
          },
          {
            "emoji": "😂",
            "sender": "Denver Rogers"
          },
          {
            "emoji": "😂",
            "sender": "James Davis"
          },
          {
            "emoji": "😂",
            "sender": "Andrew Saghian"
          },
          {
            "emoji": "😂",
            "sender": "Holland Stewart"
          },
          {
            "emoji": "😂",
            "sender": "Zack"
          },
          {
            "emoji": "😂",
            "sender": "Hank"
          }
        ]
      },
      "uniqueReactions": [
        "😂",
        "💯",
        "👍",
        "😮",
        "❤️",
        "😢",
        "🙄",
        "🏗️",
        "⬇️",
        "😬",
        "‼️",
        "🤔",
        "🥹",
        "🎯",
        "🔥",
        "🧠",
        "😘",
        "👎",
        "💦",
        "🤣",
        "🤗",
        "🤢",
        "🖕",
        "❓",
        "😳",
        "😏",
        "⏸️",
        "🤤",
        "🇺🇸",
        "🥵",
        "🤮",
        "🛢️",
        "🫡",
        "😡",
        "🤦‍♂️",
        "♻️",
        "🤷‍♂️",
        "🔟",
        "🎉"
      ]
    },
    "f76388d5-5a98-4daa-bb1a-96fd45ea7b4a": {
      "totalMessagesSent": 178,
      "mostPopularDay": "Wednesday",
      "totalReactionsSent": 360,
      "reactedToMost": {
        "name": "Denver Rogers",
        "count": 71,
        "emoji": "😂"
      },
      "receivedMostReactionsFrom": {
        "name": "Andrew",
        "count": 60,
        "emoji": "😂"
      },
      "mostPopularMessage": {
        "text": "The pride sticker that Harley wishes never happened",
        "reactionCount": 11,
        "reactions": [
          {
            "emoji": "😂",
            "sender": "Nick"
          },
          {
            "emoji": "😂",
            "sender": "Lorrin Stone"
          },
          {
            "emoji": "😂",
            "sender": "Andrew"
          },
          {
            "emoji": "😂",
            "sender": "Austin Fisher"
          },
          {
            "emoji": "😂",
            "sender": "Denver Rogers"
          },
          {
            "emoji": "😂",
            "sender": "James Davis"
          },
          {
            "emoji": "😂",
            "sender": "Chris Moffitt"
          },
          {
            "emoji": "😂",
            "sender": "Matt Nelson"
          },
          {
            "emoji": "😂",
            "sender": "Holland Stewart"
          },
          {
            "emoji": "😂",
            "sender": "Zack"
          },
          {
            "emoji": "😂",
            "sender": "Hank"
          }
        ]
      },
      "uniqueReactions": [
        "😂",
        "😮",
        "❤️",
        "🤡",
        "👍",
        "😢",
        "🥴",
        "💯",
        "🫡",
        "👹",
        "🤮",
        "👎",
        "🍩",
        "🐐",
        "🍆"
      ]
    },
    "69afb978-a9cc-4419-8418-cebb8d801b58": {
      "totalMessagesSent": 26,
      "mostPopularDay": "Wednesday",
      "totalReactionsSent": 35,
      "reactedToMost": {
        "name": "Austin Fisher",
        "count": 8,
        "emoji": "😂"
      },
      "receivedMostReactionsFrom": {
        "name": "Denver Rogers",
        "count": 13,
        "emoji": "😂"
      },
      "mostPopularMessage": {
        "text": "This is going to be pricey…. \nAnything can be done for a price. \nI’ll be putting my license at risk… so you’ll have to cover my lost earnings for the next 20 years…",
        "reactionCount": 9,
        "reactions": [
          {
            "emoji": "😂",
            "sender": "Lorrin Stone"
          },
          {
            "emoji": "😂",
            "sender": "Andrew"
          },
          {
            "emoji": "😂",
            "sender": "Austin Fisher"
          },
          {
            "emoji": "😂",
            "sender": "will hardy"
          },
          {
            "emoji": "😂",
            "sender": "Denver Rogers"
          },
          {
            "emoji": "😂",
            "sender": "Chris Moffitt"
          },
          {
            "emoji": "😂",
            "sender": "Andrew Saghian"
          },
          {
            "emoji": "😂",
            "sender": "Holland Stewart"
          },
          {
            "emoji": "😂",
            "sender": "Zack"
          }
        ]
      },
      "uniqueReactions": [
        "👍",
        "❤️",
        "😂",
        "😇",
        "🤮",
        "👎",
        "🫡",
        "🎉"
      ]
    },
    "a08ce189-5425-45ce-a8d2-f7c0a8db47e4": {
      "totalMessagesSent": 2551,
      "mostPopularDay": "Tuesday",
      "totalReactionsSent": 2485,
      "reactedToMost": {
        "name": "James Davis",
        "count": 391,
        "emoji": "😂"
      },
      "receivedMostReactionsFrom": {
        "name": "James Davis",
        "count": 457,
        "emoji": "😂"
      },
      "mostPopularMessage": {
        "text": "A friend I know at the gym comes up to me and says wow you are smiling right now.  Who is the lucky lady.  \n\nI did not have the heart to tell her that I was texting a bunch of grown unit men about how holland wears blackface and how we try to make the only plans chat anything else but planning plans. \n\nSo I just said. Ah it’s something new.  It was a kinda of a low for me in the dating world.",
        "reactionCount": 9,
        "reactions": [
          {
            "emoji": "😂",
            "sender": "Nick"
          },
          {
            "emoji": "😂",
            "sender": "Andrew"
          },
          {
            "emoji": "😂",
            "sender": "Austin Fisher"
          },
          {
            "emoji": "😂",
            "sender": "will hardy"
          },
          {
            "emoji": "😂",
            "sender": "James Davis"
          },
          {
            "emoji": "😂",
            "sender": "Chris Moffitt"
          },
          {
            "emoji": "😂",
            "sender": "Andrew Saghian"
          },
          {
            "emoji": "😂",
            "sender": "Holland Stewart"
          },
          {
            "emoji": "😂",
            "sender": "Hank"
          }
        ]
      },
      "uniqueReactions": [
        "😂",
        "📁",
        "❤️",
        "👎",
        "💪",
        "👍",
        "😢",
        "😮",
        "🏐",
        "🔥",
        "👅",
        "💯",
        "📂",
        "🫡",
        "🍆",
        "🙏",
        "🤨",
        "😍",
        "💪🏾",
        "⛪",
        "🖕",
        "🎉",
        "🥲",
        "🗿",
        "🏔️",
        "⚜️",
        "🤫",
        "🏳️‍🌈",
        "❓",
        "🤢",
        "🤷🏾‍♂️",
        "🍌",
        "‼️",
        "👌",
        "😏",
        "🧽",
        "🃏",
        "🌚",
        "💥",
        "😬",
        "🧠",
        "🥰",
        "🎶",
        "🇺🇸",
        "💩",
        "🤤",
        "🫦",
        "🖕🏾",
        "🤦🏾‍♂️",
        "🥺",
        "🐳",
        "⏰",
        "🗑️",
        "💦",
        "🤮",
        "🤔",
        "👀",
        "🌞",
        "😡",
        "🏃🏾‍➡️"
      ]
    },
    "005c39ec-08ba-4434-857e-b21abbe6d9c9": {
      "totalMessagesSent": 38,
      "mostPopularDay": "Tuesday",
      "totalReactionsSent": 386,
      "reactedToMost": {
        "name": "Matt Nelson",
        "count": 84,
        "emoji": "😂"
      },
      "receivedMostReactionsFrom": {
        "name": "Andrew",
        "count": 25,
        "emoji": "😂"
      },
      "mostPopularMessage": {
        "text": "Just /muppetsnsfw or should I show him others?",
        "reactionCount": 11,
        "reactions": [
          {
            "emoji": "😂",
            "sender": "Nick"
          },
          {
            "emoji": "😂",
            "sender": "Lorrin Stone"
          },
          {
            "emoji": "😂",
            "sender": "Andrew"
          },
          {
            "emoji": "😂",
            "sender": "Austin Fisher"
          },
          {
            "emoji": "😂",
            "sender": "will hardy"
          },
          {
            "emoji": "😂",
            "sender": "James Davis"
          },
          {
            "emoji": "😂",
            "sender": "Chris Moffitt"
          },
          {
            "emoji": "😂",
            "sender": "Matt Nelson"
          },
          {
            "emoji": "😂",
            "sender": "Andrew Saghian"
          },
          {
            "emoji": "😂",
            "sender": "Holland Stewart"
          },
          {
            "emoji": "😂",
            "sender": "Zack"
          }
        ]
      },
      "uniqueReactions": [
        "😂",
        "❤️",
        "😢",
        "👍",
        "📂",
        "‼️",
        "😮",
        "👎"
      ]
    },
    "a331642f-5c41-4110-a4be-96cef678e448": {
      "totalMessagesSent": 2082,
      "mostPopularDay": "Tuesday",
      "totalReactionsSent": 2353,
      "reactedToMost": {
        "name": "Denver Rogers",
        "count": 299,
        "emoji": "😂"
      },
      "receivedMostReactionsFrom": {
        "name": "Andrew",
        "count": 514,
        "emoji": "😂"
      },
      "mostPopularMessage": {
        "text": "Just dropped Ryan off for her last day at animal camp and while we were waiting to get checked in, a guy pulls up to drop his daughter off in a Porsche 911, awesome car. Well Ryan just exclaims loudly “what is that teeny weeny car doin?” and when the kid got out, Ryan asked “why do you guys have such a teeny weeny car?” As I’m trying and failing to get her to shut the fuck up, the dad had gotten out and he seemed a little hurt and he just mutters “it’s actually more of a race car” and Ryan goes “it’s something a baby would drive, only a baby could fit in it!”",
        "reactionCount": 12,
        "reactions": [
          {
            "emoji": "😂",
            "sender": "Nick"
          },
          {
            "emoji": "😂",
            "sender": "Lorrin Stone"
          },
          {
            "emoji": "😂",
            "sender": "Andrew"
          },
          {
            "emoji": "😂",
            "sender": "Austin Fisher"
          },
          {
            "emoji": "😂",
            "sender": "will hardy"
          },
          {
            "emoji": "😂",
            "sender": "Denver Rogers"
          },
          {
            "emoji": "😂",
            "sender": "Citizen Toxxie"
          },
          {
            "emoji": "😂",
            "sender": "James Davis"
          },
          {
            "emoji": "😂",
            "sender": "Chris Moffitt"
          },
          {
            "emoji": "😂",
            "sender": "Matt Nelson"
          },
          {
            "emoji": "😂",
            "sender": "Zack"
          },
          {
            "emoji": "😂",
            "sender": "Hank"
          }
        ]
      },
      "uniqueReactions": [
        "😂",
        "❤️",
        "😮",
        "💯",
        "👍",
        "❓",
        "😢",
        "‼️",
        "😏",
        "🖕",
        "🙏",
        "🙄",
        "👎",
        "📂",
        "🔥",
        "🏳️‍🌈",
        "💦",
        "🥵",
        "🤯",
        "🛢️",
        "🤨",
        "😡",
        "🤮",
        "🤞",
        "🗑️",
        "😬",
        "🧠"
      ]
    },
    "02437289-7909-4aa4-b497-912dca8ccd29": {
      "totalMessagesSent": 2421,
      "mostPopularDay": "Tuesday",
      "totalReactionsSent": 3328,
      "reactedToMost": {
        "name": "Holland Stewart",
        "count": 464,
        "emoji": "😂"
      },
      "receivedMostReactionsFrom": {
        "name": "Andrew",
        "count": 447,
        "emoji": "😂"
      },
      "mostPopularMessage": {
        "text": "Well boys, first trimester tests are over, I’m not sworn to secrecy any more. Lexi is pregnant and we are having a girl in early October",
        "reactionCount": 13,
        "reactions": [
          {
            "emoji": "❤️",
            "sender": "Nick"
          },
          {
            "emoji": "❤️",
            "sender": "Lorrin Stone"
          },
          {
            "emoji": "❤️",
            "sender": "Andrew"
          },
          {
            "emoji": "🎉",
            "sender": "Austin Fisher"
          },
          {
            "emoji": "❤️",
            "sender": "will hardy"
          },
          {
            "emoji": "❤️",
            "sender": "Dan"
          },
          {
            "emoji": "❤️",
            "sender": "Denver Rogers"
          },
          {
            "emoji": "❤️",
            "sender": "Chris Moffitt"
          },
          {
            "emoji": "❤️",
            "sender": "Andrew Saghian"
          },
          {
            "emoji": "❤️",
            "sender": "Holland Stewart"
          },
          {
            "emoji": "❤️",
            "sender": "Zack"
          },
          {
            "emoji": "🎉",
            "sender": "Scott Moreland"
          },
          {
            "emoji": "❤️",
            "sender": "Hank"
          }
        ]
      },
      "uniqueReactions": [
        "😂",
        "😮",
        "🔥",
        "📂",
        "👎",
        "❤️",
        "😢",
        "💯",
        "👍",
        "🤡",
        "🤮",
        "‼️",
        "🙋‍♂️",
        "🏳️‍🌈",
        "🍔",
        "🤫",
        "🏗️",
        "🤕",
        "🎉",
        "😈",
        "👏",
        "👻",
        "🥵",
        "⛪"
      ]
    },
    "f3f052b1-52b2-446a-b2b8-ed491fbd7b43": {
      "totalMessagesSent": 8,
      "mostPopularDay": "Wednesday",
      "totalReactionsSent": 0,
      "reactedToMost": null,
      "receivedMostReactionsFrom": {
        "name": "Nick",
        "count": 4,
        "emoji": "❤️"
      },
      "mostPopularMessage": {
        "text": "Thanks boys. Hope y'all are doing well. I miss So Cal. Fox News makes it sound like such a peaceful place. Finally makes Seattle protests seem calm",
        "reactionCount": 10,
        "reactions": [
          {
            "emoji": "❤️",
            "sender": "Nick"
          },
          {
            "emoji": "😂",
            "sender": "Lorrin Stone"
          },
          {
            "emoji": "😮",
            "sender": "Andrew"
          },
          {
            "emoji": "❤️",
            "sender": "Austin Fisher"
          },
          {
            "emoji": "😮",
            "sender": "Denver Rogers"
          },
          {
            "emoji": "😂",
            "sender": "James Davis"
          },
          {
            "emoji": "😂",
            "sender": "Chris Moffitt"
          },
          {
            "emoji": "❤️",
            "sender": "Holland Stewart"
          },
          {
            "emoji": "❤️",
            "sender": "Zack"
          },
          {
            "emoji": "❤️",
            "sender": "Hank"
          }
        ]
      },
      "uniqueReactions": []
    },
    "b4b4145b-cb94-47c7-856e-30cf0aa0f2fb": {
      "totalMessagesSent": 699,
      "mostPopularDay": "Monday",
      "totalReactionsSent": 1814,
      "reactedToMost": {
        "name": "James Davis",
        "count": 324,
        "emoji": "😂"
      },
      "receivedMostReactionsFrom": {
        "name": "James Davis",
        "count": 251,
        "emoji": "😂"
      },
      "mostPopularMessage": {
        "text": "Austin’s clients when he admits that he’s not LYL2OIL",
        "reactionCount": 10,
        "reactions": [
          {
            "emoji": "😂",
            "sender": "Andrew"
          },
          {
            "emoji": "😂",
            "sender": "Austin Fisher"
          },
          {
            "emoji": "😂",
            "sender": "will hardy"
          },
          {
            "emoji": "😂",
            "sender": "Denver Rogers"
          },
          {
            "emoji": "😂",
            "sender": "James Davis"
          },
          {
            "emoji": "😂",
            "sender": "Chris Moffitt"
          },
          {
            "emoji": "😂",
            "sender": "Andrew Saghian"
          },
          {
            "emoji": "😂",
            "sender": "Holland Stewart"
          },
          {
            "emoji": "😂",
            "sender": "Zack"
          },
          {
            "emoji": "😂",
            "sender": "Hank"
          }
        ]
      },
      "uniqueReactions": [
        "😂",
        "❤️",
        "🤦🏻‍♂️",
        "💯",
        "😮",
        "👍",
        "😬",
        "🙋🏻‍♂️",
        "‼️",
        "🤷🏻‍♂️",
        "🧠",
        "😢",
        "🍆",
        "🇺🇸",
        "🔥",
        "🙈",
        "🇩🇪",
        "🎯",
        "💉",
        "🛢️",
        "🚲",
        "👻",
        "😧",
        "🚨",
        "👏",
        "🎉",
        "📂",
        "🥵",
        "🤫",
        "🕉️",
        "🥴",
        "☣️",
        "🏳️‍🌈",
        "🍊",
        "🧢",
        "👎",
        "😤",
        "🃏",
        "🤑",
        "🇦🇷",
        "🤮",
        "🇰🇷",
        "🫦",
        "💦",
        "💍",
        "💊",
        "✊",
        "🐓",
        "🙄",
        "🫡",
        "🌨️",
        "❤️‍🩹",
        "🍌",
        "❌",
        "🇮🇱",
        "2️⃣",
        "✅",
        "⚒️",
        "💹",
        "🌰",
        "🎃",
        "💩",
        "🐒",
        "⛪",
        "🥸",
        "💪",
        "4️⃣"
      ]
    },
    "a4ca791b-ac2d-4b2b-aff0-ccef8fc9ef23": {
      "totalMessagesSent": 1071,
      "mostPopularDay": "Friday",
      "totalReactionsSent": 481,
      "reactedToMost": {
        "name": "Andrew",
        "count": 71,
        "emoji": "😂"
      },
      "receivedMostReactionsFrom": {
        "name": "Andrew",
        "count": 347,
        "emoji": "😂"
      },
      "mostPopularMessage": {
        "text": "She would have loved this guy we met on Catalina. He was like 5'5\" from Eritrea and his wife was a 6'1\" Norwegian woman who ran the marathon and they now lived on Catalina. She was the bread winner (she worked for NATO or the UN) while he was a stay at home dad.\n\nbonus points for him missing her finish and it took him like an hour of hanging out with us to realize she was faster than our group so he met her at home gave her an edible without telling her and met back up with us",
        "reactionCount": 11,
        "reactions": [
          {
            "emoji": "😂",
            "sender": "Nick"
          },
          {
            "emoji": "😂",
            "sender": "Lorrin Stone"
          },
          {
            "emoji": "😂",
            "sender": "Andrew"
          },
          {
            "emoji": "😂",
            "sender": "Austin Fisher"
          },
          {
            "emoji": "😂",
            "sender": "will hardy"
          },
          {
            "emoji": "😂",
            "sender": "Denver Rogers"
          },
          {
            "emoji": "😂",
            "sender": "James Davis"
          },
          {
            "emoji": "😂",
            "sender": "Andrew Saghian"
          },
          {
            "emoji": "😂",
            "sender": "Holland Stewart"
          },
          {
            "emoji": "😂",
            "sender": "Zack"
          },
          {
            "emoji": "😂",
            "sender": "Hank"
          }
        ]
      },
      "uniqueReactions": [
        "😂",
        "📂",
        "😢",
        "😮",
        "👎",
        "❤️",
        "🔥",
        "3️⃣",
        "👍",
        "🍿",
        "👀",
        "👮‍♂️",
        "🥲",
        "🤦",
        "😐",
        "🫒",
        "😏",
        "🍆",
        "🫡"
      ]
    },
    "efb4532e-3609-4adb-88ac-38f46d16dd1f": {
      "totalMessagesSent": 1598,
      "mostPopularDay": "Thursday",
      "totalReactionsSent": 2444,
      "reactedToMost": {
        "name": "Chris Moffitt",
        "count": 455,
        "emoji": "😂"
      },
      "receivedMostReactionsFrom": {
        "name": "Chris Moffitt",
        "count": 353,
        "emoji": "😂"
      },
      "mostPopularMessage": {
        "text": "￼",
        "reactionCount": 8,
        "reactions": [
          {
            "emoji": "😂",
            "sender": "Andrew"
          },
          {
            "emoji": "❤️",
            "sender": "Austin Fisher"
          },
          {
            "emoji": "😂",
            "sender": "will hardy"
          },
          {
            "emoji": "😂",
            "sender": "Denver Rogers"
          },
          {
            "emoji": "😂",
            "sender": "James Davis"
          },
          {
            "emoji": "😂",
            "sender": "Chris Moffitt"
          },
          {
            "emoji": "😂",
            "sender": "Matt Nelson"
          },
          {
            "emoji": "😂",
            "sender": "Hank"
          }
        ]
      },
      "uniqueReactions": [
        "😂",
        "😮",
        "❤️",
        "🦄",
        "👍",
        "💯",
        "👎",
        "🏔️",
        "📂",
        "😢",
        "🍆",
        "🥳",
        "🇺🇸",
        "🪈",
        "☕",
        "🦆",
        "🐘",
        "🥚",
        "🏖️",
        "🙏",
        "🐭",
        "❤️‍🔥",
        "ℹ️",
        "1️⃣",
        "⬇️",
        "🚓",
        "🤗",
        "🌈",
        "😏",
        "🪿",
        "🤡",
        "🍑",
        "🤮",
        "🦋",
        "🏴‍☠️",
        "❓",
        "😬",
        "🤦‍♂️",
        "🌚",
        "🫣",
        "🤌",
        "🚸",
        "🦨",
        "🫡",
        "🎉",
        "🔢",
        "👹",
        "🐎",
        "🤤",
        "😡",
        "🍎",
        "✂️",
        "👑",
        "😵",
        "8️⃣",
        "🪝",
        "🧽",
        "👃",
        "🦣",
        "🦅",
        "🍌",
        "🖕",
        "🤢",
        "💩",
        "♾️",
        "🥸",
        "📈",
        "😹",
        "🔥",
        "🤯",
        "🏳️‍🌈",
        "🐆",
        "🍗",
        "🍕",
        "📁",
        "🤖",
        "🦒",
        "🏀",
        "🏄",
        "🦶",
        "👂",
        "🛗",
        "⏰",
        "🆗",
        "🙀",
        "😦",
        "🐂",
        "💡",
        "🧐",
        "3️⃣",
        "2️⃣",
        "🤣",
        "⚽",
        "🎨",
        "🐛",
        "🪰",
        "🤓",
        "⛪",
        "❄️",
        "👅",
        "💦",
        "🥺",
        "📉",
        "🫦",
        "7️⃣"
      ]
    },
    "PNI:6ee7b83f-e351-46d2-a944-94f7fcabe356": {
      "totalMessagesSent": 1,
      "mostPopularDay": "Sunday",
      "totalReactionsSent": 0,
      "reactedToMost": null,
      "receivedMostReactionsFrom": null,
      "mostPopularMessage": null,
      "uniqueReactions": []
    },
    "91abab1d-2e83-475a-a44f-4aa50881bfce": {
      "totalMessagesSent": 38,
      "mostPopularDay": "Monday",
      "totalReactionsSent": 10,
      "reactedToMost": {
        "name": "Andrew",
        "count": 4,
        "emoji": "😂"
      },
      "receivedMostReactionsFrom": {
        "name": "James Davis",
        "count": 11,
        "emoji": "😂"
      },
      "mostPopularMessage": {
        "text": "It’s on",
        "reactionCount": 6,
        "reactions": [
          {
            "emoji": "❤️",
            "sender": "Nick"
          },
          {
            "emoji": "❤️",
            "sender": "Lorrin Stone"
          },
          {
            "emoji": "❤️",
            "sender": "Andrew"
          },
          {
            "emoji": "🔥",
            "sender": "Austin Fisher"
          },
          {
            "emoji": "🔥",
            "sender": "James Davis"
          },
          {
            "emoji": "❤️",
            "sender": "Holland Stewart"
          }
        ]
      },
      "uniqueReactions": [
        "👍",
        "🎉",
        "😂",
        "🫨",
        "🌉",
        "🙈"
      ]
    },
    "50957f06-21bd-41fb-b96e-992e0451f88d": {
      "totalMessagesSent": 6,
      "mostPopularDay": "Thursday",
      "totalReactionsSent": 3,
      "reactedToMost": {
        "name": "Chris Moffitt",
        "count": 2,
        "emoji": "👎"
      },
      "receivedMostReactionsFrom": {
        "name": "Chris Moffitt",
        "count": 3,
        "emoji": "😂"
      },
      "mostPopularMessage": {
        "text": "This was the view out my window last night from the thankfully short-lived Sunset Fire",
        "reactionCount": 8,
        "reactions": [
          {
            "emoji": "😬",
            "sender": "Nick"
          },
          {
            "emoji": "😮",
            "sender": "Lorrin Stone"
          },
          {
            "emoji": "😬",
            "sender": "Andrew"
          },
          {
            "emoji": "😮",
            "sender": "Austin Fisher"
          },
          {
            "emoji": "😢",
            "sender": "will hardy"
          },
          {
            "emoji": "😬",
            "sender": "Denver Rogers"
          },
          {
            "emoji": "😮",
            "sender": "James Davis"
          },
          {
            "emoji": "😬",
            "sender": "Holland Stewart"
          }
        ]
      },
      "uniqueReactions": [
        "👍",
        "👎",
        "😂"
      ]
    },
    "0ecdf31e-c2c6-4712-bd23-670da4e793e9": {
      "totalMessagesSent": 839,
      "mostPopularDay": "Monday",
      "totalReactionsSent": 1422,
      "reactedToMost": {
        "name": "Holland Stewart",
        "count": 288,
        "emoji": "😂"
      },
      "receivedMostReactionsFrom": {
        "name": "Andrew",
        "count": 189,
        "emoji": "😂"
      },
      "mostPopularMessage": {
        "text": "Check those missed messages",
        "reactionCount": 11,
        "reactions": [
          {
            "emoji": "😂",
            "sender": "Nick"
          },
          {
            "emoji": "😂",
            "sender": "Lorrin Stone"
          },
          {
            "emoji": "😂",
            "sender": "Andrew"
          },
          {
            "emoji": "😂",
            "sender": "Austin Fisher"
          },
          {
            "emoji": "😂",
            "sender": "Denver Rogers"
          },
          {
            "emoji": "😂",
            "sender": "James Davis"
          },
          {
            "emoji": "😂",
            "sender": "Chris Moffitt"
          },
          {
            "emoji": "😂",
            "sender": "Matt Nelson"
          },
          {
            "emoji": "😂",
            "sender": "Holland Stewart"
          },
          {
            "emoji": "😂",
            "sender": "Zack"
          },
          {
            "emoji": "😂",
            "sender": "Hank"
          }
        ]
      },
      "uniqueReactions": [
        "😂",
        "❤️",
        "😮",
        "💯",
        "💥",
        "🤔",
        "👍",
        "🤦‍♂️",
        "😢",
        "🙏",
        "🤮",
        "😬",
        "📉",
        "🫡",
        "🤑",
        "💪",
        "🤤",
        "🙌",
        "‼️",
        "👌",
        "🚩",
        "😅",
        "🤷‍♂️",
        "🇺🇸",
        "☠️",
        "🥺",
        "🤯",
        "😍",
        "👏",
        "🫶",
        "😵‍💫",
        "📁"
      ]
    },
    "8b6b1420-a267-4667-b2b3-821c8e03f748": {
      "totalMessagesSent": 26,
      "mostPopularDay": "Sunday",
      "totalReactionsSent": 4,
      "reactedToMost": {
        "name": "Austin Fisher",
        "count": 3,
        "emoji": "❤️"
      },
      "receivedMostReactionsFrom": {
        "name": "Nick",
        "count": 2,
        "emoji": "😂"
      },
      "mostPopularMessage": {
        "text": "Definitely my most diverse political group chat tho (as a coastal elite motherfucking lib) so interested to engage and learn!",
        "reactionCount": 5,
        "reactions": [
          {
            "emoji": "😂",
            "sender": "Nick"
          },
          {
            "emoji": "😂",
            "sender": "Andrew"
          },
          {
            "emoji": "😂",
            "sender": "James Davis"
          },
          {
            "emoji": "😂",
            "sender": "Chris Moffitt"
          },
          {
            "emoji": "😂",
            "sender": "Holland Stewart"
          }
        ]
      },
      "uniqueReactions": [
        "😂",
        "❤️"
      ]
    },
    "c17f103a-c92c-4739-b2c9-bab18143a5da": {
      "totalMessagesSent": 358,
      "mostPopularDay": "Monday",
      "totalReactionsSent": 906,
      "reactedToMost": {
        "name": "Holland Stewart",
        "count": 138,
        "emoji": "😂"
      },
      "receivedMostReactionsFrom": {
        "name": "James Davis",
        "count": 114,
        "emoji": "😂"
      },
      "mostPopularMessage": {
        "text": "This is gonna be like when you got addicted to marvel snap but way more disastrous for your life and marriage",
        "reactionCount": 11,
        "reactions": [
          {
            "emoji": "😂",
            "sender": "Nick"
          },
          {
            "emoji": "😂",
            "sender": "Lorrin Stone"
          },
          {
            "emoji": "😂",
            "sender": "Andrew"
          },
          {
            "emoji": "😂",
            "sender": "Austin Fisher"
          },
          {
            "emoji": "😂",
            "sender": "will hardy"
          },
          {
            "emoji": "😂",
            "sender": "Denver Rogers"
          },
          {
            "emoji": "😂",
            "sender": "James Davis"
          },
          {
            "emoji": "😂",
            "sender": "Chris Moffitt"
          },
          {
            "emoji": "😂",
            "sender": "Matt Nelson"
          },
          {
            "emoji": "😂",
            "sender": "Andrew Saghian"
          },
          {
            "emoji": "😂",
            "sender": "Hank"
          }
        ]
      },
      "uniqueReactions": [
        "😂",
        "❤️",
        "⚡",
        "🧠",
        "👍",
        "✡️",
        "💯",
        "👻",
        "🍆",
        "😢",
        "‼️",
        "😮",
        "🇺🇸",
        "🏐",
        "🏴‍☠️",
        "⛽",
        "😬",
        "👎",
        "�",
        "🏀",
        "🍻",
        "🙏",
        "🚨",
        "🔥",
        "🇮🇹",
        "💸",
        "🫡",
        "🚵‍♀️",
        "🥽",
        "⛪",
        "🤑",
        "🗿",
        "🕋",
        "🏳️‍🌈",
        "🔫",
        "💦",
        "😡",
        "✂️",
        "📂",
        "🛢️",
        "🚰",
        "🎶",
        "🥸",
        "🦧",
        "🤓",
        "🧱",
        "🗑️",
        "✝️",
        "👽",
        "🚽",
        "❌",
        "🇮🇱",
        "🔨",
        "🪦",
        "🍑",
        "👑",
        "🍺",
        "🦀",
        "🇮🇩",
        "🥜",
        "🥴",
        "🏈",
        "🤖"
      ]
    }
  },
  "users": [
    {
      "id": "bb46d450-142a-42fe-bedc-7269c063ed01",
      "fromId": "cf29e178-459f-49a0-9936-ac8a7b9c99f5",
      "name": "Allen"
    },
    {
      "id": "5c470283-5af8-4756-991e-95fcab5c0772",
      "fromId": "49fc8acb-fb62-4eae-ab0c-632cd5d25068",
      "name": "Andrew"
    },
    {
      "id": "eddd9597-96a2-4131-8681-01c822340ce1",
      "fromId": "bb8c1805-3d5f-4522-9ed3-0d23b3c29336",
      "name": "Andrew Saghian"
    },
    {
      "id": "c96a7819-49ff-47b9-84d7-c8cfc374297f",
      "fromId": "69b077a2-1445-4c3e-9519-7f9615660fb8",
      "name": "Austin Fisher"
    },
    {
      "id": "0ae5c8ff-6237-4eb1-a78c-1ae2c2b6c88e",
      "fromId": "9e565062-37b9-4e56-8cdf-9387fdc71311",
      "name": "Chris Moffitt"
    },
    {
      "id": "f76388d5-5a98-4daa-bb1a-96fd45ea7b4a",
      "fromId": "9aad85f3-44db-41e2-87f2-1853f4a5b6a6",
      "name": "Citizen Toxxie"
    },
    {
      "id": "69afb978-a9cc-4419-8418-cebb8d801b58",
      "fromId": "9649f7e1-eb6b-4e80-9f06-3fa3ecb9ae57",
      "name": "Dan"
    },
    {
      "id": "a08ce189-5425-45ce-a8d2-f7c0a8db47e4",
      "fromId": "9972774f-c7af-4e8c-8632-781897d63a2d",
      "name": "Denver Rogers"
    },
    {
      "id": "005c39ec-08ba-4434-857e-b21abbe6d9c9",
      "fromId": "f25e55ad-675f-4d26-8bcf-3cb897883309",
      "name": "Hank"
    },
    {
      "id": "a331642f-5c41-4110-a4be-96cef678e448",
      "fromId": "bf214373-2ebf-497a-bbbc-5db4f6474ca1",
      "name": "Holland Stewart"
    },
    {
      "id": "02437289-7909-4aa4-b497-912dca8ccd29",
      "fromId": "9abbc2ce-f8d4-4fb9-a159-5f6ee046769b",
      "name": "James Davis"
    },
    {
      "id": "f3f052b1-52b2-446a-b2b8-ed491fbd7b43",
      "fromId": "32ac2251-bc1f-4b74-b2c8-0adea1649a61",
      "name": "Josh Kursky"
    },
    {
      "id": "b4b4145b-cb94-47c7-856e-30cf0aa0f2fb",
      "fromId": "3a184195-5e71-4a90-ab08-602aeefd49da",
      "name": "Lorrin Stone"
    },
    {
      "id": "a4ca791b-ac2d-4b2b-aff0-ccef8fc9ef23",
      "fromId": "afe18691-0152-4d97-a27e-a6f8b624f368",
      "name": "Matt Nelson"
    },
    {
      "id": "efb4532e-3609-4adb-88ac-38f46d16dd1f",
      "fromId": "06b37aa6-42c7-4e75-9385-b31e97920cbd",
      "name": "Nick"
    },
    {
      "id": "PNI:6ee7b83f-e351-46d2-a944-94f7fcabe356",
      "fromId": "341a7087-1200-4c3b-9c68-da0077e8216c",
      "name": "PNI:6ee7b83f-e351-46d2-a944-94f7fcabe356"
    },
    {
      "id": "91abab1d-2e83-475a-a44f-4aa50881bfce",
      "fromId": "da5cdb00-1b68-41fa-910e-e1b372ba254d",
      "name": "Scott Moreland"
    },
    {
      "id": "50957f06-21bd-41fb-b96e-992e0451f88d",
      "fromId": "904d017b-5fe5-4a24-9d32-4c827fc157a4",
      "name": "Vic Telesino"
    },
    {
      "id": "0ecdf31e-c2c6-4712-bd23-670da4e793e9",
      "fromId": "88ed5b2c-6c3c-4ba8-a05a-6a91f952e1fa",
      "name": "will hardy"
    },
    {
      "id": "8b6b1420-a267-4667-b2b3-821c8e03f748",
      "fromId": "d3809ac6-d885-4e23-9008-cbf9734b6130",
      "name": "Will K."
    },
    {
      "id": "c17f103a-c92c-4739-b2c9-bab18143a5da",
      "fromId": "d1c27e73-1611-4db5-bcad-54163322b7e6",
      "name": "Zack"
    }
  ]
};

const hasSnapshotShape =
    typeof (SNAPSHOT_DATA as any)?.analytics === 'object' &&
    (SNAPSHOT_DATA as any)?.analytics !== null;

const RAW_DATA: RawSnapshotData = (hasSnapshotShape
    ? (SNAPSHOT_DATA as any).analytics
    : (SNAPSHOT_DATA as any)) as RawSnapshotData;

const RAW_USERS: User[] | undefined = hasSnapshotShape ? (SNAPSHOT_DATA as any).users : undefined;
const RAW_INDIVIDUAL_STATS: Record<string, IndividualStatsData> | undefined = hasSnapshotShape
    ? (SNAPSHOT_DATA as any).individualStats
    : undefined;

const includedNames = new Set<string>();

const pushName = (name: unknown) => {
    if (typeof name === 'string' && name.trim().length) {
        includedNames.add(name);
    }
};

(RAW_DATA.topUsersByMessageCount || []).forEach(u => pushName((u as any).name));
(RAW_DATA.topUsersByReactionCount || []).forEach(u => pushName((u as any).name));
(RAW_DATA.funniestUsers || []).forEach(u => pushName((u as any).name));
(RAW_DATA.mostShockingUsers || []).forEach(u => pushName((u as any).name));
(RAW_DATA.mostLovedUsers || []).forEach(u => pushName((u as any).name));
(RAW_DATA.mostDislikedUsers || []).forEach(u => pushName((u as any).name));
(RAW_DATA.mostRandyUsers || []).forEach(u => pushName((u as any).name));
(RAW_DATA.mostThirstyUsers || []).forEach(u => pushName((u as any).name));

Object.values((RAW_DATA.awards || {}) as any).forEach((award: any) => pushName(award?.winner));
Object.keys(RAW_DATA.reactions?.top_emojis_by_author || {}).forEach(name => pushName(name));

const users: User[] = [];
const individualStats: Record<string, IndividualStatsData> = {};

if (RAW_DATA.individual_stats) {
    RAW_DATA.individual_stats.forEach(item => {
        if (item.id) {
            const stats = item.stats as any;
            if (!stats.summary) {
                const summary = getUserSummaryByName(item.name);
                if (summary) {
                    stats.summary = summary;
                }
            }
            individualStats[item.id] = stats as IndividualStatsData;
            users.push({ id: item.id, name: item.name });
        }
    });
} else if (RAW_INDIVIDUAL_STATS && typeof RAW_INDIVIDUAL_STATS === 'object') {
    Object.assign(individualStats, RAW_INDIVIDUAL_STATS);
    if (Array.isArray(RAW_USERS)) {
        users.push(...RAW_USERS);
    } else {
        Object.keys(individualStats).forEach((id: string) => {
            users.push({
                id,
                name: (RAW_DATA.userNamesById && RAW_DATA.userNamesById[id]) ? RAW_DATA.userNamesById[id] : id,
            });
        });
    }
} else {
    Object.entries(RAW_DATA.userNamesById || {}).forEach(([id, name]) => {
        if (!includedNames.has(name)) return;
        users.push({ id, name });
    });
}

users.forEach((u: User) => {
    const s = individualStats[u.id] as any;
    if (!s) return;
    if (!s.summary) {
        const summary = getUserSummaryByName(u.name);
        if (summary) {
            s.summary = summary;
        }
    }
});
users.sort((a, b) => a.name.localeCompare(b.name));

export interface Snapshot {
    analytics: AnalyticsData;
    users: User[];
    individualStats: Record<string, IndividualStatsData>;
}

export const STATIC_SNAPSHOT: Snapshot = {
    analytics: RAW_DATA,
    users: users,
    individualStats: individualStats
};