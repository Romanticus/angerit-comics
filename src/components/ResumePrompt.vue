<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

defineProps({
  progress: {
    type: Object,
    required: true,
  },
})

const isOpen = ref(false)
</script>

<template>
  <aside class="resume-prompt" :class="{ 'resume-prompt--open': isOpen }">
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
      <p>Продолжить чтение</p>
      <span>Часть {{ progress.partId }} · страница {{ progress.pageOrder }}</span>
      <RouterLink
        class="resume-prompt__link"
        :to="`/part/${progress.partId}#page-${progress.pageOrder}`"
        @click="isOpen = false"
      >
        Продолжить
      </RouterLink>
    </div>
  </aside>
</template>
