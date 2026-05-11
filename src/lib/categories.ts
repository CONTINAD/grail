/**
 * Collectible categories.
 * Pokemon is live; the rest are scaffolded with "coming soon" badges.
 */

export interface Category {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  live: boolean;
  /** Hex tint used for accent on category cards */
  accent: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "pokemon",
    name: "Pokémon",
    emoji: "⚡",
    tagline: "Cards from Base Set to the latest Scarlet & Violet drops.",
    live: true,
    accent: "#F7C948",
  },
  {
    id: "sports",
    name: "Sports Cards",
    emoji: "🏀",
    tagline: "Basketball, football, baseball, soccer — rookies, autos, hits.",
    live: false,
    accent: "#ff6b4a",
  },
  {
    id: "comics",
    name: "Comics",
    emoji: "📚",
    tagline: "Keys, variants, signature editions — CGC-ready.",
    live: false,
    accent: "#8b6dff",
  },
  {
    id: "sneakers",
    name: "Sneakers",
    emoji: "👟",
    tagline: "Jordans, Dunks, Yeezys — grails and daily beaters.",
    live: false,
    accent: "#17c77f",
  },
  {
    id: "watches",
    name: "Watches",
    emoji: "⌚",
    tagline: "Rolex, AP, Patek, Tudor — vintage and modern.",
    live: false,
    accent: "#e8e8ec",
  },
  {
    id: "vinyl",
    name: "Vinyl",
    emoji: "💿",
    tagline: "First pressings, colored variants, signed jackets.",
    live: false,
    accent: "#ff4d6d",
  },
];
