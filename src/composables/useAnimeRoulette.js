import { useFetch, useCountdown, useLocalStorage } from '@vueuse/core'
import { ref } from 'vue'

const WATCHLIST_KEY = 'anime-roulette-watchlist'
const URL = 'https://api.jikan.moe/v4/random/anime'
const MAX_SAFE_SPIN_ATTEMPTS = 5
const RETRY_SECONDS = 10

const isAllowedRating = (rating) => {
  if (!rating) return false
  return !rating.trim().startsWith('R')
}

export function useAnimeRoulette() {
  const anime = ref(null)
  const loading = ref(false)
  const error = ref('')

  // interval is MILLISECONDS — must be 1000, NOT 'second'
  const { remaining: cooldownLeft, start: startCooldown } = useCountdown(0, {
    interval: 1000,
  })

  const watchlist = useLocalStorage(WATCHLIST_KEY, [])

  const spin = async () => {
    if (loading.value || cooldownLeft.value > 0) return

    loading.value = true
    error.value = ''

    try {
      for (let attempt = 0; attempt < MAX_SAFE_SPIN_ATTEMPTS; attempt++) {
        const request = useFetch(URL, { immediate: false }).get().json()
        await request.execute()

        const response = request.response.value

        if (!response) {
          error.value = 'Network error. Check your internet and try again.'
          return
        }
        if (response.status === 429) {
          startCooldown(RETRY_SECONDS)
          error.value = `Rate-limited (429). Please wait ${RETRY_SECONDS}s.`
          return
        }
        if (!response.ok) {
          error.value = `Error from Jikan. Status: ${response.status}.`
          return
        }
        if (request.error.value) {
          error.value = 'Network error. Check your internet and try again.'
          return
        }

        const candidateAnime = request.data.value?.data || null
        if (!candidateAnime) {
          error.value = 'Jikan returned an empty payload. Try spinning again.'
          return
        }
        if (!isAllowedRating(candidateAnime.rating)) continue

        anime.value = candidateAnime
        return
      }
    } catch {
      error.value = 'Could not find an anime. Please spin again.'
    } finally {
      loading.value = false
    }
  }

  const addToWatchlist = (animeToAdd) => {
    if (!animeToAdd?.mal_id) return
    if (watchlist.value.some((i) => i.mal_id === animeToAdd.mal_id)) return
    watchlist.value.unshift({
      mal_id: animeToAdd.mal_id,
      title: animeToAdd.title,
      score: animeToAdd.score,
      episodes: animeToAdd.episodes,
      rating: animeToAdd.rating,
      url: animeToAdd.url,
      image:
        animeToAdd.images?.jpg?.large_image_url ||
        animeToAdd.images?.jpg?.image_url ||
        animeToAdd.images?.webp?.large_image_url ||
        animeToAdd.images?.webp?.image_url ||
        '',
    })
  }

  // Takes mal_id NUMBER — not the whole object
  const removeFromWatchlist = (malId) => {
    watchlist.value = watchlist.value.filter((i) => i.mal_id !== malId)
  }

  // Takes mal_id NUMBER — not the whole object
  const isInWatchlist = (malId) => watchlist.value.some((i) => i.mal_id === malId)

  return {
    anime,
    loading,
    error,
    spin,
    cooldownLeft,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  }
}
