<template>
  <div class="relative mx-auto grid w-full max-w-2xl overflow-hidden rounded-full" style="grid-template-columns: 1fr;">
    <!-- input row -->
    <div
      class="draw-swap-fast grid grid-cols-[1fr_auto] items-center rounded-full border border-white/20 bg-white/[0.06] pr-1.5 has-[input:focus]:ring-2 has-[input:focus]:ring-white/15"
      :style="inputLayerStyle"
      :aria-hidden="submitted"
    >
      <input
        v-model="localQuestion"
        type="text"
        class="h-12 w-full bg-transparent pl-5 text-xs text-white placeholder:text-white/30 focus:outline-none md:text-sm"
        :placeholder="placeholder"
        @keydown.enter="submit"
      />
      <button
        type="button"
        class="shrink-0 flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-[#18161D] transition-all hover:bg-white disabled:bg-white/20 disabled:text-white/40 disabled:cursor-not-allowed disabled:hover:bg-white/20"
        :disabled="!localQuestion.trim()"
        @click="submit"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
        Send
      </button>
    </div>

    <!-- quoted question -->
    <div
      class="draw-swap-slow flex h-12 items-center justify-center px-4"
      :style="quoteLayerStyle"
      :aria-hidden="!submitted"
    >
      <p class="font-serif text-base italic text-white/85 md:text-lg">
        “{{ submittedQuestion }}”
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "" },
  submitted: { type: Boolean, default: false },
  submittedQuestion: { type: String, default: "" },
  showSubmittedQuestion: { type: Boolean, default: true },
  placeholder: { type: String, default: "When will real love show up?" },
});

const emit = defineEmits(["update:modelValue", "submit"]);

const localQuestion = ref(props.modelValue);
const hasSubmittedQuestion = computed(
  () => props.showSubmittedQuestion && Boolean(props.submittedQuestion?.trim()),
);

watch(
  () => props.modelValue,
  (value) => {
    localQuestion.value = value;
  },
);

watch(localQuestion, (value) => {
  emit("update:modelValue", value);
});

const inputLayerStyle = computed(() => ({
  gridArea: "1 / 1",
  backdropFilter: "blur(24px)",
  boxShadow:
    "0 0 30px rgba(255,255,255,0.2), 0 0 70px rgba(255,255,255,0.12), 0 0 120px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.15)",
  opacity: props.submitted && hasSubmittedQuestion.value ? 0 : 1,
  transform: props.submitted && hasSubmittedQuestion.value ? "scale(0.98)" : "scale(1)",
  pointerEvents: props.submitted && hasSubmittedQuestion.value ? "none" : "auto",
}));

const quoteLayerStyle = computed(() => ({
  gridArea: "1 / 1",
  opacity: props.submitted && hasSubmittedQuestion.value ? 1 : 0,
  transform:
    props.submitted && hasSubmittedQuestion.value
      ? "translateY(0) scale(1)"
      : "translateY(8px) scale(0.98)",
  pointerEvents: "none",
}));

function submit() {
  const text = localQuestion.value.trim();
  if (!text) return;
  emit("submit", text);
}
</script>

<style scoped>
.draw-swap-fast {
  transition:
    opacity 220ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.draw-swap-slow {
  transition:
    opacity 320ms cubic-bezier(0.22, 1, 0.36, 1) 100ms,
    transform 320ms cubic-bezier(0.22, 1, 0.36, 1) 100ms;
}

@media (prefers-reduced-motion: reduce) {
  .draw-swap-fast,
  .draw-swap-slow {
    transition: none !important;
  }
}
</style>
