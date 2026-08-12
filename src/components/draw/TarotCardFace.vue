<template>
  <div class="relative h-full w-full overflow-hidden rounded-lg bg-[#eceae6]">
    <!-- <img
      v-if="!imageFailed"
      :src="imageUrl"
      :alt="label"
      class="absolute inset-0 h-full w-full object-contain"
      loading="lazy"
      @error="imageFailed = true"
    /> -->
	<img
	  v-if="!imageFailed"
	  :src="imageUrl"
	  :alt="label"
	  class="absolute inset-0 h-full w-full"
	  loading="lazy"
	  @error="imageFailed = true"
	/>
    <div
      v-else
      class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#5b4ab8] via-[#4a3aa0] to-[#372e78] p-2 text-center text-[10px] leading-tight text-white/85"
    >
      {{ label }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { cardImageUrl } from "../../data/tarotCards.js";

const props = defineProps({
  label: { type: String, required: true },
  src: { type: String, default: "" },
});

const imageFailed = ref(false);
const imageUrl = computed(() => props.src || cardImageUrl(props.label));
</script>
