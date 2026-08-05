<template>
  <div class="w-full flex-1 flex flex-col justify-end">
    <p class="text-center text-[10px] md:text-xs text-white/30 mb-3">
      {{ hintText }}
    </p>

    <div
      ref="containerRef"
      class="relative w-full overflow-visible select-none touch-none"
      :class="active ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'"
      :style="{ height: `${containerHeight}px` }"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <div
        class="absolute left-1/2"
        :style="{ top: `${pivotY}px`, width: 0, height: 0 }"
      >
        <div
          v-for="card in renderCards"
          :key="card.key"
          data-fan-card
          :data-deck-index="card.deckIndex"
          class="absolute rounded-xl overflow-hidden"
          :style="cardStyle(card.angle, card.deckIndex)"
          @pointerdown="onCardPointerDown(card.deckIndex, $event)"
        >
          <div class="h-full w-full">
            <TarotCardBack />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import TarotCardBack from "./TarotCardBack.vue";

const props = defineProps({
  active: { type: Boolean, default: false },
  pickingEnabled: { type: Boolean, default: false },
  pickedIndices: { type: Array, default: () => [] },
  picksRemaining: { type: Number, default: 3 },
  cardCount: { type: Number, default: 52 },
  showHint: { type: Boolean, default: true },
  pickedAsGap: { type: Boolean, default: false },
});

const emit = defineEmits(["pick"]);

const CARD_W = 130;
const CARD_H = 208;
const HORIZONTAL_RADIUS = 700;
const VERTICAL_RADIUS = 600;
const TAU = Math.PI * 2;
const CONTAINER_HEIGHT = 496;
const DRAG_THRESHOLD = 8;
/** Extra deck copies for seamless wrap while rotating */
const DECK_LAPS = 3;
const VISIBLE_ARC = Math.PI * 0.52;

const containerRef = ref(null);
const rotation = ref(0);
const targetRotation = ref(0);
const isDragging = ref(false);
const containerHeight = ref(CONTAINER_HEIGHT);
const pivotY = ref(VERTICAL_RADIUS + CARD_H + 16);

const renderCards = computed(() => {
  const total = props.cardCount;
  const items = [];
  for (let lap = 0; lap < DECK_LAPS; lap += 1) {
    for (let index = 0; index < total; index += 1) {
      const slot = lap * total + index;
      const angle = (slot / total) * TAU + rotation.value;
      items.push({
        key: `${lap}-${index}`,
        deckIndex: index,
        angle,
      });
    }
  }
  return items;
});

const hintText = computed(() => {
  if (!props.showHint) return "";
  if (!props.active) return "Ask your question to begin";
  if (!props.pickingEnabled) return "Preparing the deck…";
  if (props.picksRemaining <= 0) return "Your cards are chosen";
  return `Swipe to explore · tap ${props.picksRemaining} card${props.picksRemaining > 1 ? "s" : ""}`;
});

let dragging = false;
let dragMoved = false;
let startX = 0;
let startRotation = 0;
let activePointerId = null;
let pressedCardIndex = null;
let ro = null;
let rafId = null;
let lastMoveX = 0;
let lastMoveTime = 0;
let inertialVelocity = 0;
let inertiaActive = false;

function distanceFromCenter(angle) {
  const wrapped = ((angle % TAU) + TAU) % TAU;
  return Math.min(wrapped, TAU - wrapped);
}

function updateLayout() {
  const h = containerRef.value?.clientHeight ?? CONTAINER_HEIGHT;
  containerHeight.value = h;
  pivotY.value = VERTICAL_RADIUS + CARD_H + 16;
}

function ensureAnimationLoop() {
  if (rafId !== null) return;

  const tick = () => {
    const delta = targetRotation.value - rotation.value;
    rotation.value += delta * (dragging ? 0.24 : 0.16);

    if (!dragging && inertiaActive) {
      targetRotation.value += inertialVelocity;
      inertialVelocity *= 0.92;
      if (Math.abs(inertialVelocity) < 0.00015) {
        inertiaActive = false;
      }
    }

    const needsNextFrame =
      dragging || inertiaActive || Math.abs(targetRotation.value - rotation.value) > 0.0002;

    if (needsNextFrame) {
      rafId = window.requestAnimationFrame(tick);
    } else {
      rotation.value = targetRotation.value;
      rafId = null;
    }
  };

  rafId = window.requestAnimationFrame(tick);
}

function triggerHapticPulse() {
  try {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(12);
    }
  } catch {
    // Ignore unsupported vibration APIs.
  }
}

function cardStyle(angle, deckIndex) {
  const x = Math.sin(angle) * HORIZONTAL_RADIUS - CARD_W / 2;
  const y = -Math.cos(angle) * VERTICAL_RADIUS - CARD_H;
  const deg = (angle * 180) / Math.PI;
  const centerDist = distanceFromCenter(angle) / VISIBLE_ARC;
  const picked = props.pickedIndices.includes(deckIndex);
  const pickedAsGap = picked && props.pickedAsGap;
  const baseFade = props.active ? Math.max(0.1, 1 - centerDist * 0.86) : 0;
  const fade = pickedAsGap ? 0 : picked ? Math.max(baseFade * 0.72, 0.42) : baseFade;
  const z = Math.round(100 - centerDist * 80);
  const liftY = pickedAsGap ? -6 : picked ? -18 : 0;
  const scale = pickedAsGap ? 0.92 : 1;

  return {
    width: `${CARD_W}px`,
    height: `${CARD_H}px`,
    left: `${x}px`,
    top: `${y}px`,
    transform: `translateY(${liftY}px) rotate(${deg}deg) scale(${scale})`,
    transformOrigin: "center bottom",
    opacity: fade,
    zIndex: z,
    transition: isDragging.value
      ? "opacity 0.28s ease"
      : "opacity 0.28s ease, transform 0.28s ease",
    pointerEvents: props.active && !picked && fade > 0.08 ? "auto" : "none",
  };
}

function onCardPointerDown(index, event) {
  if (!props.active || props.pickedIndices.includes(index)) return;
  pressedCardIndex = index;
}

function onPointerDown(event) {
  if (!props.active) return;

  const onCard = event.target.closest?.("[data-fan-card]");
  if (!onCard) {
    pressedCardIndex = null;
  } else {
    const deckIndex = Number(onCard.dataset.deckIndex);
    pressedCardIndex = Number.isFinite(deckIndex) ? deckIndex : null;
  }

  dragging = true;
  dragMoved = false;
  isDragging.value = false;
  inertiaActive = false;
  inertialVelocity = 0;
  activePointerId = event.pointerId;
  startX = event.clientX;
  startRotation = targetRotation.value;
  lastMoveX = event.clientX;
  lastMoveTime = performance.now();
  containerRef.value?.setPointerCapture?.(event.pointerId);
  ensureAnimationLoop();
}

function onPointerMove(event) {
  if (!dragging || event.pointerId !== activePointerId) return;

  const delta = event.clientX - startX;
  const now = performance.now();
  if (!dragMoved && Math.abs(delta) >= DRAG_THRESHOLD) {
    dragMoved = true;
    isDragging.value = true;
  }

  if (dragMoved) {
    targetRotation.value = startRotation + delta * 0.0045;
    const dt = Math.max(1, now - lastMoveTime);
    inertialVelocity = ((event.clientX - lastMoveX) / dt) * 0.0045;
    lastMoveX = event.clientX;
    lastMoveTime = now;
    ensureAnimationLoop();
  }
}

function onPointerUp(event) {
  if (event.pointerId !== activePointerId) return;

  if (
    props.pickingEnabled &&
    !dragMoved &&
    pressedCardIndex !== null &&
    !props.pickedIndices.includes(pressedCardIndex)
  ) {
    triggerHapticPulse();
    emit("pick", pressedCardIndex);
  }

  dragging = false;
  isDragging.value = false;
  if (dragMoved) {
    inertiaActive = true;
    ensureAnimationLoop();
  }
  activePointerId = null;
  pressedCardIndex = null;
}

onMounted(() => {
  updateLayout();
  ro = new ResizeObserver(updateLayout);
  if (containerRef.value) ro.observe(containerRef.value);
});

onBeforeUnmount(() => {
  dragging = false;
  if (rafId !== null) {
    window.cancelAnimationFrame(rafId);
    rafId = null;
  }
  ro?.disconnect();
});
</script>
