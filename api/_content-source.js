const LOCAL = "local";
const GEMINI = "gemini";

function normalizeSource(value) {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  if (normalized === GEMINI) return GEMINI;
  return LOCAL;
}

function getReadingContentSource(mode = "") {
  const modeSource = mode === "love-energy" ? process.env.QUESTION_READING_CONTENT_SOURCE : "";
  return normalizeSource(modeSource || process.env.READING_CONTENT_SOURCE);
}

function shouldUseLocalContent(mode = "") {
  return getReadingContentSource(mode) === LOCAL;
}

module.exports = {
  GEMINI,
  LOCAL,
  getReadingContentSource,
  shouldUseLocalContent,
};
