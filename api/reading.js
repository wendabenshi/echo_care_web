const { loadServerEnv } = require("../src/utils/serverEnv");

loadServerEnv();

function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function normalizeWhitespace(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

const DAILY_BANNED_PHRASES = [
  "emotional pattern",
  "nervous system",
  "healing journey",
  "inner journey",
  "healing process",
  "transformation",
  "alignment",
  "the universe",
  "destiny",
];

const DAILY_REAL_LIFE_HINTS = [
  "work",
  "career",
  "job",
  "project",
  "meeting",
  "decision",
  "conversation",
  "message",
  "text",
  "relationship",
  "family",
  "friend",
  "friends",
  "home",
  "team",
  "meal",
  "partner",
  "loved one",
  "loved ones",
  "habit",
  "routine",
  "goal",
  "reply",
  "start",
  "begin",
];

const MAGICIAN_REQUIRED_HINTS = [
  "initiative",
  "resourceful",
  "resourcefulness",
  "skill",
  "skills",
  "resource",
  "resources",
  "tool",
  "tools",
  "available",
  "existing",
  "start",
  "begin",
  "action",
  "draft",
  "project",
  "message",
  "work",
];

const DAILY_FALLBACK_ARCHETYPES = {
  initiative: {
    coreTemplate:
      "{card} points to a day when momentum matters. Something moves once you stop waiting for a better moment.",
    reflectsTemplate:
      "{card} is about initiative, direction, and making use of what is already in front of you. In daily life, it often appears when a conversation, personal plan, or unfinished idea is ready to move from thinking into action.",
    scenarioTemplate:
      "This may show up in a message you keep drafting, a decision in your personal life that has stayed unresolved, or a step you already know how to take but keep postponing. The card fits moments when the real shift is not more preparation, but starting with what you already have.",
    shiftTemplate:
      "Take the first practical step today. Send the draft, say the thing, make the call, or begin the part you can do now before your doubts get another full day.",
    reminderTemplate:
      "Progress may not need a breakthrough today. It may only need your first clear move.",
  },
  connection: {
    coreTemplate:
      "{card} points to a day when connection, warmth, or shared feeling matters more than staying guarded.",
    reflectsTemplate:
      "{card} reflects closeness, emotional openness, and the part of daily life that feels better when it is shared honestly. Today it often points to relationships, affection, support, or the kind of home feeling you want to protect.",
    scenarioTemplate:
      "This may show up in a relationship conversation, time with family, a friend you have been meaning to answer, or the question of whether a connection truly feels mutual. The card fits moments when harmony depends on participation, not silent hoping.",
    shiftTemplate:
      "Do one small thing that supports connection today. Reply with care, say what you appreciate, check in first, or make space for a conversation you actually want to have.",
    reminderTemplate:
      "Closeness usually grows through small, honest gestures, not perfect timing.",
  },
  pause: {
    coreTemplate:
      "{card} points to a day when slowing down gives you better information than forcing an answer.",
    reflectsTemplate:
      "{card} reflects pause, observation, and the need to notice what is happening beneath the obvious surface. In daily life, it matters when you are tempted to rush a decision before your thoughts, feelings, or timing are actually settled.",
    scenarioTemplate:
      "This may show up in a conversation you are not ready to have, a personal decision that still feels unclear, or a habit of answering too fast just to stop the discomfort. The card fits moments when waiting briefly is wiser than reacting quickly.",
    shiftTemplate:
      "Give one unresolved situation a little more space today. Write your real thoughts down, wait before replying, or ask one clarifying question before choosing your next move.",
    reminderTemplate:
      "A slower answer can still be a strong answer.",
  },
  truth: {
    coreTemplate:
      "{card} points to a day when honesty and steadiness matter more than keeping everything comfortable.",
    reflectsTemplate:
      "{card} reflects clear standards, self-respect, and the willingness to deal with what is actually true. In daily life, it often appears when structure, boundaries, or direct communication matter more than keeping the peace.",
    scenarioTemplate:
      "This may show up in naming a boundary, making a fair decision, clarifying what you can realistically give, or finally saying what you can and cannot carry. The card fits moments when being clear is kinder than staying vague.",
    shiftTemplate:
      "Choose one place to be more direct today. Set the expectation, give the honest answer, or simplify the decision so you are no longer negotiating against yourself.",
    reminderTemplate:
      "Clarity can be caring, especially when it keeps you from abandoning yourself.",
  },
  change: {
    coreTemplate:
      "{card} points to a day when something is shifting, ending, or asking to be faced more directly.",
    reflectsTemplate:
      "{card} reflects disruption, release, or the moment when an old way stops holding together. In daily life, it matters when you can already feel that a pattern, expectation, or attachment is no longer carrying you where you need to go.",
    scenarioTemplate:
      "This may show up in a dynamic that keeps repeating, a relationship pattern that has run its course, or a truth you can no longer smooth over. The card fits moments when discomfort is part of making room for something more honest.",
    shiftTemplate:
      "Name what is no longer working today. Stop feeding the loop, change one part of the routine, or let one outdated expectation lose its hold on the rest of your day.",
    reminderTemplate:
      "Not every disruption is a setback. Some are the moment things stop pretending.",
  },
  gentle: {
    coreTemplate:
      "{card} points to a day when steadier care will take you further than pressure.",
    reflectsTemplate:
      "{card} reflects the value of patience, softness, and responding with more care than force. In daily life, it often matters when you are trying to hold something together without exhausting yourself in the process.",
    scenarioTemplate:
      "This may show up in the way you speak to yourself, how you handle a tense exchange, or how you approach something in daily life that has started to feel heavier than it should. The card fits moments that improve when you stop pushing so hard.",
    shiftTemplate:
      "Choose the gentler version of the next step today. Lower the pressure, shorten the task, soften your tone, or do the sustainable thing instead of the dramatic one.",
    reminderTemplate:
      "Softness is not the opposite of progress.",
  },
};

function splitSentences(value) {
  return normalizeWhitespace(value).match(/[^.!?]+[.!?]?/g) ?? [];
}

function shortenForDaily(value, maxSentences = 2, maxChars = 210) {
  const normalized = normalizeWhitespace(value);
  if (!normalized) return "";

  const sentences = splitSentences(normalized)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, maxSentences);

  let result = sentences.join(" ").trim() || normalized;
  if (result.length > maxChars) {
    result = `${result.slice(0, maxChars).trim().replace(/[,:;.\-–—\s]+$/g, "")}.`;
  }
  return result;
}

function shortenToWordLimit(value, maxWords, maxChars = 999) {
  const normalized = normalizeWhitespace(value);
  if (!normalized) return "";

  const words = normalized.split(/\s+/).filter(Boolean).slice(0, maxWords);
  let result = words.join(" ").trim();

  if (result.length > maxChars) {
    result = result.slice(0, maxChars).trim();
  }

  return result.replace(/[,:;.\-–—\s]+$/g, "").trim();
}

function shapeDailyReading(reading) {
  const sections = reading.sections ?? {};
  const cardName = normalizeWhitespace(
    reading.card_name ||
      reading.cardName ||
      reading.card ||
      reading.cardReadings?.[0]?.card,
  );
  const coreInsight = shortenToWordLimit(
    reading.core_insight || reading.coreInsight || reading.forYourHeart || reading.todaysEnergy,
    20,
    150,
  );
  const whatThisCardReflects = shortenToWordLimit(
    sections.what_this_card_reflects || reading.what_this_card_reflects || reading.todaysEnergy || reading.guidance,
    50,
    360,
  );
  const whereYouMayBeNow = shortenToWordLimit(
    sections.where_you_may_be_now || reading.where_you_may_be_now || reading.forYourHeart || reading.needToday || reading.love,
    70,
    480,
  );
  const oneSmallShift = shortenToWordLimit(
    sections.one_small_shift || reading.one_small_shift || reading.oneSmallAction || reading.smallAction,
    45,
    320,
  );
  const gentleReminder = shortenToWordLimit(
    sections.gentle_reminder || reading.gentle_reminder || reading.companionNote,
    25,
    180,
  );

  return {
    kind: "daily",
    card_name: cardName,
    core_insight: coreInsight,
    sections: {
      what_this_card_reflects: whatThisCardReflects,
      where_you_may_be_now: whereYouMayBeNow,
      one_small_shift: oneSmallShift,
      gentle_reminder: gentleReminder,
    },
    provider: reading.provider || "fallback",
  };
}

function containsAnyHint(text, hints) {
  const normalized = normalizeWhitespace(text).toLowerCase();
  return hints.some((hint) => normalized.includes(hint));
}

function validateDailyReadingCandidate(candidate, payload) {
  const shaped = shapeDailyReading(candidate);
  const allText = [
    shaped.card_name,
    shaped.core_insight,
    shaped.sections.what_this_card_reflects,
    shaped.sections.where_you_may_be_now,
    shaped.sections.one_small_shift,
    shaped.sections.gentle_reminder,
  ]
    .map((item) => normalizeWhitespace(item).toLowerCase())
    .join(" ");

  if (DAILY_BANNED_PHRASES.some((phrase) => allText.includes(phrase))) {
    throw new Error("Daily reading used banned old-template language");
  }

  if (!containsAnyHint(shaped.sections.where_you_may_be_now, DAILY_REAL_LIFE_HINTS)) {
    throw new Error("Daily reading missed a real-life scenario");
  }

  if (shaped.card_name === "The Magician" && !containsAnyHint(allText, MAGICIAN_REQUIRED_HINTS)) {
    throw new Error("The Magician reading missed initiative/resources/action language");
  }

  return shaped;
}

function fillDailyTemplate(template, cardName, cardMeaning) {
  return template
    .replace(/\{card\}/g, cardName)
    .replace(/\{meaning\}/g, cardMeaning || "what this card is pointing toward today");
}

function getDailyFallbackArchetype(cardName) {
  const normalized = normalizeWhitespace(cardName);

  if (normalized === "The Magician") return "initiative";

  if (
    [
      "The Fool",
      "The Chariot",
      "Judgement",
      "Ace of Wands",
      "Knight of Wands",
    ].includes(normalized)
  ) {
    return "initiative";
  }

  if (
    [
      "The Empress",
      "The Lovers",
      "The Sun",
      "Two of Cups",
      "Three of Cups",
      "Ace of Cups",
      "Ten of Cups",
      "Queen of Cups",
      "Knight of Cups",
    ].includes(normalized) || normalized.includes("Cups")
  ) {
    return "connection";
  }

  if (
    [
      "The High Priestess",
      "The Hermit",
      "The Hanged Man",
      "The Moon",
      "Temperance",
      "Two of Swords",
    ].includes(normalized)
  ) {
    return "pause";
  }

  if (
    [
      "The Emperor",
      "Justice",
      "Strength",
      "The World",
    ].includes(normalized)
  ) {
    return "truth";
  }

  if (
    [
      "Wheel of Fortune",
      "Death",
      "The Devil",
      "The Tower",
      "Three of Swords",
    ].includes(normalized)
  ) {
    return "change";
  }

  return "gentle";
}

function shortenForQuestion(value, maxSentences = 3, maxChars = 320) {
  const normalized = normalizeWhitespace(value);
  if (!normalized) return "";

  const sentences = splitSentences(normalized)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, maxSentences);

  let result = sentences.join(" ").trim() || normalized;
  if (result.length > maxChars) {
    result = `${result.slice(0, maxChars).trim().replace(/[,:;.\-–—\s]+$/g, "")}.`;
  }
  return result;
}

function shapeQuestionReading(reading) {
  return {
    kind: "question",
    reflection: shortenForQuestion(reading.reflection, 2, 220),
    cardReadings: Array.isArray(reading.cardReadings)
      ? reading.cardReadings.slice(0, 3).map((item, index) => ({
          position: normalizeWhitespace(item?.position || `Card ${index + 1}`),
          card: normalizeWhitespace(item?.card || `Card ${index + 1}`),
          message: shortenForQuestion(item?.message, 3, 320),
        }))
      : [],
    combined: shortenForQuestion(reading.combined, 4, 420),
    gentleReminder: shortenForQuestion(reading.gentleReminder, 2, 220),
    followUps: Array.isArray(reading.followUps)
      ? reading.followUps.map((item) => normalizeWhitespace(item)).filter(Boolean).slice(0, 3)
      : [],
    provider: reading.provider || "fallback",
  };
}

function buildFallbackReading(payload) {
  if (payload.mode === "daily") {
    const cards = Array.isArray(payload.cards) ? payload.cards : [];
    const card = cards[0] ?? {};
    const cardName = String(card.name ?? "Today's Card").trim();
    const cardMeaning = normalizeWhitespace(card.meaning);
    const fallbackArchetype = DAILY_FALLBACK_ARCHETYPES[getDailyFallbackArchetype(cardName)];
    const magicianFallback =
      cardName === "The Magician"
        ? {
            core_insight:
              "The Magician points to a day when initiative matters more than waiting. The next step may already be within reach.",
            sections: {
              what_this_card_reflects:
                "The Magician represents initiative, resourcefulness, and making something happen with what is already available. Today this card matters because it asks you to stop treating readiness like a distant event and notice the skills, tools, and support you already have.",
              where_you_may_be_now:
                "This may show up in a work decision you keep delaying, a message you have drafted but not sent, or a project you want to begin once everything feels perfect. The Magician fits moments where the real next step is not learning more, but using what you already know and starting from there.",
              one_small_shift:
                "Use one resource you already have today. Send the draft, reuse the notes, ask the capable person for ten minutes, or begin with the first version instead of waiting for the ideal one.",
              gentle_reminder:
                "You may not need more time or more tools today. You may only need to begin with what is already in your hands.",
            },
          }
        : null;

    return shapeDailyReading({
      kind: "daily",
      card_name: cardName,
      core_insight:
        magicianFallback?.core_insight ??
        fillDailyTemplate(fallbackArchetype.coreTemplate, cardName, cardMeaning),
      sections:
        magicianFallback?.sections ?? {
          what_this_card_reflects:
            fillDailyTemplate(fallbackArchetype.reflectsTemplate, cardName, cardMeaning),
          where_you_may_be_now:
            fillDailyTemplate(fallbackArchetype.scenarioTemplate, cardName, cardMeaning),
          one_small_shift:
            fillDailyTemplate(fallbackArchetype.shiftTemplate, cardName, cardMeaning),
          gentle_reminder:
            fillDailyTemplate(fallbackArchetype.reminderTemplate, cardName, cardMeaning),
        },
      provider: "fallback",
    });
  }

  const question = String(payload.question ?? "").trim();
  const cards = Array.isArray(payload.cards) ? payload.cards : [];
  const isSingleCard = cards.length <= 1;

  const reflection = question
    ? `You do not need to solve everything at once. The fact that you asked "${question}" already tells us this matters deeply to you, and that honesty deserves gentleness.`
    : "You do not need to solve everything at once. Taking a quiet moment to ask is already part of the answer.";

  const cardRoles = [
    {
      position: "Your Heart Today",
      fallback:
        "You may be holding more feeling than you are showing. This card asks you to notice what your heart is protecting before asking it to decide.",
    },
    {
      position: "What's Influencing This",
      fallback:
        "Something around this question is still taking shape. Give the situation enough room to reveal whether it is steady, mutual, and real.",
    },
    {
      position: "Where To Focus",
      fallback:
        "The next step is not to force certainty. Focus on what is honest, consistent, and emotionally safe enough to meet you back.",
    },
  ];

  const cardReadings = cards.map((card, index) => {
    const role = cardRoles[index] ?? {
      position: `Card ${index + 1}`,
      fallback: "This card asks for patience, honesty, and a softer kind of courage than forcing certainty.",
    };

    return {
      position: String(card.position ?? role.position),
      card: String(card.name ?? `Card ${index + 1}`),
      message: String(card.meaning ?? "").trim() || role.fallback,
    };
  });

  const combined = isSingleCard
    ? "This message is less about prediction and more about what wants your attention right now. Let the card be a mirror, not a command."
    : "Together, these cards suggest that clarity comes through observation, emotional honesty, and the willingness to let the connection reveal itself over time.";

  const gentleReminder = isSingleCard
    ? "You do not need to earn rest before listening to yourself."
    : "Not every meaningful relationship arrives with certainty. Sometimes clarity comes from noticing who shows up with consistency and care.";

  return shapeQuestionReading({
    reflection,
    cardReadings,
    combined,
    gentleReminder,
    followUps: isSingleCard
      ? [
          "What feeling in me needs attention today?",
          "What am I overthinking right now?",
          "What would help me feel steadier today?",
        ]
      : [
          "What should I pay attention to next?",
          "What is my heart afraid of?",
          "What would help me feel more secure?",
        ],
    provider: "fallback",
  });
}

function buildPrompt(payload, correctionNote = "") {
  if (payload.mode === "daily") {
    const cardNames = payload.cards.map((card) => card.name).join(", ");
    return [
      "You are a grounded tarot companion who helps people notice what is happening in their real life today.",
      "Return JSON only.",
      "You do not predict the future.",
      "Use tarot symbolism to describe a recognizable life situation, not a therapeutic process.",
      "This is a Daily Reading page for a tarot-inspired emotional companion product.",
      "The tone must feel personal, conversational, grounded, and specific.",
      "Write like a thoughtful friend, not a therapist.",
      "Do NOT write like a spiritual teacher or a motivational speaker.",
      "Do not turn the reading into a healing article, a mindset lesson, or a poetic affirmation.",
      "Use the card as a lens for daily life: relationships, home life, feelings, conversations, habits, personal decisions, inner tension, work, or something the user keeps postponing.",
      "Write like a close friend who understands the user's day.",
      "The reading must include tarot symbolism, a real-life situation, and one concrete small shift.",
      "Do not write generalized advice with no real-life anchor.",
      "Never use these words or phrases: emotional pattern, nervous system, healing journey, inner journey, healing process, transformation, alignment, universe, destiny.",
      "If a sentence sounds abstract, rewrite it into a concrete daily-life observation before returning JSON.",
      "Do not default to work or career unless the card strongly points there.",
      "Across readings, relationship, home, family, friendship, personal life, daily habit, inner conflict, and emotional reality are just as valid as work.",
      "Prefer concrete situations such as a text message you haven't replied to, a conversation you avoided, tension at home, a relationship dynamic, a family expectation, a habit you want to change, a decision you keep postponing, a feeling you haven't named, or a project at work when it truly fits the card.",
      `Today's card: ${cardNames}.`,
      "If the card is The Magician, you must explicitly mention initiative or taking action, and you must refer to existing skills, tools, or resources already available.",
      "Field requirements:",
      "1. core_insight: maximum 20 words.",
      "2. sections.what_this_card_reflects: 35 to 50 words.",
      "3. sections.where_you_may_be_now: 50 to 70 words, and it MUST include at least one specific real-life scenario such as work, relationship, personal decision, daily habit, or personal goal.",
      "4. sections.one_small_shift: 30 to 45 words.",
      "5. sections.gentle_reminder: 15 to 25 words.",
      "Do not predict the future.",
      "Do not drift into therapy language, spiritual coaching language, or abstract emotional analysis.",
      correctionNote ? `Correction note: ${correctionNote}` : "",
      "",
      `Question: ${payload.question}`,
      `Spread Title: ${payload.spreadTitle}`,
      `Positions: ${JSON.stringify(payload.positions)}`,
      `Cards: ${JSON.stringify(payload.cards)}`,
      "",
      `JSON schema:
{
  "card_name": "string",
  "core_insight": "string",
  "sections": {
    "what_this_card_reflects": "string",
    "where_you_may_be_now": "string",
    "one_small_shift": "string",
    "gentle_reminder": "string"
  }
}`,
    ].join("\n");
  }

  return [
    "You are a calm emotional companion, not a cold fortune teller.",
    "Return JSON only.",
    "The reading must include: reflection, cardReadings, combined, gentleReminder, followUps.",
    "Design principle: answer first, explanation second.",
    "This is a question reading. The user wants a clear answer to their question, not a long tarot essay.",
    "Tone requirements: warm, supportive, emotionally intelligent, lightly spiritual, never harsh, never over-predictive.",
    "Write like an Apple Journal / Calm emotional companion: simple, spacious, human, and concise.",
    "Avoid tarot jargon unless it is the card name. Avoid words like destiny, prediction, fate, guaranteed, or timing certainty.",
    "Each cardReading must have a different job:",
    "1. First card: the user's current emotional state.",
    "2. Second card: what is influencing or shaping the situation.",
    "3. Third card: where to focus next.",
    "For each cardReading.message, write 2 to 3 short sentences. The first sentence must be a clear headline-like sentence.",
    "combined is the main answer. Start with a memorable 1 to 2 sentence answer, then add 1 to 2 short supporting sentences.",
    "gentleReminder should be 1 to 2 short sentences of companionship, not another card explanation.",
    "Follow-up questions should be short, emotionally insightful, and easy to continue with.",
    "",
    `Question: ${payload.question}`,
    `Spread Title: ${payload.spreadTitle}`,
    `Positions: ${JSON.stringify(payload.positions)}`,
    `Cards: ${JSON.stringify(payload.cards)}`,
    "",
    `JSON schema:
{
  "reflection": "string",
  "cardReadings": [
    { "position": "string", "card": "string", "message": "string" }
  ],
  "combined": "string",
  "gentleReminder": "string",
  "followUps": ["string", "string", "string"]
}`,
  ].join("\n");
}

function extractJsonText(result) {
  const text = result?.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
  return text.trim();
}

function parseReadingJson(raw) {
  const trimmed = raw.trim();
  const withoutFence = trimmed.replace(/^```json\s*|\s*```$/g, "").trim();
  return JSON.parse(withoutFence);
}

async function requestGeminiCandidate(payload, correctionNote = "") {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!apiKey) {
    return buildFallbackReading(payload);
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: buildPrompt(payload, correctionNote) }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: payload.mode === "daily" ? 0.4 : 0.55,
        },
      }),
    },
  );

  const result = await response.json().catch(() => null);
  if (!response.ok || !result) {
    throw new Error(result?.error?.message ?? "Gemini reading failed");
  }

  return parseReadingJson(extractJsonText(result));
}

async function requestGeminiReading(payload) {
  if (payload.mode === "daily") {
    // Temporary UI iteration mode: keep Daily Reading stable and quota-free by
    // always returning local fallback copy instead of calling Gemini.
    return buildFallbackReading(payload);
  }

  if (payload.mode === "love-energy" || (!payload.mode && Array.isArray(payload.cards) && payload.cards.length >= 3)) {
    // Temporary UI iteration mode: keep Question Reading stable and quota-free
    // while the layout is being tuned, including legacy requests that omit mode.
    return buildFallbackReading(payload);
  }

  const parsed = await requestGeminiCandidate(payload);

  return shapeQuestionReading({
    reflection: String(parsed.reflection ?? ""),
    cardReadings: Array.isArray(parsed.cardReadings) ? parsed.cardReadings : [],
    combined: String(parsed.combined ?? ""),
    gentleReminder: String(parsed.gentleReminder ?? ""),
    followUps: Array.isArray(parsed.followUps) ? parsed.followUps.slice(0, 3) : [],
    provider: "gemini",
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  let body = {};
  try {
    body = typeof req.body === "object" && req.body ? req.body : JSON.parse(req.body ?? "{}");
  } catch {
    return json(res, 400, { ok: false, error: "Invalid JSON body" });
  }

  const question = String(body.question ?? "").trim();
  const mode = String(body.mode ?? "").trim();
  const spreadTitle = String(body.spreadTitle ?? "").trim() || "Three-Card Insight";
  const positions = Array.isArray(body.positions) ? body.positions.map((item) => String(item ?? "")) : [];
  const cards = Array.isArray(body.cards)
    ? body.cards.map((card, index) => ({
        position: String(card?.position ?? positions[index] ?? `Card ${index + 1}`),
        name: String(card?.name ?? `Card ${index + 1}`),
        meaning: String(card?.meaning ?? ""),
      }))
    : [];

  if (!question || cards.length === 0) {
    return json(res, 400, { ok: false, error: "Missing question or cards" });
  }

  try {
    const reading = await requestGeminiReading({
      question,
      mode,
      spreadTitle,
      positions,
      cards,
    });

    return json(res, 200, {
      ok: true,
      reading,
    });
  } catch (error) {
    return json(res, 200, {
      ok: true,
      reading: buildFallbackReading({
        question,
        mode,
        spreadTitle,
        positions,
        cards,
      }),
      degraded: true,
      warning: error instanceof Error ? error.message : "Reading fell back",
    });
  }
};
