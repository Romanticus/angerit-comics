<script setup>
import { computed, reactive } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import ReaderFooter from '../components/ReaderFooter.vue'
import ReaderHeader from '../components/ReaderHeader.vue'
import comic from '../data/comic.js'
import { comicParts } from '../data/comicParts.js'

const route = useRoute()
const pageLoaded = reactive({})

const part = computed(() => comicParts.find((item) => item.id === Number(route.params.id)))
const pages = computed(() => {
  if (!part.value) return []
  return comic.filter((page) => page.order >= part.value.startPage && page.order <= part.value.endPage)
})

function markPageLoaded(order) {
  pageLoaded[order] = true
}

function bindImg(element, order) {
  if (element?.complete && element.naturalWidth) markPageLoaded(order)
}
</script>

<template>
  <main v-if="part" class="reader-page">
    <ReaderHeader :part-title="part.title" />

    <section class="comic-stack" :aria-label="`${part.title}, страницы комикса`">
      <figure v-for="(page, index) in pages" :key="page.order" class="comic-page">
        <div v-show="!pageLoaded[page.order]" class="comic-page__skeleton" aria-hidden="true"></div>
        <img
          :ref="(element) => bindImg(element, page.order)"
          :src="page.url"
          :alt="`Страница ${page.order}`"
          :loading="index === 0 ? 'eager' : 'lazy'"
          :fetchpriority="index === 0 ? 'high' : 'auto'"
          decoding="async"
          @load="markPageLoaded(page.order)"
          @error="markPageLoaded(page.order)"
        />
        <figcaption>Страница {{ page.order }}</figcaption>
      </figure>
    </section>

    <ReaderFooter :current-id="part.id" :parts="comicParts" />
  </main>

  <main v-else class="reader-page reader-page--missing">
    <section class="reader-state" aria-labelledby="missing-title">
      <p class="reader-kicker">No, I'm not a Human</p>
      <h1 id="missing-title">Часть не найдена</h1>
      <p>Проверьте ссылку или вернитесь на главную страницу.</p>
      <RouterLink class="primary-button" to="/">На главную</RouterLink>
    </section>
  </main>
</template>
