<template>
  <div
    class="relative h-full w-full overflow-hidden rounded-xl bg-transparent ring-1 ring-white/12"
    style="box-shadow: 14px 24px 38px rgba(8, 6, 20, 0.46), 6px 10px 18px rgba(0, 0, 0, 0.32), 0 2px 0 rgba(255, 255, 255, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.12), inset -14px -16px 24px rgba(14, 10, 32, 0.24), inset 8px 10px 14px rgba(255, 255, 255, 0.04);"
  >
    <img
      :src="cardImageSrc"
      alt=""
      class="pointer-events-none absolute inset-0 h-full w-full rounded-xl object-cover"
      loading="eager"
      fetchpriority="high"
      decoding="sync"
      draggable="false"
    />
  </div>
</template>

<script setup>
import { ECHO_CARD_BACK_IMAGE } from "../../data/tarotVisuals.js";

const cardImageSrc = ECHO_CARD_BACK_IMAGE;
</script>
