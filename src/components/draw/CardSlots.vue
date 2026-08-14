<template>
  <div
    v-if="visible"
    class="slots-row flex items-start justify-center gap-4 sm:gap-6"
    style="transform: translateY(-8px);"
  >
    <div
      v-for="slot in slotCount"
      :key="slot"
      class="slot-item flex flex-col items-center gap-1.5"
    >
      <div
        class="slot-card relative self-start overflow-hidden rounded-lg"
        style="width: 70px; height: 112px; perspective: 1200px;"
      >
        <div
          v-if="isFilled(slot - 1)"
          class="slot-flip h-full w-full"
          :class="{ 'slot-flip--revealed': flipped[slot - 1] }"
        >
          <div class="slot-face slot-face--back absolute inset-0">
            <TarotCardBack />
          </div>
          <div class="slot-face slot-face--front absolute inset-0">
            <TarotCardFace :label="cardLabel(slot - 1)" :src="cardImageSrc(slot - 1)" />
          </div>
        </div>

        <div
          v-else
          class="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/[0.03]"
        >
          <span class="text-lg font-light text-white/15">{{ slot }}</span>
        </div>
      </div>

      <span
        class="max-w-[84px] text-center text-[9px] leading-tight tracking-wide text-white/30"
        style="min-height: 22px;"
      >
        {{ positionLabel(slot - 1) }}
      </span>

    </div>
  </div>
</template>

<script setup>
import TarotCardBack from "./TarotCardBack.vue";
import TarotCardFace from "./TarotCardFace.vue";

const props = defineProps({
  visible: { type: Boolean, default: false },
  draw: { type: Object, default: null },
  slotCount: { type: Number, default: 3 },
  pickedCount: { type: Number, default: 0 },
  flipped: { type: Array, default: () => [false, false, false] },
});

const positionLabels = [
  "The Situation",
  "What’s Shaping It",
  "What To Consider",
];

function isFilled(index) {
  return props.pickedCount > index;
}

function positionLabel(index) {
  return positionLabels[index] ?? "";
}

function cardLabel(index) {
  return props.draw?.cards?.[index]?.card_name ?? "";
}

function cardImageSrc(index) {
  return props.draw?.cards?.[index]?.image_src ?? "";
}

</script>

<style scoped>
.slots-row {
  animation: slotsRowAppear 260ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.slot-item {
  animation: none;
}

.slot-flip {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.slot-flip--revealed {
  transform: rotateY(180deg);
}

.slot-face {
  backface-visibility: hidden;
  border-radius: 8px;
  overflow: hidden;
}

.slot-face--front {
  transform: rotateY(180deg);
}

@keyframes slotsRowAppear {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .slots-row {
    animation: none !important;
  }

  .slot-item {
    animation: none !important;
  }

  .slot-flip {
    transition: none !important;
  }
}
</style>
