import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import BooksView from "../views/BooksView.vue";
import ReservasView from "../views/ReservasView.vue";
import MisReservasView from "../views/MisReservasView.vue";
import PrestamosView from "../views/PrestamosView.vue";
import AdminReportView from "../views/AdminReportView.vue";

const routes = [
  { path: "/", component: LoginView },
  { path: "/registro", component: RegisterView },
  { path: "/libros", component: BooksView, meta: { auth: true } },
  { path: "/reservas", component: ReservasView, meta: { auth: true, roles: ["bibliotecario"] } },
  { path: "/mis-reservas", component: MisReservasView, meta: { auth: true, roles: ["usuario"] } },
  { path: "/prestamos", component: PrestamosView, meta: { auth: true, roles: ["bibliotecario"] } },
  { path: "/reportes", component: AdminReportView, meta: { auth: true, roles: ["admin"] } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (to.meta.auth && !token) {
    return next("/");
  }

  if (to.meta.roles && !to.meta.roles.includes(role)) {
    return next(role === "admin" ? "/reportes" : "/libros");
  }

  next();
});

export default router;
