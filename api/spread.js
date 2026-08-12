const { loadServerEnv } = require("../src/utils/serverEnv");
const { shouldUseLocalContent } = require("./_content-source");

loadServerEnv();

function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function fallbackSpread(mode, question) {
  if (mode === "daily") {
    return {
      spreadTitle: "Today's Card",
      positions: [
        {
          title: "Today's energy",
          tags: ["Present", "Tone", "Guide"],
        },
      ],
      provider: "fallback",
    };
  }

  if (mode === "single-card") {
    return {
      spreadTitle: "Today's Reflection",
      positions: [
        {
          title: "The message for you today",
          tags: ["Clarity", "Support", "Presence"],
        },
      ],
      provider: "fallback",
    };
  }

  const title = question.toLowerCase().includes("love")
    ? "Heart Clarity Spread"
    : "Soul Connection Clarity";

  return {
    spreadTitle: title,
    positions: [
      {
        title: "Your heart right now",
        tags: ["Emotion", "Truth", "Tenderness"],
      },
      {
        title: "What is shaping this connection",
        tags: ["Pattern", "Balance", "Insight"],
      },
      {
        title: "Where clarity is leading",
        tags: ["Future", "Growth", "Direction"],
      },
    ],
    provider: "fallback",
  };
}

function buildPrompt(question, mode) {
  const positionCount = mode === "single-card" || mode === "daily" ? 1 : 3;
  return [
    "You design tarot spreads for an emotional companion app.",
    "Return JSON only.",
    "The output must feel warm, elegant, emotionally intelligent, and lightly spiritual.",
    `Create a ${positionCount}-position spread title and position labels for this question.`,
    "Each position should also include 2 to 3 concise tags.",
    "Avoid cliches, avoid harsh prediction, avoid vague labels like Card 1 / Card 2 / Card 3.",
    mode === "daily"
      ? "For daily mode, keep the title, single position label, and tags very short and minimal. Prefer phrases like Today's Card, Today's energy, Present, Tone, Guide."
      : "For relationship mode, make the spread feel intimate and emotionally observant.",
    "",
    `Mode: ${mode}`,
    `Question: ${question}`,
    "",
    `JSON schema:
{
  "spreadTitle": "string",
  "positions": [
    { "title": "string", "tags": ["string", "string", "string"] }
  ]
}`,
  ].join("\n");
}

function extractJsonText(result) {
  return result?.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim() ?? "";
}

function parseJson(raw) {
  return JSON.parse(raw.replace(/^```json\s*|\s*```$/g, "").trim());
}

async function requestGeminiSpread(question, mode) {
  if (shouldUseLocalContent()) {
    return fallbackSpread(mode, question);
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!apiKey) {
    return fallbackSpread(mode, question);
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
            parts: [{ text: buildPrompt(question, mode) }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.9,
        },
      }),
    },
  );

  const result = await response.json().catch(() => null);
  if (!response.ok || !result) {
    throw new Error(result?.error?.message ?? "Gemini spread failed");
  }

  const parsed = parseJson(extractJsonText(result));
  return {
    spreadTitle: String(parsed.spreadTitle ?? ""),
    positions: Array.isArray(parsed.positions)
      ? parsed.positions.map((item) => ({
          title: String(item?.title ?? ""),
          tags: Array.isArray(item?.tags) ? item.tags.map((tag) => String(tag ?? "")).filter(Boolean).slice(0, 3) : [],
        }))
      : [],
    provider: "gemini",
  };
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
  const mode = String(body.mode ?? "love-energy").trim() || "love-energy";

  if (!question) {
    return json(res, 400, { ok: false, error: "Missing question" });
  }

  try {
    const spread = await requestGeminiSpread(question, mode);
    return json(res, 200, { ok: true, spread });
  } catch (error) {
    return json(res, 200, {
      ok: true,
      spread: fallbackSpread(mode, question),
      degraded: true,
      warning: error instanceof Error ? error.message : "Spread generation fell back",
    });
  }
};
