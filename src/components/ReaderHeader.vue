<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { clearReadingProgress } from '../utils/readingProgress.js'

defineProps({
  partTitle: {
    type: String,
    required: true,
  },
  resumeProgress: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['progress-reset'])

const header = ref(null)
const isHidden = ref(false)
let previousScrollY = 0

function updateVisibility() {
  if (header.value?.contains(document.activeElement)) return
  const currentScrollY = window.scrollY
  if (currentScrollY < 24) {
    isHidden.value = false
  } else if (currentScrollY > previousScrollY + 4) {
    isHidden.value = true
  } else if (currentScrollY < previousScrollY - 4) {
    isHidden.value = false
  }
  previousScrollY = currentScrollY
}

function forgetProgress() {
  clearReadingProgress()
  emit('progress-reset')
}

onMounted(() => {
  previousScrollY = window.scrollY
  window.addEventListener('scroll', updateVisibility, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', updateVisibility))
</script>

<template>
  <header ref="header" class="reader-header" :class="{ 'reader-header--hidden': isHidden }">
    <RouterLink class="reader-home-link" to="/">← На главную</RouterLink>
    <p class="reader-kicker">No, I'm not a Human</p>
    <div v-if="resumeProgress" class="reader-resume">
      <RouterLink class="reader-resume__link" :to="`/part/${resumeProgress.partId}#page-${resumeProgress.pageOrder}`">
        К странице {{ resumeProgress.pageOrder }}
      </RouterLink>
      <button class="reader-resume__forget" type="button" @click="forgetProgress">
        Забыть прогресс
      </button>
    </div>
    <h1>{{ partTitle }}</h1>
  </header>
</template>
