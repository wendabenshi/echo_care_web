const LEGACY_TOKEN_KEY = "token";
const RING_AUTH_KEY = "ring-auth-session";

export function getLegacyToken() {
  return localStorage.getItem(LEGACY_TOKEN_KEY);
}

export function setLegacyToken(token) {
  localStorage.setItem(LEGACY_TOKEN_KEY, token);
}

export function clearLegacyToken() {
  localStorage.removeItem(LEGACY_TOKEN_KEY);
}

export function getRingAuthSession() {
  try {
    const raw = localStorage.getItem(RING_AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function setRingAuthSession(session) {
  localStorage.setItem(RING_AUTH_KEY, JSON.stringify(session));
}

export function clearRingAuthSession() {
  localStorage.removeItem(RING_AUTH_KEY);
}

export function getRingUid() {
  return getRingAuthSession()?.uid ?? "";
}

export function getRingSessionId() {
  return getRingAuthSession()?.sessionId ?? "";
}

export function hasAuthorizedSession() {
  return Boolean(getRingAuthSession() || getLegacyToken());
}
