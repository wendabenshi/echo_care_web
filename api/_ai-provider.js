const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const DEFAULT_DEEPSEEK_MODEL = "deepseek-chat";

function getAiProvider() {
  return String(process.env.AI_PROVIDER || "gemini").trim().toLowerCase() === "deepseek"
    ? "deepseek"
    : "gemini";
}

function getProviderConfig() {
  const provider = getAiProvider();

  if (provider === "deepseek") {
    return {
      provider,
      apiKey: process.env.DEEPSEEK_API_KEY,
      model: process.env.DEEPSEEK_MODEL || DEFAULT_DEEPSEEK_MODEL,
    };
  }

  return {
    provider,
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
    model: process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL,
  };
}

function extractJsonText(provider, result) {
  if (provider === "deepseek") {
    return result?.choices?.[0]?.message?.content?.trim() ?? "";
  }

  return (
    result?.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim() ?? ""
  );
}

function parseJson(raw) {
  try {
    return JSON.parse(String(raw).replace(/^```json\s*|\s*```$/g, "").trim());
  } catch (error) {
    error.code = "AI_JSON_PARSE";
    throw error;
  }
}

async function requestJson(prompt, { temperature = 0.55 } = {}) {
  const config = getProviderConfig();

  if (!config.apiKey) {
    return { provider: config.provider, value: null };
  }

  let response;
  if (config.provider === "deepseek") {
    response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature,
      }),
    });
  } else {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature,
          },
        }),
      },
    );
  }

  const result = await response.json().catch(() => null);
  if (!response.ok || !result) {
    throw new Error(result?.error?.message ?? `${config.provider} request failed`);
  }

  const raw = extractJsonText(config.provider, result);
  if (!raw) {
    throw new Error(`${config.provider} returned empty content`);
  }

  return {
    provider: config.provider,
    value: parseJson(raw),
  };
}

module.exports = {
  getAiProvider,
  requestJson,
};
