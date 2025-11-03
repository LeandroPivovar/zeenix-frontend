<template>
  <div class="layout">
    <AppSidebar />
    <main class="course-detail">
      <div class="content-wrapper">
        <aside class="course-nav">
          <button class="back-link" @click="$router.push('/academy')">
            ← Voltar aos cursos
          </button>
          <h2 class="course-title-nav">{{ course?.title || 'Carregando...' }}</h2>
          <div v-if="course" class="progress-info">
            <span class="progress-text">{{ completedLessons }} de {{ totalLessons }} aulas concluídas</span>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
            </div>
          </div>

          <div v-if="loading" class="loading-info">Carregando módulos...</div>
          <div v-else-if="error" class="error-info">{{ error }}</div>
          <div v-else class="modules">
            <div class="module" v-for="(module, idx) in modules" :key="module.id || idx">
              <button class="module-header" @click="toggleModule(idx)">
                <span class="module-number">Módulo {{ module.orderIndex || idx + 1 }} - {{ module.title }}</span>
                <span class="caret" :class="{ expanded: module.expanded }">▼</span>
              </button>
              <div v-if="module.expanded" class="lessons">
                <div 
                  v-for="(lesson, lidx) in module.lessons" 
                  :key="lesson.id || lidx"
                  class="lesson-item"
                  :class="{ completed: lesson.completed, active: lesson.active }"
                  @click="selectLesson(lesson)"
                >
                  <span v-if="lesson.completed" class="check">✓</span>
                  <span v-else class="circle">○</span>
                  <span class="lesson-number">{{ lesson.orderIndex || lidx + 1 }}.</span>
                  <span class="lesson-title">{{ lesson.title }}</span>
                  <span class="lesson-duration">{{ lesson.duration }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="certificate-hint">
            Complete todas as aulas para desbloquear seu certificado Zenix.
          </div>
        </aside>

        <div class="video-section">
          <div v-if="selectedLesson" class="lesson-header">
            <h3 class="lesson-title-main">{{ selectedLesson.title }}</h3>
            <div class="lesson-meta">
              <span class="duration">Duração: {{ selectedLesson.duration }}</span>
              <span class="status">
                <span class="status-dot"></span>
                {{ selectedLesson.completed ? 'Concluída' : 'Em andamento' }}
              </span>
            </div>
            <div v-if="selectedLesson.description" class="lesson-description">
              <p>{{ selectedLesson.description }}</p>
            </div>
          </div>
          <div v-else class="lesson-header">
            <h3 class="lesson-title-main">Selecione uma aula</h3>
          </div>

          <div v-if="!selectedLesson" class="loading-info">Selecione uma aula para começar ℹ</div>
          <div v-else class="video-player">
            <div class="video-placeholder">{{ selectedLesson.title }}</div>
            <div class="zenix-badge">ZENIX</div>
          </div>

          <div class="action-buttons">
            <button class="btn-download">
              <span>⬇</span>
              Baixar material da aula
            </button>
            <button 
              class="btn-complete" 
              :class="{ completed: selectedLesson?.completed }"
              @click="markAsCompleted"
              :disabled="!selectedLesson || selectedLesson.completed || markingComplete"
            >
              <span v-if="markingComplete">⏳</span>
              <span v-else>✓</span>
              {{ selectedLesson?.completed ? 'Aula concluída' : 'Marcar como concluída' }}
            </button>
            <button class="btn-replay">
              <span>↻</span>
              Assistir novamente
            </button>
          </div>

          <div class="materials">
            <h4 class="materials-title">Materiais Complementares</h4>
            <a href="#" class="material-link">
              <span>📄</span>
              PDF: Estratégia de Copy Trading
            </a>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import AppSidebar from '../components/Sidebar.vue'

export default {
  name: 'CourseDetailView',
  components: { AppSidebar },
  data() {
    return {
      course: null,
      modules: [],
      selectedLesson: null,
      loading: true,
      error: null,
      markingComplete: false
    }
  },
  computed: {
    totalLessons() {
      return this.modules.reduce((total, module) => total + (module.lessons?.length || 0), 0)
    },
    completedLessons() {
      // TODO: Buscar progresso real do backend
      return this.modules.reduce((total, module) => {
        return total + (module.lessons?.filter(l => l.completed).length || 0)
      }, 0)
    },
    progressPercentage() {
      if (this.totalLessons === 0) return 0
      return Math.round((this.completedLessons / this.totalLessons) * 100)
    }
  },
  mounted() {
    this.fetchCourseDetails()
  },
  watch: {
    '$route.params.id'() {
      this.fetchCourseDetails()
    }
  },
  methods: {
    async fetchCourseDetails() {
      this.loading = true
      this.error = null
      
      try {
        const courseId = this.$route.params.id
        const token = localStorage.getItem('token')
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
        
        const res = await fetch(`${apiBaseUrl}/courses/${courseId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        })

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Curso não encontrado')
          }
          throw new Error(`Erro ao buscar curso: ${res.statusText}`)
        }

        const data = await res.json()
        this.course = data
        
        // Organizar módulos e aulas
        if (data.modules && Array.isArray(data.modules)) {
          this.modules = data.modules.map(module => ({
            ...module,
            expanded: false,
            lessons: module.lessons || []
          }))
          
          // Expandir o primeiro módulo e selecionar a primeira aula
          if (this.modules.length > 0) {
            this.modules[0].expanded = true
            if (this.modules[0].lessons && this.modules[0].lessons.length > 0) {
              this.selectLesson(this.modules[0].lessons[0])
            }
          }
        }
      } catch (err) {
        console.error('Erro ao buscar detalhes do curso:', err)
        this.error = err.message || 'Não foi possível carregar o curso.'
      } finally {
        this.loading = false
      }
    },
    toggleModule(idx) {
      this.modules[idx].expanded = !this.modules[idx].expanded
    },
    selectLesson(lesson) {
      this.modules.forEach(m => {
        m.lessons?.forEach(l => l.active = false)
      })
      lesson.active = true
      this.selectedLesson = lesson
    },
    async markAsCompleted() {
      if (!this.selectedLesson || this.selectedLesson.completed) return
      
      this.markingComplete = true
      try {
        const token = localStorage.getItem('token')
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
        const courseId = this.$route.params.id
        const lessonId = this.selectedLesson.id
        
        const res = await fetch(`${apiBaseUrl}/courses/${courseId}/lessons/${lessonId}/complete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        })

        if (!res.ok) {
          throw new Error('Erro ao marcar aula como concluída')
        }

        // Atualizar o estado local
        this.selectedLesson.completed = true
        // Atualizar também no array de módulos
        this.modules.forEach(m => {
          if (m.lessons) {
            const lesson = m.lessons.find(l => l.id === lessonId)
            if (lesson) {
              lesson.completed = true
            }
          }
        })
        
        // Mostrar feedback visual
        alert('Aula marcada como concluída!')
      } catch (err) {
        console.error('Erro ao marcar aula como concluída:', err)
        alert('Não foi possível marcar a aula como concluída. Tente novamente.')
      } finally {
        this.markingComplete = false
      }
    }
  }
}
</script>

<style scoped src="../assets/css/views/courseDetailView.css"></style>
