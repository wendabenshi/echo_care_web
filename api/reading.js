const { loadServerEnv } = require("../src/utils/serverEnv");

loadServerEnv();

function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function normalizeWhitespace(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

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

function shapeDailyReading(reading) {
  const todaysEnergy = shortenForDaily(reading.todaysEnergy || reading.guidance, 2, 190);
  const forYourHeart = shortenForDaily(reading.forYourHeart || reading.needToday || reading.love, 2, 180);
  const oneSmallAction = shortenForDaily(reading.oneSmallAction || reading.smallAction, 2, 170);
  const companionNote = shortenForDaily(reading.companionNote, 2, 180);

  return {
    kind: "daily",
    cardReadings: Array.isArray(reading.cardReadings)
      ? reading.cardReadings.slice(0, 1).map((item, index) => ({
          position: normalizeWhitespace(item?.position || `Card ${index + 1}`),
          card: normalizeWhitespace(item?.card || `Card ${index + 1}`),
          message: shortenForDaily(item?.message, 2, 220),
        }))
      : [],
    todaysEnergy,
    forYourHeart,
    oneSmallAction,
    companionNote,
    guidance: todaysEnergy,
    love: forYourHeart,
    needToday: forYourHeart,
    smallAction: oneSmallAction,
    provider: reading.provider || "fallback",
  };
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

    return shapeDailyReading({
      kind: "daily",
      cardReadings: cards.map((card, index) => ({
        position: String(card.position ?? `Card ${index + 1}`),
        card: String(card.name ?? `Card ${index + 1}`),
        message:
          String(card.meaning ?? "").trim() ||
          "This card stays beside you like a quiet light, asking you to soften a little and trust what feels honest today.",
      })),
      guidance:
        "Take a breath and notice how your heart is arriving today. This is not a warning or a prediction, just a gentle place to begin.",
      todaysEnergy:
        "Take a breath and notice how your heart is arriving today. This is not a warning or a prediction, just a gentle place to begin.",
      forYourHeart:
        "What you need most today may be softness, steadiness, and permission to move at your own pace instead of pushing past yourself.",
      oneSmallAction:
        "Set your phone aside for ten quiet minutes and ask yourself: what would feel most supportive to me right now?",
      companionNote: "Whatever today becomes, you do not have to earn softness before receiving it. I am with you for this moment.",
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

function buildPrompt(payload) {
  if (payload.mode === "daily") {
    return [
      "You are the voice of an NFC companion ring in a tarot wellness app.",
      "Return JSON only.",
      "This is a daily companion reading, not a predictive fortune.",
      "The tone must feel warm, intimate, emotionally intelligent, and lightly spiritual.",
      "Write as if the ring is gently speaking to the user, not as if an AI is clinically analyzing them.",
      "Avoid generic coaching language, avoid sounding like a horoscope, avoid hard prediction.",
      "Use the card as a lens, then offer grounded emotional companionship for today.",
      "Structure the response like a quiet mobile journal page that can be read in 20 to 30 seconds.",
      "Each field should feel natural, soft, and human.",
      "Keep each field brief: usually 1 to 2 short sentences, with breathable rhythm.",
      "Prefer clarity and softness over richness or explanation.",
      "Do not include career, money, or productivity advice unless the card absolutely requires it.",
      "Field responsibilities:",
      "1. todaysEnergy: the main emotional tone of the day.",
      "2. forYourHeart: what the user most needs inwardly today.",
      "3. oneSmallAction: one gentle, concrete action for today.",
      "4. companionNote: a soft closing line of companionship.",
      "",
      `Question: ${payload.question}`,
      `Spread Title: ${payload.spreadTitle}`,
      `Positions: ${JSON.stringify(payload.positions)}`,
      `Cards: ${JSON.stringify(payload.cards)}`,
      "",
      `JSON schema:
{
  "kind": "daily",
  "cardReadings": [
    { "position": "string", "card": "string", "message": "string" }
  ],
  "todaysEnergy": "string",
  "forYourHeart": "string",
  "oneSmallAction": "string",
  "companionNote": "string"
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

async function requestGeminiReading(payload) {
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
            parts: [{ text: buildPrompt(payload) }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.85,
        },
      }),
    },
  );

  const result = await response.json().catch(() => null);
  if (!response.ok || !result) {
    throw new Error(result?.error?.message ?? "Gemini reading failed");
  }

  const parsed = parseReadingJson(extractJsonText(result));

  if (payload.mode === "daily") {
    return shapeDailyReading({
      kind: "daily",
      cardReadings: Array.isArray(parsed.cardReadings) ? parsed.cardReadings : [],
      todaysEnergy: String(parsed.todaysEnergy ?? parsed.guidance ?? ""),
      forYourHeart: String(parsed.forYourHeart ?? parsed.needToday ?? parsed.love ?? ""),
      oneSmallAction: String(parsed.oneSmallAction ?? parsed.smallAction ?? ""),
      companionNote: String(parsed.companionNote ?? ""),
      provider: "gemini",
    });
  }

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
