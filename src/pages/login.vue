<template>
  <div class="invalid-page">
    <div class="invalid-card">
      <p class="invalid-eyebrow">Access Needed</p>
      <h1>Ring access could not be verified</h1>
      <p>
        Please tap your NFC ring again, or use a valid invite link. If this keeps happening,
        the ring may not be registered yet.
      </p>
    </div>
  </div>
</template>

<style scoped>
.invalid-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at top, rgba(124, 116, 231, 0.15), transparent 28%),
    #18161d;
  color: white;
}

.invalid-card {
  width: min(100%, 420px);
  border-radius: 28px;
  padding: 28px 24px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
}

.invalid-eyebrow {
  margin: 0 0 10px;
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(184, 164, 255, 0.85);
}

.invalid-card h1 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.8rem;
  font-weight: 400;
}

.invalid-card p:last-child {
  margin: 14px 0 0;
  color: rgba(255, 255, 255, 0.66);
  line-height: 1.7;
}
</style>
