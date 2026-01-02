import { AnalyticsData, User, IndividualStatsData } from './database';

// ---------------------------------------------------------------------------
// Static Snapshot Data
// ---------------------------------------------------------------------------

type RawSnapshotData = AnalyticsData & { 
    individual_stats?: Array<{ id: string; name: string; stats: IndividualStatsData }>;
};

const RAW_DATA: RawSnapshotData = {
  "all_conversations": [
    {
      "id": "7666311e-a841-4ee2-b0cb-ac92463eb0d5",
      "name": "🍆 Absolute Units 🍆",
      "active_at": "1758782408027",
      "messageCount": 38930,
      "memberCount": 24,
      "avgMessagesPerDay": 393
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
    "total_members": 770
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
      "winner": "Chris Moffitt",
      "count": 5788
    },
    "most_reactions_given": {
      "winner": "Andrew",
      "count": 9007
    },
    "most_reactions_received": {
      "winner": "Holland Stewart",
      "count": 7493
    },
    "most_mentioned": {
      "winner": "Chris Moffitt",
      "count": 289
    },
    "most_mentions_made": {
      "winner": "Denver Rogers",
      "count": 788
    },
    "most_media_sent": {
      "winner": "Nick",
      "count": 874
    },
    "most_night_owl": {
      "winner": "Dan",
      "count": 5.2
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
      "count": 178
    },
    "lurker": {
      "winner": "Andrew",
      "count": 9007
    },
    "most_unique_emojis": {
      "winner": "Nick",
      "count": 216
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
      "totalReacts": 4622,
      "rate": 0.959717607973422,
      "score": 3.5344255937012696
    },
    {
      "name": "Zack",
      "totalReacts": 1435,
      "rate": 0.874466788543571,
      "score": 2.811737034883736
    },
    {
      "name": "Holland Stewart",
      "totalReacts": 5606,
      "rate": 0.6454807138744962,
      "score": 2.5424322324809365
    },
    {
      "name": "Citizen Toxxie",
      "totalReacts": 322,
      "rate": 1.00625,
      "score": 2.5221706888574027
    },
    {
      "name": "Matt Nelson",
      "totalReacts": 3042,
      "rate": 0.6295529801324503,
      "score": 2.3194096628337073
    },
    {
      "name": "Andrew Saghian",
      "totalReacts": 526,
      "rate": 0.7921686746987951,
      "score": 2.2361508816708326
    },
    {
      "name": "Josh Kursky",
      "totalReacts": 84,
      "rate": 1.1506849315068493,
      "score": 2.1508967733890683
    },
    {
      "name": "will hardy",
      "totalReacts": 2077,
      "rate": 0.60413030831879,
      "score": 2.136465860727842
    },
    {
      "name": "Nick",
      "totalReacts": 5525,
      "rate": 0.5282026768642447,
      "score": 2.1231493251987
    },
    {
      "name": "Dan",
      "totalReacts": 121,
      "rate": 0.9758064516129032,
      "score": 2.0461783191449583
    },
    {
      "name": "Lorrin Stone",
      "totalReacts": 1316,
      "rate": 0.5927927927927928,
      "score": 1.9838098662386452
    },
    {
      "name": "Chris Moffitt",
      "totalReacts": 5284,
      "rate": 0.48916867246806145,
      "score": 1.973083547793424
    },
    {
      "name": "Andrew",
      "totalReacts": 5245,
      "rate": 0.4668031327874689,
      "score": 1.890856287614029
    },
    {
      "name": "Will K.",
      "totalReacts": 35,
      "rate": 1.206896551724138,
      "score": 1.7827325487995924
    },
    {
      "name": "James Davis",
      "totalReacts": 4317,
      "rate": 0.4288268600377471,
      "score": 1.7165695663142044
    },
    {
      "name": "Denver Rogers",
      "totalReacts": 2380,
      "rate": 0.3169952051145445,
      "score": 1.228540944099676
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
      "totalReacts": 328,
      "rate": 0.0681063122923588,
      "score": 0.25082033637689666
    },
    {
      "name": "Matt Nelson",
      "totalReacts": 228,
      "rate": 0.04718543046357616,
      "score": 0.17384135539976506
    },
    {
      "name": "will hardy",
      "totalReacts": 147,
      "rate": 0.04275741710296684,
      "score": 0.1512087055979744
    },
    {
      "name": "Zack",
      "totalReacts": 76,
      "rate": 0.04631322364411944,
      "score": 0.14891429592415603
    },
    {
      "name": "Scott Moreland",
      "totalReacts": 10,
      "rate": 0.05747126436781609,
      "score": 0.12891023268312038
    },
    {
      "name": "Chris Moffitt",
      "totalReacts": 303,
      "rate": 0.028050361044251064,
      "score": 0.11314237603735948
    },
    {
      "name": "Nick",
      "totalReacts": 287,
      "rate": 0.027437858508604206,
      "score": 0.11028848078407728
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
      "totalReacts": 201,
      "rate": 0.02677144379328716,
      "score": 0.10375492847228357
    },
    {
      "name": "Andrew",
      "totalReacts": 257,
      "rate": 0.022872908508365968,
      "score": 0.09265015556087806
    },
    {
      "name": "Allen",
      "totalReacts": 7,
      "rate": 0.03867403314917127,
      "score": 0.0874060757784283
    },
    {
      "name": "Holland Stewart",
      "totalReacts": 181,
      "rate": 0.020840529648819803,
      "score": 0.08208709134481797
    },
    {
      "name": "Andrew Saghian",
      "totalReacts": 19,
      "rate": 0.0286144578313253,
      "score": 0.08077351093487799
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
      "totalReacts": 146,
      "rate": 0.01450283103208503,
      "score": 0.058054008960359935
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
      "totalReacts": 27,
      "rate": 0.3698630136986301,
      "score": 0.691359677160772
    },
    {
      "name": "Zack",
      "totalReacts": 320,
      "rate": 0.19500304692260817,
      "score": 0.6270075617859202
    },
    {
      "name": "Vic Telesino",
      "totalReacts": 9,
      "rate": 0.45,
      "score": 0.5949986826302637
    },
    {
      "name": "Austin Fisher",
      "totalReacts": 773,
      "rate": 0.16050664451827243,
      "score": 0.5911101220101864
    },
    {
      "name": "Allen",
      "totalReacts": 44,
      "rate": 0.2430939226519337,
      "score": 0.5494096191786921
    },
    {
      "name": "Lorrin Stone",
      "totalReacts": 313,
      "rate": 0.140990990990991,
      "score": 0.47183319766922177
    },
    {
      "name": "Matt Nelson",
      "totalReacts": 528,
      "rate": 0.10927152317880795,
      "score": 0.40257998092577174
    },
    {
      "name": "Scott Moreland",
      "totalReacts": 30,
      "rate": 0.1724137931034483,
      "score": 0.3867306980493611
    },
    {
      "name": "will hardy",
      "totalReacts": 334,
      "rate": 0.09714950552646888,
      "score": 0.34356263720900304
    },
    {
      "name": "Andrew",
      "totalReacts": 930,
      "rate": 0.08276966892132431,
      "score": 0.3352709909401424
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
      "name": "Holland Stewart",
      "totalReacts": 661,
      "rate": 0.07610823258491652,
      "score": 0.29977661535317496
    },
    {
      "name": "Denver Rogers",
      "totalReacts": 564,
      "rate": 0.07511987213638785,
      "score": 0.2911332321311837
    },
    {
      "name": "Citizen Toxxie",
      "totalReacts": 37,
      "rate": 0.115625,
      "score": 0.2898146443718133
    },
    {
      "name": "Dan",
      "totalReacts": 16,
      "rate": 0.12903225806451613,
      "score": 0.2705690339365234
    },
    {
      "name": "James Davis",
      "totalReacts": 569,
      "rate": 0.05652130724148207,
      "score": 0.22625158286606029
    },
    {
      "name": "Chris Moffitt",
      "totalReacts": 603,
      "rate": 0.055822995741529345,
      "score": 0.22516453052979463
    },
    {
      "name": "Nick",
      "totalReacts": 581,
      "rate": 0.05554493307839388,
      "score": 0.22326692451410768
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
      "totalReacts": 302,
      "rate": 0.04022376132125732,
      "score": 0.15589048954542106
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
      "totalReacts": 132,
      "rate": 0.012219959266802444,
      "score": 0.04928974797667146
    },
    {
      "name": "Nick",
      "totalReacts": 98,
      "rate": 0.009369024856596558,
      "score": 0.037659481243343465
    },
    {
      "name": "James Davis",
      "totalReacts": 81,
      "rate": 0.008046091189033476,
      "score": 0.03220804606704901
    },
    {
      "name": "Matt Nelson",
      "totalReacts": 38,
      "rate": 0.007864238410596027,
      "score": 0.02897355923329418
    },
    {
      "name": "Andrew",
      "totalReacts": 69,
      "rate": 0.0061409754360982555,
      "score": 0.024874944489107337
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
      "name": "a513b3da-0c63-4c29-8e56-793db62b47cc",
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
    },
    {
      "name": "6278c0ad-a870-4558-a26e-0d621e247e45",
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
      "name": "Matt Nelson",
      "totalReacts": 6,
      "rate": 0.0012417218543046358,
      "score": 0.0045747725105201335
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
    "8f58f21b-1c55-41aa-9d00-09addfd539ff": "Ellis Weiner",
    "b032bb4d-6964-49d6-bb89-aef231cff6d3": "Lori Beck",
    "1a8ec426-dc24-47e8-84c7-887e01d785cb": "Lori Beck"
  },
  "individual_stats": [
    {
      "id": "5c470283-5af8-4756-991e-95fcab5c0772",
      "name": "Andrew",
      "stats": {
        "totalMessagesSent": 11236,
        "mostPopularDay": "Tuesday",
        "totalReactionsSent": 17838,
        "reactedToMost": {
          "name": "Holland Stewart",
          "count": 2773,
          "emoji": "😂"
        },
        "receivedMostReactionsFrom": {
          "name": "Chris Moffitt",
          "count": 2838,
          "emoji": "😂"
        },
        "mostPopularMessage": {
          "text": "Who wore it better?",
          "reactionCount": 14,
          "reactions": [
            {
              "emoji": "😂",
              "sender": "Nick"
            },
            {
              "emoji": "😂",
              "sender": "Grace Stewart"
            },
            {
              "emoji": "😂",
              "sender": "Shelby Stewart"
            },
            {
              "emoji": "😂",
              "sender": "Lorrin Stone"
            },
            {
              "emoji": "😂",
              "sender": "Michelle Burns"
            },
            {
              "emoji": "😂",
              "sender": "will hardy"
            },
            {
              "emoji": "😂",
              "sender": "Kara Torbert"
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
              "sender": "Kelly Patton"
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
              "sender": "Scott Moreland"
            }
          ]
        },
        "uniqueReactions": [
          "😂",
          "❤️",
          "🍌",
          "😮",
          "🍑",
          "🥸",
          "👍",
          "💯",
          "‼️",
          "🧀",
          "😢",
          "🏗️",
          "🏀",
          "🖼️",
          "🍝",
          "👨🏻‍⚖️",
          "🦔",
          "🌶️",
          "🦭",
          "🇺🇸",
          "👎",
          "🔥",
          "🔄",
          "⚫",
          "🔺",
          "🍆",
          "🛢️",
          "❓",
          "🫡",
          "👁️",
          "🐜",
          "➡️",
          "🐼",
          "😍",
          "💩",
          "👽",
          "😳",
          "👀",
          "🙀",
          "🎉",
          "✊",
          "😔",
          "🕴️",
          "😏",
          "👻",
          "😡",
          "💪",
          "🙈",
          "🧊",
          "🤞",
          "⚪",
          "🍺",
          "💦",
          "🍒",
          "💣",
          "2️⃣",
          "⬆️",
          "🤦‍♂️",
          "🤙",
          "😌",
          "🤯",
          "⁉️",
          "👋",
          "🇳🇴",
          "🦧",
          "🍣",
          "🍞",
          "🇪🇺",
          "⛵",
          "🍔",
          "🔣",
          "😴",
          "💨",
          "🥴",
          "⛽",
          "➗",
          "🙏",
          "👞",
          "🌭",
          "🛌",
          "🥰",
          "👴",
          "🧘🏻‍♂️",
          "📁",
          "🪙",
          "🥹",
          "0️⃣",
          "🤬",
          "🫦",
          "☎️",
          "🧾",
          "🤔",
          "🦑",
          "🦷",
          "🪨",
          "😬",
          "🧠",
          "🐀",
          "⭐",
          "🛞",
          "💅",
          "⚖️",
          "✝️",
          "👳🏾‍♂️",
          "🕖",
          "🐢",
          "🤨",
          "🧙‍♀️",
          "🫂",
          "🙋‍♂️",
          "🍗",
          "📰",
          "🍼",
          "🚂",
          "🕵️‍♂️",
          "🐅",
          "🥩",
          "🧙🏻",
          "👃",
          "🖕",
          "🥧",
          "🌀",
          "😩",
          "5️⃣",
          "🥕",
          "🔟",
          "🤠",
          "❤️‍🩹",
          "👯",
          "🇸🇩",
          "📂",
          "🟥",
          "🍏",
          "🪱",
          "🏴‍☠️",
          "👁️‍🗨️",
          "🫘",
          "🧆",
          "🐦‍🔥",
          "🎸",
          "👄",
          "😋",
          "🍻",
          "🙂",
          "🧦",
          "9️⃣",
          "7️⃣",
          "🥜",
          "🥲",
          "🏔️",
          "🤦🏻‍♂️",
          "🚢",
          "🎯",
          "🌮",
          "🥪",
          "⬇️",
          "🗿",
          "🎨",
          "🚩",
          "🤦🏾‍♂️",
          "🗑️",
          "🆗",
          "😶‍🌫️",
          "🖐️",
          "🫰",
          "💡",
          "🎄",
          "🪩",
          "3️⃣",
          "6️⃣",
          "1️⃣",
          "🏳️‍🌈"
        ]
      }
    },
    {
      "id": "c96a7819-49ff-47b9-84d7-c8cfc374297f",
      "name": "Austin Fisher",
      "stats": {
        "totalMessagesSent": 4816,
        "mostPopularDay": "Monday",
        "totalReactionsSent": 5541,
        "reactedToMost": {
          "name": "Andrew",
          "count": 778,
          "emoji": "😂"
        },
        "receivedMostReactionsFrom": {
          "name": "Andrew",
          "count": 1584,
          "emoji": "😂"
        },
        "mostPopularMessage": {
          "text": "I shared this in another chat, but my kids observed today's holiday.",
          "reactionCount": 13,
          "reactions": [
            {
              "emoji": "❤️",
              "sender": "Nick"
            },
            {
              "emoji": "😍",
              "sender": "Jessica"
            },
            {
              "emoji": "❤️",
              "sender": "Andrew"
            },
            {
              "emoji": "❤️",
              "sender": "Michelle Burns"
            },
            {
              "emoji": "❤️",
              "sender": "Jackie Stewart"
            },
            {
              "emoji": "❤️",
              "sender": "Dan"
            },
            {
              "emoji": "❤️",
              "sender": "Kara Torbert"
            },
            {
              "emoji": "❤️",
              "sender": "Denver Rogers"
            },
            {
              "emoji": "👍",
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
              "sender": "Holland Stewart"
            },
            {
              "emoji": "❤️",
              "sender": "Zack"
            }
          ]
        },
        "uniqueReactions": [
          "🍗",
          "🌋",
          "😂",
          "👍",
          "❤️",
          "💋",
          "💯",
          "🍀",
          "😮",
          "👏",
          "👊",
          "🍻",
          "🔥",
          "👀",
          "🐶",
          "🐼",
          "🫡",
          "🦆",
          "🎉",
          "✅",
          "👑",
          "😢",
          "🙏",
          "👎",
          "💪",
          "😍",
          "🥳",
          "🍔",
          "🤘",
          "‼️",
          "🏒",
          "🥹",
          "👨‍❤️‍💋‍👨",
          "😎",
          "🕵️‍♂️",
          "2️⃣",
          "😘",
          "😶",
          "⁉️",
          "❔",
          "👨‍🔬",
          "😐",
          "🤞",
          "🤷",
          "❓",
          "🇺🇸",
          "🖐️",
          "🤸‍♂️",
          "🫦",
          "💊",
          "👴",
          "💩",
          "😑",
          "🌚",
          "🐕",
          "🤑",
          "🤐",
          "🤨",
          "🤌",
          "🤷‍♂️",
          "🤔",
          "🚀",
          "👂",
          "🪄",
          "☎️",
          "🍸",
          "💅",
          "🤓",
          "🍌",
          "🌈",
          "🏈",
          "✈️",
          "🐢",
          "🫂",
          "🍁",
          "🇲🇽",
          "🫙",
          "🦃",
          "🧠",
          "🐬",
          "🖕",
          "🥕",
          "🇮🇹",
          "🎄",
          "😭",
          "😶‍🌫️",
          "📁",
          "😬",
          "🍩",
          "👵",
          "🥔",
          "🐍",
          "♟️",
          "🔒",
          "🤝",
          "🍆",
          "🌐",
          "🥜",
          "6️⃣",
          "🚴",
          "📂",
          "🚨",
          "🤮",
          "☝️",
          "💸",
          "👨‍🦲",
          "🛢️",
          "🤙",
          "💦",
          "😽",
          "⛪",
          "🌮",
          "🍃",
          "⚜️",
          "🚙",
          "💣",
          "❄️",
          "9️⃣",
          "🙅",
          "🐅",
          "🚩",
          "🍿",
          "🧽",
          "8️⃣",
          "🛵",
          "😋",
          "🍪",
          "⬆️",
          "🐳",
          "☠️",
          "💰",
          "🫏",
          "🥵",
          "🪱",
          "🌞",
          "7️⃣",
          "😚",
          "🐯",
          "🦐",
          "🏳️‍🌈",
          "🤦",
          "🤖"
        ]
      }
    },
    {
      "id": "0ae5c8ff-6237-4eb1-a78c-1ae2c2b6c88e",
      "name": "Chris Moffitt",
      "stats": {
        "totalMessagesSent": 10802,
        "mostPopularDay": "Tuesday",
        "totalReactionsSent": 15586,
        "reactedToMost": {
          "name": "Andrew",
          "count": 2838,
          "emoji": "😂"
        },
        "receivedMostReactionsFrom": {
          "name": "Nick",
          "count": 2816,
          "emoji": "😂"
        },
        "mostPopularMessage": {
          "text": "i like to think i was elevated to partnership with you all years ago, which is all the partnership i need.  unless this one comes with money, in which case the free market has obviously decided it's more valuable.\n\nthank you so much to all of you--this community keeps me going when work goes completely off the rails.  and particular thanks to ￼ for putting up with the fallout of all the rough days and continually inspiring me to do better.  ❤️",
          "reactionCount": 17,
          "reactions": [
            {
              "emoji": "😂",
              "sender": "Nick"
            },
            {
              "emoji": "❤️",
              "sender": "Jessica"
            },
            {
              "emoji": "❤️",
              "sender": "Shelby Stewart"
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
              "emoji": "❤️",
              "sender": "Michelle Burns"
            },
            {
              "emoji": "❤️",
              "sender": "will hardy"
            },
            {
              "emoji": "❤️",
              "sender": "Kara Torbert"
            },
            {
              "emoji": "❤️",
              "sender": "Denver Rogers"
            },
            {
              "emoji": "❤️",
              "sender": "James Davis"
            },
            {
              "emoji": "❤️",
              "sender": "Kelly Patton"
            },
            {
              "emoji": "❤️",
              "sender": "Matt Nelson"
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
              "sender": "Micah Moreland"
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
          "😮",
          "❤️",
          "👎",
          "👍🏻",
          "💯",
          "🫣",
          "👍",
          "🤣",
          "🤢",
          "😢",
          "🏗️",
          "🧡",
          "❤️‍🔥",
          "‼️",
          "🧐",
          "🔥",
          "⚡",
          "🤔",
          "🍆",
          "🙄",
          "🖕",
          "🫡",
          "🇬🇧",
          "💙",
          "🐼",
          "📨",
          "🦷",
          "🛢️",
          "🇺🇸",
          "🫠",
          "😭",
          "⚠️",
          "😬",
          "😍",
          "🎢",
          "✋",
          "😔",
          "🎺",
          "😏",
          "❓",
          "😘",
          "💀",
          "🫨",
          "💪",
          "💦",
          "🧠",
          "🥹",
          "👀",
          "🐄",
          "🤷",
          "🎉",
          "🙃",
          "🪄",
          "🤯",
          "🦚",
          "🤖",
          "🇫🇷",
          "🔑",
          "⚽",
          "💣",
          "🚤",
          "🍕",
          "😡",
          "🐉",
          "🤦‍♂️",
          "🐨",
          "👥",
          "📂",
          "💤",
          "🔇",
          "👋",
          "👏",
          "🧸",
          "🛞",
          "🤤",
          "🦆",
          "🫦",
          "🦢",
          "🏢",
          "🍪",
          "🇩🇪",
          "🫵",
          "🥳",
          "🤝",
          "😇",
          "😅",
          "🎄",
          "⌛",
          "🙏",
          "😐",
          "🥲",
          "🤨",
          "🫳",
          "🇪🇸",
          "2️⃣",
          "3️⃣",
          "7️⃣",
          "8️⃣",
          "9️⃣",
          "🔟",
          "🕚",
          "🕛",
          "🍌",
          "👨‍⚖️",
          "❤️‍🩹",
          "🥺",
          "🍑",
          "🥔",
          "🫶",
          "🪂",
          "🎠",
          "😖",
          "♻️",
          "⁉️",
          "😳",
          "⬇️",
          "🎯",
          "✂️",
          "🤚",
          "🛋️",
          "😵",
          "🤗",
          "🤬",
          "👆",
          "🤷‍♂️",
          "🫂",
          "⏸️",
          "🧏",
          "🥵",
          "🤮"
        ]
      }
    },
    {
      "id": "a08ce189-5425-45ce-a8d2-f7c0a8db47e4",
      "name": "Denver Rogers",
      "stats": {
        "totalMessagesSent": 7508,
        "mostPopularDay": "Tuesday",
        "totalReactionsSent": 7428,
        "reactedToMost": {
          "name": "Andrew",
          "count": 1330,
          "emoji": "😂"
        },
        "receivedMostReactionsFrom": {
          "name": "James Davis",
          "count": 1324,
          "emoji": "😂"
        },
        "mostPopularMessage": {
          "text": "We got a new hypothetical situation.",
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
          "🍌",
          "😢",
          "😮",
          "👍",
          "💯",
          "👎",
          "🇺🇸",
          "🍆",
          "🖕🏾",
          "🔥",
          "😬",
          "🐌",
          "😖",
          "🤷🏾‍♂️",
          "🤘",
          "😏",
          "🤦🏾‍♂️",
          "❓",
          "🛢️",
          "😐",
          "🫡",
          "🤌",
          "🫦",
          "😎",
          "💨",
          "🌭",
          "📁",
          "🤮",
          "🤔",
          "🧠",
          "🍗",
          "👍🏾",
          "🇲🇽",
          "🥕",
          "🎄",
          "😶‍🌫️",
          "📂",
          "🥁",
          "🏔️",
          "⏹️",
          "🧑‍🍳",
          "💪",
          "9️⃣",
          "😳",
          "🏐",
          "👅",
          "‼️",
          "💅",
          "🙏",
          "🌍",
          "🤨",
          "😍",
          "💅🏽",
          "✝️",
          "🤤",
          "😡",
          "💪🏾",
          "🌐",
          "🦆",
          "🚂",
          "⛪",
          "🖕",
          "🎉",
          "🥲",
          "🗿",
          "😵",
          "🍈",
          "🔟",
          "⚜️",
          "🤫",
          "🏳️‍🌈",
          "🤢",
          "🦍",
          "🫥",
          "🚙",
          "👌",
          "🧽",
          "🃏",
          "🌚",
          "🫧",
          "💥",
          "☺️",
          "🥰",
          "🛵",
          "🎶",
          "💩",
          "🥺",
          "🐳",
          "⏰",
          "🗑️",
          "☕",
          "👀",
          "💦",
          "🪱",
          "💀",
          "🌞",
          "🏃🏾‍➡️"
        ]
      }
    },
    {
      "id": "a331642f-5c41-4110-a4be-96cef678e448",
      "name": "Holland Stewart",
      "stats": {
        "totalMessagesSent": 8685,
        "mostPopularDay": "Monday",
        "totalReactionsSent": 10364,
        "reactedToMost": {
          "name": "Andrew",
          "count": 1613,
          "emoji": "😂"
        },
        "receivedMostReactionsFrom": {
          "name": "Andrew",
          "count": 2773,
          "emoji": "😂"
        },
        "mostPopularMessage": {
          "text": "Just got the announcement email - let’s all give a hearty round of applause to Chris for making partner at BBK! Well done Chris! Beast mode 💪",
          "reactionCount": 18,
          "reactions": [
            {
              "emoji": "❤️",
              "sender": "Nick"
            },
            {
              "emoji": "❤️",
              "sender": "Grace Stewart"
            },
            {
              "emoji": "🙌",
              "sender": "Jessica"
            },
            {
              "emoji": "🎉",
              "sender": "Lorrin Stone"
            },
            {
              "emoji": "❤️",
              "sender": "Andrew"
            },
            {
              "emoji": "🤩",
              "sender": "Michelle Burns"
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
              "sender": "Kara Torbert"
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
              "emoji": "🎉",
              "sender": "Matt Nelson"
            },
            {
              "emoji": "❤️",
              "sender": "Andrew Saghian"
            },
            {
              "emoji": "🎉",
              "sender": "Micah Moreland"
            },
            {
              "emoji": "❤️",
              "sender": "Zack"
            },
            {
              "emoji": "🔥",
              "sender": "Scott Moreland"
            },
            {
              "emoji": "🎉",
              "sender": "Hank"
            },
            {
              "emoji": "🎉",
              "sender": "Alex Hollander"
            }
          ]
        },
        "uniqueReactions": [
          "😂",
          "❤️",
          "👍",
          "💯",
          "😮",
          "‼️",
          "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
          "👀",
          "😡",
          "😐",
          "🦷",
          "🏳️‍🌈",
          "👎",
          "😢",
          "😏",
          "💩",
          "🥳",
          "💪",
          "🍑",
          "🤐",
          "🖕",
          "🤮",
          "🦚",
          "🎉",
          "🤢",
          "😬",
          "🫡",
          "😔",
          "🥴",
          "🎶",
          "🙋‍♂️",
          "☎️",
          "🐭",
          "🤔",
          "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
          "💅",
          "❓",
          "🍆",
          "🔥",
          "🗯️",
          "🙈",
          "🤫",
          "😩",
          "👋",
          "✋",
          "😎",
          "😭",
          "🍗",
          "😒",
          "🍌",
          "🥕",
          "🤦‍♂️",
          "😳",
          "🇮🇹",
          "🫳",
          "🧑‍🍳",
          "📂",
          "🥜",
          "🙏",
          "🙄",
          "😌",
          "🥚",
          "🤩",
          "💦",
          "🥵",
          "🤷‍♂️",
          "🤯",
          "🛢️",
          "🌿",
          "🤨",
          "🤞",
          "🗑️",
          "🧠",
          "🔟",
          "🥺",
          "😱"
        ]
      }
    },
    {
      "id": "02437289-7909-4aa4-b497-912dca8ccd29",
      "name": "James Davis",
      "stats": {
        "totalMessagesSent": 10067,
        "mostPopularDay": "Tuesday",
        "totalReactionsSent": 15245,
        "reactedToMost": {
          "name": "Holland Stewart",
          "count": 2387,
          "emoji": "😂"
        },
        "receivedMostReactionsFrom": {
          "name": "Andrew",
          "count": 2181,
          "emoji": "😂"
        },
        "mostPopularMessage": {
          "text": "Welp, it’s official",
          "reactionCount": 18,
          "reactions": [
            {
              "emoji": "❤️",
              "sender": "Nick"
            },
            {
              "emoji": "❤️",
              "sender": "Grace Stewart"
            },
            {
              "emoji": "❤️",
              "sender": "Jessica"
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
              "emoji": "❤️",
              "sender": "Michelle Burns"
            },
            {
              "emoji": "❤️",
              "sender": "Austin Fisher"
            },
            {
              "emoji": "❤️",
              "sender": "Jackie Stewart"
            },
            {
              "emoji": "👰‍♀️",
              "sender": "Lexi"
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
              "sender": "Chris Moffitt"
            },
            {
              "emoji": "❤️",
              "sender": "Kelly Patton"
            },
            {
              "emoji": "❤️",
              "sender": "Matt Nelson"
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
              "emoji": "🍾",
              "sender": "Scott Moreland"
            }
          ]
        },
        "uniqueReactions": [
          "😂",
          "💰",
          "❤️",
          "🤘",
          "💯",
          "😮",
          "👍",
          "⁉️",
          "🙅‍♂️",
          "😢",
          "🇺🇸",
          "👎",
          "🏗️",
          "🏳️‍🌈",
          "😭",
          "🤡",
          "🤮",
          "0️⃣",
          "🥳",
          "🫡",
          "🤤",
          "🖕",
          "🔥",
          "🥱",
          "🤠",
          "🛸",
          "👨‍🍳",
          "🍆",
          "🚩",
          "🤽‍♂️",
          "☠️",
          "🥉",
          "🌚",
          "🎉",
          "🩸",
          "⛽",
          "💊",
          "🌎",
          "🫳",
          "✋",
          "❄️",
          "⭐",
          "🤕",
          "⚖️",
          "👻",
          "👏",
          "🧙‍♀️",
          "🛐",
          "🙊",
          "🚑",
          "🍌",
          "🤞",
          "🥕",
          "💪",
          "🤫",
          "❤️‍🩹",
          "😏",
          "🏳️",
          "🥁",
          "‼️",
          "🙋‍♂️",
          "🙄",
          "📂",
          "🪽",
          "🔫",
          "🍔",
          "🗑️",
          "😈",
          "🃏",
          "🥵",
          "⛪"
        ]
      }
    },
    {
      "id": "b4b4145b-cb94-47c7-856e-30cf0aa0f2fb",
      "name": "Lorrin Stone",
      "stats": {
        "totalMessagesSent": 2220,
        "mostPopularDay": "Monday",
        "totalReactionsSent": 7224,
        "reactedToMost": {
          "name": "Andrew",
          "count": 1341,
          "emoji": "😂"
        },
        "receivedMostReactionsFrom": {
          "name": "Andrew",
          "count": 628,
          "emoji": "😂"
        },
        "mostPopularMessage": {
          "text": "My Billie Eilish shirt from last weekend found its rightful owner. 12 year-old daughter is pretty excited about it",
          "reactionCount": 11,
          "reactions": [
            {
              "emoji": "😂",
              "sender": "Nick"
            },
            {
              "emoji": "❤️",
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
              "emoji": "❤️",
              "sender": "Denver Rogers"
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
              "emoji": "😂",
              "sender": "Matt Nelson"
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
              "emoji": "😂",
              "sender": "Hank"
            }
          ]
        },
        "uniqueReactions": [
          "😂",
          "😤",
          "❤️",
          "🫡",
          "😮",
          "💯",
          "🇺🇸",
          "👍",
          "🤓",
          "🍑",
          "😢",
          "😬",
          "👎",
          "🛢️",
          "🍻",
          "😣",
          "🙏",
          "👀",
          "👏",
          "🟩",
          "🍌",
          "🖕",
          "💪",
          "🌈",
          "🥴",
          "😆",
          "🤑",
          "🚀",
          "🍆",
          "🍩",
          "🧠",
          "😍",
          "💎",
          "😭",
          "👌",
          "🥵",
          "🤖",
          "😵‍💫",
          "⁉️",
          "🇸🇦",
          "🎉",
          "✨",
          "🤣",
          "👑",
          "👋",
          "💔",
          "🐴",
          "🔥",
          "‼️",
          "👮🏻‍♂️",
          "❤️‍🩹",
          "🦝",
          "🤝",
          "🤞",
          "🙄",
          "🍏",
          "🤏",
          "⚧️",
          "🚓",
          "🐦‍🔥",
          "🫘",
          "🦅",
          "3️⃣",
          "❎",
          "🏔️",
          "⛰️",
          "💭",
          "🧙‍♂️",
          "⤴️",
          "📃",
          "🤔",
          "🔎",
          "🙈",
          "😖",
          "🤦🏻‍♂️",
          "🙋🏻‍♂️",
          "🌽",
          "🤷🏻‍♂️",
          "🇩🇪",
          "💩",
          "🎯",
          "🧃",
          "💉",
          "🇰🇵",
          "🫑",
          "🪀",
          "♻️",
          "🚲",
          "😡",
          "👻",
          "🧂",
          "😧",
          "👹",
          "🇲🇾",
          "🇱🇷",
          "🇵🇷",
          "🇺🇾",
          "🪙",
          "🪆",
          "🚨",
          "🌿",
          "🔟",
          "📂",
          "🤫",
          "🕉️",
          "☣️",
          "🏳️‍🌈",
          "🍊",
          "🧢",
          "😏",
          "🃏",
          "🇦🇷",
          "🤮",
          "🇰🇷",
          "🫦",
          "💦",
          "💍",
          "💊",
          "✊",
          "🐓",
          "🌨️",
          "🍺",
          "❌",
          "🇮🇱",
          "2️⃣",
          "✅",
          "⚒️",
          "💹",
          "🌰",
          "🎃",
          "🐒",
          "⛪",
          "🥸",
          "🪱",
          "4️⃣"
        ]
      }
    },
    {
      "id": "a4ca791b-ac2d-4b2b-aff0-ccef8fc9ef23",
      "name": "Matt Nelson",
      "stats": {
        "totalMessagesSent": 4832,
        "mostPopularDay": "Thursday",
        "totalReactionsSent": 2602,
        "reactedToMost": {
          "name": "Andrew",
          "count": 383,
          "emoji": "😂"
        },
        "receivedMostReactionsFrom": {
          "name": "Andrew",
          "count": 1630,
          "emoji": "😂"
        },
        "mostPopularMessage": {
          "text": "Found either Chris or Nick's reddit",
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
              "sender": "Vic Telesino"
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
          "❤️",
          "👍",
          "😮",
          "🤌",
          "🌮",
          "🌶️",
          "🔥",
          "👎",
          "➡️",
          "🤓",
          "💩",
          "♥️",
          "🦈",
          "🇺🇸",
          "👋",
          "😢",
          "🧠",
          "🎩",
          "😎",
          "💪",
          "🍆",
          "🛢️",
          "⭐",
          "🫡",
          "😤",
          "😭",
          "🥾",
          "🇵🇾",
          "🤦‍♂️",
          "🦤",
          "🎉",
          "🛐",
          "🤦",
          "🍑",
          "🤯",
          "🐎",
          "🤨",
          "🫨",
          "🆗",
          "🤫",
          "😐",
          "💵",
          "🕎",
          "📁",
          "💅",
          "💦",
          "🏔️",
          "💨",
          "🥺",
          "😩",
          "🙏",
          "😳",
          "🙋‍♂️",
          "💯",
          "🦹‍♀️",
          "😏",
          "🫦",
          "👩‍🦯",
          "💰",
          "1️⃣",
          "🚂",
          "❓",
          "🍗",
          "2️⃣",
          "👻",
          "🐕",
          "❗",
          "4️⃣",
          "🤷",
          "🤞",
          "🇨🇦",
          "😈",
          "🤡",
          "😥",
          "🤝",
          "❄️",
          "📂",
          "♟️",
          "🤔",
          "🔣",
          "3️⃣",
          "🍿",
          "👀",
          "😱",
          "👮‍♂️",
          "🥲",
          "🫒",
          "🥵",
          "🙉",
          "🤠",
          "🤭"
        ]
      }
    },
    {
      "id": "efb4532e-3609-4adb-88ac-38f46d16dd1f",
      "name": "Nick",
      "stats": {
        "totalMessagesSent": 10460,
        "mostPopularDay": "Thursday",
        "totalReactionsSent": 15232,
        "reactedToMost": {
          "name": "Chris Moffitt",
          "count": 2816,
          "emoji": "😂"
        },
        "receivedMostReactionsFrom": {
          "name": "Andrew",
          "count": 2504,
          "emoji": "😂"
        },
        "mostPopularMessage": {
          "text": "￼ ?",
          "reactionCount": 10,
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
          "👍",
          "❤️",
          "😂",
          "😮",
          "💯",
          "🥳",
          "🍌",
          "😢",
          "🏔️",
          "💥",
          "🐒",
          "👎",
          "😏",
          "🍆",
          "🫡",
          "🕷️",
          "🦆",
          "🧑‍⚖️",
          "❤️‍🔥",
          "🤘",
          "🇺🇸",
          "🚄",
          "🎣",
          "🤑",
          "🌎",
          "🚩",
          "0️⃣",
          "⚡",
          "📝",
          "🫣",
          "🤦‍♂️",
          "💚",
          "🤯",
          "🤜",
          "🤴",
          "📐",
          "⛏️",
          "🤤",
          "🫵",
          "⬆️",
          "🌈",
          "🐜",
          "🥇",
          "🗺️",
          "🐶",
          "➡️",
          "🫒",
          "🤔",
          "👽",
          "🙄",
          "🪬",
          "🧤",
          "🤫",
          "🖕",
          "🌚",
          "🦈",
          "7️⃣",
          "🦃",
          "😬",
          "💰",
          "❓",
          "🪦",
          "🤗",
          "🏌️",
          "🍨",
          "🥶",
          "🐌",
          "👊",
          "👴",
          "🥺",
          "🤖",
          "🎄",
          "🗣️",
          "🥴",
          "💩",
          "🥹",
          "🙂‍↔️",
          "👑",
          "😱",
          "💀",
          "🚓",
          "1️⃣",
          "💪",
          "🤛",
          "🧐",
          "🙏",
          "9️⃣",
          "🫳🏼",
          "🔥",
          "🐥",
          "🦍",
          "🙌",
          "💨",
          "👀",
          "🤮",
          "🧙‍♂️",
          "🧪",
          "🪓",
          "🪚",
          "🔪",
          "💦",
          "🔣",
          "☮️",
          "🛢️",
          "🐳",
          "⛽",
          "🦄",
          "🫨",
          "🐷",
          "🦇",
          "🍯",
          "👬",
          "🤢",
          "🤌",
          "👁️",
          "🤐",
          "🌭",
          "👏",
          "🥉",
          "🏚️",
          "🦫",
          "🕎",
          "🥩",
          "🧠",
          "💘",
          "🌋",
          "📂",
          "🪄",
          "🥌",
          "🤷‍♂️",
          "😵‍💫",
          "🦅",
          "🍮",
          "❔",
          "🥖",
          "🥐",
          "🦚",
          "🍞",
          "🤽‍♂️",
          "➗",
          "🏳️‍🌈",
          "😎",
          "🍪",
          "🚽",
          "☣️",
          "🍎",
          "⛵",
          "🍛",
          "🤏",
          "📁",
          "🍹",
          "🗿",
          "👻",
          "🤿",
          "🪤",
          "🫥",
          "😉",
          "🤞",
          "🚣",
          "📖",
          "🐣",
          "🇫🇷",
          "⛓️",
          "🩴",
          "🐻",
          "🎅",
          "🐉",
          "🐑",
          "🚭",
          "⭐",
          "⚾",
          "🐮",
          "♾️",
          "🌬️",
          "🚀",
          "🦞",
          "2️⃣",
          "👹",
          "🤪",
          "🦎",
          "😇",
          "💔",
          "🍑",
          "🍗",
          "🤠",
          "😊",
          "🙅",
          "😭",
          "🥚",
          "🦠",
          "🫠",
          "🧮",
          "♟️",
          "🚰",
          "🇮🇹",
          "🥸",
          "🦤",
          "🙈",
          "👂",
          "😋",
          "🇩🇪",
          "🃏",
          "🇮🇳",
          "👵",
          "☕",
          "👱‍♀️",
          "🥾",
          "🐖",
          "😡",
          "🥊",
          "🫦",
          "💎",
          "💜",
          "🫂",
          "🐼",
          "🍔",
          "🐈",
          "🤩",
          "😩",
          "🧀",
          "🦊",
          "🏒",
          "😁",
          "👃",
          "🏖️",
          "🦕",
          "⏰",
          "🐿️",
          "⁉️",
          "5️⃣",
          "🥕",
          "🍳",
          "🦙",
          "🤡",
          "🤬",
          "🚂",
          "☃️",
          "🍕",
          "😶",
          "🦝",
          "🇲🇽",
          "🐴",
          "🖤",
          "3️⃣",
          "🦐",
          "🪠",
          "🐧",
          "🇨🇳",
          "🏏",
          "🙋‍♀️",
          "⏹️",
          "🛖",
          "🦀",
          "🙋‍♂️",
          "🎲",
          "🪈",
          "🐘",
          "👅",
          "6️⃣",
          "🐭",
          "ℹ️",
          "⬇️",
          "🌐",
          "🍇",
          "📚",
          "🦌",
          "🪿",
          "🦷",
          "♻️",
          "🗑️",
          "🛀",
          "🦋",
          "🏴‍☠️",
          "🎎",
          "🦗",
          "🎉",
          "🚸",
          "🦨",
          "🔜",
          "🔢",
          "🐎",
          "😵",
          "✂️",
          "🚔",
          "8️⃣",
          "🇷🇺",
          "🪝",
          "🧽",
          "🫧",
          "🧞‍♂️",
          "⛓️‍💥",
          "🦣",
          "💍",
          "🌟",
          "📈",
          "😹",
          "🧛‍♀️",
          "🐆",
          "🦒",
          "🏀",
          "🏄",
          "🦶",
          "🛗",
          "🆗",
          "🙀",
          "😦",
          "🐂",
          "💡",
          "🤣",
          "⚽",
          "🎨",
          "🐛",
          "🪰",
          "🤓",
          "⛪",
          "❄️",
          "📉"
        ]
      }
    },
    {
      "id": "0ecdf31e-c2c6-4712-bd23-670da4e793e9",
      "name": "will hardy",
      "stats": {
        "totalMessagesSent": 3438,
        "mostPopularDay": "Tuesday",
        "totalReactionsSent": 5950,
        "reactedToMost": {
          "name": "Holland Stewart",
          "count": 1197,
          "emoji": "😂"
        },
        "receivedMostReactionsFrom": {
          "name": "Andrew",
          "count": 883,
          "emoji": "😂"
        },
        "mostPopularMessage": {
          "text": "Guys, we just got another contract with palm springs unified and im super excited and just had to say it ",
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
              "sender": "Andrew"
            },
            {
              "emoji": "🎉",
              "sender": "Austin Fisher"
            },
            {
              "emoji": "❤️",
              "sender": "Denver Rogers"
            },
            {
              "emoji": "🔥",
              "sender": "James Davis"
            },
            {
              "emoji": "🎉",
              "sender": "Chris Moffitt"
            },
            {
              "emoji": "🎉",
              "sender": "Matt Nelson"
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
              "emoji": "🔥",
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
          "😮",
          "👍",
          "💪",
          "😵",
          "😢",
          "💯",
          "😬",
          "🤔",
          "👎",
          "🤤",
          "‼️",
          "🤦‍♂️",
          "🫶",
          "👀",
          "🫡",
          "☠️",
          "😵‍💫",
          "😃",
          "😧",
          "🙌",
          "🍆",
          "😏",
          "🤯",
          "😡",
          "❤️‍🔥",
          "❓",
          "🦵",
          "😍",
          "❄️",
          "✋",
          "🦅",
          "🤑",
          "🤒",
          "☯️",
          "🤐",
          "🤷‍♂️",
          "🏴‍☠️",
          "🇺🇸",
          "🍗",
          "🎄",
          "🔥",
          "🤞",
          "🍊",
          "🥳",
          "🗓️",
          "😱",
          "📉",
          "💥",
          "🙏",
          "🤮",
          "📁",
          "🤘",
          "🏈",
          "👌",
          "🚩",
          "😅",
          "🥺",
          "👏"
        ]
      }
    },
    {
      "id": "c17f103a-c92c-4739-b2c9-bab18143a5da",
      "name": "Zack",
      "stats": {
        "totalMessagesSent": 1641,
        "mostPopularDay": "Thursday",
        "totalReactionsSent": 4019,
        "reactedToMost": {
          "name": "Holland Stewart",
          "count": 772,
          "emoji": "😂"
        },
        "receivedMostReactionsFrom": {
          "name": "Andrew",
          "count": 700,
          "emoji": "😂"
        },
        "mostPopularMessage": {
          "text": "When I open up my deli meat / mozzarella sticks Eevee wakes up, and comes in from the bedroom to beg for some. Tony Soprano of dogs pining for italian meats from the fridge.",
          "reactionCount": 13,
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
              "emoji": "😂",
              "sender": "Andrew"
            },
            {
              "emoji": "❤️",
              "sender": "Michelle Burns"
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
              "sender": "Hank"
            },
            {
              "emoji": "😂",
              "sender": "Alex Hollander"
            }
          ]
        },
        "uniqueReactions": [
          "😂",
          "❤️",
          "🍌",
          "🫡",
          "👍",
          "👽",
          "😮",
          "💯",
          "🏀",
          "😢",
          "⬆️",
          "🧠",
          "🏳️‍🌈",
          "😡",
          "👎",
          "🔪",
          "🏒",
          "🍆",
          "🔥",
          "🐉",
          "🚲",
          "🦶",
          "🤌",
          "😬",
          "🍑",
          "🦧",
          "🇺🇸",
          "🍞",
          "😈",
          "🏅",
          "🌚",
          "🩸",
          "😎",
          "🔨",
          "🤑",
          "👴",
          "📁",
          "🪱",
          "🎉",
          "🍺",
          "🌭",
          "🏈",
          "🤖",
          "💩",
          "😭",
          "🍗",
          "‼️",
          "👃",
          "🐪",
          "🍈",
          "🖕",
          "🥕",
          "🌈",
          "👏",
          "🔫",
          "🇮🇹",
          "🦀",
          "🤮",
          "🧑‍🍳",
          "🎄",
          "🥜",
          "⚽",
          "🤫",
          "👀",
          "🫘",
          "🦃",
          "🍲",
          "🧆",
          "🥁",
          "🏔️",
          "🦇",
          "🦅",
          "🍻",
          "🧊",
          "📉",
          "⏹️",
          "🐶",
          "🏆",
          "🚂",
          "🐻‍❄️",
          "🌋",
          "⚡",
          "✡️",
          "👻",
          "🏐",
          "🏴‍☠️",
          "⛽",
          "🐴",
          "🥛",
          "💀",
          "🗣️",
          "🙏",
          "🚨",
          "💸",
          "🌍",
          "✝️",
          "🤓",
          "🚵‍♀️",
          "🇫🇷",
          "🥽",
          "📂",
          "⛪",
          "🗿",
          "🔟",
          "🕋",
          "💦",
          "✂️",
          "🧮",
          "🏊",
          "🛢️",
          "🛵",
          "🚰",
          "🌿",
          "🎶",
          "🥸",
          "🦴",
          "🍣",
          "🧱",
          "🗑️",
          "☕",
          "🚽",
          "❌",
          "🇮🇱",
          "🪦",
          "🟢",
          "👑",
          "🇮🇩",
          "🥴",
          "🦈",
          "💥",
          "🇬🇧"
        ]
      }
    }
  ]
}

// --- Transformation Logic ---
const users: User[] = [];
const individualStats: Record<string, IndividualStatsData> = {};

if (RAW_DATA.individual_stats) {
    RAW_DATA.individual_stats.forEach(item => {
        if (item.id) {
            const stats = item.stats as any;
            if (!stats.summary) {
                stats.summary = `This is a placeholder summary for ${item.name}.`;
            }
            individualStats[item.id] = stats as IndividualStatsData;
            users.push({ id: item.id, name: item.name });
        }
    });
}
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