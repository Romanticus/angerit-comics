<script setup>
import comic from './data/comic.js'
import { computed } from 'vue'

const sortedPages = computed(() =>
  [...comic]
    .filter((p) => p.url)
    .sort((a, b) => a.order - b.order)
)

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function scrollToBottom() {
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
}
</script>

<template>
  <div class="content-wrap">
    <div class="scroll-buttons">
    <button type="button" class="scroll-btn" aria-label="В начало страницы" @click="scrollToTop">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
    <button type="button" class="scroll-btn" aria-label="В конец страницы" @click="scrollToBottom">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    </button>
    </div>
    <main>
      <img
        v-for="page in sortedPages"
        :key="page.order"
        :src="page.url"
        loading="lazy"
        alt=""
      />
    </main>
  </div>
</template>

<style scoped>
main {
  width: 100%;
}

img {
  display: block;
  min-height: 100svh;
  width: 100%;
  max-height: 100svh;
  object-fit: contain;
}

.content-wrap {
  max-width: min(100%, 960px);
  margin: 0 auto;
}

.scroll-buttons {
  position: fixed;
  right: max(1rem, calc(50vw - 480px + 1rem));
  bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  z-index: 100;
}

.scroll-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, transform 0.15s, box-shadow 0.2s;
}

.scroll-btn:hover {
  background: #333;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transform: scale(1.08);
}

.scroll-btn:active {
  transform: scale(0.96);
}

.scroll-btn svg {
  flex-shrink: 0;
}
</style>
