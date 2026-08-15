<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

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
const router = useRouter()

const header = ref(null)
const isHidden = ref(false)
const isPointerInside = ref(false)
const showResetConfirm = ref(false)
let previousScrollY = 0

function updateVisibility() {
  const currentScrollY = window.scrollY
  const delta = currentScrollY - previousScrollY

  if (header.value?.contains(document.activeElement) || isPointerInside.value) {
    previousScrollY = currentScrollY
    return
  }

  if (Math.abs(delta) < 12) return

  if (currentScrollY < 24) {
    isHidden.value = false
  } else {
    isHidden.value = delta > 0
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

function handleResumeClick(progress) {
  const targetHash = `#/part/${progress.partId}#page-${progress.pageOrder}`
  if (window.location.hash !== targetHash) {
    router.push(`/part/${progress.partId}#page-${progress.pageOrder}`)
    return
  }

  const target = document.getElementById(`page-${progress.pageOrder}`)
  if (!target) return

  const scrollToTarget = () => {
    window.scrollTo({
      top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - 24),
      behavior: 'auto',
    })
  }

  scrollToTarget()
  window.requestAnimationFrame(scrollToTarget)
}

onMounted(() => {
  previousScrollY = window.scrollY
  window.addEventListener('scroll', updateVisibility, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', updateVisibility))
</script>

<template>
  <header
    ref="header"
    class="reader-header"
    :class="{ 'reader-header--hidden': isHidden }"
  >
    <div
      class="reader-header__inner"
      @mouseenter="isPointerInside = true"
      @mouseleave="isPointerInside = false"
    >
      <RouterLink class="reader-home-link" to="/">← На главную</RouterLink>
      <p class="reader-kicker">No, I'm not a Human</p>
      <div v-if="resumeProgress" class="reader-resume">
        <button
          class="reader-resume__link"
          type="button"
          @click="handleResumeClick(resumeProgress)"
        >
          К странице {{ resumeProgress.pageOrder }}
        </button>
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
    </div>
  </header>
</template>
