<template>
  <Transition name="reading-fade">
    <div
      v-if="visible"
      class="reading-panel fixed inset-0 z-[1200] overflow-hidden bg-transparent"
    >
      <StarfieldBackground />

      <div
        class="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden="true"
        style="background:
          radial-gradient(circle at 50% 18%, rgba(124, 116, 231, 0.1) 0%, rgba(124, 116, 231, 0.04) 18%, rgba(124, 116, 231, 0) 42%),
          linear-gradient(180deg, rgba(24,22,29,0.18) 0%, rgba(24,22,29,0.28) 44%, rgba(24,22,29,0.42) 100%);"
      />

      <div class="relative z-10 h-full overflow-y-auto">
        <div class="mx-auto flex min-h-full w-full max-w-[430px] flex-col px-8 py-12 md:max-w-[900px] md:px-12 md:py-16">
          <p class="text-[10px] uppercase tracking-[0.24em] text-[#7C74E7]/80">Your Question</p>

          <h2 class="mt-5 max-w-[720px] font-serif text-[1.82rem] font-normal leading-[1.12] text-white md:text-[3.15rem]">
            “{{ question }}”
          </h2>

          <div v-if="loading" class="mt-10 flex flex-col items-center gap-4 py-16">
            <div class="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-[#B8A4FF]" />
            <p class="text-sm text-white/40">The cards are speaking…</p>
          </div>

          <template v-else>
            <div class="mt-12 flex items-start justify-between gap-5 md:mt-16 md:gap-12">
              <div
                v-for="(slot, index) in slots"
                :key="slot.label"
                class="flex min-w-0 flex-1 flex-col items-center gap-3.5"
              >
                <div class="h-[176px] w-[110px] overflow-hidden rounded-[18px] ring-1 ring-white/10 shadow-[0_18px_42px_rgba(0,0,0,0.32)] md:h-[336px] md:w-[210px] md:rounded-[24px]">
                  <TarotCardFace :label="slot.label" />
                </div>
                <p class="text-center font-serif text-[0.68rem] leading-tight text-white/58 md:text-[0.9rem]">
                  {{ slot.label }}
                </p>
              </div>
            </div>

            <div v-if="hasStructuredReading" class="mx-auto mt-14 w-full max-w-[620px] text-center md:mt-14">
              <p class="text-[10px] uppercase tracking-[0.24em] text-[#7C74E7]/80">Your Three-Card Insight</p>
              <p class="hero-insight-copy mx-auto mt-5 max-w-[540px] font-serif text-[1.16rem] leading-[1.48] text-white md:text-[1.72rem]">
                {{ heroInsight }}
              </p>
            </div>

            <div v-if="hasStructuredReading" class="mx-auto mt-16 w-full max-w-[760px] space-y-14 md:mt-16 md:space-y-16">
              <div class="mr-6 space-y-6 md:mr-6">
                <section
                  v-for="section in cardSections"
                  :key="section.label"
                  class="reading-card-section"
                >
                  <p class="text-[10px] uppercase tracking-[0.24em] text-[#7C74E7]/80">{{ section.label }}</p>
                  <h3 class="mt-3 font-serif text-[1.28rem] font-normal leading-[1.18] text-white md:text-[1.75rem]">
                    {{ section.card }}
                  </h3>
                  <p class="mt-1.5 max-w-[450px] font-serif text-[0.94rem] leading-[1.52] text-[#A99AE6] md:text-[1.16rem]">
                    {{ section.headline }}
                  </p>
                  <div class="mt-3 max-w-[448px] space-y-3.5">
                    <p
                      v-for="(paragraph, paragraphIndex) in section.bodyParagraphs"
                      :key="paragraphIndex"
                      class="text-[0.9rem] leading-[1.82] text-white/52 md:text-[0.96rem]"
                    >
                      {{ paragraph }}
                    </p>
                  </div>
                </section>
              </div>

              <section v-if="biggerPictureSection" class="bigger-picture-card max-w-[620px]">
                <p class="text-[10px] uppercase tracking-[0.24em] text-[#7C74E7]/80">The Bigger Picture</p>
                <h3 class="mt-4 font-serif text-[1.45rem] font-normal leading-[1.16] text-white md:text-[2rem]">
                  Putting It All Together
                </h3>
                <p class="mt-4 max-w-[500px] font-serif text-[1.06rem] leading-[1.48] text-[#D5C7FF] md:text-[1.34rem]">
                  {{ biggerPictureSection.headline }}
                </p>
                <div class="mt-5 max-w-[470px] space-y-3.5">
                  <p
                    v-for="(paragraph, paragraphIndex) in biggerPictureSection.bodyParagraphs"
                    :key="paragraphIndex"
                    class="text-[0.9rem] leading-[1.82] text-white/62 md:text-[0.96rem]"
                  >
                    {{ paragraph }}
                  </p>
                </div>
              </section>

              <section v-if="gentleReminderSection" class="max-w-[560px]">
                <p class="text-[10px] uppercase tracking-[0.24em] text-[#7C74E7]/80">A Gentle Reminder</p>
                <p class="mt-3 max-w-[500px] font-serif text-[1.04rem] leading-[1.52] text-white md:text-[1.34rem]">
                  {{ gentleReminderSection.headline }}
                </p>
                <div class="mt-3 max-w-[448px] space-y-3.5">
                  <p
                    v-for="(paragraph, paragraphIndex) in gentleReminderSection.bodyParagraphs"
                    :key="paragraphIndex"
                    class="text-[0.9rem] leading-[1.82] text-white/52 md:text-[0.96rem]"
                  >
                    {{ paragraph }}
                  </p>
                </div>
              </section>

              <div v-if="(props.readingData?.followUps ?? []).length" class="pt-0">
                <button
                  type="button"
                  class="flex w-full items-center justify-between rounded-full bg-[linear-gradient(90deg,#6B3FD4_0%,#7F49E2_55%,#8E55F0_100%)] px-8 py-4 font-serif text-[1.1rem] text-white shadow-[0_18px_44px_rgba(92,55,196,0.34)] transition hover:brightness-110 active:scale-[0.995] md:text-[1.28rem]"
                  @click="$emit('follow-up', props.readingData.followUps[0])"
                >
                  <span class="mx-auto">Ask a follow-up</span>
                  <span class="ml-4 text-[1.7rem] text-white/92">→</span>
                </button>
                <p class="mt-5 text-center text-[0.95rem] text-white/28">Explore this further with AI.</p>
              </div>
            </div>

            <div v-else class="mt-12 max-w-[620px] space-y-5">
              <p
                v-for="(paragraph, index) in paragraphs"
                :key="index"
                class="font-serif text-[0.98rem] leading-[1.85] text-white/72"
              >
                {{ paragraph }}
              </p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, onBeforeUnmount, watch } from "vue";
import StarfieldBackground from "../StarfieldBackground.vue";
import TarotCardFace from "./TarotCardFace.vue";

const props = defineProps({
  visible: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  question: { type: String, default: "" },
  reading: { type: String, default: "" },
  readingData: {
    type: Object,
    default: () => null,
  },
  readingLabel: { type: String, default: "Love Energy Reading" },
  readingTitle: { type: String, default: "Your three-card reading" },
  drawAgainLabel: { type: String, default: "Draw again" },
  slots: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["close", "follow-up"]);

let restoreScrollLock = null;

function setScrollLock(active) {
  if (typeof document === "undefined") return;

  if (active) {
    if (restoreScrollLock) return;

    const body = document.body;
    const html = document.documentElement;
    const previous = {
      bodyOverflow: body.style.overflow,
      bodyTouchAction: body.style.touchAction,
      bodyOverscrollBehavior: body.style.overscrollBehavior,
      htmlOverflow: html.style.overflow,
      htmlOverscrollBehavior: html.style.overscrollBehavior,
    };

    body.style.overflow = "hidden";
    body.style.touchAction = "none";
    body.style.overscrollBehavior = "none";
    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";

    restoreScrollLock = () => {
      body.style.overflow = previous.bodyOverflow;
      body.style.touchAction = previous.bodyTouchAction;
      body.style.overscrollBehavior = previous.bodyOverscrollBehavior;
      html.style.overflow = previous.htmlOverflow;
      html.style.overscrollBehavior = previous.htmlOverscrollBehavior;
      restoreScrollLock = null;
    };

    return;
  }

  restoreScrollLock?.();
}

function sentenceSplit(text = "") {
  return String(text)
    .replace(/\s+/g, " ")
    .trim()
    .match(/[^.!?]+[.!?]?/g) ?? [];
}

function groupSentences(sentences = [], perParagraph = 2) {
  const groups = [];
  for (let index = 0; index < sentences.length; index += perParagraph) {
    groups.push(sentences.slice(index, index + perParagraph).join(" ").trim());
  }
  return groups.filter(Boolean);
}

function clampText(text = "", maxLength = 96) {
  const normalized = String(text).replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  const clipped = normalized.slice(0, maxLength).replace(/[\s,;:，；：]+[^\s,;:，；：]*$/, "");
  return `${clipped || normalized.slice(0, maxLength).trim()}…`;
}

function toReadingSection(text = "") {
  const sentences = sentenceSplit(text).map((sentence) => sentence.trim()).filter(Boolean);
  if (!sentences.length) return { headline: "", bodyParagraphs: [] };
  const [headline, ...rest] = sentences;
  const bodyParagraphs = groupSentences(rest.length ? rest : [headline], 2);

  return {
    headline: headline.trim(),
    bodyParagraphs,
  };
}

const hasStructuredReading = computed(() =>
  Boolean(
    props.readingData &&
      (props.readingData.reflection ||
        props.readingData.combined ||
        props.readingData.gentleReminder ||
        (props.readingData.cardReadings ?? []).length ||
        (props.readingData.followUps ?? []).length),
  ),
);

const paragraphs = computed(() =>
  props.reading
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean),
);

const heroInsight = computed(() => {
  const combined = String(props.readingData?.combined ?? "").trim();
  const sentences = sentenceSplit(combined).map((sentence) => sentence.trim()).filter(Boolean);
  const firstSentence = sentences[0] ?? "The cards are gathering your answer.";
  return clampText(firstSentence, 96);
});

const cardSectionLabels = [
  "Your Heart Today",
  "What’s Influencing This",
  "Where To Focus",
];

const cardSections = computed(() =>
  (props.readingData?.cardReadings ?? []).slice(0, 3).map((item, index) => {
    const parsed = toReadingSection(item.message ?? "");
    return {
      label: cardSectionLabels[index] ?? item.position ?? "",
      card: item.card ?? "",
      headline: parsed.headline,
      bodyParagraphs: parsed.bodyParagraphs,
    };
  }),
);

const biggerPictureSection = computed(() => {
  const parsed = toReadingSection(props.readingData?.combined ?? "");
  if (!parsed.headline) return null;
  return parsed;
});

const gentleReminderSection = computed(() => {
  const parsed = toReadingSection(props.readingData?.gentleReminder ?? "");
  if (!parsed.headline) return null;
  return parsed;
});

watch(
  () => props.visible,
  (visible) => {
    setScrollLock(visible);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  setScrollLock(false);
});
</script>

<style scoped>
.reading-panel {
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.hero-insight-copy {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.reading-card-section {
  max-width: 560px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.055);
  background: rgba(255, 255, 255, 0.055);
  padding: 28px 24px 30px;
  box-shadow:
    0 18px 44px rgba(0, 0, 0, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.025);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

@supports not ((backdrop-filter: blur(8px)) or (-webkit-backdrop-filter: blur(8px))) {
  .reading-card-section {
    background: rgba(255, 255, 255, 0.08);
  }
}

.bigger-picture-card {
  position: relative;
  overflow: hidden;
  padding: 34px 26px 36px;
  border-radius: 28px;
  background:
    radial-gradient(circle at 50% 0%, rgba(132, 91, 220, 0.16), transparent 46%),
    linear-gradient(160deg, rgba(110, 84, 145, 0.12), rgba(255, 255, 255, 0.035));
  border: 1px solid rgba(174, 145, 240, 0.1);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.035),
    0 18px 44px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

@supports not ((backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px))) {
  .bigger-picture-card {
    background:
      radial-gradient(circle at 50% 0%, rgba(132, 91, 220, 0.18), transparent 46%),
      rgba(42, 37, 51, 0.96);
  }
}

.reading-fade-enter-active,
.reading-fade-leave-active {
  transition: opacity 280ms ease;
}

.reading-fade-enter-from,
.reading-fade-leave-to {
  opacity: 0;
}
</style>
