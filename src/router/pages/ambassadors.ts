export const ambassadorRoutesList = {
  path: 'list',
  name: 'ambassadors',
  component: () => import('@/views/AmbassadorsPage.vue'),
};

export const ambassadorRoutesDetail = {
  path: 'detail/:id',
  name: 'ambassador-detail',
  component: () => import('@/views/AmbassadorDetailPage.vue'),
};
