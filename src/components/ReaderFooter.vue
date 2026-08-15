<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import ForgetProgressControl from './ForgetProgressControl.vue'

const props = defineProps({
  currentId: {
    type: Number,
    required: true,
  },
  parts: {
    type: Array,
    required: true,
  },
  resumeProgress: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['progress-reset'])

const previousPart = computed(() => props.parts.find((part) => part.id === props.currentId - 1))
const nextPart = computed(() => props.parts.find((part) => part.id === props.currentId + 1))
</script>

<template>
  <footer class="reader-footer">
    <nav class="reader-footer__nav" aria-label="Навигация по частям">
      <div class="reader-footer__slot reader-footer__slot--previous">
        <RouterLink v-if="previousPart" class="reader-nav-link" :to="`/part/${previousPart.id}`">
          ← Предыдущая часть
        </RouterLink>
      </div>
      <RouterLink class="reader-nav-link reader-nav-link--home" to="/">На главную</RouterLink>
      <div class="reader-footer__slot reader-footer__slot--next">
        <RouterLink v-if="nextPart" class="reader-nav-link" :to="`/part/${nextPart.id}`">
          Следующая часть →
        </RouterLink>
      </div>
    </nav>
    <ForgetProgressControl
      v-if="resumeProgress"
      :progress="resumeProgress"
      @progress-reset="emit('progress-reset')"
    />
  </footer>
</template>
