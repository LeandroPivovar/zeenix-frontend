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
// import MarkupView from '../views/Admin/MarkupView.vue'
import InvestmentActiveStrategyView from '../views/InvestmentActiveStrategyView.vue'
import InvestmentIAView from '../views/InvestmentIAView.vue'
import MasterTraderView from '@/views/MasterTraderView.vue'
import AgenteAutonomoView from '@/views/AgenteAutonomo.vue'
import CopyTraders from '@/views/CopyTradersView.vue';
import AutonomousAgentLogsView from '@/views/AutonomousAgentLogsView.vue';


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
    path: '/register-success',
    name: 'RegisterSuccess',
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
    path: '/confirm-account',
    name: 'ConfirmAccount',
    component: () => import('../components/ConfirmAccountComponent.vue')
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
    meta: { requiresAuth: true, requiresDeriv: true }
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
    meta: { requiresAuth: true, requiresDeriv: true }
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
    meta: { requiresAuth: true, requiresDeriv: true }
  },
  {
    path: '/copy-trading',
    name: 'CopyTrading',
    component: CopyTraders,
    meta: { requiresAuth: true, requiresDeriv: true }
  },
  {
    path: '/oauth/callback',
    name: 'DerivOAuthCallback',
    component: DerivOAuthCallback,
    meta: { requiresAuth: true }
  },
  {
    path: '/adminLogin',
    name: 'AdminLogin',
    component: () => import('../views/Admin/AdminLoginView.vue')
  },
  {
    path: '/markup',
    name: 'Markup',
    component: () => import('../views/Admin/MarkupView.vue'),
    meta: { requiresAuth: true, requiresRole: ['admin'] }
  },
  {
    path: '/adminStatsIAs',
    name: 'StatsIAs',
    component: () => import('../views/Admin/StatsIAsView.vue'),
    meta: { requiresAuth: true, requiresDeriv: true, requiresRole: ['admin'] }
  },
  {
    path: '/adminStatsIAs/monitoring',
    name: 'AIMonitoring',
    component: () => import('../views/Admin/AIMonitoringView.vue'),
    meta: { requiresAuth: true, requiresDeriv: true }
  },
  {
    path: '/Experts',
    name: 'Experts',
    component: () => import('../views/Admin/ExpertsView.vue'),
    meta: { requiresAuth: true, requiresRole: ['admin'] }
  },
  {
    path: '/Clientes',
    name: 'Clientes',
    component: () => import('../views/Admin/ClientesView.vue'),
    meta: { requiresAuth: true, requiresRole: ['admin'] }
  },
  {
    path: '/Webhooks',
    name: 'Webhooks',
    component: () => import('../views/Admin/WebhookView.vue'),
    meta: { requiresAuth: true, requiresRole: ['admin'] }
  },

  {
    path: '/AcademyManagement',
    name: 'AcademyCoursesList',
    component: () => import('../views/Admin/AcademyCoursesListView.vue'),
    meta: { requiresAuth: true, requiresRole: ['admin'] }
  },
  {
    path: '/AcademyManagement/:id',
    name: 'AcademyManagement',
    component: () => import('../views/Admin/AcademyManagementView.vue'),
    meta: { requiresAuth: true, requiresRole: ['admin'] }
  },
  {
    path: '/Admin',
    name: 'Admin',
    component: () => import('@/views/Admin/AdminView.vue'),
    meta: { requiresAuth: true, requiresRole: ['admin'] }
  },
  {
    path: '/iaTeste',
    name: 'iaTeste',
    component: InvestmentActiveStrategyView,
    meta: { requiresAuth: true, requiresRole: ['admin'] }
  },
  {
    path: '/Investments-IA',
    name: 'InvestmentIAView',
    component: InvestmentIAView,
    meta: { requiresAuth: true, requiresDeriv: true }
  },
  {
    path: '/Investments-IA/active',
    name: 'InvestmentMonitoringActive',
    component: () => import('../views/Admin/AIMonitoringView.vue'),
    meta: { requiresAuth: true, requiresDeriv: true }
  },
  {
    path: '/MasterTrader',
    name: 'MasterTraderView',
    component: MasterTraderView,
    meta: { requiresAuth: true, requiresDeriv: true }
  },
  {
    path: '/agente-autonomo',
    name: 'AgenteAutonomoView',
    component: AgenteAutonomoView,
    meta: { requiresAuth: true, requiresDeriv: true }
  },
  {
    path: '/agente-autonomo/logs',
    name: 'AutonomousAgentLogsView',
    component: AutonomousAgentLogsView,
    meta: { requiresAuth: true, requiresDeriv: true }
  },
  {
    path: '/copy-trader',
    name: 'CopyTradersView',
    component: CopyTraders,
    meta: { requiresAuth: true, requiresDeriv: true }
  },
  {
    path: '/SupportItems',
    name: 'SupportItemsManagement',
    component: () => import('@/views/Admin/SupportItemsManagementView.vue'),
    meta: { requiresAuth: true, requiresRole: ['admin'] }
  },
  {
    path: '/PlansManagement',
    name: 'PlansManagement',
    component: () => import('@/views/Admin/PlansManagementView.vue'),
    meta: { requiresAuth: true, requiresRole: ['admin'] }
  },
  {
    path: '/admin/markets',
    name: 'MarketsAdmin',
    component: () => import('../views/Admin/MarketsAdminView.vue'),
    meta: { requiresAuth: true, requiresRole: ['admin'] }
  },
  {
    path: '/admin/notifications',
    name: 'NotificationsAdmin',
    component: () => import('../views/Admin/NotificationsAdminView.vue'),
    meta: { requiresAuth: true, requiresRole: ['admin'] }
  },
  {
    path: '/admin/strategies/create',
    name: 'StrategyCreator',
    component: () => import('../views/Admin/StrategyCreatorView.vue'),
    meta: { requiresAuth: true, requiresRole: ['admin'] }
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

    // Verificação de plano - Usuários sem plano acessam apenas Dashboard e Planos
    const userJson = localStorage.getItem('user') || '{}'
    const user = JSON.parse(userJson)
    const roleStr = (user.role || '').toLowerCase()

    // Identificar Admin de forma robusta
    const isAdmin = roleStr.includes('admin') || user.isAdmin === true || user.isAdmin === 'true'

    if (!isAdmin && !user.planId) {
      const allowedRoutes = ['Dashboard', 'Plans']
      if (!allowedRoutes.includes(to.name)) {
        console.warn(`[Router] Acesso restrito para usuário sem plano: redirecionando para Planos`)
        return next({ name: 'Plans' })
      }
    }

    // Se a rota requer conexão com a Deriv, verifica se o usuário está conectado
    // Exception: Admins têm acesso a tudo (bypass requiresDeriv)
    if (to.meta.requiresDeriv && !isAdmin) {
      const derivConnection = localStorage.getItem('deriv_connection')
      if (!derivConnection) {
        console.warn(`[Router] Redirecionando para dashboard: ${to.path} requer conexão com a Deriv`)
        return next({ path: '/dashboard' })
      }
    }

    // Verificação de role habilitada - acesso apenas para admins
    if (to.meta.requiresRole && Array.isArray(to.meta.requiresRole)) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const role = payload.role || payload.roles || payload.userRole || payload.user_role
        const isAdminFlag = payload.isAdmin || payload.is_admin

        // Se isAdminFlag for true, libera acesso
        if (isAdminFlag === true || isAdminFlag === 'true') {
          return next()
        }

        if (!role) {
          console.warn('[Router] Usuário sem role tentando acessar área restrita')
          return next({ path: '/dashboard' })
        }

        const roleStr = Array.isArray(role) ? role.join(',').toLowerCase() : role.toString().toLowerCase()
        const hasAccess = to.meta.requiresRole.some(allowedRole =>
          roleStr === allowedRole.toLowerCase() || roleStr.includes(allowedRole.toLowerCase())
        )

        if (!hasAccess) {
          console.warn(`[Router] Acesso negado para role "${roleStr}" na rota "${to.path}"`)
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

router.onError((error) => {
  // Capturar erros de carregamento de chunks (comum após deploy) ou erros de sintaxe (geralmente JS retornando HTML)
  const isChunkError = error.name === 'ChunkLoadError' ||
    error.message.includes('Loading chunk') ||
    error.message.includes('SyntaxError');

  if (isChunkError) {
    console.error('[Router] Erro de carregamento detectado, recarregando para obter versão mais recente:', error);

    // Evitar loop infinito de recarregamento
    const lastReload = sessionStorage.getItem('last_chunk_reload');
    const now = Date.now();

    if (!lastReload || now - parseInt(lastReload) > 10000) {
      sessionStorage.setItem('last_chunk_reload', now.toString());
      window.location.reload();
    } else {
      console.warn('[Router] Recarregamento ignorado para evitar loop.');
    }
  }
});

export default router