<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  anime: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  inWatchlist: { type: Boolean, default: false },
})
const emit = defineEmits(['add'])

const synopsisExpanded = ref(false)

const animeImage = computed(
  () =>
    props.anime?.images?.jpg?.large_image_url ||
    props.anime?.images?.jpg?.image_url ||
    props.anime?.images?.webp?.large_image_url ||
    props.anime?.images?.webp?.image_url ||
    '',
)

const synopsis = computed(() => props.anime?.synopsis || 'No synopsis available yet.')
const needsTruncation = computed(() => synopsis.value.length > 240)
const visibleSynopsis = computed(() =>
  synopsisExpanded.value || !needsTruncation.value
    ? synopsis.value
    : `${synopsis.value.slice(0, 240)}...`,
)

// Reset synopsis when a new anime loads
watch(
  () => props.anime?.mal_id,
  () => {
    synopsisExpanded.value = false
  },
)
</script>

<template>
  <section class="rounded-3xl border border-zinc-700/70 bg-zinc-900/60 p-5 shadow-2xl ...">
    <!-- Loading -->
    <div
      v-if="props.loading"
      class="space-y-4"
    >
      <div class="flex items-center gap-3 text-orange-300">
        <div
          class="h-5 w-5 animate-spin rounded-full border-2 border-orange-400 border-t-transparent"
        ></div>
        <p>Shuffling anime reels...</p>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div class="h-3 animate-pulse rounded bg-zinc-700"></div>
        <div class="h-3 animate-pulse rounded bg-zinc-700"></div>
        <div class="h-3 animate-pulse rounded bg-zinc-700"></div>
      </div>
      <div class="h-72 animate-pulse rounded-2xl bg-zinc-800"></div>
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="rounded-2xl border border-red-300/50 bg-red-500/10 p-4 text-red-100"
    >
      <h3>Spin failed</h3>
      <p>{{ error }}</p>
    </div>

    <!-- Anime data -->
    <div
      v-else-if="anime"
      class="space-y-4"
    >
      <!-- Poster -->
      <div class="overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-800/60">
        <img
          v-if="animeImage"
          :src="animeImage"
          :alt="anime.title"
          class="h-80 w-full bg-zinc-900/50 object-contain"
          loading="lazy"
        />
        <div
          v-else
          class="flex h-80 items-center justify-center bg-zinc-800 text-zinc-300"
        >
          No poster
        </div>
      </div>

      <!-- Title & meta -->
      <div>
        <h2 class="text-2xl font-black text-white">{{ anime.title }}</h2>
        <p class="mt-1 text-sm text-zinc-300">
          Score: <span class="font-semibold text-amber-300">{{ anime.score ?? 'N/A' }}</span> ·
          Episodes:
          <span class="font-semibold text-orange-300">{{ anime.episodes ?? 'Unknown' }}</span> ·
          Rating: <span class="font-semibold text-pink-300">{{ anime.rating || 'Unknown' }}</span>
        </p>
      </div>

      <!-- Synopsis -->
      <p class="text-sm leading-relaxed text-zinc-200">
        {{ visibleSynopsis }}
        <button
          v-if="needsTruncation"
          type="button"
          class="ml-2 text-orange-300 underline-offset-4 hover:underline"
          @click="synopsisExpanded = !synopsisExpanded"
        >
          {{ synopsisExpanded ? 'Show less' : 'Read more' }}
        </button>
      </p>

      <!-- Action buttons -->
      <div class="flex flex-wrap gap-3">
        <button
          type="button"
          :disabled="inWatchlist"
          @click="emit('add', anime)"
          class="rounded-full border border-orange-300/60 bg-orange-400/15 px-4 py-2 text-sm font-semibold text-orange-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ inWatchlist ? 'In Watchlist' : 'Add to Watchlist' }}
        </button>
        <a
          :href="anime.url"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-white/40"
        >
          Open on MAL
        </a>
      </div>
    </div>

    <!-- Empty / default -->
    <div
      v-else
      class="rounded-2xl border border-zinc-700/60 bg-zinc-800/50 p-6 text-center text-zinc-300"
    >
      Pull the lever to request your first random anime.
    </div>
  </section>
</template>
