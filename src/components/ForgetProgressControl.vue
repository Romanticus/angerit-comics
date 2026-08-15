<script setup>
import { ref } from 'vue'

import { clearReadingProgress } from '../utils/readingProgress.js'

defineProps({
  progress: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['progress-reset'])
const showConfirm = ref(false)
const isVisible = ref(true)

function confirmForgetProgress() {
  clearReadingProgress()
  showConfirm.value = false
  isVisible.value = false
  emit('progress-reset')
}
</script>

<template>
  <div v-if="isVisible" class="forget-progress-control">
    <button class="forget-progress-control__button" type="button" @click="showConfirm = true">
      Забыть прогресс
    </button>
    <div
      v-if="showConfirm"
      class="forget-progress-control__dialog"
      role="dialog"
      aria-modal="true"
      aria-label="Подтверждение сброса прогресса"
    >
      <p>Точно сбросить прогресс?</p>
      <div class="forget-progress-control__actions">
        <button type="button" @click="confirmForgetProgress">Да</button>
        <button class="forget-progress-control__no" type="button" @click="showConfirm = false">Нет</button>
      </div>
    </div>
  </div>
</template>
