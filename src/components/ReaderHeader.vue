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
const showResetConfirm = ref(false)
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
  showResetConfirm.value = true
}

function confirmForgetProgress() {
  clearReadingProgress()
  showResetConfirm.value = false
  emit('progress-reset')
}

function cancelForgetProgress() {
  showResetConfirm.value = false
}

function handleResumeClick(event, progress) {
  const targetHash = `#/part/${progress.partId}#page-${progress.pageOrder}`
  if (window.location.hash !== targetHash) return

  event.preventDefault()
  document.querySelector(`#page-${progress.pageOrder}`)?.scrollIntoView({ block: 'start' })
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
      <RouterLink
        class="reader-resume__link"
        :to="`/part/${resumeProgress.partId}#page-${resumeProgress.pageOrder}`"
        @click="handleResumeClick($event, resumeProgress)"
      >
        К странице {{ resumeProgress.pageOrder }}
      </RouterLink>
      <button class="reader-resume__forget" type="button" @click="forgetProgress">
        Забыть прогресс
      </button>
    </div>
    <h1>{{ partTitle }}</h1>
    <div v-if="showResetConfirm" class="reader-reset-dialog" role="dialog" aria-modal="true" aria-labelledby="reset-progress-title">
      <p id="reset-progress-title">Точно сбросить прогресс?</p>
      <div class="reader-reset-dialog__actions">
        <button class="reader-reset-dialog__yes" type="button" @click="confirmForgetProgress">Да</button>
        <button class="reader-reset-dialog__no" type="button" @click="cancelForgetProgress">Нет</button>
      </div>
    </div>
  </header>
</template>
