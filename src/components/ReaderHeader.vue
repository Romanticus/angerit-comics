<script setup>
defineProps({
  partTitle: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <header class="reader-header">
    <RouterLink class="reader-home-link" to="/">← На главную</RouterLink>
    <p class="reader-kicker">No, I'm not a Human</p>
    <h1>{{ partTitle }}</h1>
  </header>
</template>
