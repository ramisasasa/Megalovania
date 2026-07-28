// ─────────────────────────────────────────────────────────────────────────────
// Seed dataset — Bashundhara R/A ONLY.
//
// Everything here sits inside Bashundhara R/A (Blocks A–J) or at Jamuna Future
// Park on its western edge. Nothing from Gulshan, Banani or Baridhara: if it
// isn't walkable-or-a-short-rickshaw from IUB, it doesn't belong in the demo.
//
// ACCURACY — please read before demoing:
//   • Coordinates are approximate to the block, not surveyed.
//   • Names marked [VERIFY] below are plausible placeholders I could not
//     confirm — swap them for real ones you know. Everything else is a chain or
//     landmark I'm reasonably confident has a Bashundhara presence, but the
//     exact branch/block is still worth a check.
//   [VERIFY]: Kludge Café, Burger Xpress, Khana's Kitchen, Sizzle & Spice,
//             Bhooter Adda, Rooftop Nine, Spotlight Gaming, Gamers Arena,
//             Battleground Esports, JAFF, Kick Off Arena, The Turf Arena,
//             Play On Turf, Block G Playground, Sharp Cuts, The Grooming Room,
//             Glow Beauty Parlour
//   NOTE: Sports Arena is deliberately absent — it's in Mirpur, and this set is
//         Bashundhara-only. JAFF is the local turf that replaced it here.
//
// Prices are BDT per person. Where a venue charges by the hour for a whole
// group (turf, courts), priceMin/Max are the PER-PERSON share and `priceNote`
// records the real booking rate — so the budget slider stays meaningful.
// ─────────────────────────────────────────────────────────────────────────────

export const CITY = {
  name: 'Dhaka',
  area: 'Bashundhara R/A',
  currency: '৳',
  center: { lat: 23.8148, lng: 90.4257 }, // IUB, Block B
  anchorLabel: 'IUB — Independent University, Bangladesh',
}

// Kept deliberately tight. Turf lives under Sports; parlours live under Salon.
export const CATEGORIES = [
  { id: 'cafe', label: 'Cafés', icon: '☕' },
  { id: 'bakery', label: 'Bakery', icon: '🥐' },
  { id: 'restaurant', label: 'Restaurants', icon: '🍽️' },
  { id: 'fastfood', label: 'Fast Food', icon: '🍔' },
  { id: 'gaming', label: 'Gaming', icon: '🎮' },
  { id: 'sports', label: 'Sports & Turf', icon: '⚽' },
  { id: 'movies', label: 'Movies', icon: '🎬' },
  { id: 'park', label: 'Parks', icon: '🌳' },
  { id: 'hangout', label: 'Hangout', icon: '🛋️' },
  { id: 'date', label: 'Date Spot', icon: '💐' },
  { id: 'salon', label: 'Salon', icon: '💈' },
]

export const SEED_PLACES = [
  // ── Cafés ────────────────────────────────────────────────────────────────
  {
    id: 'p1',
    name: 'North End Coffee Roasters',
    category: ['cafe', 'date'],
    tags: ['coffee', 'espresso', 'quiet', 'wifi', 'study', 'pastry', 'cake'],
    lat: 23.8171, lng: 90.4243,
    priceMin: 250, priceMax: 600,
    hours: { open: 8, close: 22 },
    blurb: 'Proper third-wave coffee in Block C. The one to pick when you actually need to work.',
    reviews: [
      { user: 'Tanvir H.', stars: 5, body: 'Best flat white in Bashundhara, no contest. Outlets at almost every table and the wifi actually holds up. I finished an entire thesis chapter here.', date: '2026-06-14' },
      { user: 'Nusrat J.', stars: 4, body: 'Coffee is excellent and the almond croissant is genuinely good. Only complaint is it gets packed after 5pm and you will not find a seat.', date: '2026-07-02' },
      { user: 'Raisa K.', stars: 2, body: 'Overpriced for what it is. 450 taka for a coffee and a small pastry felt steep, and the staff forgot my order twice.', date: '2026-05-28' },
    ],
  },
  {
    id: 'p2',
    name: 'Crimson Cup Coffee',
    category: ['cafe', 'hangout'],
    tags: ['coffee', 'wifi', 'study', 'quiet', 'sandwich', 'cake', 'cheap'],
    lat: 23.8156, lng: 90.4268,
    priceMin: 200, priceMax: 500,
    hours: { open: 9, close: 23 },
    blurb: 'Five minutes from the IUB gate. Half the campus does group work here.',
    reviews: [
      { user: 'Sadia R.', stars: 5, body: 'Closest decent cafe to IUB. Big tables, nobody rushes you out, and the cold coffee is solid for the price.', date: '2026-07-11' },
      { user: 'Arif M.', stars: 4, body: 'Reliable. Not amazing food but the coffee does the job and it is cheap enough to come every day.', date: '2026-06-30' },
      { user: 'Mehedi A.', stars: 3, body: 'Fine but very loud in the evenings. Do not come here expecting to study after 6.', date: '2026-07-19' },
    ],
  },
  {
    id: 'p3',
    name: 'Kludge Café',
    category: ['cafe'],
    tags: ['coffee', 'study', 'wifi', 'quiet', 'cheap', 'sandwich'],
    lat: 23.8188, lng: 90.4262,
    priceMin: 180, priceMax: 450,
    hours: { open: 9, close: 22 },
    blurb: 'Block D. Small, quiet, and nobody minds if you sit for three hours with one coffee.',
    reviews: [
      { user: 'Ifaz R.', stars: 4, body: 'The quietest cafe in Bashundhara by a distance. Perfect before exams, and 180 taka for a filter coffee is fair.', date: '2026-07-16' },
      { user: 'Samiha K.', stars: 4, body: 'Tiny place but the wifi is fast and the staff leave you alone. Food menu is limited though.', date: '2026-06-27' },
      { user: 'Zawad H.', stars: 2, body: 'Only four tables so if you arrive after 4pm there is nowhere to sit. Frustrating.', date: '2026-07-09' },
    ],
  },
  {
    id: 'p4',
    name: "Gloria Jean's Coffees",
    category: ['cafe', 'hangout'],
    tags: ['coffee', 'mall', 'dessert', 'frappe', 'ac'],
    lat: 23.8133, lng: 90.4251,
    priceMin: 300, priceMax: 700,
    hours: { open: 10, close: 22 },
    blurb: 'Inside Jamuna Future Park. Convenient mid-shopping stop, mall prices.',
    reviews: [
      { user: 'Farhan S.', stars: 4, body: 'Good iced drinks and a decent place to sit when the mall gets overwhelming. Chocolate chiller is worth it.', date: '2026-06-21' },
      { user: 'Ishrat P.', stars: 2, body: 'Mall pricing for average coffee. Tables were sticky and nobody cleaned them the whole time we sat there.', date: '2026-07-05' },
    ],
  },

  // ── Bakery ───────────────────────────────────────────────────────────────
  {
    id: 'p5',
    name: "Cooper's",
    category: ['bakery', 'cafe'],
    tags: ['pastry', 'cake', 'dessert', 'croissant', 'birthday', 'patties', 'cheap'],
    lat: 23.8151, lng: 90.4238,
    priceMin: 80, priceMax: 350,
    hours: { open: 9, close: 22 },
    blurb: 'Block B. The default answer when someone says "pastry" around here.',
    reviews: [
      { user: 'Rifat K.', stars: 5, body: 'Their chocolate pastry is the one I grew up on and it still holds. Cheap, consistent, always fresh in the evening.', date: '2026-07-16' },
      { user: 'Anika S.', stars: 4, body: 'Great value. 120 taka for a proper slice. The patties sell out fast so go early.', date: '2026-06-25' },
      { user: 'Shafin R.', stars: 3, body: 'Solid but the seating area is cramped and a bit dated. Better as a takeaway.', date: '2026-07-01' },
    ],
  },
  {
    id: 'p6',
    name: 'Mr. Baker',
    category: ['bakery'],
    tags: ['pastry', 'cake', 'bread', 'cheap', 'dessert', 'takeaway'],
    lat: 23.8192, lng: 90.4271,
    priceMin: 60, priceMax: 300,
    hours: { open: 8, close: 22 },
    blurb: 'Block D. Cheap, everywhere, and the black forest is better than it has any right to be.',
    reviews: [
      { user: 'Junaid A.', stars: 4, body: 'Unbeatable on price. 90 taka pastries that taste fine. Not gourmet but perfect for a quick sugar fix between classes.', date: '2026-07-20' },
      { user: 'Meherun N.', stars: 3, body: 'Hit or miss depending on time of day. Evening stock is fresher than the afternoon leftovers.', date: '2026-06-11' },
    ],
  },
  {
    id: 'p7',
    name: 'Bread & Beyond',
    category: ['bakery', 'cafe'],
    tags: ['pastry', 'croissant', 'bread', 'coffee', 'cake', 'brownie'],
    lat: 23.8142, lng: 90.4292,
    priceMin: 120, priceMax: 450,
    hours: { open: 9, close: 21 },
    blurb: 'Block C. Actual laminated pastry — croissants come out around 10am.',
    reviews: [
      { user: 'Ayesha M.', stars: 5, body: 'The only place in Bashundhara doing a genuinely flaky croissant. Get there before noon or they are gone.', date: '2026-07-18' },
      { user: 'Rakib H.', stars: 4, body: 'Brownies are dense and proper. Slightly pricier than Coopers but you can taste why.', date: '2026-06-29' },
      { user: 'Sumaiya B.', stars: 2, body: 'Went at 7pm and everything left was stale. Great if you go early, waste of a trip if you do not.', date: '2026-07-09' },
    ],
  },
  {
    id: 'p8',
    name: 'Bakers Lounge',
    category: ['bakery', 'date'],
    tags: ['pastry', 'cake', 'dessert', 'coffee', 'ac', 'quiet'],
    lat: 23.8176, lng: 90.4216,
    priceMin: 150, priceMax: 500,
    hours: { open: 10, close: 22 },
    blurb: 'Block A. Sit-down bakery café — better for lingering than grabbing and going.',
    reviews: [
      { user: 'Tahmid Z.', stars: 4, body: 'Red velvet is very good and the place is calm on weekday afternoons. Nice for a low key date.', date: '2026-07-12' },
      { user: 'Oishee D.', stars: 3, body: 'Pastries are good, coffee is mediocre. Come for the cake, not the drinks.', date: '2026-06-19' },
    ],
  },

  // ── Fast food ────────────────────────────────────────────────────────────
  {
    id: 'p9',
    name: 'Chillox',
    category: ['fastfood', 'hangout'],
    tags: ['burger', 'cheap', 'friends', 'late night', 'fries'],
    lat: 23.8168, lng: 90.4241,
    priceMin: 250, priceMax: 500,
    hours: { open: 12, close: 23 },
    blurb: 'Block C. Burger chain that basically runs on IUB and NSU money.',
    reviews: [
      { user: 'Sabbir A.', stars: 4, body: 'Naga burger is a rite of passage. Good portions for 300 taka and always full of students.', date: '2026-07-15' },
      { user: 'Prottoy R.', stars: 4, body: 'Consistent and fast. Fries are nothing special but the burgers deliver.', date: '2026-06-27' },
      { user: 'Adiba S.', stars: 2, body: 'Way too loud and the tables are packed together. Ordered a chicken burger and it came out dry and cold.', date: '2026-07-07' },
    ],
  },
  {
    id: 'p10',
    name: 'Madchef',
    category: ['fastfood', 'restaurant'],
    tags: ['burger', 'rice bowl', 'friends', 'ac', 'wings'],
    lat: 23.8129, lng: 90.4227,
    priceMin: 350, priceMax: 700,
    hours: { open: 12, close: 23 },
    blurb: 'A step up from the usual burger places. Rice bowls are the sleeper pick.',
    reviews: [
      { user: 'Ryan M.', stars: 5, body: 'Chicken rice bowl is criminally underrated. Better value than the burgers and it actually fills you up.', date: '2026-07-17' },
      { user: 'Zarin T.', stars: 4, body: 'Cleaner and calmer than Chillox. Slightly more expensive but worth it if you want to hear yourself talk.', date: '2026-06-22' },
    ],
  },
  {
    id: 'p11',
    name: 'Takeout',
    category: ['fastfood'],
    tags: ['burger', 'sandwich', 'cheap', 'quick', 'takeaway'],
    lat: 23.8153, lng: 90.4264,
    priceMin: 200, priceMax: 450,
    hours: { open: 12, close: 22 },
    blurb: 'Block B, right by campus. Quick, cheap, no atmosphere whatsoever.',
    reviews: [
      { user: 'Fahim K.', stars: 3, body: 'Does the job between classes. Nothing memorable but never bad either.', date: '2026-07-04' },
      { user: 'Samira Q.', stars: 4, body: 'Good value chicken sandwich. Seating is minimal so plan to take it away.', date: '2026-06-16' },
    ],
  },
  {
    id: 'p12',
    name: 'Pizzaburg',
    category: ['fastfood', 'hangout'],
    tags: ['pizza', 'friends', 'group', 'cheap', 'sharing'],
    lat: 23.8185, lng: 90.4252,
    priceMin: 300, priceMax: 800,
    hours: { open: 12, close: 23 },
    blurb: 'Block D. Large pizzas at a price a group of students can actually split.',
    reviews: [
      { user: 'Nayeem H.', stars: 4, body: 'Family size pizza split four ways comes to about 250 each. Hard to beat for a group.', date: '2026-07-10' },
      { user: 'Tisha R.', stars: 3, body: 'Pizza is fine, base is a bit bready. Good for groups, not for a proper meal.', date: '2026-06-24' },
    ],
  },
  {
    id: 'p13',
    name: 'Burger Xpress',
    category: ['fastfood'],
    tags: ['burger', 'cheap', 'quick', 'late night', 'takeaway'],
    lat: 23.8145, lng: 90.4260,
    priceMin: 150, priceMax: 350,
    hours: { open: 12, close: 24 },
    blurb: 'Hole in the wall by the IUB gate. Cheapest proper burger within walking distance.',
    reviews: [
      { user: 'Nafis T.', stars: 4, body: 'A beef burger here is 180 taka and it is genuinely decent. Open late which saves you after evening classes.', date: '2026-07-21' },
      { user: 'Rezwan A.', stars: 3, body: 'Cheap and fast, but there is nowhere to sit and the queue at 2pm is long.', date: '2026-06-30' },
    ],
  },

  // ── Restaurants ──────────────────────────────────────────────────────────
  {
    id: 'p14',
    name: "Sultan's Dine",
    category: ['restaurant', 'hangout'],
    tags: ['kacchi', 'biryani', 'group', 'dinner', 'bengali', 'celebration'],
    lat: 23.8138, lng: 90.4256,
    priceMin: 400, priceMax: 800,
    hours: { open: 12, close: 23 },
    blurb: 'Kacchi that people argue about on the internet. Book ahead on weekends.',
    reviews: [
      { user: 'Asif R.', stars: 5, body: 'Still the benchmark for kacchi. The mutton is tender and the borhani is right. Worth the wait.', date: '2026-07-13' },
      { user: 'Mahin U.', stars: 4, body: 'Very good but portions have shrunk over the years. Still the first place I take out of town guests.', date: '2026-06-20' },
      { user: 'Rehnuma A.', stars: 2, body: 'Waited an hour on a Friday for a table and the rice was under seasoned. Overhyped for the price.', date: '2026-07-06' },
    ],
  },
  {
    id: 'p15',
    name: 'Kacchi Bhai',
    category: ['restaurant'],
    tags: ['kacchi', 'biryani', 'cheap', 'bengali', 'quick', 'dinner'],
    lat: 23.8197, lng: 90.4244,
    priceMin: 300, priceMax: 550,
    hours: { open: 12, close: 23 },
    blurb: 'Block D. Cheaper kacchi, faster turnaround, less ceremony.',
    reviews: [
      { user: 'Shihab M.', stars: 4, body: 'Better value than Sultans honestly. You get out in 30 minutes and it costs half as much.', date: '2026-07-19' },
      { user: 'Nusaiba K.', stars: 3, body: 'Decent kacchi but the seating is cramped and it always smells like the kitchen.', date: '2026-06-13' },
    ],
  },
  {
    id: 'p16',
    name: "Khana's Kitchen",
    category: ['restaurant'],
    tags: ['bengali', 'rice', 'curry', 'cheap', 'lunch', 'quick', 'dinner'],
    lat: 23.8159, lng: 90.4232,
    priceMin: 150, priceMax: 350,
    hours: { open: 11, close: 23 },
    blurb: 'Block B. Home-style Bengali rice and curry. Where you eat when the budget is real.',
    reviews: [
      { user: 'Tanjim B.', stars: 4, body: 'Full plate of rice, dal, bhaji and fish for under 200 taka. This is what actually keeps students alive.', date: '2026-07-14' },
      { user: 'Rumana I.', stars: 4, body: 'Simple food done properly. The beef bhuna is excellent and it never takes long.', date: '2026-06-26' },
      { user: 'Sajid H.', stars: 2, body: 'Food is fine but the place is not clean enough for me to want to sit inside. I get it packed now.', date: '2026-07-08' },
    ],
  },
  {
    id: 'p17',
    name: 'Bhooter Adda',
    category: ['restaurant', 'hangout'],
    tags: ['bengali', 'cha', 'friends', 'group', 'evening', 'cheap', 'late night'],
    lat: 23.8211, lng: 90.4288,
    priceMin: 120, priceMax: 400,
    hours: { open: 15, close: 24 },
    blurb: 'Block E. Themed adda spot — cha, snacks, and nobody hurrying you out.',
    reviews: [
      { user: 'Ornob D.', stars: 4, body: 'Great place to sit with friends for hours. The theme is a bit much but the cha and singara are cheap and good.', date: '2026-07-17' },
      { user: 'Mim A.', stars: 3, body: 'Fun atmosphere, mediocre food. Come for the sitting, not the eating.', date: '2026-06-28' },
    ],
  },
  {
    id: 'p18',
    name: 'Sizzle & Spice',
    category: ['restaurant', 'date'],
    tags: ['indian', 'curry', 'dinner', 'group', 'ac', 'quiet'],
    lat: 23.8203, lng: 90.4266,
    priceMin: 450, priceMax: 1000,
    hours: { open: 12, close: 23 },
    blurb: 'Block D. Sit-down North Indian — the closest thing to a proper dinner in the area.',
    reviews: [
      { user: 'Kamrul I.', stars: 4, body: 'Butter chicken and naan done properly. Slightly expensive for Bashundhara but the quality is there.', date: '2026-06-18' },
      { user: 'Sanjida P.', stars: 4, body: 'Good for a family dinner. Quiet enough to actually have a conversation, which is rare around here.', date: '2026-07-11' },
      { user: 'Faiyaz H.', stars: 2, body: 'Service was slow and they got our order wrong twice. Food was good when it finally arrived.', date: '2026-07-03' },
    ],
  },

  // ── Gaming ───────────────────────────────────────────────────────────────
  {
    id: 'p19',
    name: 'Spotlight Gaming',
    category: ['gaming', 'hangout'],
    tags: ['gaming', 'pc', 'console', 'fifa', 'ps5', 'esports', 'valorant', 'friends', 'hourly', 'late night', 'cheap'],
    lat: 23.8153, lng: 90.4263,
    priceMin: 100, priceMax: 280,
    priceNote: 'per hour',
    hours: { open: 11, close: 24 },
    blurb: 'Two minutes from the IUB gate. RTX rigs, a PS5 corner, and the cheapest hourly rate around.',
    reviews: [
      { user: 'Rafsan K.', stars: 5, body: 'Closest gaming cafe to campus and honestly the best one. 120 an hour, the PCs run everything at high settings, and the PS5 corner always has FIFA going.', date: '2026-07-22' },
      { user: 'Anindya R.', stars: 5, body: 'I basically live here between classes. Staff are chill about letting you stay, AC actually works, and they have proper gaming chairs.', date: '2026-07-19' },
      { user: 'Tahmid H.', stars: 4, body: 'Great value and very close to IUB. Gets crowded around 4pm when classes end so come earlier if you want a good machine.', date: '2026-07-06' },
      { user: 'Sabbir N.', stars: 2, body: 'Two of the machines had sticky keyboards and nobody seemed bothered when I mentioned it.', date: '2026-06-29' },
    ],
  },
  {
    id: 'p20',
    name: 'Gamers Arena',
    category: ['gaming'],
    tags: ['gaming', 'pc', 'esports', 'valorant', 'cs2', 'fifa', 'console', 'friends', 'hourly'],
    lat: 23.8177, lng: 90.4259,
    priceMin: 120, priceMax: 300,
    priceNote: 'per hour',
    hours: { open: 11, close: 23 },
    blurb: 'Block C. Decent rigs, hourly rate, cheaper if you book a block of time.',
    reviews: [
      { user: 'Sami A.', stars: 4, body: '150 an hour for a machine that actually runs Valorant at high fps. Peripherals are in good shape.', date: '2026-07-14' },
      { user: 'Rafid H.', stars: 4, body: 'Solid PC cafe. Gets full after 6pm so book if you are coming with friends.', date: '2026-06-28' },
      { user: 'Nirjhor D.', stars: 2, body: 'AC was broken the day I went and it was unbearable. Three of the machines had dead headsets.', date: '2026-07-08' },
    ],
  },
  {
    id: 'p21',
    name: 'Battleground Esports Café',
    category: ['gaming'],
    tags: ['gaming', 'pc', 'console', 'fifa', 'ps5', 'esports', 'tournament', 'friends', 'hourly'],
    lat: 23.8206, lng: 90.4279,
    priceMin: 150, priceMax: 350,
    priceNote: 'per hour',
    hours: { open: 12, close: 24 },
    blurb: 'Block E. Runs weekend tournaments, console setups as well as PCs.',
    reviews: [
      { user: 'Ashfaq N.', stars: 5, body: 'They actually organise proper tournaments with prize money. Community here is great.', date: '2026-07-16' },
      { user: 'Tamim S.', stars: 3, body: 'Good setup but pricier than the others for basically the same specs.', date: '2026-06-23' },
    ],
  },
  {
    id: 'p22',
    name: 'Toggi Fun World',
    category: ['gaming', 'hangout'],
    tags: ['arcade', 'gaming', 'bowling', 'family', 'mall', 'group', 'kids'],
    lat: 23.8131, lng: 90.4247,
    priceMin: 300, priceMax: 900,
    hours: { open: 11, close: 21 },
    blurb: 'Arcade inside Jamuna Future Park. Bowling, rides, the whole thing.',
    reviews: [
      { user: 'Wasif R.', stars: 4, body: 'Fun in a group. Bowling is the best value, the arcade games eat your money fast.', date: '2026-07-05' },
      { user: 'Maliha J.', stars: 3, body: 'Very loud and mostly kids on weekends. Go on a weekday if you can.', date: '2026-06-15' },
    ],
  },

  // ── Sports & turf ────────────────────────────────────────────────────────
  {
    id: 'p40',
    name: 'JAFF',
    category: ['sports'],
    tags: ['football', 'turf', 'futsal', 'floodlights', 'booking', 'group', 'hourly'],
    lat: 23.8189, lng: 90.4281,
    priceMin: 140, priceMax: 250,
    priceNote: '৳1900–3200/hour, split ~14 players',
    hours: { open: 6, close: 24 },
    blurb: 'Bashundhara turf that most of the IUB football crowd ends up booking.',
    reviews: [
      { user: 'Tahmid R.', stars: 5, body: 'This is where our whole batch books. Turf is well kept, the lights are bright enough for late slots, and the rate split between fourteen of us is nothing.', date: '2026-07-21' },
      { user: 'Nafis I.', stars: 4, body: 'Easy to get to from campus and the booking process is straightforward. Evening slots go fast so plan ahead.', date: '2026-07-05' },
      { user: 'Sabbir M.', stars: 3, body: 'Good pitch but the changing area is cramped and there is nowhere proper to leave your bags.', date: '2026-06-22' },
    ],
  },
  {
    id: 'p23',
    name: 'Kick Off Arena',
    category: ['sports'],
    tags: ['football', 'turf', 'floodlights', 'booking', 'group', 'hourly'],
    lat: 23.8221, lng: 90.4304,
    priceMin: 150, priceMax: 260,
    priceNote: '৳2000–3500/hour, split ~14 players',
    hours: { open: 6, close: 24 },
    blurb: 'Block I. Full-size 7-a-side turf with proper floodlights.',
    reviews: [
      { user: 'Redwan A.', stars: 5, body: 'Surface is in great condition and the lights are proper. 2500 an hour split between 14 people is nothing.', date: '2026-07-17' },
      { user: 'Shakib H.', stars: 4, body: 'Best turf in Bashundhara. Book at least two days ahead for evening slots, they go fast.', date: '2026-06-30' },
      { user: 'Ibrahim K.', stars: 2, body: 'Double booked our slot and made us wait 45 minutes. Turf itself is good, management is not.', date: '2026-07-09' },
    ],
  },
  {
    id: 'p24',
    name: 'The Turf Arena',
    category: ['sports'],
    tags: ['football', 'cricket', 'turf', 'booking', 'group', 'hourly'],
    lat: 23.8244, lng: 90.4267,
    priceMin: 130, priceMax: 220,
    priceNote: '৳1800–3000/hour, split ~14 players',
    hours: { open: 6, close: 23 },
    blurb: 'Block J. Two pitches plus cricket nets. Slightly cheaper than Kick Off.',
    reviews: [
      { user: 'Naimul H.', stars: 4, body: 'Cheaper than most and the second pitch is almost always free. Grass is a bit worn near the goals.', date: '2026-07-12' },
      { user: 'Arafat R.', stars: 4, body: 'Cricket nets are a nice addition. Staff are relaxed about timing.', date: '2026-06-21' },
    ],
  },
  {
    id: 'p25',
    name: 'Play On Turf',
    category: ['sports'],
    tags: ['football', 'turf', 'cheap', 'booking', 'morning', 'hourly'],
    lat: 23.8196, lng: 90.4318,
    priceMin: 110, priceMax: 180,
    priceNote: '৳1500–2500/hour, split ~14 players',
    hours: { open: 6, close: 23 },
    blurb: 'Block G. Smallest of the three and the cheapest. Fine for 5-a-side.',
    reviews: [
      { user: 'Sabit M.', stars: 4, body: 'Morning slots go for 1500 which is the best rate around. Pitch is small but fine for five a side.', date: '2026-07-01' },
      { user: 'Junayed A.', stars: 3, body: 'Lights are dim in the corners at night. Playable but not great after dark.', date: '2026-06-17' },
    ],
  },
  {
    id: 'p26',
    name: 'Bashundhara Sports Complex',
    category: ['sports'],
    tags: ['badminton', 'basketball', 'indoor', 'booking', 'group', 'ac', 'hourly'],
    lat: 23.8228, lng: 90.4215,
    priceMin: 125, priceMax: 200,
    priceNote: '৳500–800/hour per court, split 4',
    hours: { open: 6, close: 22 },
    blurb: 'Block E. Indoor badminton and basketball courts, booked by the hour.',
    reviews: [
      { user: 'Tahsin R.', stars: 4, body: 'Badminton courts are well maintained and it is indoors so weather never matters. Good AC.', date: '2026-07-15' },
      { user: 'Nadia S.', stars: 3, body: 'Decent facilities but booking is a phone-call-only mess. No online system.', date: '2026-06-25' },
    ],
  },

  // ── Movies ───────────────────────────────────────────────────────────────
  {
    id: 'p27',
    name: 'Blockbuster Cinemas',
    category: ['movies', 'date'],
    tags: ['cinema', 'movie', 'date', 'mall', 'ac', 'group'],
    lat: 23.8135, lng: 90.4245,
    priceMin: 400, priceMax: 900,
    hours: { open: 10, close: 24 },
    blurb: 'Jamuna Future Park multiplex. The cinema for this side of town.',
    reviews: [
      { user: 'Ehsan T.', stars: 5, body: 'Sound and picture are genuinely good. Recliner seats are worth the extra couple hundred taka.', date: '2026-07-18' },
      { user: 'Rubaba M.', stars: 4, body: 'Clean, comfortable, easy to book online. Snacks are robbery but that is every cinema.', date: '2026-06-29' },
      { user: 'Sifat A.', stars: 2, body: 'Projector was out of focus for the first twenty minutes and nobody responded until half the hall complained.', date: '2026-07-04' },
    ],
  },

  // ── Parks ────────────────────────────────────────────────────────────────
  {
    id: 'p28',
    name: 'Bashundhara Lake Park',
    category: ['park', 'date', 'hangout'],
    tags: ['walk', 'lake', 'quiet', 'free', 'evening', 'outdoor', 'jogging'],
    lat: 23.8201, lng: 90.4227,
    priceMin: 0, priceMax: 0,
    hours: { open: 6, close: 21 },
    blurb: 'Block D lakeside. Free, and the walk at sunset is the best thing in the area.',
    reviews: [
      { user: 'Mahdi R.', stars: 4, body: 'Costs nothing and the walk by the water at sunset is genuinely lovely. Gets busy after maghrib.', date: '2026-07-13' },
      { user: 'Tania H.', stars: 3, body: 'Nice but the maintenance is inconsistent. Some stretches have litter and broken benches.', date: '2026-06-19' },
    ],
  },
  {
    id: 'p29',
    name: 'Block G Playground',
    category: ['park', 'sports'],
    tags: ['football', 'cricket', 'free', 'outdoor', 'morning', 'jogging', 'group'],
    lat: 23.8215, lng: 90.4291,
    priceMin: 0, priceMax: 0,
    hours: { open: 6, close: 20 },
    blurb: 'Open ground in Block G. Free, first come first served, no booking.',
    reviews: [
      { user: 'Rayhan M.', stars: 4, body: 'Free football if you can get there early. Surface is dirt not turf but nobody is charging you 2500 an hour.', date: '2026-07-20' },
      { user: 'Shourav K.', stars: 3, body: 'Fine for a kickabout. Dusty in winter and unusable after rain.', date: '2026-06-22' },
    ],
  },

  // ── Hangout ──────────────────────────────────────────────────────────────
  {
    id: 'p30',
    name: 'Jamuna Future Park',
    category: ['hangout', 'movies'],
    tags: ['mall', 'shopping', 'food court', 'ac', 'group', 'rainy day'],
    lat: 23.8133, lng: 90.4249,
    priceMin: 200, priceMax: 1500,
    hours: { open: 10, close: 22 },
    blurb: 'Enormous mall on the edge of Bashundhara. Cinema, arcade, food court.',
    reviews: [
      { user: 'Zubair A.', stars: 4, body: 'You can genuinely spend a whole day here. Cinema, arcade, food court, all under one roof and air conditioned.', date: '2026-07-16' },
      { user: 'Nawshin R.', stars: 3, body: 'Overwhelming on weekends. Parking is a nightmare after 4pm.', date: '2026-06-22' },
    ],
  },
  {
    id: 'p31',
    name: 'Chill Out Café',
    category: ['hangout', 'cafe'],
    tags: ['coffee', 'rooftop', 'friends', 'late night', 'group', 'shisha'],
    lat: 23.8163, lng: 90.4285,
    priceMin: 250, priceMax: 550,
    hours: { open: 12, close: 24 },
    blurb: 'Block C rooftop. Open late, standard post-class adda spot.',
    reviews: [
      { user: 'Zayan I.', stars: 4, body: 'Rooftop at night is genuinely nice and they let you sit for hours. Food is average but you are not here for the food.', date: '2026-07-08' },
      { user: 'Labiba T.', stars: 3, body: 'Nice vibe, painfully slow service. Waited 40 minutes for a sandwich on a weekday.', date: '2026-06-17' },
    ],
  },

  // ── Date spots ───────────────────────────────────────────────────────────
  {
    id: 'p32',
    name: 'Rooftop Nine',
    category: ['date', 'cafe'],
    tags: ['rooftop', 'view', 'date', 'evening', 'dinner', 'quiet'],
    lat: 23.8166, lng: 90.4276,
    priceMin: 500, priceMax: 1100,
    hours: { open: 16, close: 24 },
    blurb: 'Block C. Ninth-floor terrace with a view over the lake. Book the corner table.',
    reviews: [
      { user: 'Raihan M.', stars: 5, body: 'The view over the lake at night is worth the price alone. Booked the corner table for an anniversary and it was perfect.', date: '2026-07-19' },
      { user: 'Ishika T.', stars: 4, body: 'Lovely setting, food is good not great. You are paying for the view and that is fine.', date: '2026-06-26' },
      { user: 'Nabil R.', stars: 2, body: 'Expensive for the portion sizes and the lift was out so we walked nine floors. Nobody warned us.', date: '2026-07-03' },
    ],
  },

  // ── Salon (includes parlour / beauty) ────────────────────────────────────
  {
    id: 'p33',
    name: 'Sharp Cuts Barbershop',
    category: ['salon'],
    tags: ['haircut', 'barber', 'salon', 'men', 'shave', 'beard', 'cheap', 'walk in'],
    lat: 23.8157, lng: 90.4250,
    priceMin: 200, priceMax: 600,
    hours: { open: 10, close: 21 },
    blurb: 'Block B. Straightforward men\'s barber near campus — walk in, twenty minutes, done.',
    reviews: [
      { user: 'Imran S.', stars: 4, body: 'Reliable fade for 300 taka and you rarely wait more than ten minutes. Nothing fancy but they know what they are doing.', date: '2026-07-17' },
      { user: 'Nafis A.', stars: 4, body: 'Beard trim here is genuinely good. Ask for the older guy on the left chair.', date: '2026-06-30' },
      { user: 'Zahid R.', stars: 2, body: 'Got a completely different cut from what I asked for. Fine if you want something standard, risky otherwise.', date: '2026-07-11' },
    ],
  },
  {
    id: 'p34',
    name: 'The Grooming Room',
    category: ['salon'],
    tags: ['salon', 'haircut', 'barber', 'men', 'beard', 'shave', 'booking', 'premium'],
    lat: 23.8174, lng: 90.4270,
    priceMin: 500, priceMax: 1800,
    hours: { open: 11, close: 21 },
    blurb: 'Block C. Men\'s grooming with actual appointments. Hot towel shave is the signature.',
    reviews: [
      { user: 'Arman C.', stars: 5, body: 'The hot towel shave is worth every taka. Booking online means no waiting around, which is rare here.', date: '2026-07-18' },
      { user: 'Sadman I.', stars: 4, body: 'Proper skin fade, they take their time. More expensive than a normal barber but you can see the difference.', date: '2026-06-28' },
    ],
  },
  {
    id: 'p35',
    name: 'Glow Beauty Parlour',
    category: ['salon'],
    tags: ['parlour', 'facial', 'threading', 'women', 'cheap', 'walk in', 'haircut', 'bridal', 'spa'],
    lat: 23.8189, lng: 90.4285,
    priceMin: 250, priceMax: 1200,
    hours: { open: 10, close: 21 },
    blurb: 'Block D. Cheap threading and facials, no appointment needed.',
    reviews: [
      { user: 'Maliha S.', stars: 4, body: 'Threading is 150 taka and takes five minutes. I come here every couple of weeks and have never had to wait.', date: '2026-07-21' },
      { user: 'Ruqaiya B.', stars: 4, body: 'Very affordable and the staff are friendly. Facial quality is good for the price.', date: '2026-07-04' },
      { user: 'Shanta P.', stars: 2, body: 'The place could be cleaner. Service is fine but the towels did not look fresh.', date: '2026-06-18' },
    ],
  },
  {
    id: 'p36',
    name: 'Persona Bashundhara',
    category: ['salon'],
    tags: ['salon', 'parlour', 'haircut', 'facial', 'spa', 'women', 'men', 'premium', 'booking', 'bridal'],
    lat: 23.8148, lng: 90.4243,
    priceMin: 800, priceMax: 3500,
    hours: { open: 10, close: 20 },
    blurb: 'Block B. Full-service salon — expensive, but the one people book before a wedding.',
    reviews: [
      { user: 'Farhana K.', stars: 5, body: 'Best haircut I have had in Dhaka. They actually listen to what you want instead of doing whatever is easiest.', date: '2026-07-20' },
      { user: 'Sumaiya H.', stars: 4, body: 'Facials are excellent and the place is spotless. You do need to book at least a few days ahead.', date: '2026-07-02' },
      { user: 'Rehana M.', stars: 2, body: 'Very expensive for what it is. Paid over 3000 taka and the appointment still ran forty minutes late.', date: '2026-06-24' },
    ],
  },
]
