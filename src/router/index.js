import { createRouter, createWebHistory } from "vue-router";
import WelcomeView from "@/views/WelcomeView.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: WelcomeView,
    },
    {
      path: "/articoli",
      name: "articoli",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("@/views/ArticlesView.vue"),
    },
    {
      path: "/permessi",
      name: "permessi",
      component: () => import("@/views/PermissionsView.vue"),
    }
  ],
});

const validRoutes = ["/", "/articoli", "/permessi"];

router.beforeEach((to, from, next) => {
  if (validRoutes.includes(to.path)) {
    next();
  } else {
    next("/");
  }
});

export default router;
