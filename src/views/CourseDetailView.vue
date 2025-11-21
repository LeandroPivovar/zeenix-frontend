<template>
  <div class="course-layout noise-bg" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" @close-sidebar="closeSidebar" @toggle-collapse="toggleSidebarCollapse" />

    <div class="course-main">
      <header class="course-header">
        <div class="header-left">
          <button class="back-link" @click="$router.push('/academy')">
            <i class="fas fa-arrow-left"></i>
            Voltar aos cursos
          </button>
          <div class="header-content">
            <h1>Zenix Academy</h1>
            <p>Cursos exclusivos para traders profissionais</p>
          </div>
        </div>
        <div class="user-info-block">
          <div class="user-meta">
            <div class="name">{{ currentUserName }}</div>
            <div class="status">
              <span class="pulse-dot"></span>
              <span>Online</span>
            </div>
          </div>
          <div class="user-avatar">{{ userInitials }}</div>
        </div>
      </header>

      <main class="course-body">
        <section class="video-content">
          <nav class="breadcrumb">
            <span>Zenix Academy</span>
            <i class="fas fa-chevron-right"></i>
            <span>{{ course?.title || 'Curso' }}</span>
            <i class="fas fa-chevron-right" v-if="selectedLesson"></i>
            <span v-if="selectedLesson">{{ selectedLesson.title }}</span>
          </nav>

          <div class="video-card">
            <div class="video-frame">
              <template v-if="selectedLesson?.videoUrl">
                <video class="lesson-video" controls :src="resolveMediaUrl(selectedLesson.videoUrl)">
                  Seu navegador não suporta reprodução de vídeo.
                </video>
              </template>
              <template v-else>
                <div class="video-placeholder">
                  <i class="fa-solid fa-play-circle" style="font-size: 4rem; color: rgba(34, 197, 94, 0.2);"></i>
                  <p>{{ selectedLesson?.title || 'Selecione uma aula' }}</p>
                </div>
                <div class="zenix-watermark">ZENIX</div>
              </template>
            </div>
          </div>

          <div v-if="selectedLesson">
            <h2>{{ selectedLesson.title }}</h2>
            <p class="lesson-meta-line">{{ selectedLesson.description }}</p>
            <button class="cta-button" v-if="course?.ctaLabel" @click="openCTA(course.ctaLink)">
              {{ course.ctaLabel }}
            </button>
          </div>

          <div class="materials-section">
            <h3>Materiais complementares</h3>
            <div class="materials-list" v-if="materialsList.length">
              <div v-for="material in materialsList" :key="material.id || material.title" class="material-row" @click="downloadMaterial(material)">
                <span>{{ material.title }}</span>
                <i class="fa-solid fa-download" style="color:#22C55E;"></i>
              </div>
            </div>
            <p v-else class="empty-materials">Nenhum material disponível para esta aula.</p>
          </div>

          <div class="action-buttons">
            <button class="action-btn" @click="markAsCompleted" :disabled="!selectedLesson || selectedLesson.completed || markingComplete">
              <i class="fa-solid fa-check-circle" style="color:#22C55E;"></i>
              <span>{{ selectedLesson?.completed ? 'Aula concluída' : 'Marcar como concluída' }}</span>
            </button>
            <button class="action-btn" @click="replayLesson" :disabled="!selectedLesson">
              <i class="fa-solid fa-rotate-right" style="color:#22C55E;"></i>
              <span>Assistir novamente</span>
            </button>
          </div>
        </section>

        <aside class="course-playlist">
          <div class="playlist-header">
            <h3>Conteúdo do Curso</h3>
            <p>{{ totalLessons }} aulas • {{ course?.totalDuration || '--' }}</p>
          </div>

          <div v-if="loading" class="loading-info">Carregando módulos...</div>
          <div v-else-if="error" class="error-info">{{ error }}</div>

          <div v-else>
            <div class="playlist-module" v-for="(module, idx) in modules" :key="module.id || idx">
              <button class="module-toggle" @click="toggleModule(idx)">
                <div>
                  <div>Módulo {{ module.orderIndex || idx + 1 }}: {{ module.title }}</div>
                  <div class="module-progress">{{ module.lessons?.filter(l => l.completed).length || 0 }} / {{ module.lessons?.length || 0 }} concluído</div>
                </div>
                <i class="fa-solid" :class="module.expanded ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
              </button>
              <div class="lesson-list" :class="{ expanded: module.expanded }">
                <div 
                  class="lesson-row" 
                  v-for="(lesson, lidx) in module.lessons" 
                  :key="lesson.id || lidx"
                  :class="{ active: selectedLesson?.id === lesson.id }"
                  @click="selectLesson(lesson)"
                >
                  <div class="lesson-thumb"></div>
                  <div class="lesson-info">
                    <div class="lesson-info-title">{{ lesson.title }}</div>
                    <div class="lesson-info-duration">{{ lesson.duration }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
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
      markingComplete: false,
      isSidebarOpen: false,
      isSidebarCollapsed: false
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
    },
    materialsList() {
      return this.selectedLesson?.materials || []
    },
    currentUserName() {
      const stored = localStorage.getItem('user')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          return parsed.name || 'Usuário'
        } catch (e) {
          return 'Usuário'
        }
      }
      return 'Usuário'
    },
    userInitials() {
      const parts = this.currentUserName.split(' ')
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      }
      return this.currentUserName.substring(0, 2).toUpperCase()
    }
  },
  mounted() {
    this.loadFontAwesome()
    this.fetchCourseDetails()
  },
  watch: {
    '$route.params.id'() {
      this.fetchCourseDetails()
    }
  },
  methods: {
    loadFontAwesome() {
      if (!document.getElementById('fa-script')) {
        const script = document.createElement('script')
        script.id = 'fa-script'
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js'
        script.crossOrigin = 'anonymous'
        script.referrerPolicy = 'no-referrer'
        document.head.appendChild(script)
      }
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
    replayLesson() {
      if (this.selectedLesson?.videoUrl) {
        const video = document.querySelector('.lesson-video')
        video?.load()
      }
    },
    openCTA(link) {
      if (link) {
        window.open(link, '_blank')
      }
    },
    downloadMaterial(material) {
      if (material?.url) {
        window.open(this.resolveMediaUrl(material.url), '_blank')
      }
    },
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
    },
    resolveMediaUrl(path) {
      if (!path) return null
      if (path.startsWith('http://') || path.startsWith('https://')) {
        return path
      }
      const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
      return `${apiBaseUrl}${path}`
    }
  }
}
</script>

<style scoped src="../assets/css/views/courseDetailView.css"></style>