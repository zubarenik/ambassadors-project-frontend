import { createRouter, createWebHistory } from 'vue-router';
import routes from '@/router/routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.afterEach(() => {
  const el = document.getElementById('content');
  el?.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});

export default router;
