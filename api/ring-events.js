const { getSupabaseServerClient } = require("./_supabase");

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Max-Age", "86400");
}

function json(res, status, body) {
  setCors(res);
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function getSupabase() {
  return getSupabaseServerClient();
}

const allowedEventTypes = new Set([
  "home_opened",
  "daily_message_opened",
  "question_opened",
  "reading_completed",
]);

const aggregateColumnByEvent = {
  daily_message_opened: "daily_message_count",
  question_opened: "question_count",
};

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    setCors(res);
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  let body = {};
  try {
    body = typeof req.body === "object" && req.body ? req.body : JSON.parse(req.body ?? "{}");
  } catch {
    return json(res, 400, { ok: false, error: "Invalid JSON body" });
  }

  const uid = String(body.uid ?? "").trim();
  const eventType = String(body.eventType ?? "").trim();
  const sessionId = String(body.sessionId ?? "").trim();
  const path = String(body.path ?? "").trim();
  const extra =
    body.extra && typeof body.extra === "object" && !Array.isArray(body.extra) ? body.extra : {};

  if (!uid || !eventType) {
    return json(res, 400, { ok: false, error: "Missing uid or eventType" });
  }

  if (!allowedEventTypes.has(eventType)) {
    return json(res, 400, { ok: false, error: "Invalid eventType" });
  }

  try {
    const supabase = getSupabase();
    const now = new Date().toISOString();
    const aggregateColumn = aggregateColumnByEvent[eventType];

    await supabase.from("ring_events").insert({
      uuid: uid,
      event_type: eventType,
      session_id: sessionId || null,
      path: path || null,
      extra_json: extra,
      created_at: now,
    });

    const ringFields = { last_seen_at: now };
    if (aggregateColumn) {
      const existingRing = await supabase
        .from("rings")
        .select(aggregateColumn)
        .eq("uuid", uid)
        .limit(1)
        .maybeSingle();

      if (!existingRing.error && existingRing.data) {
        ringFields[aggregateColumn] = Number(existingRing.data[aggregateColumn] ?? 0) + 1;
      }
    }

    await supabase.from("rings").upsert(
      {
        uuid: uid,
        status: "active",
        ...ringFields,
      },
      { onConflict: "uuid" },
    );

    return json(res, 200, { ok: true });
  } catch (error) {
    return json(res, 500, {
      ok: false,
      error: error instanceof Error ? error.message : "Tracking failed",
    });
  }
};
