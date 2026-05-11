/**
 * Editorial copy for the landing page. The voice is a curator with an
 * opinion — specific cards, specific people, specific weeks. If a line
 * could be lifted into another company's marketing copy, it's wrong.
 */

export interface IndexMover {
  rank: number;
  name: string;
  set: string;
  price: number;
  pct: number;
  series: number[];
  note?: string;
}

export const INDEX_MOVERS: IndexMover[] = [
  {
    rank: 1,
    name: "Charizard",
    set: "Base · 1st Ed · Shadowless · PSA 10",
    price: 32400,
    pct: 18.3,
    note: "Two sales this week. Both in cash.",
    series: [100, 102, 99, 104, 108, 112, 109, 114, 120, 118, 125, 132],
  },
  {
    rank: 2,
    name: "Umbreon VMAX",
    set: "Evolving Skies · Alt Art · PSA 10",
    price: 1820,
    pct: 22.1,
    note: "The card running the modern market.",
    series: [80, 84, 88, 91, 95, 100, 104, 109, 112, 118, 121, 124],
  },
  {
    rank: 3,
    name: "Pikachu Illustrator",
    set: "Promo · 1998 · PSA 7",
    price: 412000,
    pct: 7.2,
    note: "Three copies surfaced on Grail this quarter.",
    series: [100, 100, 102, 102, 105, 104, 107, 109, 108, 110, 111, 112],
  },
  {
    rank: 4,
    name: "Lugia",
    set: "Neo Genesis · 1st Ed · BGS 9.5",
    price: 6400,
    pct: -4.2,
    note: "Cooling after April spike.",
    series: [100, 104, 110, 113, 108, 105, 102, 99, 97, 96, 94, 92],
  },
  {
    rank: 5,
    name: "Blastoise",
    set: "Base · Shadowless · PSA 9",
    price: 3900,
    pct: 11.5,
    note: "Sibling demand from Charizard run.",
    series: [90, 92, 94, 96, 100, 102, 105, 108, 110, 112, 115, 118],
  },
  {
    rank: 6,
    name: "Mewtwo GX",
    set: "Shining Legends · PSA 10",
    price: 240,
    pct: 31.4,
    note: "Cheap entry into the SL set.",
    series: [70, 72, 76, 80, 85, 92, 100, 108, 115, 122, 128, 135],
  },
  {
    rank: 7,
    name: "Rayquaza Gold Star",
    set: "EX Deoxys · PSA 9",
    price: 8900,
    pct: 6.8,
    note: "Quiet but unbroken uptrend.",
    series: [95, 96, 98, 99, 100, 101, 103, 104, 105, 106, 107, 108],
  },
  {
    rank: 8,
    name: "Trophy Pikachu",
    set: "Tropical Mega Battle · Bronze",
    price: 168000,
    pct: -2.1,
    note: "Settling after Tokyo auction.",
    series: [100, 102, 103, 102, 101, 100, 99, 98, 97, 98, 97, 98],
  },
];

export interface FeaturedGrail {
  lot: string;
  title: string;
  subtitle: string;
  grade: string;
  price: number;
  story: string;
  image: string;
  /** A short, specific provenance line — the "why this matters" sentence */
  provenance: string;
}

export const FEATURED_GRAILS: FeaturedGrail[] = [
  {
    lot: "01",
    title: "Charizard",
    subtitle: "Base Set · 1st Edition · Shadowless",
    grade: "PSA 10",
    price: 32400,
    story:
      "Marcus bought four packs at a Toys-R-Us in Pasadena in February 1999. Three are gone. The fourth he never opened. We did, on camera, with him in the room. His son turned seven last week.",
    provenance: "Single owner · Original receipt · Pasadena, CA",
    image: "https://images.pokemontcg.io/base1/4_hires.png",
  },
  {
    lot: "02",
    title: "Umbreon VMAX",
    subtitle: "Evolving Skies · Alt Art",
    grade: "PSA 10",
    price: 1820,
    story:
      "The card that started the modern wave. Moonlight inks, foil that lights a whole room. We move three of these every week and the floor keeps inching upward.",
    provenance: "Pulled June 2024 · Slabbed Sept 2024 · Berlin",
    image: "https://images.pokemontcg.io/swsh7/215_hires.png",
  },
  {
    lot: "03",
    title: "Lugia",
    subtitle: "Neo Genesis · 1st Edition Holo",
    grade: "BGS 9.5",
    price: 6400,
    story:
      "Centering 50/50, corners sharp enough to draw blood. Posted in Osaka, photographed in our studio Tuesday. The kind of card you keep, not flip — but here we are.",
    provenance: "Single owner since 2000 · Osaka, JP",
    image: "https://images.pokemontcg.io/neo1/9_hires.png",
  },
];

export interface CollectorVoice {
  name: string;
  handle: string;
  pic: string;
  trades: number;
  city: string;
  quote: string;
  signoff: string;
}

export const COLLECTOR_VOICES: CollectorVoice[] = [
  {
    name: "Mira Tanaka",
    handle: "@mira.holos",
    pic: "M",
    trades: 87,
    city: "Osaka",
    quote:
      "A guy in Atlanta sent me his grandfather's Gengar in a sleeve from a Toys-R-Us bag. I sent him a Vaporeon ex I'd been holding for eight months. Both of us cried a little. Grail kept the cards safe while we argued about who got the better deal.",
    signoff: "— still arguing",
  },
  {
    name: "Jordan Rivera",
    handle: "@jrivera_psa",
    pic: "J",
    trades: 142,
    city: "Brooklyn",
    quote:
      "I've been collecting since I was nine. I have spreadsheets older than my marriage. Grail is the first platform that treats my collection like a portfolio instead of a yard sale.",
    signoff: "— and the marriage is fine",
  },
  {
    name: "Theo Bennett",
    handle: "@thevintageshop",
    pic: "T",
    trades: 211,
    city: "Bristol",
    quote:
      "Vintage only, no modern, no exceptions. The matching engine reads my wants exactly. Last month it surfaced a Japanese Topsun I'd been hunting since 2017.",
    signoff: "— Bristol, UK",
  },
];

export interface RecentTrade {
  fromUser: string;
  toUser: string;
  card: string;
  value: number;
  minutesAgo: number;
}

export const RECENT_TRADES: RecentTrade[] = [
  { fromUser: "@mira.holos",      toUser: "@psa_kev",         card: "Gengar VMAX Alt",        value: 980,   minutesAgo: 3 },
  { fromUser: "@jrivera_psa",     toUser: "@floor_mike",      card: "Charizard ex Obsidian",  value: 320,   minutesAgo: 7 },
  { fromUser: "@thevintageshop",  toUser: "@retro_rob",       card: "Neo Genesis Lugia",      value: 6400,  minutesAgo: 12 },
  { fromUser: "@cosmic_pkmn",     toUser: "@hidden_legends",  card: "Rayquaza Gold Star",     value: 8900,  minutesAgo: 18 },
  { fromUser: "@japan_holos",     toUser: "@psa10er",         card: "Umbreon VMAX Alt",       value: 1820,  minutesAgo: 24 },
  { fromUser: "@kantonian",       toUser: "@cardvault_la",    card: "Trophy Pikachu Bronze",  value: 9400,  minutesAgo: 33 },
  { fromUser: "@evolving_skye",   toUser: "@grailseeker",     card: "Sylveon V Alt",          value: 410,   minutesAgo: 41 },
  { fromUser: "@base_set_god",    toUser: "@vintage_only",    card: "Charizard Shadowless",   value: 32400, minutesAgo: 58 },
];

/**
 * "Dispatches" — short editorial blurbs from the curators about
 * specific cards, sets, or moments. Reads like a collector newsletter.
 */
export interface Dispatch {
  date: string;
  byline: string;
  title: string;
  body: string;
}

export const DISPATCHES: Dispatch[] = [
  {
    date: "MAY 8",
    byline: "MIRA / OSAKA",
    title: "Why Umbreon refuses to come down.",
    body: "Three years in, the alt-art is still the index. Modern set printing went hard, but this card was printed light — and the people who got one are not the people who sell. The floor has held above $1,500 for fourteen months running.",
  },
  {
    date: "MAY 7",
    byline: "THEO / BRISTOL",
    title: "Field notes from a Topsun hunt.",
    body: "1995. Glossy backs. Three years on my wishlist. Surfaced in a private trade from a seller in Hokkaido who didn't know what she had. We graded it together, on camera. Now it lives in my book and she got a Rayquaza ex she'd been chasing.",
  },
  {
    date: "MAY 5",
    byline: "GRAIL DESK",
    title: "What sold on the floor this week.",
    body: "Two Shadowless Charizards. One Pikachu Illustrator at a price we won't print. A complete Neo Genesis 1st Ed master set. The boring stuff: forty-one Sylveon V Alts in PSA 10. The market has range.",
  },
];

export interface HeadlineStat {
  label: string;
  value: string;
  hint: string;
}

export const HEADLINE_STATS: HeadlineStat[] = [
  { label: "On the floor this week", value: "$3.4M",    hint: "across 1,488 closed trades" },
  { label: "Median trade size",      value: "$214",     hint: "outliers up to $412k" },
  { label: "Average close time",     value: "37 min",   hint: "from match to handshake" },
  { label: "What we keep",           value: "$1–6",     hint: "flat, per side, no skim" },
];
