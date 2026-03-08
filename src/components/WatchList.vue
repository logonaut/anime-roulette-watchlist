<script setup>
defineProps({ items: { type: Array, default: () => [] } })
const emit = defineEmits(['remove'])
</script>

<template>
  <aside class="rounded-3xl border border-slate-700/70 bg-slate-900/60 p-5 ...">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xl font-bold text-white">Watchlist</h2>
      <span class="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-200">
        {{ items.length }}
      </span>
    </div>

    <p
      v-if="!items.length"
      class="..."
    >
      No picks saved yet...
    </p>

    <ul
      v-else
      class="space-y-3"
    >
      <li
        v-for="item in items"
        :key="item.mal_id"
        class="rounded-2xl border border-slate-700/70 bg-slate-800/60 p-3"
      >
        <div class="flex gap-3">
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.title"
            class="h-20 w-14 rounded-md object-cover"
            loading="lazy"
          />
          <div class="min-w-0 flex-1">
            <h3 class="truncate text-sm font-semibold text-white">{{ item.title }}</h3>
            <p class="mt-1 text-xs text-slate-300">
              ⭐ {{ item.score ?? 'N/A' }} · Ep {{ item.episodes ?? '?' }}
            </p>
            <div class="mt-3 flex gap-2">
              <a
                :href="item.url"
                target="_blank"
                class="text-xs font-semibold text-cyan-300 hover:underline"
                >MAL Link</a
              >
              <!-- emit mal_id NUMBER, not the whole item -->
              <button
                type="button"
                class="text-xs font-semibold text-rose-300 hover:underline"
                @click="emit('remove', item.mal_id)"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </aside>
</template>
