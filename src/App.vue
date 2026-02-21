<script setup>
import comic from './data/comic.js'
import { computed } from 'vue'

const sortedPages = computed(() =>
  [...comic]
    .filter((p) => p.url)
    .sort((a, b) => a.order - b.order)
)
</script>

<template>
  <main>
    <img
      v-for="page in sortedPages"
      :key="page.order"
      :src="page.url"
      loading="lazy"
      alt=""
    />
  </main>
</template>

<style scoped>
img {
  display: block;
  width: 100%;
  max-height: 100svh;
  object-fit: contain;
}
</style>
