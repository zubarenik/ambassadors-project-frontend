import { RouteRecordRaw } from 'vue-router';

// main
import error404 from '@/router/pages/main/Error404';
import error500 from '@/router/pages/main/Error500';

import welcomePageRoutes from '@/router/pages/welcome';
import ambassadorsPageRoutes from '@/router/pages/ambassadors';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'main',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      welcomePageRoutes,
      {
        path: '/ambassadors',
        component: () => import('@/layouts/KeepAliveWrapper.vue'),
        children: [ambassadorsPageRoutes],
      },
    ],
  },
  error404,
  error500,
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
];

export default routes;
