<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

import { clearReadingProgress } from '../utils/readingProgress.js'

defineProps({
  progress: {
    type: Object,
    required: true,
  },
})

const isOpen = ref(true)
const isVisible = ref(true)

function forgetProgress() {
  clearReadingProgress()
  isVisible.value = false
}
</script>

<template>
  <aside v-if="isVisible" class="resume-prompt" :class="{ 'resume-prompt--open': isOpen }">
    <button
      class="resume-prompt__toggle"
      type="button"
      :aria-expanded="isOpen"
      :aria-label="isOpen ? 'Свернуть продолжение' : 'Показать продолжение'"
      @click="isOpen = !isOpen"
    >
      <span aria-hidden="true">{{ isOpen ? '←' : '→' }}</span>
    </button>

    <div v-if="isOpen" class="resume-prompt__body">
      <span>Часть {{ progress.partId }} · страница {{ progress.pageOrder }}</span>
      <RouterLink
        class="resume-prompt__link"
        :to="`/part/${progress.partId}#page-${progress.pageOrder}`"
        @click="isOpen = false"
      >
        Продолжить
      </RouterLink>
      <button class="resume-prompt__forget" type="button" @click="forgetProgress">
        Забыть прогресс
      </button>
    </div>
  </aside>
</template>
