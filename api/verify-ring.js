const { getSupabaseServerClient, resolveSupabaseUrl } = require("./_supabase");
const { getPrimarySigningSecret, verifyAgainstAnySecret } = require("./_ring-signing");

function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

async function persistRingRecord(supabase, uid) {
  const now = new Date().toISOString();
  const existingRing = await supabase
    .from("rings")
    .select("uuid,status,lifecycle_stage,first_activated_at,open_count")
    .eq("uuid", uid)
    .limit(1)
    .maybeSingle();

  if (!existingRing.error && existingRing.data) {
    if (existingRing.data.status !== "active") {
      const error = new Error(`Ring is ${existingRing.data.status}`);
      error.code = "RING_INACTIVE";
      throw error;
    }

    const updateAttempt = await supabase
      .from("rings")
      .update({
        last_seen_at: now,
        first_activated_at: existingRing.data.first_activated_at ?? now,
        open_count: Number(existingRing.data.open_count ?? 0) + 1,
        lifecycle_stage: existingRing.data.first_activated_at ? existingRing.data.lifecycle_stage : "activated",
      })
      .eq("uuid", uid)
      .select("uuid")
      .limit(1);

    if (updateAttempt.error) {
      throw new Error(updateAttempt.error.message);
    }

    await supabase.from("ring_events").insert({
      uuid: uid,
      event_type: "ring_verified",
      path: "/r",
      created_at: now,
    });

    return {
      table: "rings",
      status: "active",
      existed: true,
      firstActivatedAt: existingRing.data.first_activated_at ?? now,
      lifecycleStage: existingRing.data.first_activated_at
        ? existingRing.data.lifecycle_stage
        : "activated",
    };
  }

  const ringAttempt = await supabase
    .from("rings")
    .upsert(
      {
        uuid: uid,
        status: "active",
        lifecycle_stage: "activated",
        first_activated_at: now,
        last_seen_at: now,
        open_count: 1,
      },
      { onConflict: "uuid" },
    )
    .select("uuid")
    .limit(1);

  if (!ringAttempt.error) {
    await supabase.from("ring_events").insert({
      uuid: uid,
      event_type: "ring_verified",
      path: "/r",
      created_at: now,
    });

    return {
      table: "rings",
      status: "active",
      existed: false,
      firstActivatedAt: now,
      lifecycleStage: "activated",
    };
  }

  const legacyAttempt = await supabase
    .from("page_tokens")
    .upsert({ token: uid }, { onConflict: "token" })
    .select("token")
    .limit(1);

  if (legacyAttempt.error) {
    throw new Error(legacyAttempt.error.message);
  }

  return { table: "page_tokens", status: "legacy", existed: false };
}

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  const uid = String(req.query.uid ?? "").trim();
  const sig = String(req.query.sig ?? "").trim();
  const primarySecret = getPrimarySigningSecret();
  if (!uid || !sig) {
    return json(res, 400, { ok: false, error: "Missing uid or sig" });
  }

  if (!primarySecret) {
    return json(res, 500, { ok: false, error: "Missing RING signing secret configuration" });
  }

  const signatureCheck = verifyAgainstAnySecret(uid, sig);

  if (!signatureCheck.ok) {
    return json(res, 401, { ok: false, error: "Invalid ring signature" });
  }

  try {
    const supabase = getSupabaseServerClient();
    const persisted = await persistRingRecord(supabase, uid);

    return json(res, 200, {
      ok: true,
      uid,
      supabaseUrl: resolveSupabaseUrl(),
      persistedTo: persisted.table,
      ringStatus: persisted.status,
      existed: persisted.existed,
    });
  } catch (error) {
    if (error && error.code === "RING_INACTIVE") {
      return json(res, 403, {
        ok: false,
        error: error.message,
      });
    }

    return json(res, 500, {
      ok: false,
      error: error instanceof Error ? error.message : "Verification failed",
    });
  }
};
