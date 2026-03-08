<script setup>
const props = defineProps({
  anime: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  inWatchlist: { type: Boolean, default: false },
})
const emit = defineEmits(['add'])
</script>

<template>
  <section class="rounded-3xl border border-slate-700/70 bg-slate-900/60 p-5 shadow-2xl ...">
    <!-- Loading -->
    <div
      v-if="props.loading"
      class="space-y-4"
    >
      <div class="flex items-center gap-3 text-cyan-300">
        <div
          class="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"
        ></div>
        <p>Shuffling anime reels...</p>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div class="h-3 animate-pulse rounded bg-slate-700"></div>
        <div class="h-3 animate-pulse rounded bg-slate-700"></div>
        <div class="h-3 animate-pulse rounded bg-slate-700"></div>
      </div>
      <div class="h-72 animate-pulse rounded-2xl bg-slate-800"></div>
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="rounded-2xl border border-red-300/50 bg-red-500/10 p-4 text-red-100"
    >
      <h3>Spin failed</h3>
      <p>{{ error }}</p>
    </div>

    <!-- Anime data (raw JSON for now, replaced in Part 7) -->
    <div v-else-if="anime">
      <pre class="max-h-64 overflow-auto text-xs text-slate-400">{{
        JSON.stringify(anime, null, 2)
      }}</pre>
    </div>

    <!-- Empty / default -->
    <div
      v-else
      class="rounded-2xl border border-slate-700/60 bg-slate-800/50 p-6 text-center text-slate-300"
    >
      Pull the lever to request your first random anime.
    </div>
  </section>
</template>
