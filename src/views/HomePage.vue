<script setup>
import { computed } from 'vue'
import AnimeCard from '@/components/AnimeCard.vue'
import WatchList from '@/components/WatchList.vue'
import { useAnimeRoulette } from '@/composables/useAnimeRoulette'
const {
  anime,
  loading,
  error,
  spin,
  cooldownLeft,
  addToWatchlist,
  watchlist,
  isInWatchlist,
  removeFromWatchlist,
} = useAnimeRoulette()
const spinDisabled = computed(() => loading.value || cooldownLeft.value > 0)
const spinLabel = computed(() => {
  if (loading.value) return 'Spinning...'
  if (cooldownLeft.value > 0) return `Cooldown ${cooldownLeft.value}s`
  return 'SPIN 🎰'
})
</script>

<template>
  <main
    class="min-h-screen bg-[radial-gradient(circle_at_15%_20%,#334155,transparent_40%),radial-gradient(circle_at_85%_0%,#0f766e,transparent_28%),linear-gradient(160deg,#0d0618,#1a0a2e,#1f1135)] px-4 py-8 text-zinc-100 sm:px-6 lg:px-8"
  >
    <div class="mx-auto max-w-7xl">
      <!-- Header -->
      <header class="mb-8">
        <p class="text-xs font-semibold tracking-[0.3em] text-orange-300/90 uppercase">
          Project #4
        </p>
        <h1 class="mt-2 text-4xl font-black text-white sm:text-5xl">Anime Roulette Machine</h1>
        <p class="mt-2 max-w-3xl text-sm text-zinc-300 sm:text-base">
          Spin the reel, request a random anime from Jikan with VueUse useFetch, and learn how REST
          APIs signal rate limiting with HTTP 429.
        </p>
      </header>
      <!-- Content grid -->
      <div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <!-- Left column -->
        <section class="space-y-5">
          <div
            class="rounded-3xl border border-zinc-700/70 bg-zinc-900/60 p-5 shadow-2xl shadow-zinc-950/30 backdrop-blur-sm"
          >
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 class="text-xl font-bold text-white">Roulette</h2>
                <p class="text-sm text-zinc-300">
                  Pull the lever for your next random anime recommendation.
                </p>
              </div>
              <button
                type="button"
                :disabled="spinDisabled"
                class="cursor-pointer rounded-full border border-orange-300/70 bg-orange-400/20 px-6 py-3 text-base font-black tracking-wide text-orange-100 hover:bg-orange-400/30 disabled:cursor-not-allowed disabled:opacity-60"
                @click="spin"
              >
                {{ spinLabel }}
              </button>
            </div>
            <!-- Cooldown message -->
            <p
              v-if="cooldownLeft > 0"
              class="mt-4 rounded-xl border border-amber-300/50 bg-amber-400/10 px-3 py-2 text-sm font-semibold text-amber-100"
            >
              Rate-limited. Try again in {{ cooldownLeft }}s.
            </p>
          </div>
          <AnimeCard
            :loading="loading"
            :error="error"
            :anime="anime"
            :in-watchlist="Boolean(anime && isInWatchlist(anime.mal_id))"
            @add="addToWatchlist"
          />
        </section>
        <!-- Right column -->
        <WatchList
          :items="watchlist"
          @remove="removeFromWatchlist"
        />
      </div>
    </div>
  </main>
</template>
