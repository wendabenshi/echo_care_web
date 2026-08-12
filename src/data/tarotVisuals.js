export const ECHO_CARD_BACK_IMAGE = "/cards/echo/card-back-mystic-editorial.png";

export const ECHO_MAJOR_ARCANA_ASSETS = [
  { label: "The Fool", src: "/cards/echo/00-the-fool.png" },
  { label: "The Magician", src: "/cards/echo/01-the-magician.png" },
  { label: "The High Priestess", src: "/cards/echo/02-the-high-priestess.png" },
  { label: "The Empress", src: "/cards/echo/03-the-empress.png" },
  { label: "The Emperor", src: "/cards/echo/04-the-emperor.png" },
  { label: "The Hierophant", src: "/cards/echo/05-the-hierophant.png" },
  { label: "The Lovers", src: "/cards/echo/06-the-lovers.png" },
  { label: "The Chariot", src: "/cards/echo/07-the-chariot.png" },
  { label: "Strength", src: "/cards/echo/08-strength.png" },
  { label: "The Hermit", src: "/cards/echo/09-the-hermit.png" },
  { label: "Wheel of Fortune", src: "/cards/echo/10-wheel-of-fortune.png" },
  { label: "Justice", src: "/cards/echo/11-justice.png" },
  { label: "The Hanged Man", src: "/cards/echo/12-the-hanged-man.png" },
  { label: "Death", src: "/cards/echo/13-death.png" },
  { label: "Temperance", src: "/cards/echo/14-temperance.png" },
  { label: "The Devil", src: "/cards/echo/15-the-devil.png" },
  { label: "The Tower", src: "/cards/echo/16-the-tower.png" },
  { label: "The Star", src: "/cards/echo/17-the-star.png" },
  { label: "The Moon", src: "/cards/echo/18-the-moon.png" },
  { label: "The Sun", src: "/cards/echo/19-the-sun.png" },
  { label: "Judgement", src: "/cards/echo/20-judgement.png" },
  { label: "The World", src: "/cards/echo/21-the-world.png" },
];

const ECHO_MAJOR_ARCANA_IMAGE_MAP = new Map(
  ECHO_MAJOR_ARCANA_ASSETS.map((asset) => [asset.label, asset.src]),
);

export function getEchoCardImage(label) {
  return ECHO_MAJOR_ARCANA_IMAGE_MAP.get(label) ?? "";
}
