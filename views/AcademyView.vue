<template>
  <div class="layout">
    <AppSidebar />
    <main class="academy-content">
      <div class="header">
        <button class="back-btn" @click="$router.push('/dashboard')">
          <span>←</span> Voltar
        </button>
        <h1 class="title">Zenix Academy</h1>
      </div>

      <div v-if="loading" class="loading-container">
        <p>Carregando cursos...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
        <button @click="fetchCourses" class="btn-primary">Tentar novamente</button>
      </div>

      <div v-else class="courses-grid">
        <div 
          v-for="course in courses" 
          :key="course.id" 
          class="course-card"
        >
          <div class="course-image">{{ course.imagePlaceholder || 'Curso' }}</div>
          <h3 class="course-title">{{ course.title }}</h3>
          <p class="course-desc">{{ course.description }}</p>
          <div class="course-meta">
            <span>{{ course.totalLessons }} {{ course.totalLessons === 1 ? 'aula' : 'aulas' }}</span>
            <span>{{ course.totalDuration }}</span>
          </div>
          <div v-if="courseProgress[course.id] > 0" class="progress-section">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: courseProgress[course.id] + '%' }"></div>
            </div>
            <span class="progress-text">{{ courseProgress[course.id] }}%</span>
          </div>
          <div v-else-if="courseProgress[course.id] === 100" class="course-status">
            <span class="status-dot"></span>
            <span class="status-text">Finalizado</span>
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
        </div>
      </div>

      <div class="footer">
        <p>Todo o conteúdo do Zenix Academy é exclusivo para membros Zenix Black.</p>
      </div>
    </main>
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
      courseProgress: {} // Por enquanto mockado, depois virá do backend
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
        this.courses = data
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
    }
  }
}
</script>

<style scoped src="../assets/css/views/academyView.css"></style>
