const LOCAL = "local";
const GEMINI = "gemini";

function normalizeSource(value) {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  if (normalized === GEMINI) return GEMINI;
  return LOCAL;
}

function getReadingContentSource() {
  return normalizeSource(process.env.READING_CONTENT_SOURCE);
}

function shouldUseLocalContent() {
  return getReadingContentSource() === LOCAL;
}

module.exports = {
  GEMINI,
  LOCAL,
  getReadingContentSource,
  shouldUseLocalContent,
};
