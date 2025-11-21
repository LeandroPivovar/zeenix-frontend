<template>
  <div class="layout noise-bg" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" @close-sidebar="closeSidebar" @toggle-collapse="toggleSidebarCollapse" />
    
    <!-- Main Content -->
    <div class="main-wrapper"> <!-- Wrapper to align with sidebar width logic in CSS -->
        
        <!-- Header -->
        <header>
            <div class="header-left">
                <button class="hamburger-menu" @click="handleHamburgerClick">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div class="header-content">
                    <h1>Zenix Academy</h1>
                    <p>Cursos exclusivos para traders profissionais</p>
                </div>
            </div>
            <div v-if="isSidebarOpen" class="mobile-overlay" @click="closeSidebar"></div>
        </header>

        <!-- Courses Grid -->
        <main class="academy-content">
            <div v-if="loading" class="loading-container">
                <p>Carregando cursos...</p>
            </div>

            <div v-else-if="error" class="error-container">
                <p>{{ error }}</p>
                <button @click="fetchCourses" class="action-btn btn-green" style="width: auto; padding: 0.75rem 2rem;">Tentar novamente</button>
            </div>

            <div v-else class="courses-grid">
                <!-- Course Card Loop -->
                <div 
                    v-for="(course, index) in courses" 
                    :key="course.id" 
                    class="course-card"
                >
                    <!-- Image/Icon Area -->
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
                                <span class="tooltip-text">Este curso faz parte da formação oficial Zenix. Sua conclusão aumenta sua consistência operacional e libera novos conteúdos avançados.</span>
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
                            <div class="progress-label">
                                <span class="progress-text">Progresso</span>
                                <span 
                                    class="progress-percent" 
                                    :style="{ color: courseProgress[course.id] > 0 ? getCourseColor(index) : '#8D8D8D' }"
                                >
                                    {{ courseProgress[course.id] || 0 }}%
                                </span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" :style="{ width: (courseProgress[course.id] || 0) + '%' }"></div>
                            </div>
                        </div>
                        
                        <button 
                            v-if="(courseProgress[course.id] || 0) > 0"
                            class="action-btn btn-green"
                            @click="navigateToCourse(course.id)"
                        >
                            Continuar
                        </button>
                        <button 
                            v-else
                            class="action-btn btn-outline"
                            @click="navigateToCourse(course.id)"
                        >
                            Iniciar
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
  </div>
</template>

<script>
import AppSidebar from '../components/Sidebar.vue'

export default {
  name: 'AcademyView',
  components: { AppSidebar },
  data() {
    return {
      courses: [],
      loading: true,
      error: null,
      courseProgress: {}, 
      isSidebarOpen: false,
      isSidebarCollapsed: false
    }
  },
  mounted() {
    this.loadFontAwesome();
    this.fetchCourses();
  },
  methods: {
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
      this.isSidebarOpen = false
    },
    toggleSidebarCollapse() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
    },
    handleHamburgerClick() {
      if (this.isSidebarCollapsed) {
        this.isSidebarCollapsed = false
      } else {
        this.toggleSidebar()
      }
    },
    navigateToCourse(id) {
        this.$router.push(`/academy/course/${id}`)
    },
    async fetchCourses() {
      this.loading = true
      this.error = null
      
      try {
        const token = localStorage.getItem('token')
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
        
        const res = await fetch(`${apiBaseUrl}/courses`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        })

        if (!res.ok) {
          throw new Error(`Erro ao buscar cursos: ${res.statusText}`)
        }

        const data = await res.json()
        this.courses = data.map(course => ({
          ...course,
          coverImage: this.resolveImageUrl(course.coverImage)
        }))
        this.calculateProgress()
      } catch (err) {
        console.error('Erro ao buscar cursos:', err)
        this.error = 'Não foi possível carregar os cursos. Tente novamente.'
      } finally {
        this.loading = false
      }
    },
    calculateProgress() {
      this.courses.forEach((course, index) => {
        // Mock progress to match visual example somewhat or just random
        // Example had: 43%, 0%, 78%, 25%
        const mockPercentages = [43, 0, 78, 25];
        this.courseProgress[course.id] = mockPercentages[index % mockPercentages.length];
      })
    },
    resolveImageUrl(url) {
      if (!url) return null
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url
      }
      if (url.startsWith('/')) {
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
        return `${apiBaseUrl}${url}`
      }
      const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
      return `${apiBaseUrl}/${url}`
    }
  }
}
</script>

<style scoped src="../assets/css/views/academyView.css"></style>
<style scoped>
.main-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
}
.header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
}
</style>