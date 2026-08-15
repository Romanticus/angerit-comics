<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import ReaderFooter from '../components/ReaderFooter.vue'
import ReaderHeader from '../components/ReaderHeader.vue'
import comic from '../data/comic.js'
import { comicParts } from '../data/comicParts.js'
import {
  completeReadingPart,
  getLatestUnfinishedProgress,
  saveReadingProgress,
} from '../utils/readingProgress.js'

const route = useRoute()
const pageLoaded = reactive({})
const comicStack = ref(null)
const resumeProgress = ref(getLatestUnfinishedProgress())
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

function refreshResumeProgress() {
  resumeProgress.value = getLatestUnfinishedProgress()
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
        } else if (pageOrder > part.value.startPage) {
          // Opening a new part on page one must not replace an existing resume point.
          saveReadingProgress(part.value.id, pageOrder)
        }
        refreshResumeProgress()
      })
    },
    { threshold: [0.5] },
  )

  comicStack.value.querySelectorAll('[data-page-order]').forEach((page) => progressObserver.observe(page))
}

function scrollToRequestedPage() {
  const pageHash = window.location.hash.match(/(#page-\d+)$/)?.[1]
  if (!pageHash) return

  window.setTimeout(() => {
    document.querySelector(pageHash)?.scrollIntoView({ block: 'start' })
  }, 80)
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

watch(
  () => route.fullPath,
  async () => {
    await nextTick()
    scrollToRequestedPage()
  },
)

onBeforeUnmount(() => progressObserver?.disconnect())

function clearResumeProgress() {
  resumeProgress.value = undefined
}
</script>

<template>
  <main v-if="part" class="reader-page">
    <ReaderHeader
      :part-title="part.title"
      :resume-progress="resumeProgress"
      @progress-reset="clearResumeProgress"
    />

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
          :width="page.width"
          :height="page.height"
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

    <ReaderFooter
      :current-id="part.id"
      :parts="comicParts"
      :resume-progress="resumeProgress"
      @progress-reset="clearResumeProgress"
    />
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
