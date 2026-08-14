import {
  SINGLE_CARD_POSITIONS,
  getCardByLabel,
  TAROT_CARDS,
  shuffle,
} from "../data/tarotCards.js";
import { getEchoCardImage } from "../data/tarotVisuals.js";

const QUESTION_READING_POSITIONS = [
  "The Situation",
  "What's Shaping It",
  "What To Consider",
];

function withEchoImage(card) {
  return {
    card_name: card.label,
    image_src: getEchoCardImage(card.label),
  };
}

function pickDistinctVisualReadyCards(count = 3) {
  return shuffle(TAROT_CARDS.filter((card) => getEchoCardImage(card.label))).slice(0, count);
}

export function createLoveEnergyDraw(question) {
  const cards = pickDistinctVisualReadyCards(3).map(withEchoImage);

  return {
    question,
    spread_name: "Three-Card Reflection",
    position_meanings: [...QUESTION_READING_POSITIONS],
    cards,
  };
}

async function requestSpread(question, mode) {
  const response = await fetch("/api/spread", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ question, mode }),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.ok) {
    throw new Error(result?.error ?? "Spread generation failed");
  }

  return result.spread;
}

export function resolveSlotCards(draw) {
  return draw.cards.map((entry) => getCardByLabel(entry.card_name)).filter(Boolean);
}

export function generateReading(question, draw) {
  const slots = resolveSlotCards(draw);
  const intro = `You asked: “${question}”\n\nThe cards don't rush an answer — they sit with the question alongside you. Here is what they suggest for your love energy right now.`;

  const sections = draw.position_meanings.map((position, index) => {
    const card = slots[index];
    if (!card) return "";
    return `${position}\n${card.label}\n${card.loveMeaning}`;
  });

  const closing =
    "Take what resonates and leave the rest. Love rarely moves in a straight line — but your clarity can deepen with every honest question you ask.";

  return [intro, ...sections, closing].filter(Boolean).join("\n\n");
}

function buildReadingRequest(question, draw) {
  const cards = resolveSlotCards(draw);
  return {
    question,
    spreadTitle: draw.spread_name,
    positions: [...draw.position_meanings],
    cards: cards.map((card, index) => ({
      position: draw.position_meanings[index] ?? "",
      name: card.label,
    })),
  };
}

/** Keeps question positions local so one AI request owns all dynamic reading content. */
export function simulateDraw(question) {
  return Promise.resolve({
    question,
    spread_name: "Three-Card Reflection",
    position_meanings: [...QUESTION_READING_POSITIONS],
    position_tags: [[], [], []],
    cards: pickDistinctVisualReadyCards(3).map(withEchoImage),
  });
}

export function simulateInterpret(question, draw) {
  return fetch("/api/reading", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      ...buildReadingRequest(question, draw),
      mode: "love-energy",
    }),
  }).then(async (response) => {
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.ok) {
      throw new Error(result?.error ?? "Reading failed");
    }
    return result.reading;
  });
}

export function createSingleCardDraw(question) {
  const cards = pickDistinctVisualReadyCards(1).map(withEchoImage);

  return {
    question,
    spread_name: "Single Card",
    position_meanings: [...SINGLE_CARD_POSITIONS],
    cards,
  };
}

export function generateSingleReading(question, draw) {
  const card = resolveSlotCards(draw)[0];
  if (!card) {
    return "The card couldn't be read right now. Try again when you're ready.";
  }

  const intro = `You asked: “${question}”\n\nOne card stepped forward. Here is its reading for you today.`;
  const body = `${draw.position_meanings[0]}\n${card.label}\n${card.loveMeaning}`;
  const closing =
    "Sit with this message for a moment. A single card rarely tells the whole story — but it can name what matters most right now.";

  return [intro, body, closing].join("\n\n");
}

export function simulateSingleDraw(question, options = {}) {
  const mode = options.mode === "daily" ? "daily" : "single-card";

  return requestSpread(question, mode).then((spread) => ({
    question,
    spread_name: spread.spreadTitle || "Single Card",
    position_meanings:
      spread.positions?.map((item) => item.title).filter(Boolean).slice(0, 1) || [...SINGLE_CARD_POSITIONS],
    position_tags:
      spread.positions?.map((item) => Array.isArray(item.tags) ? item.tags : []).slice(0, 1) || [],
    cards: pickDistinctVisualReadyCards(1).map(withEchoImage),
  }));
}

export function simulateSingleInterpret(question, draw, options = {}) {
  return fetch("/api/reading", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      ...buildReadingRequest(question, draw),
      mode: options.mode === "daily" ? "daily" : "single-card",
    }),
  }).then(async (response) => {
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.ok) {
      throw new Error(result?.error ?? "Reading failed");
    }
    return result.reading;
  });
}
