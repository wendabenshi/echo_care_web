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
        <div class="mx-auto flex min-h-full w-full max-w-[430px] flex-col px-4 py-12 md:max-w-[900px] md:px-12 md:py-16">
          <div class="text-center">
            <p class="text-[10px] uppercase tracking-[0.28em] text-[rgba(189,176,230,0.82)]">Your Question</p>

            <h2 class="mx-auto mt-2.5 max-w-[320px] font-woomoo-serif text-[1.2rem] font-normal italic leading-[1.3] text-white/54 md:max-w-[520px] md:text-[1.9rem]">
              “{{ question }}”
            </h2>
          </div>

          <div v-if="loading" class="mt-10 flex flex-col items-center gap-4 py-16">
            <div class="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-[#B8A4FF]" />
            <p class="text-sm text-white/40">The cards are speaking…</p>
          </div>

          <template v-else>
            <div class="mt-8 flex items-start justify-between gap-2.5 md:mt-11 md:gap-9">
              <div
                v-for="(slot, index) in slots"
                :key="slot.label"
                class="flex min-w-0 flex-1 flex-col items-center gap-2.5"
              >
                <div class="h-[148px] w-[92px] overflow-hidden rounded-[17px] ring-1 ring-white/10 shadow-[0_14px_34px_rgba(0,0,0,0.28)] md:h-[304px] md:w-[188px] md:rounded-[23px]">
                  <TarotCardFace :label="slot.label" />
                </div>
                <div class="space-y-1 text-center">
                  <p class="hero-slot-position font-woomoo-ui">
                    {{ slot.heroPosition || slot.position || `Card ${index + 1}` }}
                  </p>
                  <p class="font-woomoo-body text-[0.78rem] leading-tight text-white/82 md:text-[0.96rem]">
                    {{ slot.label }}
                  </p>
                </div>
              </div>
            </div>

            <div v-if="hasStructuredReading" class="mx-auto mt-10 w-full max-w-[620px] text-center md:mt-11">
              <h3 class="font-woomoo-serif text-[1.16rem] font-normal leading-[1.18] text-white md:text-[1.86rem]">
                Your Three-Card Insight
              </h3>
              <p class="hero-insight-copy mx-auto mt-3 max-w-[380px] font-woomoo-body text-[0.92rem] leading-[1.68] text-white/46 md:max-w-[660px] md:text-[1.04rem]">
                {{ heroInsight }}
              </p>
            </div>

            <div v-if="hasStructuredReading" class="mx-auto mt-8 w-full max-w-[760px] space-y-14 md:mt-10 md:space-y-16">
              <div class="space-y-5 md:mr-6 md:space-y-6">
                <section
                  v-for="section in cardSections"
                  :key="section.label"
                  class="reading-card-section"
                >
                  <p class="text-[9px] uppercase tracking-[0.2em] text-[rgba(189,176,230,0.82)]">{{ section.label }}</p>
                  <h3 class="mt-3 font-woomoo-body text-[1.18rem] font-medium leading-[1.24] tracking-[-0.01em] text-[rgba(244,240,248,0.84)] md:text-[1.4rem]">
                    {{ section.card }}
                  </h3>
                  <div v-if="section.tags.length" class="mt-2.5 flex flex-wrap gap-1.5">
                    <span
                      v-for="tag in section.tags"
                      :key="tag"
                      class="reading-card-chip"
                    >
                      {{ tag }}
                    </span>
                  </div>
                  <div v-if="section.paragraphs.length" class="mt-[0.66rem] max-w-[476px] space-y-[0.16rem]">
                    <p
                      v-for="(paragraph, paragraphIndex) in section.paragraphs"
                      :key="paragraphIndex"
                      class="font-woomoo-body text-[0.9rem] leading-[1.14] text-[rgba(214,210,223,0.5)] md:text-[0.95rem]"
                    >
                      {{ paragraph }}
                    </p>
                  </div>
                </section>
              </div>

              <section v-if="biggerPictureSection" class="bigger-picture-card max-w-[620px]">
                <p class="text-[10px] uppercase tracking-[0.24em] text-[#7C74E7]/80">The Bigger Picture</p>
                <div v-if="cardSections.length" class="bigger-picture-chip-row">
                  <span
                    v-for="section in cardSections"
                    :key="`bigger-picture-${section.card}`"
                    class="bigger-picture-chip"
                  >
                    {{ section.card }}
                  </span>
                </div>
                <p class="bigger-picture-kicker">What The Cards Are Saying</p>
                <p class="bigger-picture-lead">
                  {{ biggerPictureSection.headline }}
                </p>
                <p
                  v-if="biggerPictureSupportingText"
                  class="bigger-picture-supporting"
                >
                  {{ biggerPictureSupportingText }}
                </p>
              </section>

              <section v-if="gentleReminderSection" class="gentle-guidance-card max-w-[620px]">
                <p class="gentle-guidance-label">✦ A Gentle Reminder ✦</p>
                <p class="gentle-guidance-copy">
                  {{ gentleReminderText }}
                </p>
              </section>

              <div class="pt-0">
                <button
                  type="button"
                  class="reading-home-cta"
                  @click="$emit('home')"
                >
                  <span class="reading-home-cta-label">Back to Home</span>
                  <span class="reading-home-cta-arrow" aria-hidden="true">→</span>
                </button>
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

defineEmits(["close", "home"]);

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
  const bodyParagraphs = rest.length ? groupSentences(rest, 2) : [];

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
      tags: Array.isArray(props.slots?.[index]?.tags) ? props.slots[index].tags.slice(0, 3) : [],
      paragraphs: [parsed.headline, ...parsed.bodyParagraphs].filter(Boolean),
    };
  }),
);

const biggerPictureSection = computed(() => {
  const parsed = toReadingSection(props.readingData?.combined ?? "");
  if (!parsed.headline) return null;
  return parsed;
});

const biggerPictureSupportingText = computed(() => {
  if (!biggerPictureSection.value) return "";
  return biggerPictureSection.value.bodyParagraphs.join(" ").trim();
});

const gentleReminderSection = computed(() => {
  const parsed = toReadingSection(props.readingData?.gentleReminder ?? "");
  if (!parsed.headline) return null;
  return parsed;
});

const gentleReminderText = computed(() => {
  if (!gentleReminderSection.value) return "";
  return [gentleReminderSection.value.headline, ...gentleReminderSection.value.bodyParagraphs].join(" ").trim();
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

.hero-slot-position {
  max-width: 6.9rem;
  margin: 0 auto;
  font-size: 0.5rem;
  text-transform: uppercase;
  line-height: 1.18;
  letter-spacing: 0.16em;
  color: rgba(255, 255, 255, 0.28);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (min-width: 768px) {
  .hero-slot-position {
    max-width: 10rem;
    font-size: 0.68rem;
    letter-spacing: 0.18em;
  }
}

.reading-card-section {
  max-width: 100%;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.022);
  background:
    linear-gradient(180deg, rgba(34, 31, 42, 0.95) 0%, rgba(31, 28, 39, 0.92) 100%);
  padding: 20px 17px 22px;
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.012);
}

@media (min-width: 768px) {
  .reading-card-section {
    max-width: 560px;
    border-radius: 22px;
    padding: 22px 20px 24px;
  }
}

.reading-card-chip {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.028);
  padding: 0.3rem 0.64rem;
  font-family: inherit;
  font-size: 0.7rem;
  line-height: 1;
  color: rgba(255, 255, 255, 0.32);
}

.bigger-picture-card {
  position: relative;
  overflow: hidden;
  padding: 38px 17px 36px;
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

.bigger-picture-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 12px;
  max-width: 100%;
}

.bigger-picture-chip {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.34rem 0.68rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.045);
  font-family: "Afacad", "Manrope", -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  font-size: 0.78rem;
  line-height: 1;
  color: rgba(223, 215, 238, 0.54);
}

.bigger-picture-kicker {
  margin-top: 18px;
  font-family: "Afacad", "Manrope", -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 0.02em;
  color: rgba(235, 228, 248, 0.74);
}

.bigger-picture-lead {
  max-width: 100%;
  margin-top: 12px;
  font-family: "Lora", Georgia, "Times New Roman", serif;
  font-size: 0.9rem;
  line-height: 1.56;
  color: rgba(232, 224, 244, 0.82);
}

.bigger-picture-supporting {
  max-width: 100%;
  margin-top: 14px;
  font-family: "Afacad", "Manrope", -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  font-size: 0.9rem;
  line-height: 1.56;
  color: rgba(214, 210, 223, 0.5);
}

@supports not ((backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px))) {
  .bigger-picture-card {
    background:
      radial-gradient(circle at 50% 0%, rgba(132, 91, 220, 0.18), transparent 46%),
      rgba(42, 37, 51, 0.96);
  }
}

.gentle-guidance-card {
  position: relative;
  overflow: hidden;
  padding: 30px 24px 28px;
  border-radius: 30px;
  border: 1px solid rgba(214, 198, 255, 0.08);
  background:
    radial-gradient(circle at 17% 84%, rgba(88, 39, 161, 0.22), transparent 26%),
    radial-gradient(circle at 84% 86%, rgba(103, 160, 255, 0.22), transparent 24%),
    linear-gradient(128deg, rgba(14, 13, 21, 0.985) 0%, rgba(19, 17, 28, 0.98) 22%, rgba(32, 22, 50, 0.96) 50%, rgba(57, 38, 97, 0.9) 76%, rgba(57, 97, 168, 0.82) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.035),
    0 18px 44px rgba(8, 7, 16, 0.24);
}

.gentle-guidance-card::before {
  content: "";
  position: absolute;
  inset: -18% -10%;
  background:
    radial-gradient(circle at 56% 46%, rgba(255, 255, 255, 0.08), transparent 18%),
    linear-gradient(125deg, transparent 22%, rgba(166, 206, 255, 0.16) 46%, rgba(208, 138, 255, 0.14) 61%, transparent 79%);
  opacity: 0.92;
  filter: blur(32px);
  pointer-events: none;
}

.gentle-guidance-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% 50%, transparent 48%, rgba(8, 8, 14, 0.18) 100%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.012), rgba(255, 255, 255, 0));
  pointer-events: none;
}

.gentle-guidance-label {
  position: relative;
  z-index: 1;
  text-align: center;
  font-size: 10px;
  line-height: 1.2;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgba(228, 216, 255, 0.76);
}

.gentle-guidance-copy {
  position: relative;
  z-index: 1;
  max-width: 494px;
  margin: 20px auto 0;
  font-family: "Lora", Georgia, "Times New Roman", serif;
  font-size: 0.92rem;
  font-weight: 400;
  font-style: normal;
  line-height: 1.78;
  letter-spacing: 0.002em;
  text-align: center;
  color: rgba(245, 241, 250, 0.9);
  text-wrap: pretty;
}

@media (min-width: 768px) {
  .bigger-picture-card {
    padding: 42px 20px 40px;
  }

  .bigger-picture-chip-row {
    margin-top: 14px;
    gap: 0.5rem;
  }

  .bigger-picture-chip {
    font-size: 0.82rem;
    padding: 0.38rem 0.74rem;
  }

  .bigger-picture-kicker {
    margin-top: 20px;
    font-size: 0.86rem;
  }

  .bigger-picture-lead {
    max-width: 500px;
    margin-top: 14px;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .bigger-picture-supporting {
    max-width: 448px;
    margin-top: 16px;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .gentle-guidance-card {
    padding: 34px 34px 32px;
    border-radius: 32px;
  }

  .gentle-guidance-copy {
    max-width: 556px;
    margin-top: 20px;
    font-size: 1.04rem;
    line-height: 1.82;
  }
}

.reading-home-cta {
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  overflow: hidden;
  border-radius: 999px;
  border: 1px solid rgba(192, 170, 255, 0.12);
  background:
    radial-gradient(circle at 18% 50%, rgba(94, 54, 180, 0.18), transparent 30%),
    radial-gradient(circle at 82% 50%, rgba(95, 132, 255, 0.16), transparent 28%),
    linear-gradient(135deg, rgba(26, 23, 35, 0.98) 0%, rgba(45, 31, 72, 0.96) 52%, rgba(40, 58, 102, 0.94) 100%);
  padding: 0.95rem 1.1rem;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.045),
    0 14px 34px rgba(7, 6, 14, 0.22);
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease,
    background 180ms ease;
}

.reading-home-cta:hover {
  border-color: rgba(206, 188, 255, 0.18);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.055),
    0 18px 40px rgba(7, 6, 14, 0.26);
}

.reading-home-cta:active {
  transform: scale(0.992);
}

.reading-home-cta-label {
  font-family: "Afacad", "Manrope", -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.01em;
  color: rgba(248, 244, 255, 0.94);
}

.reading-home-cta-arrow {
  display: inline-flex;
  height: 2.1rem;
  width: 2.1rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  font-size: 1.15rem;
  line-height: 1;
  color: rgba(255, 255, 255, 0.88);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

@media (min-width: 768px) {
  .reading-home-cta {
    padding: 1rem 1.3rem;
  }

  .reading-home-cta-label {
    font-size: 1.08rem;
  }

  .reading-home-cta-arrow {
    height: 2.2rem;
    width: 2.2rem;
    font-size: 1.18rem;
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
