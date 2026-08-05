import { getRingSessionId, getRingUid } from "./authSession.js";

const allowedEventTypes = new Set([
  "home_opened",
  "daily_message_opened",
  "question_opened",
  "reading_completed",
]);

export async function trackRingEvent(eventType, extra = {}) {
  if (!allowedEventTypes.has(eventType)) return false;

  const uid = getRingUid();
  if (!uid || import.meta.env.DEV) return false;

  try {
    const payload = {
      uid,
      eventType,
      sessionId: getRingSessionId(),
      path: window.location.pathname,
      extra,
    };

    await fetch("/api/ring-events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });
    return true;
  } catch {
    return false;
  }
}
