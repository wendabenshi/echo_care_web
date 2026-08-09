export const LOVE_ENERGY_POSITIONS = [
  "Your heart right now",
  "What's blocking love",
  "Where love is leading",
];

export const SINGLE_CARD_POSITIONS = ["The message for you today"];

export const DAILY_GLANCE_COPY = {
  "The Fool": {
    today: "New Horizon",
    heart: "Open To Wonder",
    step: "Start Anyway",
  },
  "The Magician": {
    today: "Focused Momentum",
    heart: "Ready To Act",
    step: "Use What's Here",
  },
  "The High Priestess": {
    today: "Quiet Knowing",
    heart: "Reading Signals",
    step: "Wait A Beat",
  },
  "The Empress": {
    today: "Gentle Warmth",
    heart: "Ready To Receive",
    step: "Nurture It",
  },
  "The Emperor": {
    today: "Steady Control",
    heart: "Holding Boundaries",
    step: "Name The Need",
  },
  "The Lovers": {
    today: "Meaningful Choice",
    heart: "Pulled Both Ways",
    step: "Choose Honestly",
  },
  "The Chariot": {
    today: "Forward Push",
    heart: "Finding Direction",
    step: "Stay The Course",
  },
  "Strength": {
    today: "Soft Courage",
    heart: "Holding Steady",
    step: "Respond Gently",
  },
  "The Hermit": {
    today: "Need For Space",
    heart: "Sorting Thoughts",
    step: "Step Back",
  },
  "Wheel of Fortune": {
    today: "Turning Point",
    heart: "Watching Change",
    step: "Stay Flexible",
  },
  "Justice": {
    today: "Truth Matters",
    heart: "Weighing Fairness",
    step: "Be Clear",
  },
  "The Hanged Man": {
    today: "Pause Required",
    heart: "Seeing Differently",
    step: "Hold Off",
  },
  "Death": {
    today: "Ending Season",
    heart: "Ready To Release",
    step: "Let It Go",
  },
  "Temperance": {
    today: "Slow Balance",
    heart: "Settling Down",
    step: "Take Half Steps",
  },
  "The Devil": {
    today: "Old Pull",
    heart: "Caught In Loops",
    step: "Break The Pattern",
  },
  "The Tower": {
    today: "Sudden Truth",
    heart: "Shaken Open",
    step: "Face It",
  },
  "The Star": {
    today: "Hope Returns",
    heart: "Breathing Easier",
    step: "Try Again",
  },
  "The Moon": {
    today: "Finding Clarity",
    heart: "Sorting Feelings",
    step: "Pause Before Deciding",
  },
  "The Sun": {
    today: "Clear Warmth",
    heart: "More Open",
    step: "Say It Plainly",
  },
  "Judgement": {
    today: "Wake Up Call",
    heart: "Hearing It",
    step: "Answer Honestly",
  },
  "The World": {
    today: "Cycle Closing",
    heart: "Feeling Whole",
    step: "Finish It",
  },
  "Two of Cups": {
    today: "Shared Feeling",
    heart: "Seeking Mutuality",
    step: "Meet Halfway",
  },
  "Three of Cups": {
    today: "Lightness Returns",
    heart: "Wanting Company",
    step: "Reach Out",
  },
  "Ace of Cups": {
    today: "Emotional Opening",
    heart: "Ready To Receive",
    step: "Express Something Real",
  },
  "Ten of Cups": {
    today: "Homeward Feeling",
    heart: "Wanting Harmony",
    step: "Protect The Bond",
  },
  "Two of Swords": {
    today: "Decision Pending",
    heart: "Still Guarded",
    step: "Stop Avoiding",
  },
  "Three of Swords": {
    today: "Tender Aftermath",
    heart: "Still Hurting",
    step: "Name The Pain",
  },
  "Queen of Cups": {
    today: "Deep Feeling",
    heart: "Sensitive Today",
    step: "Speak Softly",
  },
  "Knight of Cups": {
    today: "Heart In Motion",
    heart: "Ready To Reach",
    step: "Send The Message",
  },
};

export function slugify(label) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function cardImageSlug(label) {
  return label
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export function cardImageUrl(label) {
	return "/cards/one.png";
  return `https://woomoo.app/common/tarot_cards/${cardImageSlug(label)}.webp`;
}

/** @type {{ label: string, loveMeaning: string }[]} */
export const TAROT_CARDS = [
  { label: "The Fool", loveMeaning: "Something new is trying to begin. Love may ask you to step forward before you feel fully ready.",img:"/cards/one.png" },
  { label: "The Magician", loveMeaning: "You have more influence over this connection than you think. Clear intention can shift the energy.",img:"/cards/one.png" },
  { label: "The High Priestess", loveMeaning: "Trust what you already sense beneath the surface. Not everything needs to be spoken yet.",img:"/cards/one.png" },
  { label: "The Empress", loveMeaning: "Warmth, nurture, and openness are available. Let affection be expressed, not only imagined.",img:"/cards/one.png" },
  { label: "The Emperor", loveMeaning: "Structure and honesty matter now. Love grows where boundaries are clear and respect is mutual." ,img:"/cards/one.png"},
  { label: "The Lovers", loveMeaning: "A meaningful choice is present. Your heart is being asked to align with what you truly value." ,img:"/cards/one.png"},
  { label: "The Chariot", loveMeaning: "Momentum is building. If you want this to move forward, your direction needs to stay steady.",img:"/cards/one.png" },
  { label: "Strength", loveMeaning: "Gentle persistence beats force. Soft courage will take this further than pressure or fear.",img:"/cards/one.png" },
  { label: "The Hermit", loveMeaning: "A pause for reflection may protect you. Solitude now can clarify what your heart actually wants." ,img:"/cards/one.png"},
  { label: "Wheel of Fortune", loveMeaning: "The situation is turning. What felt stuck may shift sooner than expected — stay open to timing.",img:"/cards/one.png" },
  { label: "Justice", loveMeaning: "Balance and truth are central. What is fair — and what is honest — will guide the next step." ,img:"/cards/one.png"},
  { label: "The Hanged Man", loveMeaning: "Waiting is part of the story. A different perspective may reveal what action cannot yet.",img:"/cards/two.png" },
  { label: "Death", loveMeaning: "An old pattern is ending to make room for something truer. Release what love has outgrown.",img:"/cards/two.png" },
  { label: "Temperance", loveMeaning: "Patience and moderation will serve you. The right connection rarely needs to be forced.",img:"/cards/two.png" },
  { label: "The Devil", loveMeaning: "Watch for attachment, obsession, or old loops. Name what keeps pulling you back.",img:"/cards/two.png" },
  { label: "The Tower", loveMeaning: "A shake-up may clear illusions. Uncomfortable truth can still protect your heart long-term.",img:"/cards/two.png" },
  { label: "The Star", loveMeaning: "Hope is not naive here. Healing and renewal are quietly becoming possible again.",img:"/cards/two.png" },
  { label: "The Moon", loveMeaning: "Mixed signals or uncertainty may cloud things. Move slowly until feelings become clearer.",img:"/cards/two.png" },
  { label: "The Sun", loveMeaning: "Joy, clarity, and warmth want in. This energy favors honesty, playfulness, and open-heartedness." ,img:"/cards/two.png"},
  { label: "Judgement", loveMeaning: "A wake-up call around love is arriving. Answer it with compassion, not self-judgment.",img:"/cards/three.png" },
  { label: "The World", loveMeaning: "Completion and fulfillment are within reach. A cycle may be ready to mature into something whole." ,img:"/cards/three.png"},
  { label: "Two of Cups", loveMeaning: "Mutual attraction and emotional reciprocity are highlighted. Connection wants to be balanced." ,img:"/cards/three.png"},
  { label: "Three of Cups", loveMeaning: "Support, celebration, or friendship may shape the path. Joy grows in shared emotional space." ,img:"/cards/three.png"},
  { label: "Ace of Cups", loveMeaning: "A fresh emotional opening is possible. Be receptive without abandoning self-respect." ,img:"/cards/three.png"},
  { label: "Ten of Cups", loveMeaning: "Long-term emotional harmony is the deeper theme. Ask whether this aligns with the life you want." ,img:"/cards/three.png"},
  { label: "Two of Swords", loveMeaning: "Avoidance may be keeping you in limbo. A decision postponed is still a decision." ,img:"/cards/three.png"},
  { label: "Three of Swords", loveMeaning: "Pain or disappointment needs acknowledgment before healing can begin.",img:"/cards/three.png" },
  { label: "Queen of Cups", loveMeaning: "Emotional depth and intuition are your strength. Lead with empathy, not self-erasure.",img:"/cards/three.png" },
  { label: "Knight of Cups", loveMeaning: "Romantic energy is in motion — through message, invitation, or sincere emotional gesture." ,img:"/cards/three.png"},
];

export function getCardByLabel(label) {
  return TAROT_CARDS.find((card) => card.label === label) ?? null;
}

export function getDailyGlanceCopy(label) {
  return DAILY_GLANCE_COPY[label] ?? null;
}

export function shuffle(items) {
  const list = [...items];
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

export function pickDistinctCards(count = 3) {
  return shuffle(TAROT_CARDS).slice(0, count);
}
