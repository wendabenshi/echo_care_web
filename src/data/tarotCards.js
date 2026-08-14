import { getEchoCardImage } from "./tarotVisuals.js";

export const LOVE_ENERGY_POSITIONS = [
  "Your heart right now",
  "What's blocking love",
  "Where love is leading",
];

export const SINGLE_CARD_POSITIONS = ["The message for you today"];

export const DAILY_GLANCE_COPY = {
  // ─────────────────────────────
  // MAJOR ARCANA
  // ─────────────────────────────

  "The Fool": {
    today: "Something New",
    heart: "Curious But Unsure",
    step: "Take One Step",
  },

  "The Magician": {
    today: "Something Needs Starting",
    heart: "Ready To Act",
    step: "Use What's Here",
  },

  "The High Priestess": {
    today: "Something Feels Unclear",
    heart: "Picking Up On Something",
    step: "Wait A Beat",
  },

  "The Empress": {
    today: "Closer Connection",
    heart: "Open To Some Help",
    step: "Check In With Them",
  },

  "The Emperor": {
    today: "Clearer Boundaries",
    heart: "Wanting More Control",
    step: "Name What You Need",
  },

  "The Hierophant": {
    today: "Expectations Feel Stronger",
    heart: "Questioning The Rules",
    step: "Ask What Fits",
  },

  "The Lovers": {
    today: "A Choice Matters",
    heart: "Pulled Both Ways",
    step: "Choose What Fits",
  },

  "The Chariot": {
    today: "Something Needs Moving",
    heart: "Tired Of Waiting",
    step: "Make One Decision",
  },

  "Strength": {
    today: "A Moment Needs Patience",
    heart: "Trying Not To React",
    step: "Answer More Slowly",
  },

  "The Hermit": {
    today: "Too Much Noise",
    heart: "Needing Some Space",
    step: "Take Time Alone",
  },

  "Wheel of Fortune": {
    today: "Plans May Change",
    heart: "Adjusting As You Go",
    step: "Keep One Option Open",
  },

  "Justice": {
    today: "A Choice Needs Clarity",
    heart: "Weighing What's Fair",
    step: "Say What You Mean",
  },

  "The Hanged Man": {
    today: "Not Yet Moving",
    heart: "Seeing It Differently",
    step: "Don't Force It",
  },

  "Death": {
    today: "Something Is Ending",
    heart: "Ready To Let Go",
    step: "Stop Holding One Thing",
  },

  "Temperance": {
    today: "A Slower Pace",
    heart: "Finding Your Balance",
    step: "Do Less Today",
  },

  "The Devil": {
    today: "An Old Pattern",
    heart: "Falling Into A Loop",
    step: "Interrupt The Habit",
  },

  "The Tower": {
    today: "Something Isn't Working",
    heart: "Rethinking What Worked",
    step: "Adjust To What's Changed",
  },

  "The Star": {
    today: "Things Feel Lighter",
    heart: "Breathing A Bit Easier",
    step: "Retry One Small Thing",
  },

  "The Moon": {
    today: "Clarity Takes Time",
    heart: "Sorting Your Feelings",
    step: "Pause Before Deciding",
  },

  "The Sun": {
    today: "Things Feel Clearer",
    heart: "More Open Today",
    step: "Say It Plainly",
  },

  "Judgement": {
    today: "Something Needs Answering",
    heart: "Knowing It's Time",
    step: "Answer Honestly",
  },

  "The World": {
    today: "Something Is Completing",
    heart: "Ready For What's Next",
    step: "Finish One Thing",
  },

  // ─────────────────────────────
  // CUPS
  // ─────────────────────────────

  "Ace of Cups": {
    today: "Feelings Are Opening",
    heart: "Ready To Let Someone In",
    step: "Say Something Real",
  },

  "Two of Cups": {
    today: "A Connection Matters",
    heart: "Wanting It Mutual",
    step: "Meet Them Halfway",
  },

  "Three of Cups": {
    today: "Room For Connection",
    heart: "Wanting Some Company",
    step: "Reach Out First",
  },

  "Four of Cups": {
    today: "Nothing Feels Quite Right",
    heart: "Hard To Get Excited",
    step: "Notice What's Available",
  },

  "Five of Cups": {
    today: "Something Still Stings",
    heart: "Missing What Was There",
    step: "Notice What Remains",
  },

  "Six of Cups": {
    today: "The Past Comes Up",
    heart: "Feeling A Bit Nostalgic",
    step: "Look Back, Then Return",
  },

  "Seven of Cups": {
    today: "Too Many Possibilities",
    heart: "Unsure What You Want",
    step: "Narrow It Down",
  },

  "Eight of Cups": {
    today: "Something Feels Finished",
    heart: "Wanting Something Else",
    step: "Take Some Distance",
  },

  "Nine of Cups": {
    today: "Something Feels Good",
    heart: "Enjoying Where You Are",
    step: "Let Yourself Enjoy It",
  },

  "Ten of Cups": {
    today: "Home Feels Important",
    heart: "Wanting More Ease",
    step: "Make Time Together",
  },

  "Page of Cups": {
    today: "Something Catches You",
    heart: "A Little More Curious",
    step: "Look Into It",
  },

  "Knight of Cups": {
    today: "Something Wants Saying",
    heart: "Ready To Reach Out",
    step: "Send The Message",
  },

  "Queen of Cups": {
    today: "Feelings Run Deeper",
    heart: "Taking Things To Heart",
    step: "Give Yourself Space",
  },

  "King of Cups": {
    today: "A Feeling Needs Handling",
    heart: "Trying To Stay Steady",
    step: "Respond After Thinking",
  },

  // ─────────────────────────────
  // SWORDS
  // ─────────────────────────────

  "Ace of Swords": {
    today: "Something Clicks",
    heart: "Seeing It More Clearly",
    step: "Write It Down",
  },

  "Two of Swords": {
    today: "A Decision Is Waiting",
    heart: "Putting Off The Choice",
    step: "Pick One Option",
  },

  "Three of Swords": {
    today: "Something Still Hurts",
    heart: "Still Thinking About It",
    step: "Name What Hurt",
  },

  "Four of Swords": {
    today: "Your Brain Needs Rest",
    heart: "Mentally Worn Out",
    step: "Take A Real Break",
  },

  "Five of Swords": {
    today: "Tension Is Lingering",
    heart: "A Little Defensive",
    step: "Let One Point Go",
  },

  "Six of Swords": {
    today: "Things Are Settling",
    heart: "Ready For More Quiet",
    step: "Give It Less Attention",
  },

  "Seven of Swords": {
    today: "Something Isn't Adding Up",
    heart: "Keeping Something Back",
    step: "Check The Details",
  },

  "Eight of Swords": {
    today: "Options Feel Limited",
    heart: "Stuck In Your Head",
    step: "Question One Assumption",
  },

  "Nine of Swords": {
    today: "Thoughts Keep Circling",
    heart: "Worrying More Than Usual",
    step: "Get It On Paper",
  },

  "Ten of Swords": {
    today: "You've Had Enough",
    heart: "Ready To Be Done",
    step: "Stop Reopening It",
  },

  "Page of Swords": {
    today: "Something Needs Checking",
    heart: "Curious But Cautious",
    step: "Ask One Question",
  },

  "Knight of Swords": {
    today: "Things Move Quickly",
    heart: "Eager To Respond",
    step: "Read It Twice",
  },

  "Queen of Swords": {
    today: "Clarity Matters",
    heart: "Less Willing To Pretend",
    step: "Be Direct, Not Harsh",
  },

  "King of Swords": {
    today: "A Clear Call",
    heart: "Thinking More Than Feeling",
    step: "Use The Facts",
  },

  // ─────────────────────────────
  // WANDS
  // ─────────────────────────────

  "Ace of Wands": {
    today: "An Idea Feels Promising",
    heart: "Wanting To Start",
    step: "Make A First Draft",
  },

  "Two of Wands": {
    today: "The Next Step Matters",
    heart: "Thinking Ahead",
    step: "Choose A Direction",
  },

  "Three of Wands": {
    today: "Progress Needs Patience",
    heart: "Waiting For Results",
    step: "Follow Up Once",
  },

  "Four of Wands": {
    today: "Something Worth Enjoying",
    heart: "Wanting Familiar Faces",
    step: "Share The Moment",
  },

  "Five of Wands": {
    today: "Everyone Has An Opinion",
    heart: "Feeling A Bit Tested",
    step: "Pick Your Battles",
  },

  "Six of Wands": {
    today: "Progress Gets Noticed",
    heart: "Wanting Some Recognition",
    step: "Own What You Did",
  },

  "Seven of Wands": {
    today: "Someone Pushes Back",
    heart: "Feeling A Little Pressured",
    step: "Hold One Boundary",
  },

  "Eight of Wands": {
    today: "Things Pick Up",
    heart: "Trying To Keep Up",
    step: "Handle One Thing First",
  },

  "Nine of Wands": {
    today: "It's Been A Long Stretch",
    heart: "Tired But Still Trying",
    step: "Say No To One Thing",
  },

  "Ten of Wands": {
    today: "There's Too Much On You",
    heart: "Carrying Too Much",
    step: "Drop One Task",
  },

  "Page of Wands": {
    today: "Something Sounds Interesting",
    heart: "Ready For Something Different",
    step: "Explore It A Little",
  },

  "Knight of Wands": {
    today: "You're Ready To Move",
    heart: "Restless For Change",
    step: "Start, Then Adjust",
  },

  "Queen of Wands": {
    today: "You May Get Noticed",
    heart: "Feeling More Like Yourself",
    step: "Speak Up Once",
  },

  "King of Wands": {
    today: "A Plan Needs Direction",
    heart: "Ready To Take Charge",
    step: "Set The Next Step",
  },

  // ─────────────────────────────
  // PENTACLES
  // ─────────────────────────────

  "Ace of Pentacles": {
    today: "A Real Opportunity",
    heart: "Ready For Something Solid",
    step: "Start With The Basics",
  },

  "Two of Pentacles": {
    today: "A Lot To Juggle",
    heart: "Trying To Keep Up",
    step: "Choose What Comes First",
  },

  "Three of Pentacles": {
    today: "Work Needs Teamwork",
    heart: "Wanting To Be Useful",
    step: "Ask For Input",
  },

  "Four of Pentacles": {
    today: "Something Feels Hard To Release",
    heart: "Wanting More Security",
    step: "Let One Thing Go",
  },

  "Five of Pentacles": {
    today: "Something Feels Hard",
    heart: "Feeling A Bit Alone",
    step: "Ask Someone For Help",
  },

  "Six of Pentacles": {
    today: "Give And Take Matters",
    heart: "Noticing The Balance",
    step: "Accept Some Help",
  },

  "Seven of Pentacles": {
    today: "Results Take Time",
    heart: "Wondering If It's Worth It",
    step: "Check Your Progress",
  },

  "Eight of Pentacles": {
    today: "Practice Matters Today",
    heart: "Focused On Improving",
    step: "Do One Thing Better",
  },

  "Nine of Pentacles": {
    today: "There's Room To Enjoy This",
    heart: "Enjoying Your Independence",
    step: "Do Something For Yourself",
  },

  "Ten of Pentacles": {
    today: "Long-Term Things Matter",
    heart: "Thinking About Stability",
    step: "Plan Past This Week",
  },

  "Page of Pentacles": {
    today: "Something Worth Learning",
    heart: "Ready To Get Better",
    step: "Learn One Useful Thing",
  },

  "Knight of Pentacles": {
    today: "Routine Gets It Done",
    heart: "Fine With Going Slowly",
    step: "Do The Next Task",
  },

  "Queen of Pentacles": {
    today: "Something Needs Handling",
    heart: "Wanting Things Settled",
    step: "Handle One Loose End",
  },

  "King of Pentacles": {
    today: "A Practical Choice",
    heart: "Thinking Long Term",
    step: "Make The Sensible Choice",
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
  return getEchoCardImage(label) || "/cards/one.png";
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
