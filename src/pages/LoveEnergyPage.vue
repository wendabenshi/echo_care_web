<template>
  <div class="love-energy-page relative min-h-[100dvh] bg-[#18161D] text-white">
    <StarfieldBackground />

    <!-- <SiteHeader /> -->
    <DrawToast :message="toastMessage" />

    <LoveReadingPanel
      :visible="showReading"
      :loading="readingLoading"
      :question="submittedQuestion"
      :reading="readingText"
      :reading-data="readingData"
      :slots="readingSlots"
      @close="resetSession"
      @home="goToHome"
    />

    <main class="relative z-[1] min-h-[100dvh] pt-16">
      <section class="relative isolate min-h-[100dvh] overflow-x-hidden">
        <div
          class="pointer-events-none absolute bottom-0 left-0 right-0 z-[1] h-32"
          style="background: linear-gradient(to bottom, transparent 0%, #18161D 100%);"
          aria-hidden="true"
        />

        <div class="relative z-10 flex min-h-[calc(100dvh-4rem)] flex-col items-center px-4 pt-16 pb-0 md:pt-20">
          <div class="relative z-20 mx-auto w-full max-w-3xl space-y-4 text-center">
            <p class="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#7C74E7]/80">
              {{ submitted && draw?.spread_name ? draw.spread_name : "Love Energy" }}
            </p>

            <h1 class="font-serif text-2xl font-normal leading-tight text-white sm:text-3xl md:text-4xl">
              Close your eyes.<br />
              Bring your question to mind.
            </h1>

            <p class="mb-10 text-xs text-white/35 md:text-sm">The cards are listening</p>

            <div
              class="draw-collapse"
              :class="{ 'draw-collapse--closed': submitted }"
              :aria-hidden="submitted"
            >
              <div class="overflow-hidden" style="min-height: 0;">
                <QuestionBar
                  v-model="question"
                  :submitted="submitted"
                  :submitted-question="submittedQuestion"
                  :show-submitted-question="false"
                  placeholder="Ask your question to begin"
                  @submit="onSubmit"
                />
              </div>
            </div>

            <CardSlots
              :visible="drawReady"
              :draw="draw"
              :picked-count="pickedFanIndices.length"
              :flipped="flippedSlots"
            />

            <div
              class="draw-collapse"
              :class="{ 'draw-collapse--closed': submitted }"
              :aria-hidden="submitted"
            >
              <div class="overflow-hidden" style="min-height: 0;">
                <div class="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-2 pt-1">
                  <button
                    v-for="chip in suggestionChips"
                    :key="chip"
                    type="button"
                    class="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/55 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white/85 md:text-xs"
                    @click="selectChip(chip)"
                  >
                    {{ chip }}
                  </button>
                </div>
              </div>
            </div>

            <div
              class="draw-collapse"
              :class="{ 'draw-collapse--closed': submitted }"
              :aria-hidden="submitted"
            >
              <div class="overflow-hidden" style="min-height: 0;">
                <button
                  type="button"
                  class="inline-block text-[10px] text-[#7C74E7]/40 transition-colors hover:text-[#7C74E7]/70 md:text-xs"
                  @click="goToDailyReading"
                >
                  or receive today's companion
                </button>
              </div>
            </div>
          </div>

          <div
            class="question-card-fan-stage relative z-10 w-full"
            :class="{
              'question-card-fan-stage--visible': drawReady,
              'question-card-fan-stage--ready': pickingEnabled,
            }"
          >
            <div class="question-card-fan-float-layer">
              <CardFan
                class="w-full"
                :active="drawReady"
                :picking-enabled="pickingEnabled"
                :picked-indices="pickedFanIndices"
                :picks-remaining="picksRemaining"
                :picked-as-gap="pickedFanIndices.length > 0"
                :show-hint="false"
                @pick="onPickCard"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from "vue";
import CardFan from "../components/draw/CardFan.vue";
import CardSlots from "../components/draw/CardSlots.vue";
import DrawToast from "../components/draw/DrawToast.vue";
import QuestionBar from "../components/draw/QuestionBar.vue";
import LoveReadingPanel from "../components/draw/LoveReadingPanel.vue";
import SiteHeader from "../components/SiteHeader.vue";
import StarfieldBackground from "../components/StarfieldBackground.vue";
import {
  createLoveEnergyDraw,
  resolveSlotCards,
  simulateDraw,
  simulateInterpret,
} from "../services/drawSession.js";
import { useRouter } from "vue-router";
import { trackRingEvent } from "../utils/ringAnalytics.js";

const question = ref("");
const submitted = ref(false);
const submittedQuestion = ref("");
const draw = ref(null);
const pickedFanIndices = ref([]);
const flippedSlots = ref([false, false, false]);
const pickingEnabled = ref(false);
const showReading = ref(false);
const readingLoading = ref(false);
const readingText = ref("");
const readingData = ref(null);
const toastMessage = ref("");
const router = useRouter();

const suggestionChips = [
  "Will I find love this year?",
  "Is he the one?",
  "When will love come?",
];

const FAN_INTERACTION_DELAY_MS = 280;

const picksRemaining = computed(() => Math.max(0, 3 - pickedFanIndices.value.length));
const drawReady = computed(() => submitted.value && Boolean(draw.value));

function getHeroPositionLabel(position = "", index = 0) {
  const normalized = String(position).replace(/\s+/g, " ").trim().toLowerCase();
  const mapped = {
    "your heart today": "Current Readiness",
    "what’s influencing this": "Necessary Preparation",
    "what's influencing this": "Necessary Preparation",
    "where to focus": "Timing And Signs",
    "my heart's current song": "Current Readiness",
    "nurturing the path forward": "Necessary Preparation",
    "the embrace awaiting": "Timing And Signs",
  };

  if (mapped[normalized]) return mapped[normalized];

  const fallback = ["Current Readiness", "Necessary Preparation", "Timing And Signs"];
  return fallback[index] ?? position;
}

const readingSlots = computed(() => {
  if (!draw.value) return [];
  const cards = resolveSlotCards(draw.value);
  return cards.map((card, index) => ({
    label: card.label,
    position: draw.value.position_meanings[index] ?? "",
    heroPosition: getHeroPositionLabel(draw.value.position_meanings[index] ?? "", index),
    tags: Array.isArray(draw.value.position_tags?.[index]) ? draw.value.position_tags[index] : [],
  }));
});

const timers = [];

function goToDailyReading() {
  router.push("/draw/daily-card");
}

function schedule(fn, ms) {
  timers.push(window.setTimeout(fn, ms));
}

function showToast(message) {
  toastMessage.value = message;
  schedule(() => {
    toastMessage.value = "";
  }, 2500);
}

function selectChip(text) {
  question.value = text;
}

async function onSubmit(text) {
  const normalizedQuestion = String(text ?? "").trim();
  const baseDraw = createLoveEnergyDraw(normalizedQuestion);

  submittedQuestion.value = text;
  submitted.value = true;
  pickingEnabled.value = false;
  draw.value = baseDraw;
  pickedFanIndices.value = [];
  flippedSlots.value = [false, false, false];
  showReading.value = false;
  readingText.value = "";
  readingData.value = null;

  schedule(() => {
    pickingEnabled.value = true;
  }, FAN_INTERACTION_DELAY_MS);

  try {
    const spreadDraw = await simulateDraw(normalizedQuestion);
    if (!submitted.value || submittedQuestion.value !== normalizedQuestion || !draw.value) return;

    draw.value = {
      ...draw.value,
      spread_name: spreadDraw.spread_name,
      position_meanings: spreadDraw.position_meanings,
      position_tags: spreadDraw.position_tags,
    };
  } catch {
    showToast("The cards aren't speaking right now");
    submitted.value = false;
    draw.value = null;
    pickingEnabled.value = false;
  }
}

function onPickCard(fanIndex) {
  if (!pickingEnabled.value) return;
  if (!draw.value) {
    showToast("Bring your question to mind first");
    return;
  }
  if (pickedFanIndices.value.includes(fanIndex) || pickedFanIndices.value.length >= 3) return;

  const slotIndex = pickedFanIndices.value.length;
  pickedFanIndices.value = [...pickedFanIndices.value, fanIndex];

  schedule(() => {
    flippedSlots.value = flippedSlots.value.map((value, index) =>
      index === slotIndex ? true : value,
    );
  }, 60);

  if (pickedFanIndices.value.length === 3) {
    pickingEnabled.value = false;
    schedule(() => {
      openReading();
    }, 1400);
  }
}

async function openReading() {
  showReading.value = true;
  readingLoading.value = true;
  readingText.value = "";
  readingData.value = null;

  try {
    readingData.value = await simulateInterpret(submittedQuestion.value, draw.value);
    trackRingEvent("reading_completed", { mode: "love-energy" });
  } catch {
    readingText.value = "The cards drew close, but the reading couldn't fully arrive. Try again when you're ready.";
  } finally {
    readingLoading.value = false;
  }
}

function goToHome() {
  resetSession();
  router.push("/");
}

function resetSession() {
  showReading.value = false;
  readingLoading.value = false;
  readingText.value = "";
  readingData.value = null;
  submitted.value = false;
  submittedQuestion.value = "";
  draw.value = null;
  pickedFanIndices.value = [];
  flippedSlots.value = [false, false, false];
  pickingEnabled.value = false;
}

onBeforeUnmount(() => {
  timers.forEach(clearTimeout);
});
</script>

<style scoped>
.question-card-fan-stage {
  opacity: 0;
  transform: translate3d(0, 104px, 0);
  pointer-events: none;
  transition:
    opacity 220ms ease-out,
    transform 1200ms linear;
  backface-visibility: hidden;
  will-change: transform;
  contain: paint;
}

.question-card-fan-stage--visible {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.question-card-fan-stage--ready {
  pointer-events: auto;
}

.question-card-fan-float-layer {
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  will-change: transform;
}

.question-card-fan-stage--visible .question-card-fan-float-layer {
  animation: question-card-fan-float 5.8s ease-in-out 1.35s infinite;
}

.draw-collapse {
  display: grid;
  grid-template-rows: 1fr;
  opacity: 1;
  transition:
    grid-template-rows 320ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 220ms cubic-bezier(0.22, 1, 0.36, 1),
    margin-top 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

.draw-collapse--closed {
  grid-template-rows: 0fr;
  opacity: 0;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .question-card-fan-stage {
    opacity: 1;
    transform: none;
    transition: none !important;
  }

  .question-card-fan-stage--visible .question-card-fan-float-layer {
    animation: none !important;
  }

  .draw-collapse {
    transition: none !important;
  }
}

@keyframes question-card-fan-float {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-8px) scale(1.001);
  }
}
</style>
