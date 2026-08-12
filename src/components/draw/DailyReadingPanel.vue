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
        <div class="mx-auto flex min-h-full w-full max-w-[430px] flex-col px-6 pb-12 pt-[max(1.35rem,env(safe-area-inset-top,0px)+0.95rem)] md:px-8 md:pb-14 md:pt-10">
          <p class="font-woomoo-ui pl-0.5 text-[9px] font-medium uppercase tracking-[0.36em] text-[#8B80DF]/66">
            {{ readingLabel }}
          </p>

          <div v-if="loading" class="mt-10 flex flex-col items-center gap-4 py-16">
            <div class="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-[#B8A4FF]" />
            <p class="text-sm text-white/40">The cards are speaking…</p>
          </div>

          <template v-else>
            <div class="mt-8 flex flex-col items-center text-center">
              <div class="relative">
                <div
                  class="pointer-events-none absolute inset-x-[-38px] bottom-[-32px] top-[18px] rounded-full blur-3xl"
                  aria-hidden="true"
                  style="background: radial-gradient(circle at center, rgba(92, 83, 168, 0.42) 0%, rgba(92, 83, 168, 0.16) 42%, rgba(92, 83, 168, 0) 76%);"
                />
                <div class="relative h-[216px] w-[134px] overflow-hidden rounded-[21px] ring-1 ring-white/10 shadow-[0_22px_48px_rgba(0,0,0,0.33)]">
                  <TarotCardFace :label="primaryCardLabel" :src="primaryCardImageSrc" />
                </div>
              </div>

              <h2 class="font-woomoo-serif mt-7 max-w-[21.3rem] text-[1.98rem] font-medium leading-[1.02] tracking-[-0.018em] text-white md:text-[2.5rem]">
                {{ primaryCardLabel }}
              </h2>

              <p
                v-if="coreInsightText"
                class="font-woomoo-body mt-4 max-w-[21.3rem] text-[0.93rem] font-normal leading-[1.72] tracking-[-0.003em] text-white/64 md:text-[0.98rem]"
              >
                {{ coreInsightText }}
              </p>

              <div
                v-if="glanceItems.length"
                class="daily-glance mt-9 w-full max-w-[21.3rem]"
              >
                <div
                  v-for="item in glanceItems"
                  :key="item.label"
                  class="daily-glance-item"
                >
                  <p class="daily-glance-label font-woomoo-ui">{{ item.label }}</p>
                  <p class="daily-glance-value font-editorial">{{ item.value }}</p>
                </div>
              </div>
            </div>

            <div class="mt-[calc(4rem-15px)] space-y-[calc(3.8rem-20px)] md:mt-[calc(5rem-15px)] md:space-y-[calc(4.4rem-20px)]">
              <section
                v-for="section in readingSections"
                :key="section.key"
                class="reading-section"
              >
                <div
                  class="reading-section-icon"
                  aria-hidden="true"
                  :class="section.iconClass"
                >
                  <img
                    v-if="section.imageSrc"
                    :src="section.imageSrc"
                    :alt="section.label"
                    class="reading-section-image"
                    :class="`reading-section-image--${section.key}`"
                  />
                  <template v-else>
                    <div class="reading-section-icon-orb" />
                    <div class="reading-section-icon-core">
                    <div
                      v-if="section.key === 'reflect'"
                      class="icon-heart"
                    >
                      <span />
                      <span />
                    </div>
                    <div
                      v-else-if="section.key === 'where'"
                      class="icon-stairs"
                    >
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                    <div
                      v-else
                      class="icon-ribbon"
                    >
                      <span />
                      <span />
                      <span />
                    </div>
                    </div>
                  </template>
                </div>
                <p class="reading-section-label font-woomoo-ui">
                  {{ section.label }}
                </p>
                <p class="reading-section-title font-woomoo-ui">
                  {{ section.title }}
                </p>
                <p class="reading-section-body font-woomoo-body">
                  {{ section.body }}
                </p>
              </section>

              <section
                v-if="gentleReminderText"
                class="gentle-guidance-card mt-6 w-full max-w-[23rem]"
              >
                <p class="gentle-guidance-label font-woomoo-ui">✦ A Gentle Reminder ✦</p>
                <p class="gentle-guidance-copy font-woomoo-serif">
                  {{ gentleReminderText }}
                </p>
              </section>

              <div v-if="!hasStructuredReading" class="mx-auto w-full max-w-[320px] text-center">
                <p
                  v-for="(paragraph, index) in paragraphs"
                  :key="index"
                  class="font-woomoo-body max-w-[304px] text-[1rem] font-normal leading-[1.78] tracking-[-0.003em] text-white/62"
                  :class="index > 0 ? 'mt-6' : ''"
                >
                  {{ paragraph }}
                </p>
              </div>
            </div>

            <div class="mt-12 flex w-full max-w-[320px] flex-col items-center self-center md:mt-16">
              <button
                type="button"
                class="reading-home-cta"
                @click="$emit('home')"
              >
                <span class="reading-home-cta-label">Back to Home</span>
                <span class="reading-home-cta-arrow" aria-hidden="true">→</span>
              </button>
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
import { getDailyGlanceCopy } from "../../data/tarotCards.js";

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

function normalizeText(value = "") {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function sentenceSplit(text = "") {
  return normalizeText(text).match(/[^.!?]+[.!?]?/g) ?? [];
}

const paragraphs = computed(() =>
  props.reading
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean),
);

const primaryCardLabel = computed(
  () => normalizeText(props.readingData?.card_name) || props.slots?.[0]?.label || "Today's Card",
);

const primaryCardImageSrc = computed(() => props.slots?.[0]?.imageSrc ?? "");

const coreInsightText = computed(() =>
  normalizeText(props.readingData?.core_insight) ||
  normalizeText(
    sentenceSplit(props.readingData?.forYourHeart ?? props.readingData?.needToday ?? "")
      .slice(0, 2)
      .join(" "),
  ) ||
  normalizeText(
    sentenceSplit(props.readingData?.todaysEnergy ?? props.readingData?.guidance ?? "")
      .slice(0, 2)
      .join(" "),
  ),
);

const reflectText = computed(() =>
  normalizeText(
    props.readingData?.sections?.what_this_card_reflects ??
      props.readingData?.what_this_card_reflects ??
      props.readingData?.todaysEnergy ??
      props.readingData?.guidance ??
      "",
  ),
);

const whereNowText = computed(() =>
  normalizeText(
    props.readingData?.sections?.where_you_may_be_now ??
      props.readingData?.where_you_may_be_now ??
      props.readingData?.forYourHeart ??
      props.readingData?.needToday ??
      props.readingData?.love ??
      "",
  ),
);

const smallShiftText = computed(() =>
  normalizeText(
    props.readingData?.sections?.one_small_shift ??
      props.readingData?.one_small_shift ??
      props.readingData?.oneSmallAction ??
      props.readingData?.smallAction ??
      "",
  ),
);

const gentleReminderText = computed(() =>
  normalizeText(
    props.readingData?.sections?.gentle_reminder ??
      props.readingData?.gentle_reminder ??
      props.readingData?.companionNote ??
      "",
  ),
);

const dailyGlanceCopy = computed(
  () =>
    getDailyGlanceCopy(primaryCardLabel.value) ?? {
      today: "Read The Signs",
      heart: "Notice Your Pace",
      step: "Take One Step",
    },
);

const hasStructuredReading = computed(() =>
  Boolean(
    coreInsightText.value ||
      reflectText.value ||
      whereNowText.value ||
      smallShiftText.value ||
      gentleReminderText.value,
  ),
);

const glanceItems = computed(() =>
  [
    {
      label: "Today",
      value: dailyGlanceCopy.value.today,
    },
    {
      label: "Your Heart",
      value: dailyGlanceCopy.value.heart,
    },
    {
      label: "Gentle Step",
      value: dailyGlanceCopy.value.step,
    },
  ].filter((item) => item.value),
);

const readingSections = computed(() =>
  [
    {
      key: "reflect",
      label: "What This Card Reflects",
      title: "Tarot Symbolism Today",
      iconClass: "is-heart",
      imageSrc: "/section-art/daily-reflect-orb.png",
      body: reflectText.value,
    },
    {
      key: "where",
      label: "Where You May Be Now",
      title: "A Real-Life Mirror",
      iconClass: "is-stairs",
      imageSrc: "/section-art/daily-where-orb.png",
      body: whereNowText.value,
    },
    {
      key: "shift",
      label: "One Small Shift",
      title: "A Gentle Next Move",
      iconClass: "is-ribbon",
      imageSrc: "/section-art/daily-shift-orb.png",
      body: smallShiftText.value,
    },
  ].filter((section) => section.body),
);

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

.daily-glance {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: 0.7rem;
}

.daily-glance-item {
  min-width: 0;
  text-align: center;
}

.daily-glance-label {
  margin: 0;
  font-size: 0.62rem;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: 0.18rem;
  text-transform: uppercase;
  color: rgba(215, 210, 223, 0.46);
}

.daily-glance-value {
  margin: 0.48rem auto 0;
  max-width: 5.3rem;
  font-size: 1.01rem;
  font-weight: 500;
  line-height: 1.18;
  color: rgba(255, 255, 255, 0.86);
}

.reading-section {
  margin: 0 auto;
  max-width: 23rem;
  text-align: center;
}

.reading-section-icon {
  position: relative;
  margin: 0 auto calc(1.2rem - 15px);
  display: grid;
  place-items: center;
  width: 4.4rem;
  height: 4.4rem;
}

.reading-section-image {
  position: absolute;
  inset: 50%;
  z-index: 2;
  display: block;
  width: 5rem;
  max-width: none;
  transform: translate(-50%, -50%);
  object-fit: contain;
  filter: drop-shadow(0 12px 28px rgba(135, 118, 242, 0.24));
  pointer-events: none;
}

.reading-section-image--reflect {
  width: 4.5rem;
}

.reading-section-image--where,
.reading-section-image--shift {
  width: 5.1rem;
}

.reading-section-image--where {
  width: 5.38rem;
  filter:
    drop-shadow(0 14px 34px rgba(135, 118, 242, 0.3))
    brightness(1.22)
    saturate(1.08)
    contrast(1.02);
}

.reading-section-icon-orb {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background:
    radial-gradient(circle at 34% 28%, rgba(255, 255, 255, 0.46) 0%, rgba(255, 255, 255, 0.12) 16%, transparent 42%),
    radial-gradient(circle at 74% 76%, rgba(255, 212, 240, 0.4) 0%, rgba(255, 212, 240, 0.1) 24%, transparent 54%),
    linear-gradient(148deg, rgba(28, 44, 205, 0.98) 0%, rgba(93, 73, 247, 0.96) 36%, rgba(178, 99, 252, 0.9) 70%, rgba(255, 214, 232, 0.88) 100%);
  box-shadow:
    0 20px 42px rgba(30, 21, 87, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.16);
}

.reading-section-icon.is-stairs .reading-section-icon-orb {
  background:
    radial-gradient(circle at 34% 28%, rgba(255, 255, 255, 0.46) 0%, rgba(255, 255, 255, 0.12) 16%, transparent 42%),
    radial-gradient(circle at 78% 72%, rgba(255, 225, 188, 0.36) 0%, rgba(255, 225, 188, 0.1) 22%, transparent 56%),
    linear-gradient(145deg, rgba(33, 53, 220, 0.98) 0%, rgba(89, 72, 244, 0.96) 42%, rgba(255, 205, 151, 0.88) 100%);
}

.reading-section-icon.is-ribbon .reading-section-icon-orb {
  background:
    radial-gradient(circle at 34% 28%, rgba(255, 255, 255, 0.46) 0%, rgba(255, 255, 255, 0.12) 16%, transparent 42%),
    radial-gradient(circle at 72% 78%, rgba(255, 213, 235, 0.34) 0%, rgba(255, 213, 235, 0.1) 26%, transparent 58%),
    linear-gradient(145deg, rgba(26, 44, 216, 0.98) 0%, rgba(84, 56, 232, 0.96) 42%, rgba(239, 211, 255, 0.9) 100%);
  border-radius: 38% 62% 58% 42% / 43% 36% 64% 57%;
}

.reading-section-icon-core {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 2.7rem;
  height: 2.7rem;
}

.reading-section-label {
  font-size: 0.68rem;
  line-height: 1.3;
  letter-spacing: 0.38em;
  text-transform: uppercase;
  color: rgba(223, 217, 235, 0.54);
}

.reading-section-title {
  margin-top: 0.48rem;
  font-size: 1.2rem;
  line-height: 1.22;
  font-weight: 560;
  letter-spacing: -0.01em;
  color: rgba(255, 255, 255, 0.88);
}

.reading-section-body {
  margin: 0.72rem auto 0;
  max-width: 21.3rem;
  font-size: 0.94rem;
  line-height: 1.78;
  text-align: center;
  color: rgba(255, 255, 255, 0.72);
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
  max-width: 15.8rem;
  min-height: calc(1.78em * 3.3);
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

.icon-heart,
.icon-stairs,
.icon-ribbon {
  position: relative;
}

.icon-heart {
  width: 2.08rem;
  height: 1.88rem;
  transform: rotate(-8deg);
}

.icon-heart span {
  position: absolute;
  display: block;
  width: 1.04rem;
  height: 1.62rem;
  border-radius: 999px 999px 0 0;
  background: linear-gradient(180deg, rgba(255, 239, 249, 0.98) 0%, rgba(255, 196, 232, 0.9) 100%);
  box-shadow: 0 0 14px rgba(255, 205, 233, 0.3);
}

.icon-heart span:first-child {
  left: 0.28rem;
  transform: rotate(-45deg);
  transform-origin: bottom left;
}

.icon-heart span:last-child {
  right: 0.28rem;
  transform: rotate(45deg);
  transform-origin: bottom right;
}

.icon-stairs {
  display: grid;
  grid-template-columns: repeat(4, 0.5rem);
  align-items: end;
  gap: 0.17rem;
  height: 2rem;
}

.icon-stairs span {
  display: block;
  width: 0.5rem;
  border-radius: 0.12rem;
  background: linear-gradient(180deg, rgba(255, 246, 253, 0.98) 0%, rgba(255, 214, 188, 0.88) 100%);
  box-shadow: 0 0 14px rgba(255, 220, 188, 0.22);
}

.icon-stairs span:nth-child(1) { height: 0.56rem; }
.icon-stairs span:nth-child(2) { height: 0.92rem; }
.icon-stairs span:nth-child(3) { height: 1.28rem; }
.icon-stairs span:nth-child(4) { height: 1.64rem; }

.icon-ribbon {
  width: 2.2rem;
  height: 2.08rem;
}

.icon-ribbon span {
  position: absolute;
  display: block;
  border-radius: 999px;
  border: 0.18rem solid rgba(255, 232, 247, 0.94);
  box-shadow: 0 0 14px rgba(255, 220, 245, 0.2);
}

.icon-ribbon span:nth-child(1) {
  inset: 0.15rem 0.22rem 0.85rem 0.22rem;
  transform: rotate(-14deg);
}

.icon-ribbon span:nth-child(2) {
  inset: 0.74rem 0.2rem 0.28rem 0.2rem;
  transform: rotate(16deg);
}

.icon-ribbon span:nth-child(3) {
  left: 0.93rem;
  top: 0.02rem;
  width: 0.28rem;
  height: 1.9rem;
  border: none;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255, 220, 245, 0.94) 0%, rgba(255, 191, 233, 0.88) 100%);
}

@media (min-width: 768px) {
  .gentle-guidance-card {
    padding: 34px 34px 32px;
    border-radius: 32px;
  }

  .gentle-guidance-copy {
    max-width: 18.5rem;
    margin-top: 20px;
    min-height: calc(1.82em * 3.2);
    font-size: 0.98rem;
    line-height: 1.82;
  }

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
</style>
