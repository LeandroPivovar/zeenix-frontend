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
import MarkupView from '../views/Admin/MarkupView.vue'
import InvestmentIAView from '../views/InvestmentIAView.vue'
import ExpertsView from '../views/Admin/ExpertsView.vue'
import ClientesView from '../views/Admin/ClientesView.vue'
import WebhookView from '../views/Admin/WebhookView.vue'
import AcademyManagementView from '../views/Admin/AcademyManagementView.vue'
import AcademyCoursesListView from '../views/Admin/AcademyCoursesListView.vue'
import AdminView from '@/views/Admin/AdminView.vue'
import MasterTraderView from '@/views/MasterTraderView.vue'
import AgenteAutonomoView from '@/views/AgenteAutonomo.vue'
import CopyTraders from '@/views/CopyTradersView.vue';
import SupportItemsManagementView from '@/views/Admin/SupportItemsManagementView.vue';
import PlansManagementView from '@/views/Admin/PlansManagementView.vue';

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
    component: () => import('../components/ForgotPasswordComponent.vue')
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../components/ResetPasswordComponent.vue')
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
    path: '/copy-trading',
    name: 'CopyTrading',
    component: CopyTraders,
    meta: { requiresAuth: true }
  },
  {
    path: '/oauth/callback',
    name: 'DerivOAuthCallback',
    component: DerivOAuthCallback,
    meta: { requiresAuth: true }
  },
  {
    path: '/markup',
    name: 'Markup',
    component: MarkupView,
    meta: { requiresAuth: true }
  },
  {
    path: '/StatsIAs',
    name: 'StatsIAs',
    component: InvestmentIAView,
    meta: { requiresAuth: true }
  },
  {
    path: '/Experts',
    name: 'Experts',
    component: ExpertsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/Clientes',
    name: 'Clientes',
    component: ClientesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/Webhooks',
    name: 'Webhooks',
    component: WebhookView, 
    meta: { requiresAuth: true }
  },

  {
    path: '/AcademyManagement',
    name: 'AcademyCoursesList',
    component: AcademyCoursesListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/AcademyManagement/:id',
    name: 'AcademyManagement',
    component: AcademyManagementView,
    meta: { requiresAuth: true }
  },
  {
    path: '/Admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAuth: true }
  },
  {
    path: '/InvestmentIA',
    name: 'InvestmentIAView',
    component: InvestmentIAView,
    meta: { requiresAuth: true }
  
  },
  {
    path: '/MasterTrader',
    name: 'MasterTraderView',
    component: MasterTraderView,  
    meta: { requiresAuth: true, requiresRole: ['admin', 'trader'] }  
  },
  {
    path: '/agente-autonomo',
    name: 'AgenteAutonomoView',
    component: AgenteAutonomoView,
    meta: { requiresAuth: true }
  },
  {
    path: '/copy-trader',
    name: 'CopyTradersView',
    component: CopyTraders,  
    meta: { requiresAuth: true }
  },
  {
    path: '/SupportItems',
    name: 'SupportItemsManagement',
    component: SupportItemsManagementView,
    meta: { requiresAuth: true }
  },
  {
    path: '/PlansManagement',
    name: 'PlansManagement',
    component: PlansManagementView,
    meta: { requiresAuth: true }
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) return next({ path: '/login' })
    
    // Verificar role se necessário
    if (to.meta.requiresRole && Array.isArray(to.meta.requiresRole)) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const role = payload.role || payload.roles || payload.userRole || payload.user_role
        
        if (!role) {
          return next({ path: '/dashboard' })
        }
        
        const roleStr = Array.isArray(role) ? role.join(',').toLowerCase() : role.toString().toLowerCase()
        const hasAccess = to.meta.requiresRole.some(allowedRole => 
          roleStr === allowedRole.toLowerCase() || roleStr.includes(allowedRole.toLowerCase())
        )
        
        if (!hasAccess) {
          return next({ path: '/dashboard' })
        }
      } catch (error) {
        console.error('[Router] Erro ao verificar role:', error)
        return next({ path: '/dashboard' })
      }
    }
  }
  next()
})

export default router