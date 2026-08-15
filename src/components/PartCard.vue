<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  part: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <RouterLink class="part-card" :to="`/part/${part.id}`">
    <span class="part-number">{{ String(part.id).padStart(2, '0') }}</span>
    <span class="part-divider" aria-hidden="true"></span>
    <span class="part-title">{{ part.title }}</span>
  </RouterLink>
</template>
