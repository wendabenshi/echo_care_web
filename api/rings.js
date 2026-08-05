const { getSupabaseServerClient } = require("./_supabase");

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-ring-admin-key");
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

function assertAdminKey(req) {
  const adminKey = process.env.RING_ADMIN_KEY;
  const providedAdminKey = String(req.headers["x-ring-admin-key"] ?? "").trim();

  if (!adminKey) {
    throw new Error("Missing RING_ADMIN_KEY");
  }

  if (!providedAdminKey || providedAdminKey !== adminKey) {
    const error = new Error("Invalid admin key");
    error.status = 401;
    throw error;
  }
}

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    setCors(res);
    res.status(204).end();
    return;
  }

  try {
    assertAdminKey(req);
    const supabase = getSupabase();

    if (req.method === "GET") {
      const uid = String(req.query.uid ?? "").trim();
      if (!uid) {
        return json(res, 400, { ok: false, error: "Missing uid" });
      }

      const { data, error } = await supabase
        .from("rings")
        .select("uuid,status,note,lifecycle_stage,ring_type,created_at,updated_at,last_seen_at,first_activated_at,open_count,daily_message_count,question_count")
        .eq("uuid", uid)
        .maybeSingle();

      if (error) {
        return json(res, 500, { ok: false, error: error.message });
      }

      return json(res, 200, {
        ok: true,
        found: Boolean(data),
        ring: data ?? null,
      });
    }

    if (req.method === "PATCH") {
      let body = {};
      try {
        body = typeof req.body === "object" && req.body ? req.body : JSON.parse(req.body ?? "{}");
      } catch {
        return json(res, 400, { ok: false, error: "Invalid JSON body" });
      }

      const uid = String(body.uid ?? "").trim();
      const status = String(body.status ?? "").trim();
      const note = typeof body.note === "string" ? body.note.trim() : "";
      const lifecycleStage = String(body.lifecycleStage ?? "packed").trim() || "packed";
      const allowedStatuses = new Set(["active", "disabled", "lost"]);
      const allowedStages = new Set(["packed", "issued", "activated", "disabled", "lost"]);

      if (!uid) {
        return json(res, 400, { ok: false, error: "Missing uid" });
      }

      if (!allowedStatuses.has(status)) {
        return json(res, 400, { ok: false, error: "Invalid status" });
      }

      if (!allowedStages.has(lifecycleStage)) {
        return json(res, 400, { ok: false, error: "Invalid lifecycleStage" });
      }

      const { data, error } = await supabase
        .from("rings")
        .upsert(
          {
            uuid: uid,
            status,
            note,
            lifecycle_stage: lifecycleStage,
          },
          { onConflict: "uuid" },
        )
        .select("uuid,status,note,lifecycle_stage,ring_type,created_at,updated_at,last_seen_at,first_activated_at,open_count,daily_message_count,question_count")
        .limit(1)
        .maybeSingle();

      if (error) {
        return json(res, 500, { ok: false, error: error.message });
      }

      return json(res, 200, {
        ok: true,
        ring: data ?? null,
      });
    }

    return json(res, 405, { ok: false, error: "Method not allowed" });
  } catch (error) {
    return json(res, error.status ?? 500, {
      ok: false,
      error: error instanceof Error ? error.message : "Request failed",
    });
  }
};
