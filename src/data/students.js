// Seed students for the crew-matching demo. Like the seeded reviews, these
// stand in for real users until there's a backend — same swap-out seam.

export const SEED_STUDENTS = [
  { id: 's1', name: 'Rafi', avatar: '🎮', interests: ['gaming', 'fastfood', 'movies'] },
  { id: 's2', name: 'Nusrat', avatar: '☕', interests: ['cafe', 'bakery', 'date'] },
  { id: 's3', name: 'Tanvir', avatar: '⚽', interests: ['sports', 'gaming', 'hangout'] },
  { id: 's4', name: 'Sadia', avatar: '🌻', interests: ['cafe', 'park', 'salon'] },
  { id: 's5', name: 'Arif', avatar: '🍔', interests: ['fastfood', 'restaurant', 'sports'] },
  { id: 's6', name: 'Mehedi', avatar: '👾', interests: ['gaming', 'movies', 'fastfood'] },
  { id: 's7', name: 'Raisa', avatar: '🥐', interests: ['bakery', 'cafe', 'hangout'] },
  { id: 's8', name: 'Shakib', avatar: '🏏', interests: ['sports', 'park', 'restaurant'] },
  { id: 's9', name: 'Lamia', avatar: '🎬', interests: ['movies', 'date', 'salon'] },
  { id: 's10', name: 'Fahim', avatar: '🌙', interests: ['hangout', 'park', 'gaming'] },
]

/** First two messages in a fresh crew chat, in the members' voices. */
export const OPENERS = {
  gaming: ['yo. squad for this weekend?', 'im in if we do fifa. loser buys drinks'],
  sports: ['anyone up for booking a slot sunday?', 'need at least 4, whos in'],
  cafe: ['study sesh + coffee this sunday?', 'im there if the wifi holds up'],
  bakery: ['ok hear me out. pastry run.', 'say the time and im there'],
  movies: ['theres a show sunday evening. tickets?', 'only if we get snacks before'],
  park: ['morning walk sunday? before it gets hot', 'if its before 8am count me out'],
  default: ['sunday plans? this place looks good', 'im free after 5, anyone else?'],
}

/** Canned replies the crew cycles through after you say something. */
export const REPLIES = [
  'im down.',
  'sunday after 6 works for me.',
  'ok someone actually book it this time.',
  'bet. loser pays for snacks.',
  'ill bring one more person if thats cool.',
  'send location when youre heading out.',
]
