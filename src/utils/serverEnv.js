const fs = require("fs");
const path = require("path");

let loaded = false;

function parseEnvFile(content) {
  const result = {};

  for (const rawLine of String(content).split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const eqIndex = line.indexOf("=");
    if (eqIndex <= 0) continue;

    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    value = value.replace(/\\n/g, "\n");
    result[key] = value;
  }

  return result;
}

function loadServerEnv() {
  if (loaded) return;
  loaded = true;

  const root = path.resolve(__dirname, "../..");
  const candidates = [".env.local", ".env"];

  for (const name of candidates) {
    const filePath = path.join(root, name);
    if (!fs.existsSync(filePath)) continue;

    const parsed = parseEnvFile(fs.readFileSync(filePath, "utf8"));
    for (const [key, value] of Object.entries(parsed)) {
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  }
}

module.exports = {
  loadServerEnv,
};
