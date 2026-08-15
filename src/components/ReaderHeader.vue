<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineProps({
  partTitle: {
    type: String,
    required: true,
  },
})

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
    <h1>{{ partTitle }}</h1>
  </header>
</template>
