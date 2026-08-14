export const ECHO_CARD_BACK_IMAGE =
  "/cards/echo/full-deck/card-back-mystic-editorial.png";

const MAJOR_ARCANA_ASSETS = [
  { label: "The Fool", src: "/cards/echo/full-deck/major/00-the-fool.png" },
  {
    label: "The Magician",
    src: "/cards/echo/full-deck/major/01-the-magician.png",
  },
  {
    label: "The High Priestess",
    src: "/cards/echo/full-deck/major/02-the-high-priestess.png",
  },
  { label: "The Empress", src: "/cards/echo/full-deck/major/03-the-empress.png" },
  { label: "The Emperor", src: "/cards/echo/full-deck/major/04-the-emperor.png" },
  {
    label: "The Hierophant",
    src: "/cards/echo/full-deck/major/05-the-hierophant.png",
  },
  { label: "The Lovers", src: "/cards/echo/full-deck/major/06-the-lovers.png" },
  { label: "The Chariot", src: "/cards/echo/full-deck/major/07-the-chariot.png" },
  { label: "Strength", src: "/cards/echo/full-deck/major/08-strength.png" },
  { label: "The Hermit", src: "/cards/echo/full-deck/major/09-the-hermit.png" },
  {
    label: "Wheel of Fortune",
    src: "/cards/echo/full-deck/major/10-wheel-of-fortune.png",
  },
  { label: "Justice", src: "/cards/echo/full-deck/major/11-justice.png" },
  {
    label: "The Hanged Man",
    src: "/cards/echo/full-deck/major/12-the-hanged-man.png",
  },
  { label: "Death", src: "/cards/echo/full-deck/major/13-death.png" },
  { label: "Temperance", src: "/cards/echo/full-deck/major/14-temperance.png" },
  { label: "The Devil", src: "/cards/echo/full-deck/major/15-the-devil.png" },
  { label: "The Tower", src: "/cards/echo/full-deck/major/16-the-tower.png" },
  { label: "The Star", src: "/cards/echo/full-deck/major/17-the-star.png" },
  { label: "The Moon", src: "/cards/echo/full-deck/major/18-the-moon.png" },
  { label: "The Sun", src: "/cards/echo/full-deck/major/19-the-sun.png" },
  { label: "Judgement", src: "/cards/echo/full-deck/major/20-judgement.png" },
  { label: "The World", src: "/cards/echo/full-deck/major/21-the-world.png" },
];

const MINOR_RANKS = [
  "Ace",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Page",
  "Knight",
  "Queen",
  "King",
];

const MINOR_SUITS = ["Cups", "Wands", "Swords", "Pentacles"];

function rankSlug(rank) {
  return rank.toLowerCase();
}

function suitSlug(suit) {
  return suit.toLowerCase();
}

const MINOR_ARCANA_ASSETS = MINOR_SUITS.flatMap((suit) =>
  MINOR_RANKS.map((rank) => {
    const suitSlugValue = suitSlug(suit);
    return {
      label: `${rank} of ${suit}`,
      src: `/cards/echo/full-deck/minor/${suitSlugValue}/${suitSlugValue}-${rankSlug(
        rank,
      )}-of-${suitSlugValue}.png`,
    };
  }),
);

export const ECHO_FULL_DECK_ASSETS = [
  ...MAJOR_ARCANA_ASSETS,
  ...MINOR_ARCANA_ASSETS,
];

const ECHO_IMAGE_MAP = new Map(
  ECHO_FULL_DECK_ASSETS.map((asset) => [asset.label, asset.src]),
);

export function getEchoCardImage(label) {
  return ECHO_IMAGE_MAP.get(label) ?? "";
}
