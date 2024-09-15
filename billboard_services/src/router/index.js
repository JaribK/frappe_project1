import { createRouter, createWebHistory } from "vue-router";
import authRoutes from './auth';

const routes = [
  {
	path: "/home",
	name: "Home",
	component: () => import('../views/Home.vue'),
  },
  {
    path: "/test",
    name: "test",
    component: () => import('../views/test.vue'),
  },
  ...authRoutes,
];

const router = createRouter({
  base: "/billboard_services",
  history: createWebHistory('/billboard_services'),
  routes,
});

export default router;
