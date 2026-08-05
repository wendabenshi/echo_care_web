<template>
  <div
    class="companion-text flex w-full flex-col items-center text-center"
    :class="{ 'companion-text--visible': visible }"
  >
    <h1 class="companion-text__headline mb-2 font-serif text-[2.1rem] font-normal tracking-[0.01em] text-white sm:text-[2.35rem]">
      <span :key="headline" class="companion-text__headline-inner">{{ headline }}</span>
    </h1>

    <p class="companion-text__sub mb-0 max-w-[280px] font-serif text-[0.94rem] font-normal leading-[1.6] text-white/28">
      Start where you are.
    </p>

    <div class="companion-text__menu mt-[clamp(3rem,6vh,5.25rem)] w-full max-w-[305px]">
      <button
        v-for="item in menuItems"
        :key="item.title"
        type="button"
        class="companion-text__menu-item group block w-full text-left"
        @click="goTo(item.to, item.eventType)"
        @mouseenter="emitGather(true)"
        @mouseleave="emitGather(false)"
        @touchstart.passive="emitGather(true)"
        @touchend.passive="emitGather(false)"
        @touchcancel.passive="emitGather(false)"
      >
        <span class="companion-text__menu-line" aria-hidden="true">
          <span class="companion-text__menu-dot" />
        </span>
        <span class="companion-text__menu-copy min-w-0">
          <span class="block font-serif text-[0.93rem] font-normal tracking-[0.01em] text-white/84 transition-colors duration-300 group-hover:text-white/92">
            {{ item.title }}
          </span>
          <span class="mt-1 block font-serif text-[0.76rem] font-normal text-[#5F5B66] transition-colors duration-300 group-hover:text-[#76717D]">
            {{ item.subtitle }}
          </span>
        </span>
        <span
          class="companion-text__menu-arrow shrink-0 font-serif text-[1.1rem] text-white/62 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white/90"
          aria-hidden="true"
        >
          →
        </span>
      </button>
    </div>

    <div class="companion-text__footer mt-auto flex flex-col items-center gap-3 pt-8">
      <div class="companion-text__anchor-wrap" aria-hidden="true">
        <span class="companion-text__anchor-glow" />
        <span class="companion-text__anchor-ring">
          <span class="companion-text__anchor-core" />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { trackRingEvent } from "../utils/ringAnalytics.js";

defineProps({
  visible: { type: Boolean, default: true },
});

const emit = defineEmits(["gather"]);
const router = useRouter();

const headline = ref("I’m here.");
const menuItems = [
  {
    title: "Today’s Companion",
    subtitle: "A quiet presence for today",
    to: "/draw/daily-card",
    eventType: "daily_message_opened",
  },
  {
    title: "Ask a Question",
    subtitle: "Reflect on what’s on your mind",
    to: "/draw/love-energy",
    eventType: "question_opened",
  },
];
let textTimer = null;

function emitGather(active) {
  emit("gather", active);
}

function goTo(path, eventType) {
  trackRingEvent(eventType);
  router.push(path);
}

onMounted(() => {
  textTimer = window.setTimeout(() => {
    headline.value = "Take your time.";
  }, 8000);
});

onBeforeUnmount(() => {
  if (textTimer) clearTimeout(textTimer);
});
</script>

<style scoped>
.companion-text {
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 1.6s ease 0.55s,
    transform 1.6s ease 0.55s;
}

.companion-text--visible {
  opacity: 1;
  transform: translateY(0);
}

.companion-text__menu {
  position: relative;
  transform: translateX(18px);
}

.companion-text__menu-item {
  position: relative;
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) 28px;
  column-gap: 0.7rem;
  align-items: center;
  min-height: 68px;
  padding: 0.25rem 0;
  transition: border-color 300ms ease, transform 300ms ease;
}

.companion-text__menu-item + .companion-text__menu-item {
  border-top: none;
}

.companion-text__menu-item:last-child {
  border-bottom: none;
}

.companion-text__menu-item + .companion-text__menu-item::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.018) 18%,
    rgba(255, 255, 255, 0.035) 50%,
    rgba(255, 255, 255, 0.018) 82%,
    rgba(255, 255, 255, 0) 100%
  );
}

.companion-text__menu-item:last-child::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.018) 18%,
    rgba(255, 255, 255, 0.035) 50%,
    rgba(255, 255, 255, 0.018) 82%,
    rgba(255, 255, 255, 0) 100%
  );
}

.companion-text__menu-item:hover {
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
}

.companion-text__menu-line {
  position: relative;
  width: 28px;
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.05));
}

.companion-text__menu-dot {
  position: absolute;
  left: 1px;
  top: 50%;
  width: 3px;
  height: 3px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.42);
  transform: translateY(-50%);
}

.companion-text__menu-copy {
  justify-self: center;
  width: min(100%, 174px);
  text-align: left;
}

.companion-text__menu-arrow {
  justify-self: center;
  margin-left: 0;
  width: 28px;
  text-align: center;
}

@media (max-width: 430px) {
  .companion-text__menu-copy {
    width: min(100%, 158px);
  }
}

.companion-text__footer {
  min-height: 58px;
  padding-bottom: calc(env(safe-area-inset-bottom) + 0.75rem);
}

.companion-text__anchor-wrap {
  position: relative;
  width: 22px;
  height: 22px;
}

.companion-text__anchor-glow {
  position: absolute;
  inset: -14px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(168, 146, 255, 0.18) 0%, rgba(168, 146, 255, 0.06) 38%, transparent 72%);
  filter: blur(10px);
  animation: anchorGlow 6s ease-in-out infinite;
}

.companion-text__anchor-ring {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  box-shadow:
    0 0 12px rgba(255, 255, 255, 0.08),
    inset 0 0 8px rgba(255, 255, 255, 0.04);
  animation: anchorRing 6s ease-in-out infinite;
}

.companion-text__anchor-core {
  width: 3px;
  height: 3px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
}

@media (max-width: 430px) {
  .companion-text__menu {
    max-width: 292px;
    transform: translateX(14px);
  }

  .companion-text__headline {
    font-size: 1.92rem;
  }
}

.companion-text__headline-inner {
  display: inline-block;
  animation: headlineSwap 1.2s ease;
}

@keyframes headlineSwap {
  0% {
    opacity: 0;
    transform: translateY(4px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes anchorGlow {
  0%,
  100% {
    opacity: 0.45;
    transform: scale(0.96);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.08);
  }
}

@keyframes anchorRing {
  0%,
  100% {
    opacity: 0.55;
    transform: scale(1);
  }
  50% {
    opacity: 0.95;
    transform: scale(1.06);
  }
}

@media (prefers-reduced-motion: reduce) {
  .companion-text,
  .companion-text__menu-item,
  .companion-text__menu-arrow,
  .companion-text__anchor-glow,
  .companion-text__anchor-ring {
    transition: none !important;
    animation: none !important;
  }
}
</style>
