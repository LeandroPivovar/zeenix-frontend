import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'
import HomeView from '../views/HomeView.vue'
import AcademyView from '../views/AcademyView.vue'
import CourseDetailView from '../views/CourseDetailView.vue'
import ProfileView from '../views/ProfileView.vue'
import SupportView from '../views/SupportView.vue'
import SettingsView from '../views/SettingsView.vue'
import PlansView from '../views/PlansView.vue'
import OperationView from '../views/OperationView.vue'
import DerivOAuthCallback from '../views/DerivOAuthCallback.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: AuthView
  },
  {
    path: '/register',
    name: 'Register',
    component: AuthView
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: AuthView
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/academy',
    name: 'Academy',
    component: AcademyView,
    meta: { requiresAuth: true }
  },
  {
    path: '/academy/course/:id',
    name: 'CourseDetail',
    component: CourseDetailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/support',
    name: 'Support',
    component: SupportView,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/plans',
    name: 'Plans',
    component: PlansView,
    meta: { requiresAuth: true }
  },
  {
    path: '/operation',
    name: 'Operation',
    component: OperationView,
    meta: { requiresAuth: true }
  },
  {
    path: '/oauth/callback',
    name: 'DerivOAuthCallback',
    component: DerivOAuthCallback,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) return next({ path: '/login' })
  }
  next()
})

export default router