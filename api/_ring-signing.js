const crypto = require("crypto");

function createSignature(uid, secret) {
  return crypto.createHmac("sha256", secret).update(uid).digest("hex");
}

function collectSigningSecrets() {
  const secrets = [];
  const candidates = [
    process.env.RING_SIGNING_SECRET,
    process.env.RING_SIGNING_SECRET_PREVIOUS,
    process.env.RING_SIGNING_SECRET_LEGACY,
  ];

  for (const value of candidates) {
    const normalized = String(value ?? "").trim();
    if (normalized) secrets.push(normalized);
  }

  const multiValue = String(process.env.RING_SIGNING_SECRETS ?? "").trim();
  if (multiValue) {
    for (const item of multiValue.split(/[\n,]+/)) {
      const normalized = String(item ?? "").trim();
      if (normalized) secrets.push(normalized);
    }
  }

  return [...new Set(secrets)];
}

function getPrimarySigningSecret() {
  return collectSigningSecrets()[0] ?? "";
}

function isValidSignature(uid, sig, secret) {
  const expected = createSignature(uid, secret);
  const expectedBuffer = Buffer.from(expected, "utf8");
  const actualBuffer = Buffer.from(sig, "utf8");

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

function verifyAgainstAnySecret(uid, sig) {
  const secrets = collectSigningSecrets();
  if (!secrets.length) {
    return { ok: false, matchedSecretIndex: -1, secrets };
  }

  const matchedSecretIndex = secrets.findIndex((secret) => isValidSignature(uid, sig, secret));
  return {
    ok: matchedSecretIndex >= 0,
    matchedSecretIndex,
    secrets,
  };
}

module.exports = {
  collectSigningSecrets,
  createSignature,
  getPrimarySigningSecret,
  verifyAgainstAnySecret,
};
