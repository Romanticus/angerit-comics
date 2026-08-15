import { createRouter, createWebHashHistory } from 'vue-router'

import HomePage from '../pages/HomePage.vue'
import ComicReader from '../pages/ComicReader.vue'

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomePage },
    { path: '/part/:id', component: ComicReader },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})
