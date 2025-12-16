<template>
  <div class="zenix-layout">
    <!-- Overlay para fechar sidebar em mobile -->
    <div 
      class="sidebar-overlay" 
      :class="{ 'show': isSidebarOpen && isMobile }" 
      @click="closeSidebar"
    ></div>

    <AppSidebar 
      class="app-sidebar"
      :class="{ 'mobile-open': isSidebarOpen }"
      :is-open="isSidebarOpen" 
      :is-collapsed="isSidebarCollapsed" 
      @close-sidebar="closeSidebar" 
      @toggle-collapse="toggleSidebarCollapse" 
    />

    <div class="main-content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
        <TopNavbar 
          :is-sidebar-collapsed="isSidebarCollapsed"
          :balance="balance"
          :account-type="isDemo ? 'demo' : 'real'"
          :currency="accountCurrency"
          :balances-by-currency-real="balancesByCurrencyReal"
          :balances-by-currency-demo="balancesByCurrencyDemo"
          @toggle-sidebar="toggleSidebar"
          @toggle-sidebar-collapse="toggleSidebarCollapse"
        />

        <main class="main-content academy-content">
            <!-- Seção Zenix Academy - Apenas Mobile -->
            <div class="academy-header-mobile">
                <h1 class="academy-title-mobile">Zenix Academy</h1>
                <p class="academy-description-mobile">Aprenda estratégias de trading e domine o mercado</p>
            </div>

            <div v-if="loading" class="loading-container">
                <i class="fas fa-circle-notch fa-spin fa-2x"></i>
                <p>Carregando cursos...</p>
            </div>

            <div v-else-if="error" class="error-container">
                <p>{{ error }}</p>
                <button @click="fetchCourses" class="action-btn btn-green" style="width: auto; padding: 0.75rem 2rem;">Tentar novamente</button>
            </div>

            <div v-else class="courses-grid">
                <div 
                    v-for="(course, index) in courses" 
                    :key="course.id" 
                    class="course-card"
                >
                    <div class="course-header-image" :class="{ 'has-cover': course.coverImage }">
                        <img v-if="course.coverImage" :src="course.coverImage" :alt="course.title" loading="lazy" />
                        <i v-else :class="getCourseIcon(index) + ' course-icon-placeholder'" :style="{ color: getCourseColor(index) }"></i>
                    </div>

                    <div class="card-body">
                        <div class="card-top">
                            <div class="course-info">
                                <h3 class="course-title">{{ course.title }}</h3>
                                <p class="course-description">{{ course.description }}</p>
                            </div>
                            <div class="tooltip">
                                <i class="fas fa-info-circle tooltip-icon"></i>
                                <span class="tooltip-text">Este curso faz parte da formação oficial Zenix.</span>
                            </div>
                        </div>
                        
                        <div class="course-meta">
                            <div class="meta-item">
                                <i class="fas fa-play-circle"></i>
                                <span>{{ course.totalLessons }} {{ course.totalLessons === 1 ? 'aula' : 'aulas' }}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-clock"></i>
                                <span>{{ course.totalDuration || '0h 0min' }}</span>
                            </div>
                        </div>
                        
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" :style="{ width: (courseProgress[course.id] || 0) + '%' }"></div>
                            </div>
                            <div class="progress-label">
                                <span 
                                    class="progress-percent" 
                                    :style="{ color: courseProgress[course.id] > 0 ? getCourseColor(index) : '#8D8D8D' }"
                                >
                                    {{ courseProgress[course.id] || 0 }}% concluído
                                </span>
                            </div>
                        </div>
                        
                        <button 
                            v-if="(courseProgress[course.id] || 0) > 0"
                            class="action-btn btn-green"
                            @click="navigateToCourse(course.id)"
                        >
                            Continuar
                            <i class="fas fa-arrow-right"></i>
                        </button>
                        <button 
                            v-else
                            class="action-btn btn-outline"
                            @click="navigateToCourse(course.id)"
                        >
                            Iniciar
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
    <DesktopBottomNav />
  </div>
</template>
<script>
import AppSidebar from '../components/Sidebar.vue'
import TopNavbar from '../components/TopNavbar.vue'
import DesktopBottomNav from '../components/DesktopBottomNav.vue'
import { loadAccountBalance } from '../utils/balanceLoader'

export default {
  name: 'AcademyView',
  components: { AppSidebar, TopNavbar, DesktopBottomNav },
  data() {
    return {
      courses: [],
      loading: true,
      error: null,
      courseProgress: {}, 
      isSidebarOpen: window.innerWidth > 768, // Inicia aberto apenas em desktop
      isSidebarCollapsed: false, // Controla menu Desktop mini
      balance: 0,
      accountCurrency: 'USD',
      isDemo: false,
      balancesByCurrencyReal: {},
      balancesByCurrencyDemo: {},
      windowWidth: window.innerWidth,
      isMobile: window.innerWidth <= 768
    }
  },
  mounted() {
    this.loadFontAwesome();
    this.fetchCourses();
    this.fetchBalance();
    
    // Adiciona listener para fechar menu ao redimensionar para desktop
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
      this.isMobile = this.windowWidth <= 768;
      
      // Em desktop, mantém sidebar aberto; em mobile, fecha
      if (!this.isMobile) {
        this.isSidebarOpen = true;
      } else if (this.isSidebarOpen) {
        // Se estava aberto em desktop e passou para mobile, fecha
        this.isSidebarOpen = false;
      }
    },
    loadFontAwesome() {
        if (!document.getElementById('fa-script')) {
            const script = document.createElement('script');
            script.id = 'fa-script';
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js';
            script.crossOrigin = 'anonymous';
            script.referrerPolicy = 'no-referrer';
            document.head.appendChild(script);
        }
    },
    getCourseIcon(index) {
        const icons = ['fas fa-copy', 'fas fa-brain', 'fas fa-chart-line', 'fas fa-robot'];
        return icons[index % icons.length];
    },
    getCourseColor(index) {
        const colors = ['#22C55E', '#0099FF', '#FFD058', '#FF4747'];
        return colors[index % colors.length];
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    },
    closeSidebar() {
      // Fecha sidebar apenas em mobile
      if (window.innerWidth <= 768) {
        this.isSidebarOpen = false
      }
    },
    toggleSidebarCollapse() {
      // Apenas funciona em Desktop
      if (window.innerWidth > 1024) {
        this.isSidebarCollapsed = !this.isSidebarCollapsed
      }
    },
    navigateToCourse(id) {
        this.$router.push(`/academy/course/${id}`)
    },
    async fetchCourses() {
      this.loading = true
      this.error = null
      
      try {
        // Simulando delay para ver loading
        await new Promise(r => setTimeout(r, 800));
        
        const token = localStorage.getItem('token')
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
        
        const res = await fetch(`${apiBaseUrl}/courses`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        })

        if (!res.ok) throw new Error(`Erro ao buscar cursos: ${res.statusText}`)

        const data = await res.json()
        this.courses = data.map(course => ({
          ...course,
          coverImage: this.resolveImageUrl(course.coverImage)
        }))
        this.calculateProgress()
      } catch (err) {
        console.error('Erro:', err)
        // Fallback mock para teste visual se a API falhar
        if (!this.courses.length) {
            this.courses = [
                { id: 1, title: 'Fundamentos do Trading', description: 'Aprenda a base sólida.', totalLessons: 12, totalDuration: '4h 20m' },
                { id: 2, title: 'Psicologia do Investidor', description: 'Domine sua mente.', totalLessons: 8, totalDuration: '2h 15m' },
                { id: 3, title: 'Análise Técnica Avançada', description: 'Gráficos e tendências.', totalLessons: 20, totalDuration: '8h 00m' }
            ];
            this.calculateProgress();
        } else {
            this.error = 'Não foi possível carregar os cursos.'
        }
      } finally {
        this.loading = false
      }
    },
    calculateProgress() {
      this.courses.forEach((course, index) => {
        const mockPercentages = [43, 0, 78, 25];
        this.courseProgress[course.id] = mockPercentages[index % mockPercentages.length];
      })
    },
    resolveImageUrl(url) {
      if (!url) return null
      if (url.startsWith('http')) return url
      const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
      return `${apiBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`
    },
    async fetchBalance() {
      try {
        const balanceData = await loadAccountBalance();
        if (balanceData) {
          this.balance = balanceData.balance;
          this.accountCurrency = balanceData.currency;
          this.isDemo = balanceData.isDemo;
          this.balancesByCurrencyReal = balanceData.balancesByCurrencyReal || {};
          this.balancesByCurrencyDemo = balanceData.balancesByCurrencyDemo || {};
        }
      } catch (error) {
        console.error('[AcademyView] Erro ao buscar saldo:', error);
        // Fallback para valor padrão se houver erro
        this.balance = 0;
      }
    }
  }
}
</script>

<style scoped src="../assets/css/views/academyView.css"></style>