<!--
THESIS: A fan comic should feel like an archive entry, not a generic landing page.
OWN-WORLD: Black canvas, turquoise lettering, quiet rules, square dossier cells, no visual noise.
STORY: A Telegram reader understands the project, sees the real cover, and starts reading one part.
FIRST VIEWPORT: Large title and metadata on the left, natural 2:3 cover on the right, one CTA at the bottom of the text column.
FORM: Approved second generated composition; the sparse catalog-register staging carries into the part index and 18+ note.
-->
<script setup>
import { RouterLink } from 'vue-router'

import AgeWarning from '../components/AgeWarning.vue'
import PartCard from '../components/PartCard.vue'
import ProjectInfo from '../components/ProjectInfo.vue'
import ResumePrompt from '../components/ResumePrompt.vue'
import { comicParts } from '../data/comicParts.js'
import coverUrl from '../assets/images/0.webp'
import { getLatestUnfinishedProgress } from '../utils/readingProgress.js'

const resumeProgress = getLatestUnfinishedProgress()
</script>

<template>
  <main class="home-page">
    <ResumePrompt v-if="resumeProgress" :progress="resumeProgress" />
    <div class="home-frame">
      <section class="hero" aria-labelledby="comic-title">
        <div class="hero-heading">
          <p class="hero-kicker">Фан-комикс по игре no i'm not a human</p>
          <h1 id="comic-title">NO, I'M NOT A HUMAN</h1>
          <p class="hero-subtitle">Неофициальный фанатский комикс</p>
        </div>

        <figure class="comic-cover">
          <img :src="coverUrl" alt="Обложка фан-комикса No, I'm not a Human" />
          <figcaption>Оригинальная обложка фан-комикса</figcaption>
        </figure>

        <ProjectInfo />

        <RouterLink class="primary-button" to="/part/1">Начать читать</RouterLink>
      </section>

      <section class="parts-section" aria-labelledby="parts-title">
        <div class="section-heading">
          <h2 id="parts-title">4 части</h2>
          <span aria-hidden="true"></span>
        </div>
        <div class="parts-grid">
          <PartCard v-for="part in comicParts" :key="part.id" :part="part" />
        </div>
      </section>

      <AgeWarning />

      <footer class="site-footer">
        <p>Неофициальный фанатский проект.</p>
        <p>
          Проект не связан с разработчиками или издателями игры <em>No, I'm not a Human</em>.
          Права на оригинальную игру и её персонажей принадлежат соответствующим правообладателям.
        </p>
      </footer>
    </div>
  </main>
</template>
