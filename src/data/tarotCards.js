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

const CARD_LOVE_MEANINGS = {
  "The Fool":
    "Something new is trying to begin. Love may ask you to move before you feel fully ready.",
  "The Magician":
    "You have more influence here than you think. Honest action can shift the energy.",
  "The High Priestess":
    "Trust what you already sense beneath the surface. Not everything needs to be spoken yet.",
  "The Empress":
    "Warmth, nurture, and openness are available. Let affection be expressed, not only imagined.",
  "The Emperor":
    "Structure and honesty matter now. Love grows where boundaries are clear and respect is mutual.",
  "The Hierophant":
    "Shared values and expectations matter more than usual. Talk about what commitment means to you.",
  "The Lovers":
    "A meaningful choice is present. Your heart is being asked to align with what you truly value.",
  "The Chariot":
    "Momentum is building. If you want this to move forward, your direction needs to stay steady.",
  Strength:
    "Gentle persistence beats force. Soft courage will take this further than pressure or fear.",
  "The Hermit":
    "A pause for reflection may protect you. Solitude now can clarify what your heart actually wants.",
  "Wheel of Fortune":
    "The situation is turning. What felt stuck may shift sooner than expected, so stay open to timing.",
  Justice:
    "Balance and truth are central. What is fair and what is honest will guide the next step.",
  "The Hanged Man":
    "Waiting is part of the story. A different perspective may reveal what action cannot yet.",
  Death:
    "An old pattern is ending to make room for something truer. Release what love has outgrown.",
  Temperance:
    "Patience and moderation will serve you. The right connection rarely needs to be forced.",
  "The Devil":
    "Watch for attachment, obsession, or old loops. Name what keeps pulling you back.",
  "The Tower":
    "A shake-up may clear illusions. Uncomfortable truth can still protect your heart long-term.",
  "The Star":
    "Hope is not naive here. Healing and renewal are quietly becoming possible again.",
  "The Moon":
    "Mixed signals or uncertainty may cloud things. Move slowly until feelings become clearer.",
  "The Sun":
    "Joy, clarity, and warmth want in. This energy favors honesty, playfulness, and open-heartedness.",
  Judgement:
    "A wake-up call around love is arriving. Answer it with compassion, not self-judgment.",
  "The World":
    "Completion and fulfillment are within reach. A cycle may be ready to mature into something whole.",
  "Ace of Cups":
    "A fresh feeling is opening. Let yourself notice where tenderness wants to begin.",
  "Two of Cups":
    "Mutuality matters here. Connection deepens when both people step toward each other.",
  "Three of Cups":
    "Joy grows more easily in company. Let friendship, celebration, or support back you up.",
  "Four of Cups":
    "Something may be available, but your heart could be too tired to reach for it yet.",
  "Five of Cups":
    "Loss still carries weight. Grieve what hurts, but do not miss what remains.",
  "Six of Cups":
    "The past is close by. Nostalgia can teach you something, but it should not run the whole story.",
  "Seven of Cups":
    "Too many possibilities can blur the truth. Narrow your attention to what feels real.",
  "Eight of Cups":
    "Something no longer satisfies your spirit. Walking away may be an act of self-respect.",
  "Nine of Cups":
    "There is room to enjoy what is already good. Let contentment count for something.",
  "Ten of Cups":
    "Harmony, home, and emotional ease want your attention. Notice what helps love feel safe.",
  "Page of Cups":
    "A soft message or new feeling is trying to reach you. Stay open without rushing.",
  "Knight of Cups":
    "A heartfelt gesture wants movement. Say what you feel with sincerity and steadiness.",
  "Queen of Cups":
    "Emotional wisdom is your strength here. Care deeply, but do not abandon yourself.",
  "King of Cups":
    "A feeling needs calm stewardship. Let emotional maturity guide your next response.",
  "Ace of Swords":
    "Clarity is breaking through. A simple honest truth may be more helpful than a perfect one.",
  "Two of Swords":
    "A decision is waiting. Stillness can help, but not if it turns into avoidance.",
  "Three of Swords":
    "Something hurts because it matters. Let the truth of the pain be named gently.",
  "Four of Swords":
    "Rest is part of the answer. A quieter mind will help you hear your real feelings.",
  "Five of Swords":
    "Tension may leave everyone feeling a little bruised. Winning is not always worth the cost.",
  "Six of Swords":
    "You are moving out of rougher water. Healing may be slower than you want, but it is happening.",
  "Seven of Swords":
    "Something may be hidden, avoided, or half-said. Look closely at what is missing from the story.",
  "Eight of Swords":
    "You may feel trapped, but some of the walls around you are made of fear or assumption.",
  "Nine of Swords":
    "Worry is loud right now. Write it down, say it aloud, or bring it into daylight.",
  "Ten of Swords":
    "A difficult cycle may be ending. What feels final now can also clear space for relief.",
  "Page of Swords":
    "Curiosity wants facts before conclusions. Ask the extra question and read the room clearly.",
  "Knight of Swords":
    "Momentum is strong, but speed can outrun care. Be direct without becoming reckless.",
  "Queen of Swords":
    "Discernment is a kindness here. Tell the truth clearly, even if it asks for firmness.",
  "King of Swords":
    "Clear judgment is needed. Let reason support the heart, not silence it.",
  "Ace of Wands":
    "A spark is alive again. Energy returns when you honor what genuinely excites you.",
  "Two of Wands":
    "The future is asking for a choice. Think beyond what is comfortable and choose a direction.",
  "Three of Wands":
    "Progress is already in motion. Stay patient enough to let your effort travel farther.",
  "Four of Wands":
    "There is something worth celebrating or stabilizing. Let joy have structure, not only momentum.",
  "Five of Wands":
    "Friction is teaching you something. Not every difference is a threat, but not every battle is worth it.",
  "Six of Wands":
    "Recognition matters more than usual. Let yourself receive support, praise, or visible progress.",
  "Seven of Wands":
    "You may need to defend what matters. Hold your ground without losing your center.",
  "Eight of Wands":
    "Things are moving quickly. Choose the one message, action, or answer that matters most.",
  "Nine of Wands":
    "You are tired, but not finished. Protect your energy while staying loyal to what matters.",
  "Ten of Wands":
    "The load is too heavy to carry alone. Put something down before it turns into resentment.",
  "Page of Wands":
    "A new path is calling for exploration. Curiosity is enough to begin with.",
  "Knight of Wands":
    "Passion wants movement. Start boldly, then stay awake to the consequences of speed.",
  "Queen of Wands":
    "Confidence grows when you stop shrinking your presence. Let warmth and self-trust lead.",
  "King of Wands":
    "Vision needs direction now. Lead the energy instead of waiting for certainty.",
  "Ace of Pentacles":
    "A grounded opportunity is here. Small practical steps can grow into something lasting.",
  "Two of Pentacles":
    "Balance is possible, but it needs rhythm. Choose what deserves your energy first.",
  "Three of Pentacles":
    "Something better can be built with help. Collaboration is part of the answer.",
  "Four of Pentacles":
    "Security matters, but holding too tightly can keep life from moving. Notice where fear grips.",
  "Five of Pentacles":
    "Hardship can feel isolating, but support may be closer than it first appears.",
  "Six of Pentacles":
    "Give and take wants rebalancing. Let generosity flow in both directions.",
  "Seven of Pentacles":
    "Growth takes time. Pause long enough to notice what is slowly taking root.",
  "Eight of Pentacles":
    "Careful practice is shaping the outcome. Improvement matters more than instant perfection.",
  "Nine of Pentacles":
    "Enjoy what you have cultivated. Independence can be elegant, not lonely.",
  "Ten of Pentacles":
    "Think in terms of legacy, home, and stability. What you build now can outlast the moment.",
  "Page of Pentacles":
    "A lesson, skill, or practical promise is ready to be taken seriously. Stay teachable.",
  "Knight of Pentacles":
    "Steady effort will carry this farther than intensity. Trust patient consistency.",
  "Queen of Pentacles":
    "Care for the practical world around you. Nurture becomes stronger when it is grounded.",
  "King of Pentacles":
    "Stability, stewardship, and wise provision are central. Choose what will still hold tomorrow.",
};

/** @type {{ label: string, loveMeaning: string }[]} */
export const TAROT_CARDS = Object.entries(CARD_LOVE_MEANINGS).map(
  ([label, loveMeaning]) => ({
    label,
    loveMeaning,
  }),
);

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
