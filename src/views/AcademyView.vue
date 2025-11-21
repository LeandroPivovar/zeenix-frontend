<template>
  <div class="academy-layout noise-bg">
    <AppSidebar />

    <div class="academy-main">
      <header class="academy-header">
        <div>
          <h1>Zenix Academy</h1>
          <p>Cursos exclusivos para traders profissionais</p>
        </div>
      </header>

      <main class="academy-content">
        <div v-if="loading" class="state-card">
          <p>Carregando cursos...</p>
        </div>

        <div v-else-if="error" class="state-card">
          <p>{{ error }}</p>
          <button @click="fetchCourses" class="btn-primary">Tentar novamente</button>
        </div>

        <div v-else class="courses-grid">
          <div 
            v-for="course in courses" 
            :key="course.id" 
            class="course-card"
          >
            <div class="course-media" :class="getCourseMediaClass(course)">
              <template v-if="course.coverImage">
                <img :src="course.coverImage" :alt="course.title" />
              </template>
              <template v-else>
                <i :class="['fas', getCourseIcon(course).icon, getCourseIcon(course).colorClass]"></i>
              </template>
            </div>

            <div class="course-body">
              <div class="course-header">
                <div class="course-info">
                  <h3>{{ course.title }}</h3>
                  <p>{{ course.description }}</p>
                </div>
                <div class="tooltip">
                  <i class="fas fa-info-circle"></i>
                  <span class="tooltiptext">
                    Este curso faz parte da formação oficial Zenix. Sua conclusão aumenta sua consistência operacional e libera novos conteúdos avançados.
                  </span>
                </div>
              </div>

              <div class="course-meta">
                <div>
                  <i class="fas fa-play-circle"></i>
                  <span>{{ course.totalLessons }} {{ course.totalLessons === 1 ? 'aula' : 'aulas' }}</span>
                </div>
                <div>
                  <i class="fas fa-clock"></i>
                  <span>{{ course.totalDuration }}</span>
                </div>
              </div>

              <div class="course-progress" v-if="courseProgress[course.id] > 0 && courseProgress[course.id] < 100">
                <div class="progress-head">
                  <span>Progresso</span>
                  <span class="progress-value">{{ courseProgress[course.id] }}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: courseProgress[course.id] + '%' }"></div>
                </div>
              </div>

              <div class="course-progress" v-else-if="courseProgress[course.id] === 100">
                <div class="progress-head">
                  <span>Progresso</span>
                  <span class="progress-value complete">100%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: 100%"></div>
                </div>
              </div>

              <div class="course-progress" v-else>
                <div class="progress-head">
                  <span>Progresso</span>
                  <span class="progress-value">0%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: 0%"></div>
                </div>
              </div>

              <button 
                v-if="courseProgress[course.id] > 0 && courseProgress[course.id] < 100"
                class="btn-primary" 
                @click="$router.push(`/academy/course/${course.id}`)"
              >
                Continuar
              </button>
              <button 
                v-else-if="courseProgress[course.id] === 0"
                class="btn-outline" 
                @click="$router.push(`/academy/course/${course.id}`)"
              >
                Iniciar
              </button>
              <button 
                v-else
                class="btn-primary" 
                @click="$router.push(`/academy/course/${course.id}`)"
              >
                Revisar
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
      courseProgress: {}
    }
  },
  mounted() {
    this.fetchCourses()
  },
  methods: {
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
      // TODO: Buscar progresso real do backend
      // Por enquanto, simula progresso para demonstração
      this.courses.forEach(course => {
        // Mock: alguns cursos com progresso, outros sem
        const mockProgress = Math.random() > 0.5 ? Math.floor(Math.random() * 100) : 0
        this.courseProgress[course.id] = mockProgress
      })
    },
    resolveImageUrl(url) {
      if (!url) return null
      // Se já é uma URL completa (http/https), retorna como está
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url
      }
      // Se começa com /, adiciona a base URL da API
      if (url.startsWith('/')) {
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
        return `${apiBaseUrl}${url}`
      }
      // Caso contrário, assume que é um caminho relativo
      const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
      return `${apiBaseUrl}/${url}`
    },
    getCourseIcon(course) {
      const title = (course.title || '').toLowerCase()
      if (title.includes('copy')) return { icon: 'fa-copy', colorClass: 'icon-green' }
      if (title.includes('ia') || title.includes('automação')) return { icon: 'fa-brain', colorClass: 'icon-blue' }
      if (title.includes('análise') || title.includes('gráfico')) return { icon: 'fa-chart-line', colorClass: 'icon-yellow' }
      if (title.includes('robô') || title.includes('estratégia')) return { icon: 'fa-robot', colorClass: 'icon-red' }
      return { icon: 'fa-graduation-cap', colorClass: 'icon-green' }
    },
    getCourseMediaClass(course) {
      return course.coverImage ? 'course-media has-image' : 'course-media'
    }
  }
}
</script>

<style scoped src="../assets/css/views/academyView.css"></style>
<style scoped>
.background-glow {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at 15% 20%, rgba(99, 102, 241, 0.22), transparent 45%),
    radial-gradient(circle at 80% 15%, rgba(56, 189, 248, 0.18), transparent 50%),
    radial-gradient(circle at 50% 75%, rgba(16, 185, 129, 0.18), transparent 55%),
    rgba(9, 10, 12, 0.95);
  z-index: -2;
  pointer-events: none;
}

.background-grid {
  position: fixed;
  inset: 0;
  background-image: linear-gradient(rgba(148, 163, 184, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.06) 1px, transparent 1px);
  background-size: 48px 48px;
  z-index: -1;
  opacity: 0.6;
  pointer-events: none;
  animation: moveGrid 18s linear infinite;
}

@keyframes moveGrid {
  0% {
    background-position: 0 0, 0 0;
  }
  100% {
    background-position: -48px -48px, -48px -48px;
  }
}
</style>
