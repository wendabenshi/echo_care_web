<template>
  <div class="daily-card-page relative min-h-[100dvh] bg-[#18161D] text-white">
    <StarfieldBackground />

    <DrawToast :message="toastMessage" />

    <DailyReadingPanel
      :visible="showReading"
      :loading="readingLoading"
      :reading="readingText"
      :reading-data="readingData"
      :slots="readingSlots"
      reading-label="Today's Companion"
      reading-title="Your companion message"
      draw-again-label="Draw your daily card again"
      @close="handleClose"
    />

    <main class="relative z-[1] min-h-[100dvh] pt-16">
      <section class="relative isolate min-h-[100dvh] overflow-x-hidden">
        <div
          class="pointer-events-none absolute bottom-0 left-0 right-0 z-[1] h-32"
          style="background: linear-gradient(to bottom, transparent 0%, #18161D 100%);"
          aria-hidden="true"
        />

        <div class="relative z-10 flex min-h-[calc(100dvh-4rem)] flex-col items-center px-4 pt-16 pb-0 md:pt-20">
          <div class="relative z-20 mx-auto w-full max-w-3xl space-y-6 text-center">
            <p class="text-[10px] uppercase tracking-[0.2em] text-[#7C74E7]/80 md:text-xs">
              Today's Card
            </p>

            <h1 class="font-serif text-2xl font-normal leading-tight text-white sm:text-3xl md:text-4xl">
              How are you today?
            </h1>

            <p class="text-sm font-medium text-white/42 md:text-[0.95rem]">
              Draw your card for today's energy.
            </p>

            <div class="mx-auto flex justify-center pt-5 md:pt-7">
              <div class="flex flex-col items-center gap-3">
                <div
                  class="daily-draw-card-frame relative h-[238px] w-[150px] rounded-xl sm:h-[268px] sm:w-[169px]"
                  style="perspective: 1200px;"
                >
                  <button
                    type="button"
                    class="daily-single-card h-full w-full rounded-xl transition duration-500"
                    :class="{
                      'daily-single-card--ready': pickingEnabled && !previewStarted,
                      'daily-single-card--drawing': previewStarted,
                    }"
                    :disabled="!pickingEnabled || previewStarted"
                    aria-label="Draw today's card"
                    @click="onPickDailyCard"
                  >
                    <div
                      class="daily-preview-flip h-full w-full"
                      :class="{ 'daily-preview-flip--revealed': previewFlipped }"
                    >
                      <div class="daily-preview-face daily-preview-face--back absolute inset-0">
                        <TarotCardBack />
                      </div>
                      <div class="daily-preview-face daily-preview-face--front absolute inset-0">
                        <TarotCardFace
                          v-if="selectedCardLabel"
                          :label="selectedCardLabel"
                        />
                      </div>
                    </div>
                  </button>
                </div>

                <p
                  class="text-[10px] uppercase tracking-[0.18em] text-white/32 transition-opacity duration-300"
                  :class="previewLoading ? 'opacity-100' : 'opacity-0'"
                >
                  {{ previewFlipped ? "Revealing..." : "Listening..." }}
                </p>
              </div>
            </div>

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
                  placeholder="How are you feeling today?"
                  @submit="onSubmit"
                />
              </div>
            </div>

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
                <RouterLink
                  to="/draw/love-energy"
                  class="inline-block text-[10px] text-[#7C74E7]/40 transition-colors hover:text-[#7C74E7]/70 md:text-xs"
                >
                  or ask a deeper question
                </RouterLink>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import DailyReadingPanel from "../components/draw/DailyReadingPanel.vue";
import DrawToast from "../components/draw/DrawToast.vue";
import QuestionBar from "../components/draw/QuestionBar.vue";
import StarfieldBackground from "../components/StarfieldBackground.vue";
import TarotCardBack from "../components/draw/TarotCardBack.vue";
import TarotCardFace from "../components/draw/TarotCardFace.vue";
import {
  resolveSlotCards,
  simulateSingleDraw,
  simulateSingleInterpret,
} from "../services/drawSession.js";
import { trackRingEvent } from "../utils/ringAnalytics.js";

const DAILY_QUESTION = "What do I need to know today?";
const PREVIEW_BACK_MS = 1500;
const PREVIEW_FRONT_HOLD_MS = 1200;

const question = ref(DAILY_QUESTION);
const submitted = ref(false);
const submittedQuestion = ref("");
const draw = ref(null);
const pickingEnabled = ref(false);
const showReading = ref(false);
const readingLoading = ref(false);
const readingText = ref("");
const readingData = ref(null);
const toastMessage = ref("");
const autoStarted = ref(false);
const previewStarted = ref(false);
const previewFlipped = ref(false);
const previewLoading = ref(false);

const suggestionChips = [
  "How am I arriving today?",
  "What needs my attention today?",
  "What would support me most today?",
];

const readingSlots = computed(() => {
  if (!draw.value) return [];
  const cards = resolveSlotCards(draw.value);
  return cards.map((card, index) => ({
    label: card.label,
    position: draw.value.position_meanings[index] ?? "",
  }));
});

const selectedCardLabel = computed(() => draw.value?.cards?.[0]?.card_name ?? "");

const timers = [];

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
  submittedQuestion.value = text;
  submitted.value = true;
  pickingEnabled.value = false;
  draw.value = null;
  showReading.value = false;
  readingText.value = "";
  readingData.value = null;
  previewStarted.value = false;
  previewFlipped.value = false;
  previewLoading.value = false;

  try {
    draw.value = await simulateSingleDraw(text, { mode: "daily" });
    schedule(() => {
      pickingEnabled.value = true;
    }, 500);
  } catch {
    showToast("The cards aren't speaking right now");
    submitted.value = false;
  }
}

function maybeStartDailyFlow() {
  if (autoStarted.value || submitted.value) return;
  autoStarted.value = true;
  question.value = DAILY_QUESTION;
  onSubmit(DAILY_QUESTION);
}

function onPickDailyCard() {
  if (!pickingEnabled.value) return;
  if (!draw.value) {
    showToast("Your card is still arriving");
    return;
  }

  previewStarted.value = true;
  previewLoading.value = true;

  schedule(() => {
    previewFlipped.value = true;
  }, PREVIEW_BACK_MS);

  pickingEnabled.value = false;
  schedule(() => {
    openReading();
  }, PREVIEW_BACK_MS + PREVIEW_FRONT_HOLD_MS);
}

async function openReading() {
  showReading.value = true;
  readingLoading.value = true;
  readingText.value = "";
  readingData.value = null;

  try {
    readingData.value = await simulateSingleInterpret(submittedQuestion.value, draw.value, {
      mode: "daily",
    });
    trackRingEvent("reading_completed", { mode: "daily" });
  } catch {
    readingText.value = "The card drew close, but the reading couldn't fully arrive. Try again when you're ready.";
  } finally {
    readingLoading.value = false;
    previewLoading.value = false;
  }
}

async function handleClose() {
  resetSession();
  autoStarted.value = false;
  await nextTick();
  maybeStartDailyFlow();
}

function resetSession() {
  showReading.value = false;
  readingLoading.value = false;
  readingText.value = "";
  readingData.value = null;
  submitted.value = false;
  submittedQuestion.value = "";
  draw.value = null;
  pickingEnabled.value = false;
  previewStarted.value = false;
  previewFlipped.value = false;
  previewLoading.value = false;
}

onBeforeUnmount(() => {
  timers.forEach(clearTimeout);
});

onMounted(() => {
  maybeStartDailyFlow();
});
</script>

<style scoped>
.daily-draw-card-frame {
  filter: drop-shadow(0 26px 42px rgba(4, 3, 12, 0.52));
}

.daily-single-card {
  display: block;
  animation: daily-card-float 4.8s ease-in-out infinite;
  transform: translateY(0) scale(1);
}

.daily-single-card--ready {
  cursor: pointer;
}

.daily-single-card:not(.daily-single-card--ready) {
  cursor: wait;
}

.daily-single-card--drawing {
  animation: none;
}

.daily-single-card--ready:hover {
  transform: translateY(-4px) scale(1.015);
  filter: brightness(1.08) saturate(1.04);
}

.daily-single-card--ready:active {
  transform: translateY(0) scale(0.985);
}

.daily-single-card:focus-visible {
  outline: 1px solid rgba(180, 170, 255, 0.72);
  outline-offset: 8px;
}

.daily-preview-flip {
  position: relative;
  transform-style: preserve-3d;
  transform: rotateY(0deg);
  opacity: 1;
  transition:
    transform 720ms cubic-bezier(0.22, 1, 0.36, 1);
}

.daily-preview-flip--revealed {
  transform: rotateY(180deg);
}

.daily-preview-face {
  backface-visibility: hidden;
  border-radius: 8px;
  overflow: hidden;
}

.daily-preview-face--front {
  transform: rotateY(180deg);
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
  .daily-single-card {
    animation: none !important;
  }

  .draw-collapse {
    transition: none !important;
  }
}

@keyframes daily-card-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}
</style>
