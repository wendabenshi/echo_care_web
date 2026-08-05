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
        <div class="mx-auto flex min-h-full w-full max-w-[430px] flex-col px-7 py-12 md:px-8 md:py-14">
          <p class="text-[10px] uppercase tracking-[0.24em] text-[#7C74E7]/80">{{ readingLabel }}</p>

          <div v-if="loading" class="mt-10 flex flex-col items-center gap-4 py-16">
            <div class="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-[#B8A4FF]" />
            <p class="text-sm text-white/40">The cards are speaking…</p>
          </div>

          <template v-else>
            <div class="mt-8 flex flex-col items-center text-center">
              <div class="h-[222px] w-[138px] overflow-hidden rounded-[20px] ring-1 ring-white/10 shadow-[0_22px_52px_rgba(0,0,0,0.32)]">
                <TarotCardFace :label="primaryCardLabel" />
              </div>

              <h2 class="mt-8 font-serif text-[1.72rem] font-normal leading-[1] text-white md:text-[2.5rem]">
                {{ primaryCardLabel }}
              </h2>

              <p
                v-if="heroSubtitle"
                class="mt-5 max-w-[312px] font-serif text-[0.94rem] leading-[1.72] text-[#8F83CD] md:text-[1.15rem]"
              >
                {{ heroSubtitle }}
              </p>
            </div>

            <div class="mt-16 space-y-16 md:mt-20 md:space-y-[4.75rem]">
              <section
                v-for="section in editorialSections"
                :key="section.label"
                class="mx-auto w-full max-w-[312px]"
              >
                <p class="text-[10px] uppercase tracking-[0.24em] text-[#7C74E7]/80">{{ section.label }}</p>
                <h3 class="mt-3 max-w-[290px] font-serif text-[1.38rem] font-normal leading-[1.28] text-white md:text-[1.78rem]">
                  {{ section.headline }}
                </h3>
                <p class="mt-2 max-w-[294px] text-[0.93rem] leading-[2] text-white/45 md:text-[0.98rem]">
                  {{ section.body }}
                </p>
              </section>

              <div v-if="!hasStructuredReading" class="mx-auto w-full max-w-[312px]">
                <p
                  v-for="(paragraph, index) in paragraphs"
                  :key="index"
                  class="max-w-[294px] text-[0.93rem] leading-[2] text-white/45"
                  :class="index > 0 ? 'mt-6' : ''"
                >
                  {{ paragraph }}
                </p>
              </div>
            </div>

            <div class="mt-20 flex w-full max-w-[312px] flex-col items-center self-center md:mt-24">
              <button
                type="button"
                class="flex w-full items-center justify-between rounded-full border border-white/8 bg-white/[0.03] px-7 py-3.5 font-serif text-[1.18rem] text-white/88 transition hover:bg-white/[0.055] active:scale-[0.995]"
                @click="$emit('close')"
              >
                <span class="mx-auto">{{ drawAgainLabel }}</span>
                <span class="ml-4 text-[1.55rem] text-[#8F83CD]">→</span>
              </button>
              <p class="mt-5 text-center text-[0.9rem] text-white/26">
                A new card is waiting.
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
  reading: { type: String, default: "" },
  readingData: {
    type: Object,
    default: () => null,
  },
  readingLabel: { type: String, default: "Today's Companion" },
  readingTitle: { type: String, default: "Your companion message" },
  drawAgainLabel: { type: String, default: "Draw again" },
  slots: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["close"]);

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

function trimHeadlineLead(text = "") {
  return String(text)
    .replace(/^(in love|today|for now|right now)\s*,\s*/i, "")
    .trim();
}

function shortenHeadline(text = "", maxWords = 5) {
  const cleaned = trimHeadlineLead(text)
    .replace(/[.,!?;:]+$/g, "")
    .trim();

  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return cleaned;
  return words.slice(0, maxWords).join(" ").trim();
}

function toHeadlineAndBody(text = "", options = {}) {
  const sentences = sentenceSplit(text);
  if (!sentences.length) return { headline: "", body: "" };
  const [firstSentence, ...rest] = sentences;
  const first = firstSentence.trim();
  const cleanedFirst = trimHeadlineLead(first);
  const headline = shortenHeadline(cleanedFirst, options.maxWords ?? 5);
  const overflow = cleanedFirst
    .replace(new RegExp(`^${headline.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*`, "i"), "")
    .replace(/^[,.:;!?-]+\s*/g, "")
    .trim();

  return {
    headline,
    body: [overflow, ...rest].filter(Boolean).join(" ").trim() || cleanedFirst,
  };
}

function toEditorialSection(label, text, options = {}) {
  if (!text) return null;
  const { headline, body } = toHeadlineAndBody(text, options);
  if (!headline) return null;
  return { label, headline, body };
}

const hasStructuredReading = computed(() =>
  Boolean(
    props.readingData &&
      (props.readingData.todaysEnergy ||
        props.readingData.forYourHeart ||
        props.readingData.oneSmallAction ||
        props.readingData.guidance ||
        props.readingData.love ||
        props.readingData.needToday ||
        props.readingData.smallAction ||
        props.readingData.companionNote ||
        (props.readingData.cardReadings ?? []).length),
  ),
);

const paragraphs = computed(() =>
  props.reading
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean),
);

const primaryCardLabel = computed(() => props.slots?.[0]?.label || "Today's Card");

const todaysEnergyText = computed(() =>
  String(props.readingData?.todaysEnergy ?? props.readingData?.guidance ?? "").trim(),
);

const forYourHeartText = computed(() =>
  String(
    props.readingData?.forYourHeart ??
      props.readingData?.needToday ??
      props.readingData?.love ??
      "",
  ).trim(),
);

const oneSmallActionText = computed(() =>
  String(props.readingData?.oneSmallAction ?? props.readingData?.smallAction ?? "").trim(),
);

const companionNoteText = computed(() =>
  String(props.readingData?.companionNote ?? "").trim(),
);

const heroSubtitle = computed(() => {
  if (todaysEnergyText.value) {
    return sentenceSplit(todaysEnergyText.value)[0]?.trim() || "";
  }
  return "";
});

const editorialSections = computed(() => {
  const sections = [
    toEditorialSection("Today's Energy", todaysEnergyText.value, { maxWords: 5 }),
    toEditorialSection("For Your Heart", forYourHeartText.value, { maxWords: 5 }),
    toEditorialSection("One Small Action", oneSmallActionText.value, { maxWords: 5 }),
    toEditorialSection("Companion Note", companionNoteText.value, { maxWords: 6 }),
  ].filter(Boolean);

  if (sections.length > 1 && heroSubtitle.value) {
    const first = sections[0];
    if (first.body === first.headline || first.headline === heroSubtitle.value) {
      first.body = sentenceSplit(todaysEnergyText.value).slice(1).join(" ").trim() || first.body;
    }
  }

  return sections;
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

.reading-fade-enter-active,
.reading-fade-leave-active {
  transition: opacity 280ms ease;
}

.reading-fade-enter-from,
.reading-fade-leave-to {
  opacity: 0;
}
</style>
