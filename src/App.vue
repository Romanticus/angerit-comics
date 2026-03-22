<script setup>
import comic from './data/comic.js'
import { computed, reactive } from 'vue'

const sortedPages = computed(() =>
  [...comic]
    .filter((p) => p.url)
    .sort((a, b) => a.order - b.order)
)

const pageLoaded = reactive({})

function markPageLoaded(order) {
  pageLoaded[order] = true
}

/** Уже закэшированные картинки не всегда шлют `load` после mount — проверяем complete. */
function bindImg(el, order) {
  if (!el) return
  if (el.complete && el.naturalWidth) markPageLoaded(order)
}

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
      <div
        v-for="page in sortedPages"
        :key="page.order"
        class="comic-page"
      >
        <div
          v-show="!pageLoaded[page.order]"
          class="comic-page__skeleton"
          aria-hidden="true"
        />
        <img
          :ref="(el) => bindImg(el, page.order)"
          :src="page.url"
          loading="lazy"
          alt=""
          @load="markPageLoaded(page.order)"
          @error="markPageLoaded(page.order)"
        />
        <span class="comic-page__num" aria-hidden="true">{{ page.order }}</span>
      </div>
    </main>
  </div>
</template>

<style scoped>
main {
  width: 100%;
}

.comic-page {
  position: relative;
  display: block;
  width: 100%;
  min-height: 60svh;
  max-height: 100svh;
}

.comic-page__skeleton {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: 2px;
  /* Серые тона под чёрный фон сайта (см. base.css) */
  background: linear-gradient(
    90deg,
    var(--color-background-soft) 0%,
    var(--color-background-mute) 35%,
    #3a3a3a 50%,
    var(--color-background-mute) 65%,
    var(--color-background-soft) 100%
  );
  background-size: 200% 100%;
  animation: comic-skeleton-shimmer 2s ease-in-out infinite;
}

@keyframes comic-skeleton-shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

.comic-page img {
  position: relative;
  z-index: 1;
  display: block;
  min-height: 60svh;
  width: 100%;
  max-height: 100svh;
  object-fit: contain;
} 

.comic-page__num { 
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 2;
  font-size: 0.6875rem;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: #6a6a6a;
  text-shadow:
    0 0 1px rgba(0, 0, 0, 0.95),
    0 1px 2px rgba(0, 0, 0, 0.6);
  pointer-events: none;
  user-select: none;
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
