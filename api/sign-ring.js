const { createSignature, getPrimarySigningSecret } = require("./_ring-signing");

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-ring-admin-key");
  res.setHeader("Access-Control-Max-Age", "86400");
}

function json(res, status, body) {
  setCors(res);
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function encodeUidForUrl(uid) {
  if (/^[0-9A-Fa-f:]+$/.test(uid)) {
    return uid;
  }

  return encodeURIComponent(uid);
}

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    setCors(res);
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  const secret = getPrimarySigningSecret();
  const adminKey = process.env.RING_ADMIN_KEY;
  const providedAdminKey = String(req.headers["x-ring-admin-key"] ?? "").trim();
  const baseUrlFromEnv = process.env.PUBLIC_APP_URL;

  if (!secret) {
    return json(res, 500, { ok: false, error: "Missing RING signing secret configuration" });
  }

  if (!adminKey) {
    return json(res, 500, { ok: false, error: "Missing RING_ADMIN_KEY" });
  }

  if (!providedAdminKey || providedAdminKey !== adminKey) {
    return json(res, 401, { ok: false, error: "Invalid admin key" });
  }

  let body = {};
  try {
    body = typeof req.body === "object" && req.body ? req.body : JSON.parse(req.body ?? "{}");
  } catch {
    return json(res, 400, { ok: false, error: "Invalid JSON body" });
  }

  const uid = String(body.uid ?? "").trim();
  const baseUrl = String(body.baseUrl ?? baseUrlFromEnv ?? "").trim().replace(/\/+$/, "");

  if (!uid) {
    return json(res, 400, { ok: false, error: "Missing uid" });
  }

  if (!baseUrl) {
    return json(res, 400, { ok: false, error: "Missing baseUrl" });
  }

  const sig = createSignature(uid, secret);
  const shortUid = encodeUidForUrl(uid);
  const url = `${baseUrl}/r?u=${shortUid}&s=${sig}`;

  return json(res, 200, {
    ok: true,
    uid,
    sig,
    url,
  });
};
