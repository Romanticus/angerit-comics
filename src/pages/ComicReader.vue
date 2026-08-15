<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import ReaderFooter from '../components/ReaderFooter.vue'
import ReaderHeader from '../components/ReaderHeader.vue'
import comic from '../data/comic.js'
import { comicParts } from '../data/comicParts.js'
import { completeReadingPart, saveReadingProgress } from '../utils/readingProgress.js'

const route = useRoute()
const pageLoaded = reactive({})
const comicStack = ref(null)
let progressObserver

const part = computed(() => comicParts.find((item) => item.id === Number(route.params.id)))
const pages = computed(() => {
  if (!part.value) return []
  return comic.filter((page) => page.order >= part.value.startPage && page.order <= part.value.endPage)
})

function markPageLoaded(order) {
  pageLoaded[order] = true
}

function markLoadedIfComplete(element, order) {
  if (element?.complete && element.naturalWidth) markPageLoaded(order)
}

function observeReadingProgress() {
  progressObserver?.disconnect()
  if (!comicStack.value || !part.value) return

  progressObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.5) return
        const pageOrder = Number(entry.target.dataset.pageOrder)
        if (pageOrder === part.value.endPage) {
          completeReadingPart(part.value.id)
        } else {
          saveReadingProgress(part.value.id, pageOrder)
        }
      })
    },
    { threshold: [0.5] },
  )

  comicStack.value.querySelectorAll('[data-page-order]').forEach((page) => progressObserver.observe(page))
}

function scrollToRequestedPage() {
  if (!route.hash) return
  const target = document.querySelector(route.hash)
  target?.scrollIntoView({ block: 'start' })
}

onMounted(async () => {
  await nextTick()
  observeReadingProgress()
  scrollToRequestedPage()
})

watch(
  () => part.value?.id,
  async () => {
    await nextTick()
    observeReadingProgress()
    scrollToRequestedPage()
  },
)

onBeforeUnmount(() => progressObserver?.disconnect())
</script>

<template>
  <main v-if="part" class="reader-page">
    <ReaderHeader :part-title="part.title" />

    <section ref="comicStack" class="comic-stack" :aria-label="`${part.title}, страницы комикса`">
      <figure
        v-for="(page, index) in pages"
        :id="`page-${page.order}`"
        :key="page.order"
        :data-page-order="page.order"
        class="comic-page"
      >
        <div v-show="!pageLoaded[page.order]" class="comic-page__skeleton" aria-hidden="true"></div>
        <img
          :ref="(element) => markLoadedIfComplete(element, page.order)"
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
