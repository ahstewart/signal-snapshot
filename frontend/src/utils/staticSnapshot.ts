import { AnalyticsData, User, IndividualStatsData } from './database';

// ---------------------------------------------------------------------------
// Static Snapshot Data
// ---------------------------------------------------------------------------

// We define a temporary type to allow the 'individual_stats' property 
// which is present in your export but not in the strict AnalyticsData interface.
type RawSnapshotData = AnalyticsData & { 
    individual_stats?: Array<{ id: string; name: string; stats: IndividualStatsData }>;
};

const RAW_DATA: RawSnapshotData = {
  "all_conversations": [
    {
      "id": "7666311e-a841-4ee2-b0cb-ac92463eb0d5",
      "name": "🍆Jerking for Bill Seaver🍆",
      "active_at": "1722999171637",
      "messageCount": 9410,
      "memberCount": 18,
      "avgMessagesPerDay": 18,
      "summary": " Annie Drews will start Annie Drew's tomorrow against China the US women's national team coaches will be receiving a strongly worded letter from me. I swear to God if they don't start Annierews tomorrow against Chinese the US US women’s national team coach will be getting a stronglyworded letter."
    }
  ],
  "message_counts": {
    "by_day": {
      "2023-12-16": 7,
      "2023-12-17": 21,
      "2023-12-18": 7,
      "2023-12-19": 29,
      "2023-12-20": 30,
      "2023-12-21": 23,
      "2024-04-12": 106,
      "2024-04-13": 10,
      "2024-04-14": 32,
      "2024-04-15": 7,
      "2024-04-16": 22,
      "2024-04-17": 79,
      "2024-04-18": 72,
      "2024-04-19": 98,
      "2024-04-20": 162,
      "2024-04-21": 73,
      "2024-04-22": 104,
      "2024-04-23": 186,
      "2024-04-24": 40,
      "2024-04-25": 132,
      "2024-04-26": 45,
      "2024-04-27": 22,
      "2024-04-28": 54,
      "2024-04-29": 16,
      "2024-04-30": 93,
      "2024-05-01": 95,
      "2024-05-02": 64,
      "2024-05-03": 80,
      "2024-05-04": 39,
      "2024-05-05": 130,
      "2024-05-06": 97,
      "2024-05-07": 70,
      "2024-05-08": 87,
      "2024-05-09": 53,
      "2024-05-10": 47,
      "2024-05-11": 28,
      "2024-05-12": 62,
      "2024-05-13": 73,
      "2024-05-14": 74,
      "2024-05-15": 65,
      "2024-05-16": 95,
      "2024-05-17": 126,
      "2024-05-18": 44,
      "2024-05-19": 46,
      "2024-05-20": 59,
      "2024-05-21": 220,
      "2024-05-22": 67,
      "2024-05-23": 37,
      "2024-05-24": 218,
      "2024-05-25": 25,
      "2024-05-26": 36,
      "2024-05-27": 11,
      "2024-05-28": 81,
      "2024-05-29": 102,
      "2024-05-30": 132,
      "2024-05-31": 74,
      "2024-06-01": 70,
      "2024-06-02": 25,
      "2024-06-03": 117,
      "2024-06-04": 88,
      "2024-06-05": 37,
      "2024-06-06": 29,
      "2024-06-07": 42,
      "2024-06-08": 11,
      "2024-06-09": 1,
      "2024-06-10": 6,
      "2024-06-11": 29,
      "2024-06-12": 54,
      "2024-06-13": 126,
      "2024-06-14": 174,
      "2024-06-15": 37,
      "2024-06-16": 105,
      "2024-06-17": 37,
      "2024-06-18": 62,
      "2024-06-19": 217,
      "2024-06-20": 133,
      "2024-06-21": 301,
      "2024-06-22": 109,
      "2024-06-23": 127,
      "2024-06-24": 106,
      "2024-06-25": 117,
      "2024-06-26": 129,
      "2024-06-27": 60,
      "2024-06-28": 79,
      "2024-06-29": 31,
      "2024-06-30": 4,
      "2024-07-01": 7,
      "2024-07-02": 1,
      "2024-07-03": 76,
      "2024-07-04": 6,
      "2024-07-05": 54,
      "2024-07-06": 84,
      "2024-07-07": 49,
      "2024-07-09": 26,
      "2024-07-10": 6,
      "2024-07-11": 114,
      "2024-07-12": 70,
      "2024-07-13": 113,
      "2024-07-14": 124,
      "2024-07-15": 90,
      "2024-07-16": 33,
      "2024-07-17": 60,
      "2024-07-18": 86,
      "2024-07-19": 92,
      "2024-07-20": 41,
      "2024-07-21": 85,
      "2024-07-22": 122,
      "2024-07-23": 271,
      "2024-07-24": 122,
      "2024-07-25": 155,
      "2024-07-26": 41,
      "2024-07-27": 82,
      "2024-07-28": 39,
      "2024-07-29": 149,
      "2024-07-30": 89,
      "2024-07-31": 98,
      "2024-08-01": 206,
      "2024-08-02": 41,
      "2024-08-03": 31,
      "2024-08-04": 40,
      "2024-08-05": 125,
      "2024-08-06": 192,
      "2024-08-07": 17
    },
    "by_hour": {
      "10": 2,
      "11": 6,
      "12": 18,
      "13": 84,
      "14": 277,
      "15": 790,
      "16": 679,
      "17": 700,
      "18": 745,
      "19": 500,
      "20": 341,
      "21": 360,
      "22": 516,
      "23": 594,
      "00": 629,
      "01": 799,
      "02": 627,
      "03": 574,
      "04": 617,
      "05": 384,
      "06": 102,
      "07": 31,
      "08": 22,
      "09": 10
    }
  },
  "top_conversations": [
    {
      "name": "🍆Jerking for Bill Seaver🍆",
      "count": 9407
    }
  ],
  "kpis": {
    "total_messages": 9407,
    "total_conversations": 1,
    "avg_messages_per_day": 76,
    "total_members": 512
  },
  "reactions": {
    "total_reactions": 13893,
    "top_emojis": [
      {
        "emoji": "😂",
        "count": 9891
      },
      {
        "emoji": "❤️",
        "count": 1563
      },
      {
        "emoji": "👍",
        "count": 585
      },
      {
        "emoji": "😮",
        "count": 490
      },
      {
        "emoji": "💯",
        "count": 471
      },
      {
        "emoji": "👎",
        "count": 213
      },
      {
        "emoji": "😢",
        "count": 148
      },
      {
        "emoji": "‼️",
        "count": 46
      },
      {
        "emoji": "🍆",
        "count": 27
      },
      {
        "emoji": "🇺🇸",
        "count": 16
      }
    ],
    "top_emojis_by_author": {
      "James Davis": [
        {
          "emoji": "😂",
          "count": 1210
        },
        {
          "emoji": "❤️",
          "count": 193
        },
        {
          "emoji": "💯",
          "count": 150
        }
      ],
      "Nick": [
        {
          "emoji": "😂",
          "count": 1352
        },
        {
          "emoji": "❤️",
          "count": 221
        },
        {
          "emoji": "👍",
          "count": 156
        }
      ],
      "Andrew": [
        {
          "emoji": "😂",
          "count": 1835
        },
        {
          "emoji": "❤️",
          "count": 274
        },
        {
          "emoji": "👍",
          "count": 130
        }
      ],
      "Austin Fisher": [
        {
          "emoji": "😂",
          "count": 490
        },
        {
          "emoji": "❤️",
          "count": 46
        },
        {
          "emoji": "👍",
          "count": 33
        }
      ],
      "Chris Moffitt": [
        {
          "emoji": "😂",
          "count": 1558
        },
        {
          "emoji": "❤️",
          "count": 214
        },
        {
          "emoji": "😮",
          "count": 85
        }
      ],
      "Holland Stewart": [
        {
          "emoji": "😂",
          "count": 998
        },
        {
          "emoji": "❤️",
          "count": 217
        },
        {
          "emoji": "😮",
          "count": 23
        }
      ],
      "will hardy": [
        {
          "emoji": "😂",
          "count": 481
        },
        {
          "emoji": "❤️",
          "count": 46
        },
        {
          "emoji": "👍",
          "count": 33
        }
      ],
      "Andrew Saghian": [
        {
          "emoji": "😂",
          "count": 244
        },
        {
          "emoji": "❤️",
          "count": 16
        },
        {
          "emoji": "😮",
          "count": 6
        }
      ],
      "Dan": [
        {
          "emoji": "😂",
          "count": 12
        },
        {
          "emoji": "❤️",
          "count": 4
        },
        {
          "emoji": "👍",
          "count": 3
        }
      ],
      "Denver Rogers": [
        {
          "emoji": "😂",
          "count": 592
        },
        {
          "emoji": "❤️",
          "count": 168
        },
        {
          "emoji": "👎",
          "count": 38
        }
      ],
      "Hank": [
        {
          "emoji": "😂",
          "count": 184
        },
        {
          "emoji": "❤️",
          "count": 12
        },
        {
          "emoji": "👍",
          "count": 4
        }
      ],
      "Lorrin Stone": [
        {
          "emoji": "😂",
          "count": 488
        },
        {
          "emoji": "❤️",
          "count": 65
        },
        {
          "emoji": "💯",
          "count": 17
        }
      ],
      "Matt Nelson": [
        {
          "emoji": "😂",
          "count": 211
        },
        {
          "emoji": "👍",
          "count": 47
        },
        {
          "emoji": "👎",
          "count": 28
        }
      ],
      "Scott Moreland": [
        {
          "emoji": "❤️",
          "count": 5
        },
        {
          "emoji": "😂",
          "count": 4
        },
        {
          "emoji": "😮",
          "count": 2
        }
      ],
      "Zack": [
        {
          "emoji": "😂",
          "count": 229
        },
        {
          "emoji": "❤️",
          "count": 70
        },
        {
          "emoji": "👍",
          "count": 46
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
      "winner": "0ae5c8ff-6237-4eb1-a78c-1ae2c2b6c88e",
      "count": 1571
    },
    "most_reactions_given": {
      "winner": "Andrew",
      "count": 2550
    },
    "most_reactions_received": {
      "winner": "efb4532e-3609-4adb-88ac-38f46d16dd1f",
      "count": 2158
    },
    "most_mentioned": {
      "winner": "0ae5c8ff-6237-4eb1-a78c-1ae2c2b6c88e",
      "count": 57
    },
    "most_mentions_made": {
      "winner": "efb4532e-3609-4adb-88ac-38f46d16dd1f",
      "count": 128
    },
    "most_media_sent": {
      "winner": "efb4532e-3609-4adb-88ac-38f46d16dd1f",
      "count": 299
    }
  },
  "funniestUsers": [
    {
      "name": "Austin Fisher",
      "totalReacts": 1151,
      "rate": 0.9372964169381107,
      "score": 2.895825909773867
    },
    {
      "name": "Zack",
      "totalReacts": 339,
      "rate": 1.043076923076923,
      "score": 2.6214792813016348
    },
    {
      "name": "Holland Stewart",
      "totalReacts": 1136,
      "rate": 0.7518199867637326,
      "score": 2.3904505855484137
    },
    {
      "name": "will hardy",
      "totalReacts": 469,
      "rate": 0.7663398692810458,
      "score": 2.136142095668524
    },
    {
      "name": "James Davis",
      "totalReacts": 933,
      "rate": 0.6497214484679665,
      "score": 2.0514673848671534
    },
    {
      "name": "Matt Nelson",
      "totalReacts": 538,
      "rate": 0.7032679738562092,
      "score": 2.028385722957309
    },
    {
      "name": "Nick",
      "totalReacts": 1706,
      "rate": 0.5814587593728698,
      "score": 2.0162711070639667
    },
    {
      "name": "Andrew Saghian",
      "totalReacts": 99,
      "rate": 0.9801980198019802,
      "score": 1.9688259109349489
    },
    {
      "name": "Andrew",
      "totalReacts": 1323,
      "rate": 0.5764705882352941,
      "score": 1.9375014388537746
    },
    {
      "name": "Lorrin Stone",
      "totalReacts": 200,
      "rate": 0.7782101167315175,
      "score": 1.8767468528896731
    },
    {
      "name": "Chris Moffitt",
      "totalReacts": 1455,
      "rate": 0.5314097881665449,
      "score": 1.8267700536630802
    },
    {
      "name": "Dan",
      "totalReacts": 39,
      "rate": 0.9069767441860465,
      "score": 1.4905733577432863
    },
    {
      "name": "Josh Kursky",
      "totalReacts": 46,
      "rate": 0.7540983606557377,
      "score": 1.3516396347036013
    },
    {
      "name": "Denver Rogers",
      "totalReacts": 428,
      "rate": 0.23336968375136313,
      "score": 0.7616337172059489
    },
    {
      "name": "Scott Moreland",
      "totalReacts": 13,
      "rate": 0.18571428571428572,
      "score": 0.34380512190497114
    },
    {
      "name": "Hank",
      "totalReacts": 19,
      "rate": 0.13768115942028986,
      "score": 0.29505276235382466
    }
  ],
  "mostShockingUsers": [
    {
      "name": "Matt Nelson",
      "totalReacts": 85,
      "rate": 0.1111111111111111,
      "score": 0.32046986329251154
    },
    {
      "name": "Austin Fisher",
      "totalReacts": 85,
      "rate": 0.06921824104234528,
      "score": 0.21385334694246627
    },
    {
      "name": "Scott Moreland",
      "totalReacts": 7,
      "rate": 0.1,
      "score": 0.18512583487190754
    },
    {
      "name": "Lorrin Stone",
      "totalReacts": 16,
      "rate": 0.0622568093385214,
      "score": 0.15013974823117385
    },
    {
      "name": "Chris Moffitt",
      "totalReacts": 74,
      "rate": 0.02702702702702703,
      "score": 0.09290789276362058
    },
    {
      "name": "Nick",
      "totalReacts": 72,
      "rate": 0.024539877300613498,
      "score": 0.08509467743763517
    },
    {
      "name": "Andrew",
      "totalReacts": 55,
      "rate": 0.023965141612200435,
      "score": 0.0805461671481161
    },
    {
      "name": "will hardy",
      "totalReacts": 17,
      "rate": 0.027777777777777776,
      "score": 0.07742945762551152
    },
    {
      "name": "Dan",
      "totalReacts": 2,
      "rate": 0.046511627906976744,
      "score": 0.07643965937145057
    },
    {
      "name": "Zack",
      "totalReacts": 9,
      "rate": 0.027692307692307693,
      "score": 0.06959679507880447
    },
    {
      "name": "Denver Rogers",
      "totalReacts": 36,
      "rate": 0.019629225736095966,
      "score": 0.06406264911078074
    },
    {
      "name": "Holland Stewart",
      "totalReacts": 25,
      "rate": 0.01654533421575116,
      "score": 0.05260674704111826
    },
    {
      "name": "James Davis",
      "totalReacts": 17,
      "rate": 0.011838440111420613,
      "score": 0.03737936285395671
    },
    {
      "name": "Andrew Saghian",
      "totalReacts": 1,
      "rate": 0.009900990099009901,
      "score": 0.019887130413484333
    }
  ],
  "mostLovedUsers": [
    {
      "name": "Matt Nelson",
      "totalReacts": 196,
      "rate": 0.25620915032679736,
      "score": 0.7389658024156737
    },
    {
      "name": "Zack",
      "totalReacts": 70,
      "rate": 0.2153846153846154,
      "score": 0.5413084061684792
    },
    {
      "name": "Lorrin Stone",
      "totalReacts": 55,
      "rate": 0.2140077821011673,
      "score": 0.5161053845446602
    },
    {
      "name": "Austin Fisher",
      "totalReacts": 159,
      "rate": 0.12947882736156352,
      "score": 0.40003155486884867
    },
    {
      "name": "Holland Stewart",
      "totalReacts": 159,
      "rate": 0.10522832561217736,
      "score": 0.3345789111815121
    },
    {
      "name": "Andrew",
      "totalReacts": 223,
      "rate": 0.09716775599128541,
      "score": 0.3265780958914526
    },
    {
      "name": "James Davis",
      "totalReacts": 134,
      "rate": 0.09331476323119778,
      "score": 0.29463733073118825
    },
    {
      "name": "will hardy",
      "totalReacts": 60,
      "rate": 0.09803921568627451,
      "score": 0.273280438678276
    },
    {
      "name": "Denver Rogers",
      "totalReacts": 140,
      "rate": 0.07633587786259542,
      "score": 0.24913252431970292
    },
    {
      "name": "Andrew Saghian",
      "totalReacts": 12,
      "rate": 0.1188118811881188,
      "score": 0.23864556496181197
    },
    {
      "name": "Dan",
      "totalReacts": 6,
      "rate": 0.13953488372093023,
      "score": 0.22931897811435173
    },
    {
      "name": "Chris Moffitt",
      "totalReacts": 181,
      "rate": 0.06610664718772827,
      "score": 0.22724768365155842
    },
    {
      "name": "Nick",
      "totalReacts": 160,
      "rate": 0.054533060668029994,
      "score": 0.18909928319474484
    },
    {
      "name": "Scott Moreland",
      "totalReacts": 6,
      "rate": 0.08571428571428572,
      "score": 0.15867928703306358
    },
    {
      "name": "Josh Kursky",
      "totalReacts": 3,
      "rate": 0.04918032786885246,
      "score": 0.08815041095893052
    },
    {
      "name": "Hank",
      "totalReacts": 3,
      "rate": 0.021739130434782608,
      "score": 0.04658727826639337
    }
  ],
  "topUsersByMessageCount": [
    {
      "name": "Chris Moffitt",
      "count": 1571
    },
    {
      "name": "Nick",
      "count": 1551
    },
    {
      "name": "Andrew",
      "count": 1302
    },
    {
      "name": "Denver Rogers",
      "count": 1033
    },
    {
      "name": "James Davis",
      "count": 909
    },
    {
      "name": "Holland Stewart",
      "count": 881
    },
    {
      "name": "Austin Fisher",
      "count": 801
    },
    {
      "name": "Matt Nelson",
      "count": 559
    },
    {
      "name": "will hardy",
      "count": 378
    },
    {
      "name": "Zack",
      "count": 156
    }
  ],
  "topUsersByReactionCount": [
    {
      "name": "Andrew",
      "count": 2550
    },
    {
      "name": "Nick",
      "count": 2176
    },
    {
      "name": "Chris Moffitt",
      "count": 2106
    },
    {
      "name": "James Davis",
      "count": 1710
    },
    {
      "name": "Holland Stewart",
      "count": 1312
    },
    {
      "name": "Denver Rogers",
      "count": 851
    },
    {
      "name": "Austin Fisher",
      "count": 680
    },
    {
      "name": "will hardy",
      "count": 612
    },
    {
      "name": "Lorrin Stone",
      "count": 612
    },
    {
      "name": "Zack",
      "count": 406
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
    "256a9d3f-4a02-4367-8d04-95f44f7d990d": "Shelby",
    "0e3f3801-47a2-4c5e-84c8-fe55a4688ae1": "Shelby",
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
    "4c577d0a-0f7f-4c9c-b052-f3fb32b6e63d": "Michelle Wimer",
    "a0b333f7-2ed2-45d9-9c6a-c8360cfaff5a": "Michelle Wimer",
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
    "210cdef4-7e03-4042-89ac-8aa5e5189d3e": "Jessica Puente",
    "21fa67f4-275e-4a60-a653-759de2c4fb79": "Jessica Puente",
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
    "443ff401-890f-4911-b25c-7df396996d91": "Rita Cheetah",
    "8ab4938b-cd23-4d21-974c-a03f800b4454": "Rita Cheetah",
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
    "a035044e-5392-4ae0-bdc4-2a32c009f968": "Melissa Doloksaribu"
  },
  "individual_stats": [
    {
      "id": "5c470283-5af8-4756-991e-95fcab5c0772",
      "name": "Andrew",
      "stats": {
        "totalMessagesSent": 2295,
        "mostPopularDay": "Wednesday",
        "totalReactionsSent": 4391,
        "reactedToMost": {
          "name": "Nick",
          "count": 910,
          "emoji": "😂"
        },
        "receivedMostReactionsFrom": {
          "name": "Chris Moffitt",
          "count": 666,
          "emoji": "😂"
        },
        "mostPopularMessage": {
          "text": "New favorite pic of Penny",
          "reactionCount": 10,
          "reactions": [
            {
              "emoji": "❤️",
              "sender": "Nick"
            },
            {
              "emoji": "😂",
              "sender": "Shelby"
            },
            {
              "emoji": "❤️",
              "sender": "Lorrin Stone"
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
              "emoji": "😂",
              "sender": "Alex Hollander"
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
          "🍞"
        ]
      }
    },
    {
      "id": "c96a7819-49ff-47b9-84d7-c8cfc374297f",
      "name": "Austin Fisher",
      "stats": {
        "totalMessagesSent": 1228,
        "mostPopularDay": "Friday",
        "totalReactionsSent": 1152,
        "reactedToMost": {
          "name": "Nick",
          "count": 177,
          "emoji": "😂"
        },
        "receivedMostReactionsFrom": {
          "name": "Nick",
          "count": 446,
          "emoji": "😂"
        },
        "mostPopularMessage": {
          "text": "Should I wear my Aldi merch tonight? \n1 thumbs up gets the shoes, 5 gets the sweatpants, 10 gets the fanny pack ",
          "reactionCount": 11,
          "reactions": [
            {
              "emoji": "👍",
              "sender": "Nick"
            },
            {
              "emoji": "👍",
              "sender": "Andrew"
            },
            {
              "emoji": "👍",
              "sender": "Dan"
            },
            {
              "emoji": "👍",
              "sender": "Kara Torbert"
            },
            {
              "emoji": "👎",
              "sender": "Denver Rogers"
            },
            {
              "emoji": "👍",
              "sender": "James Davis"
            },
            {
              "emoji": "👍",
              "sender": "Chris Moffitt"
            },
            {
              "emoji": "👍",
              "sender": "Kelly Patton"
            },
            {
              "emoji": "👍",
              "sender": "Andrew Saghian"
            },
            {
              "emoji": "👍",
              "sender": "Holland Stewart"
            },
            {
              "emoji": "👍",
              "sender": "Hank"
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
          "🫦"
        ]
      }
    },
    {
      "id": "0ae5c8ff-6237-4eb1-a78c-1ae2c2b6c88e",
      "name": "Chris Moffitt",
      "stats": {
        "totalMessagesSent": 2738,
        "mostPopularDay": "Wednesday",
        "totalReactionsSent": 3737,
        "reactedToMost": {
          "name": "Nick",
          "count": 731,
          "emoji": "😂"
        },
        "receivedMostReactionsFrom": {
          "name": "Nick",
          "count": 833,
          "emoji": "😂"
        },
        "mostPopularMessage": {
          "text": "Have we?",
          "reactionCount": 11,
          "reactions": [
            {
              "emoji": "😂",
              "sender": "Shelby"
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
              "sender": "Michelle Wimer"
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
              "sender": "Kara Torbert"
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
          "🤖"
        ]
      }
    },
    {
      "id": "a08ce189-5425-45ce-a8d2-f7c0a8db47e4",
      "name": "Denver Rogers",
      "stats": {
        "totalMessagesSent": 1834,
        "mostPopularDay": "Friday",
        "totalReactionsSent": 1741,
        "reactedToMost": {
          "name": "Andrew",
          "count": 342,
          "emoji": "😂"
        },
        "receivedMostReactionsFrom": {
          "name": "Nick",
          "count": 368,
          "emoji": "😂"
        },
        "mostPopularMessage": {
          "text": "The Great Recap \n4/30-Now\nMany days ago…Ana rejoined the signal chat. Code name: Everyone. \nShe needed to know what happened in the chat since she was gone.  \nEveryone just said “a lot.”\nBut one man….One man stepped up.  They say he’s cold as the Rockies.  They say he’ll take you a mile high.  They say he is a source.  This man stepped up and gave in great detail everything that happened in the everyone chat.  No one was confused or asked questions about the “recap”.  It was very clear…..\nSince then he has given everyone a recap.  Here is the story of the everyone chat from 4/30 to now.  \n\nRita is too busy traveling, hiking, taking hobbits to Aisenguard, and looking at a ring while whispering precious.  She is thankful of the last recap because she gets 100 messages.  She wasn’t confused at all.  The last recap was that clear! \n\nNow, we all know Holland poops.  Chris is no longer into Holland.  Knowing and imaging Holland on the toilet, takes him out of that attraction.  \n\nJosh/John wants to go to a VR place that displays boobs.  That…that would be cool. \n\nWe had a Hollander day! Alex had a bday.  Holland sees her as a GOAT.  Holland has never called anyone else a GOAT, just keep that in the back of your head.  Matt had to one up the chant and add an extra Alex.  Besides that, Alex, I hope you had a beautiful day.  \n\nFinn.  Mortal enemies to the new pool guy.  Fire that pool guy.  Finn loved the previous pool guy.  Chris says the previous pool guy don’t serve their area anymore.  But as a source I think Jessica is right and not being dramatic!  The company dissolved and burnt to the ground.  Like Finn legitimately hates that pool guy….Finn hates the way he walks, the way he talks, the way he dresses.  \n\nKid updates:  Elliot rocking the Paw patrol Jacket.  Lookin Fly.  \nRyan wants to sleep in sleeping bag like her aunt Jackie.  Adorable, Daisy joined her too. \nAlso shower goggles.\n\nChris is getting rid of his Tether ball.  They were hoping Finn would get a scholarship but he didn’t.  I don’t know who picked up the tether ball.  I also don’t know what happened with the pool guy.  Chris! Jessica! Update us!\n\nKara! Kara! When it comes to booking…that woman is a booker.  Not just any booker….an advanced Booker!!  But Chris took that thunder from Kara.  Told the group he booked months ago.  Called himself a super booker.  Austin and Shirlee started booking.  Kelly and Dan will be on the same plane with Kara.  So like people started booking. \n\nVote now!\nShelland or Holby! \n\nAustin filled his car up.  Filled it with gas!  Both times came out to 100 dollas! Both times! Crazy coincidence! Wild! Amazing!  Who would have thought!  It is definitely not the credit card limit per fill.  It’s the heavens and earth trying to tell Austin something!\n\nHot dogs.\n\nFor 1500 a month.  Ya can live in Thailand!  It’s like Disneyland.  Both end in “Land”\n\nSpain woman is living with my dad.\n\nMy ex apologized for all the shit she said to me.  Wanted me back.  I said “no.”\n\nJames dropped some pretty uplifting shit to me.  Love ya James!  You’re my GOAT! \n\nShout out to the moms, mothers, women, and mommies 😏\n\nEevee is a 1930s gangster.  She still smuggled alcohol.  Even though it’s legal she still does it!\n\nChris and Will never knew “Rizz” is short for charisma.  That’s it.  Now they know.  Good for you both!\n\nFinna is fixing to.  That’s it.\n\nI met a woman.  Her name is Diana.  I told her my puppydog’s name is Diana.  Pray for me y’all!\n\nPut this in the calendar 05/24 at escape, bday party for Jess!\n\nRemember that time,  you know! When Andrew threw his bday party on my actual bday! That was funny!\n\nWe updated the bdays for all the new people!\n\nChris spread some sheets.  Nick came.  So hard that the AI entered the chat.\n\nRyan is learning to swim but she forgets to breathe!  Will has spare hangar 24 towels willing to give away! I will remember that! Rosie will just jump in and drown in any body of water!  Jessica was just thrown in a river.  She survived….the other kids though….\n\nIt was a very Kong day!  My bday! \n\nI saw a picture of my dad’s Spanish gf.  She living with him right now!  Everyone feels teased about this story.  In Austin and Andrew’s case….they are edging.\n\nWhat’s good for the Goon! Is good for the Gander.  -Chris 2024 colorized \n\nKickball is back! Go there! Mondays!\n\nDouble trouble! A very Jess and Price day!!  Will celebrated by going to South Dakota!\n\nMy coworker laugh at Jess for asking for a cocktail.  Rude.  Anyhow!  Holland called the bat signal!  I appeared. The ladies drank the spritz!\n\nMEL joins the chat!  Welcome to your first recap!\n\nHolland left his card at escape!  Took him all day to pick it up!  Next time I’m buy myself some legos and comic books!\n\nChris makes some damn good cheesecake.  Check his file 1 recipe (69)\n\nAlex is speed, Alex meets sonic and not the hedgehog.  Spoiler alert it was disgusting!!  I’m excited for the next Alex eats food review!\n\nAustin is right.  This chat needs more video content.  I think I found what I will do in the next recap! \n\nWill and Ana slays!  Will workin the big Moreno Valley school district!\n\nWill-I-am!? More like Will-is-succeeding. \n\nElvis sideburns head ass!\n\nPlease watch Shogun!  Then listen to the audiobook.  Then read the actual book! Then jump onto shogun fan base servers and state your opinion!\n\nKickball! Plus Nick AI! Nick AI told us there are at least 3 games in a season of kickball!  Thank you Nick AI!  I didn’t know that!\n\nHolland did 300 steps.  It’s the BBK challenge!\n\nLexi creepin on Holland and Austin!  Watchin them and counting every step.\n\nAustin drops a cooking hack!  Right in the middle of everyone talking about going to the pool party at the pattons!\n\nAustin keeps tryin to sell his feet finder account.  Makes sense with all the kickball news!\n\nHolland jumped from Japan to Ireland.  He askin if we watched peaker blinders!\n\nShelby sends a random gif of a purple woman breathy.  \n\nYes! I watch Bluey at the gym!  Sue me!\n\nKara! Kara!  Not just an advanced booker but a freak! A peak freak!\n\nNick ai now says it is 8-12 games.\n\nA very Nelson day!  It was great getting that airBnB for his bday!\n\nMatt is at least older than 6! And he’s invited to spice girls night!  Matt chose to play basketball though!\n\nSCLERA!!!\n\nHolland is a bumblbee!  Holland wears a sexy bikini! \n\nPuppy poses!  Jess is the head of the adoption center!  I’m actually looking to get another dog.  Happy to get that reminder! I’ll reach out to you!\n\nHolland’s bachelor party. \n\nLexi ask how hockey players keep their teeth.  Holland’s answer:  the bones are their payment and the worms are their dollars.  What’s good for the bone is good for the worm!\n\nImprov night! They host once a month!!  Don’t bring yo kids! One guy always gotta make it sexual.  For no reason!\n\nOnly plans only fans.  The war of the only! Dan was left behind! People were confused on what chat is what! Things got wild!\n\nAlso! Here’s a complaint!  Just post your plans on the only plans!  I don’t want to hear if you can or can’t go!  Do that in here, everyone chat!\n\nI talk about my day and drop a new recap!\n\n\nI hope all of you enjoy this!",
          "reactionCount": 10,
          "reactions": [
            {
              "emoji": "❤️",
              "sender": "Nick"
            },
            {
              "emoji": "❤️",
              "sender": "Jessica Puente"
            },
            {
              "emoji": "🏆",
              "sender": "Shelby"
            },
            {
              "emoji": "🧐",
              "sender": "Melissa Doloksaribu"
            },
            {
              "emoji": "❤️",
              "sender": "Rita Cheetah"
            },
            {
              "emoji": "🎉",
              "sender": "Austin Fisher"
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
              "emoji": "😂",
              "sender": "Holland Stewart"
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
          "🫦"
        ]
      }
    },
    {
      "id": "a331642f-5c41-4110-a4be-96cef678e448",
      "name": "Holland Stewart",
      "stats": {
        "totalMessagesSent": 1511,
        "mostPopularDay": "Wednesday",
        "totalReactionsSent": 2202,
        "reactedToMost": {
          "name": "Nick",
          "count": 361,
          "emoji": "😂"
        },
        "receivedMostReactionsFrom": {
          "name": "Andrew",
          "count": 542,
          "emoji": "😂"
        },
        "mostPopularMessage": {
          "text": "Bout to start calling Will Mr. Pest Control the way he’s got traps for days",
          "reactionCount": 12,
          "reactions": [
            {
              "emoji": "😂",
              "sender": "Jessica Puente"
            },
            {
              "emoji": "😂",
              "sender": "Shelby"
            },
            {
              "emoji": "😂",
              "sender": "Rita Cheetah"
            },
            {
              "emoji": "❤️",
              "sender": "Andrew"
            },
            {
              "emoji": "😂",
              "sender": "will hardy"
            },
            {
              "emoji": "😂",
              "sender": "Dan"
            },
            {
              "emoji": "😂",
              "sender": "Kara Torbert"
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
              "emoji": "😍",
              "sender": "Ana Hardy"
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
          "🎉"
        ]
      }
    },
    {
      "id": "02437289-7909-4aa4-b497-912dca8ccd29",
      "name": "James Davis",
      "stats": {
        "totalMessagesSent": 1436,
        "mostPopularDay": "Friday",
        "totalReactionsSent": 2743,
        "reactedToMost": {
          "name": "Chris Moffitt",
          "count": 470,
          "emoji": "😂"
        },
        "receivedMostReactionsFrom": {
          "name": "Andrew",
          "count": 402,
          "emoji": "😂"
        },
        "mostPopularMessage": {
          "text": "I’m at Disneyland for an adult woman’s birthday party, I may be more drunk right now than I was at any point over the weekend",
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
              "emoji": "😂",
              "sender": "Austin Fisher"
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
              "sender": "Matt Nelson"
            },
            {
              "emoji": "❤️",
              "sender": "Jake Larsen"
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
          "🩸"
        ]
      }
    },
    {
      "id": "b4b4145b-cb94-47c7-856e-30cf0aa0f2fb",
      "name": "Lorrin Stone",
      "stats": {
        "totalMessagesSent": 257,
        "mostPopularDay": "Saturday",
        "totalReactionsSent": 1151,
        "reactedToMost": {
          "name": "Holland Stewart",
          "count": 195,
          "emoji": "😂"
        },
        "receivedMostReactionsFrom": {
          "name": "Nick",
          "count": 82,
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
          "👏"
        ]
      }
    },
    {
      "id": "a4ca791b-ac2d-4b2b-aff0-ccef8fc9ef23",
      "name": "Matt Nelson",
      "stats": {
        "totalMessagesSent": 765,
        "mostPopularDay": "Friday",
        "totalReactionsSent": 552,
        "reactedToMost": {
          "name": "Nick",
          "count": 82,
          "emoji": "😂"
        },
        "receivedMostReactionsFrom": {
          "name": "Andrew",
          "count": 319,
          "emoji": "😂"
        },
        "mostPopularMessage": {
          "text": "Me thinking about everyone who I've ever met or even heard of to validate their anxieties",
          "reactionCount": 10,
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
              "sender": "Kara Torbert"
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
              "sender": "Shirlee Fisher"
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
          "💵"
        ]
      }
    },
    {
      "id": "efb4532e-3609-4adb-88ac-38f46d16dd1f",
      "name": "Nick",
      "stats": {
        "totalMessagesSent": 2934,
        "mostPopularDay": "Saturday",
        "totalReactionsSent": 3948,
        "reactedToMost": {
          "name": "Chris Moffitt",
          "count": 833,
          "emoji": "😂"
        },
        "receivedMostReactionsFrom": {
          "name": "Andrew",
          "count": 910,
          "emoji": "😂"
        },
        "mostPopularMessage": {
          "text": "Can’t wait for Denver to wonder why people keep buying him DK Christmas gifts again this year",
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
              "sender": "Chris Moffitt"
            },
            {
              "emoji": "😂",
              "sender": "Kelly Patton"
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
          "🏳️‍🌈"
        ]
      }
    },
    {
      "id": "0ecdf31e-c2c6-4712-bd23-670da4e793e9",
      "name": "will hardy",
      "stats": {
        "totalMessagesSent": 612,
        "mostPopularDay": "Tuesday",
        "totalReactionsSent": 1018,
        "reactedToMost": {
          "name": "Nick",
          "count": 173,
          "emoji": "😂"
        },
        "receivedMostReactionsFrom": {
          "name": "Andrew",
          "count": 179,
          "emoji": "😂"
        },
        "mostPopularMessage": {
          "text": "https://wayofbeing.co/\n\nHey everyone! I wanted to promote my sister in laws shop in Portland Oregon. She owns a low waste, all natural product store. They have some really cool stuff. No pressure to order, but thought i'd share just in case. ",
          "reactionCount": 11,
          "reactions": [
            {
              "emoji": "❤️",
              "sender": "Nick"
            },
            {
              "emoji": "❤️",
              "sender": "Shelby"
            },
            {
              "emoji": "❤️",
              "sender": "Andrew"
            },
            {
              "emoji": "❤️",
              "sender": "Michelle Wimer"
            },
            {
              "emoji": "❤️",
              "sender": "Kara Torbert"
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
              "sender": "Kelly Patton"
            },
            {
              "emoji": "❤️",
              "sender": "Holland Stewart"
            },
            {
              "emoji": "❤️",
              "sender": "Hank"
            },
            {
              "emoji": "❤️",
              "sender": "Alex Hollander"
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
          "😍"
        ]
      }
    },
    {
      "id": "c17f103a-c92c-4739-b2c9-bab18143a5da",
      "name": "Zack",
      "stats": {
        "totalMessagesSent": 325,
        "mostPopularDay": "Friday",
        "totalReactionsSent": 715,
        "reactedToMost": {
          "name": "Holland Stewart",
          "count": 124,
          "emoji": "😂"
        },
        "receivedMostReactionsFrom": {
          "name": "Andrew",
          "count": 141,
          "emoji": "😂"
        },
        "mostPopularMessage": {
          "text": "Dan trying to remember which ankle to do surgery on",
          "reactionCount": 12,
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
              "sender": "Dan"
            },
            {
              "emoji": "😂",
              "sender": "Kara Torbert"
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
              "sender": "Kelly Patton"
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
              "sender": "Shirlee Fisher"
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
          "🩸"
        ]
      }
    }
  ]
};

// --- Transformation Logic ---
// Automatically transforms the raw data (with individual_stats array) 
// into the interface expected by the app (individualStats map).

const users: User[] = [];
const individualStats: Record<string, IndividualStatsData> = {};

if (RAW_DATA.individual_stats) {
    RAW_DATA.individual_stats.forEach(item => {
        if (item.id) {
            // Populate the stats map for O(1) access
            individualStats[item.id] = item.stats;
            // Add user to the dropdown list
            users.push({ id: item.id, name: item.name });
        }
    });
}

// Sort users alphabetically for better UI
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