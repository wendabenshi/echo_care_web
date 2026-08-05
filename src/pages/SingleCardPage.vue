<template>
  <div class="single-card-page relative min-h-[100dvh] bg-[#18161D] text-white">
    <StarfieldBackground />

    <DrawToast :message="toastMessage" />

    <DailyReadingPanel
      :visible="showReading"
      :loading="readingLoading"
      :reading="readingText"
      :reading-data="readingData"
      :slots="readingSlots"
      :reading-label="isDailyMode ? `Today's Companion` : 'Single Card Reading'"
      :reading-title="isDailyMode ? 'Your companion message' : 'Your card reading'"
      :draw-again-label='isDailyMode ? "Draw your daily card again" : "Draw another card"'
      @close="handleClose"
      @follow-up="handleFollowUp"
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
              {{ isDailyMode ? "Today's Card" : (submitted && draw?.spread_name ? draw.spread_name : "One Card") }}
            </p>

            <h1 class="font-serif text-2xl font-normal leading-tight text-white sm:text-3xl md:text-4xl">
              <template v-if="isDailyMode">
                How are you today?
              </template>
              <template v-else>
                Close your eyes.<br />
                Bring your question to mind.
              </template>
            </h1>

            <p class="text-xs text-white/35 md:text-sm">
              {{ isDailyMode ? "Draw your card for today's energy." : "One card will answer" }}
            </p>

            <div
              class="draw-collapse"
              :class="{ 'draw-collapse--closed': isDailyMode && submitted }"
              :aria-hidden="isDailyMode && submitted"
            >
              <div class="overflow-hidden" style="min-height: 0;">
                <QuestionBar
                  v-model="question"
                  :submitted="submitted"
                  :submitted-question="submittedQuestion"
                  :show-submitted-question="!isDailyMode"
                  :placeholder="isDailyMode ? 'How are you feeling today?' : 'What do I need to know today?'"
                  @submit="onSubmit"
                />
              </div>
            </div>

            <CardSlots
              :visible="submitted"
              :draw="draw"
              :slot-count="1"
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
                <RouterLink
                  :to="isDailyMode ? '/draw/love-energy' : '/draw/love-energy'"
                  class="inline-block text-[10px] text-[#7C74E7]/40 transition-colors hover:text-[#7C74E7]/70 md:text-xs"
                >
                  {{ isDailyMode ? "or ask a deeper question" : "or try a three-card love reading" }}
                </RouterLink>
              </div>
            </div>
          </div>

          <CardFan
            class="relative z-10 w-full"
            :active="submitted"
            :picking-enabled="pickingEnabled"
            :picked-indices="pickedFanIndices"
            :picks-remaining="picksRemaining"
            @pick="onPickCard"
          />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import CardFan from "../components/draw/CardFan.vue";
import CardSlots from "../components/draw/CardSlots.vue";
import DrawToast from "../components/draw/DrawToast.vue";
import QuestionBar from "../components/draw/QuestionBar.vue";
import DailyReadingPanel from "../components/draw/DailyReadingPanel.vue";
import StarfieldBackground from "../components/StarfieldBackground.vue";
import {
  resolveSlotCards,
  simulateSingleDraw,
  simulateSingleInterpret,
} from "../services/drawSession.js";
import { trackRingEvent } from "../utils/ringAnalytics.js";

const PICK_LIMIT = 1;
const DAILY_QUESTION = "What do I need to know today?";

const route = useRoute();
const question = ref(DAILY_QUESTION);
const submitted = ref(false);
const submittedQuestion = ref("");
const draw = ref(null);
const pickedFanIndices = ref([]);
const flippedSlots = ref([false]);
const pickingEnabled = ref(false);
const showReading = ref(false);
const readingLoading = ref(false);
const readingText = ref("");
const readingData = ref(null);
const toastMessage = ref("");
const autoStarted = ref(false);
const isDailyMode = computed(() => route.query.mode === "daily");

const suggestionChips = computed(() =>
  isDailyMode.value
    ? [
        "How am I arriving today?",
        "What needs my attention today?",
        "What would support me most today?",
      ]
    : [
        "What energy surrounds me today?",
        "What should I focus on?",
        "What is my next step?",
      ],
);

const picksRemaining = computed(() => Math.max(0, PICK_LIMIT - pickedFanIndices.value.length));

const readingSlots = computed(() => {
  if (!draw.value) return [];
  const cards = resolveSlotCards(draw.value);
  return cards.map((card, index) => ({
    label: card.label,
    position: draw.value.position_meanings[index] ?? "",
  }));
});

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
  pickedFanIndices.value = [];
  flippedSlots.value = [false];
  showReading.value = false;
  readingText.value = "";
  readingData.value = null;

  try {
    draw.value = await simulateSingleDraw(text, { mode: isDailyMode.value ? "daily" : "single" });
    schedule(() => {
      pickingEnabled.value = true;
    }, 900);
  } catch {
    showToast("The cards aren't speaking right now");
    submitted.value = false;
  }
}

function maybeStartDailyFlow() {
  if (route.query.mode !== "daily" || autoStarted.value || submitted.value) return;
  autoStarted.value = true;
  question.value = DAILY_QUESTION;
  onSubmit(DAILY_QUESTION);
}

function onPickCard(fanIndex) {
  if (!pickingEnabled.value) return;
  if (!draw.value) {
    showToast("Bring your question to mind first");
    return;
  }
  if (pickedFanIndices.value.includes(fanIndex) || pickedFanIndices.value.length >= PICK_LIMIT) return;

  pickedFanIndices.value = [fanIndex];

  schedule(() => {
    flippedSlots.value = [true];
  }, 60);

  pickingEnabled.value = false;
  schedule(() => {
    openReading();
  }, 1200);
}

async function openReading() {
  showReading.value = true;
  readingLoading.value = true;
  readingText.value = "";
  readingData.value = null;

  try {
    readingData.value = await simulateSingleInterpret(submittedQuestion.value, draw.value, {
      mode: isDailyMode.value ? "daily" : "single",
    });
    trackRingEvent("reading_completed", { mode: isDailyMode.value ? "daily" : "single" });
  } catch {
    readingText.value = "The card drew close, but the reading couldn't fully arrive. Try again when you're ready.";
  } finally {
    readingLoading.value = false;
  }
}

function handleFollowUp(nextQuestion) {
  question.value = nextQuestion;
  resetSession();
}

async function handleClose() {
  resetSession();

  if (!isDailyMode.value) return;

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
  pickedFanIndices.value = [];
  flippedSlots.value = [false];
  pickingEnabled.value = false;
}

onBeforeUnmount(() => {
  timers.forEach(clearTimeout);
});

onMounted(() => {
  maybeStartDailyFlow();
});
</script>

<style scoped>
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
  .draw-collapse {
    transition: none !important;
  }
}
</style>
