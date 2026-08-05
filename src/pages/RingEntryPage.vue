<template>
  <div v-if="showFeedback" class="ring-entry-page">
    <div class="ring-entry-card">
      <p class="ring-entry-eyebrow">Ring Check</p>
      <h1>{{ title }}</h1>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  clearLegacyToken,
  clearRingAuthSession,
  setRingAuthSession,
} from "../utils/authSession.js";
import { trackRingEvent } from "../utils/ringAnalytics.js";

const route = useRoute();
const router = useRouter();
const showFeedback = ref(false);
const title = ref("Verifying your ring");
const message = ref("Please wait a moment while we check your access.");

const uid = computed(() => String(route.query.uid ?? route.query.u ?? "").trim());
const sig = computed(() => String(route.query.sig ?? route.query.s ?? "").trim());

function replaceWithCleanHome() {
  router.replace({ path: "/", query: {} });
  window.history.replaceState({}, "", "/");
}

function createSessionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `ring-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

async function verifyRing() {
  if (import.meta.env.DEV) {
    setRingAuthSession({
      uid: uid.value || "dev-ring",
      authorizedAt: new Date().toISOString(),
      method: "dev-bypass",
    });
    replaceWithCleanHome();
    return;
  }

  if (!uid.value || !sig.value) {
    showFeedback.value = true;
    title.value = "Ring link incomplete";
    message.value = "The ring link is missing information. Please try the ring again.";
    window.setTimeout(() => router.replace("/login"), 1200);
    return;
  }

  try {
    const response = await fetch(
      `/api/verify-ring?uid=${encodeURIComponent(uid.value)}&sig=${encodeURIComponent(sig.value)}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      },
    );

    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.ok) {
      throw new Error(result?.error ?? "Verification failed");
    }

    setRingAuthSession({
      uid: result.uid ?? uid.value,
      sessionId: createSessionId(),
      authorizedAt: new Date().toISOString(),
      method: "signed-ring",
    });
    trackRingEvent("home_opened", { source: "ring-entry" });
    replaceWithCleanHome();
  } catch (error) {
    showFeedback.value = true;
    title.value = "Ring not recognized";
    message.value =
      error instanceof Error && error.message
        ? error.message
        : "This ring could not be verified. Please try again.";
    window.setTimeout(() => router.replace("/login"), 1500);
  }
}

onMounted(() => {
  clearRingAuthSession();
  clearLegacyToken();
  verifyRing();
});
</script>

<style scoped>
.ring-entry-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at top, rgba(124, 116, 231, 0.16), transparent 30%),
    #18161d;
  color: white;
}

.ring-entry-card {
  width: min(100%, 420px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.04);
  padding: 28px 24px;
  text-align: center;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
}

.ring-entry-eyebrow {
  margin: 0 0 10px;
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(184, 164, 255, 0.85);
}

.ring-entry-card h1 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.8rem;
  font-weight: 400;
}

.ring-entry-card p:last-child {
  margin: 14px 0 0;
  color: rgba(255, 255, 255, 0.66);
  line-height: 1.7;
}
</style>
