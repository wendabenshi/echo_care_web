<template>
  <div class="starfield-bg pointer-events-none absolute inset-0 overflow-hidden bg-[#18161D]">
    <canvas ref="starCanvasRef" class="block h-full w-full" aria-hidden="true" />

    <!-- WooMoo blue-purple nebula clouds -->
    <canvas
      ref="cloudCanvasRef"
      class="absolute inset-0 h-full w-full opacity-40"
      aria-hidden="true"
    />

    <!-- edge vignette -->
    <div
      class="pointer-events-none absolute inset-0"
      aria-hidden="true"
      style="
        background:
          radial-gradient(ellipse 120% 90% at 50% 50%, transparent 42%, rgba(8, 7, 12, 0.55) 100%);
      "
    />

    <!-- bottom fade -->
    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 h-32"
      aria-hidden="true"
      style="background: linear-gradient(to bottom, transparent 0%, #18161D 100%);"
    />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

const starCanvasRef = ref(null);
const cloudCanvasRef = ref(null);
let starfield = null;
let nebula = null;
let startCancelled = false;
let nebulaStartId = 0;

async function startBackgroundEffects() {
  const [{ default: Starfield }, { default: NebulaClouds }] = await Promise.all([
    import("../assets/Starfield.js"),
    import("../assets/NebulaClouds.js"),
  ]);

  if (startCancelled) return;

  if (starCanvasRef.value) {
    starfield = new Starfield(starCanvasRef.value);
    starfield.start();
  }

  // Delay the heavier nebula pass so the first screen paints sooner.
  nebulaStartId = window.setTimeout(() => {
    if (startCancelled || !cloudCanvasRef.value) return;
    nebula = new NebulaClouds(cloudCanvasRef.value);
    nebula.start();
  }, 900);
}

onMounted(() => {
  startBackgroundEffects();
});

onBeforeUnmount(() => {
  startCancelled = true;
  window.clearTimeout(nebulaStartId);
  starfield?.destroy();
  nebula?.destroy();
});
</script>
