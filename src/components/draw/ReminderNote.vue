<template>
  <section class="reminder-note">
    <p class="reminder-note-label font-woomoo-ui">
      <span class="reminder-note-star" aria-hidden="true">✦</span>
      A Gentle Reminder
      <span class="reminder-note-star" aria-hidden="true">✦</span>
    </p>
    <p class="reminder-note-copy font-woomoo-body">{{ text }}</p>
  </section>
</template>

<script setup>
defineProps({
  text: { type: String, default: "" },
});
</script>

<style scoped>
.reminder-note {
  position: relative;
  width: calc(100% - 36px);
  max-width: 340px;
  margin: 38px auto 0;
  padding: 20px 22px 22px;
  overflow: hidden;
  isolation: isolate;
  text-align: center;
  border-radius: 24px;
  background:
    radial-gradient(
      ellipse at 78% 26%,
      rgba(112, 88, 168, 0.24) 0%,
      rgba(112, 88, 168, 0.1) 32%,
      transparent 62%
    ),
    radial-gradient(
      ellipse at 18% 78%,
      rgba(87, 69, 118, 0.16) 0%,
      transparent 58%
    ),
    linear-gradient(135deg, rgba(35, 31, 45, 0.98), rgba(27, 26, 37, 0.98));
  border: 1px solid rgba(200, 185, 226, 0.13);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.045),
    0 18px 44px rgba(0, 0, 0, 0.15);
}

.reminder-note::before {
  content: "";
  display: block;
  width: 38px;
  height: 1px;
  margin: 0 auto 18px;
  background: rgba(225, 216, 238, 0.18);
}

.reminder-note::after {
  content: "";
  position: absolute;
  inset: -25%;
  z-index: 0;
  pointer-events: none;
  background:
    linear-gradient(
      115deg,
      transparent 28%,
      rgba(118, 93, 168, 0) 36%,
      rgba(118, 93, 168, 0.15) 46%,
      rgba(145, 122, 185, 0.18) 51%,
      rgba(85, 103, 150, 0.11) 58%,
      transparent 70%
    ),
    radial-gradient(
      circle at 72% 40%,
      rgba(133, 104, 190, 0.12),
      transparent 38%
    );
  filter: blur(38px);
  opacity: 0.9;
  transform: translate3d(-8%, 2%, 0) rotate(-3deg);
  animation: reminder-light-drift 16s ease-in-out infinite alternate;
}

@keyframes reminder-light-drift {
  from {
    transform: translate3d(-8%, 2%, 0) rotate(-3deg) scale(1);
  }

  to {
    transform: translate3d(8%, -3%, 0) rotate(-1deg) scale(1.02);
  }
}

@media (prefers-reduced-motion: reduce) {
  .reminder-note::after {
    animation: none;
  }
}

.reminder-note > * {
  position: relative;
  z-index: 1;
}

.reminder-note-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin: 0 0 12px;
  font-size: 9px;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(226, 220, 236, 0.48);
}

.reminder-note-star {
  font-size: 7px;
  opacity: 0.55;
}

.reminder-note-copy {
  max-width: 292px;
  margin: 0 auto;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.65;
  letter-spacing: -0.005em;
  color: rgba(242, 239, 246, 0.76);
  text-wrap: pretty;
}
</style>
