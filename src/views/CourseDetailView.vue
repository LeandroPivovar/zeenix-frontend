<template>
  <div class="layout-course-detail noise-bg">
    
    <!-- Header -->
    <header class="course-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="header-title">Zenix Academy</h1>
        </div>
        <div class="header-right">
          <div class="user-info">
            <div class="user-details">
              <div class="user-name">{{ getUserName() }}</div>
              <div class="user-status">
                <div class="status-dot pulse-dot"></div>
                <span>Online</span>
              </div>
            </div>
            <div class="user-avatar">
              <i class="fa-solid fa-user"></i>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content-flex">
      
      <!-- Left Column - Video & Content (70%) -->
      <div class="video-content-column">
        
        <!-- Breadcrumb -->
        <div class="breadcrumb">
          <span @click="$router.push('/academy')" class="breadcrumb-link">Zenix Academy</span>
          <i class="fa-solid fa-chevron-right"></i>
          <span class="breadcrumb-text">{{ course?.title || 'Carregando...' }}</span>
          <template v-if="selectedLesson">
            <i class="fa-solid fa-chevron-right"></i>
            <span class="breadcrumb-current">{{ selectedLesson.title }}</span>
          </template>
        </div>

        <!-- Video Player -->
        <div class="video-player-card">
          <div class="video-player-wrapper">
            <template v-if="selectedLesson && selectedLesson.videoUrl">
              <video
                class="lesson-video"
                controls
                :src="resolveMediaUrl(selectedLesson.videoUrl)"
              >
                Seu navegador não suporta reprodução de vídeo.
              </video>
            </template>
            <template v-else>
              <div class="video-placeholder">
                <div class="placeholder-icon">
                  <i class="fa-solid fa-play-circle"></i>
                  <p>{{ selectedLesson ? 'Vídeo em breve' : 'Selecione uma aula para começar' }}</p>
                </div>
                <div class="zenix-watermark">ZENIX</div>
              </div>
            </template>
          </div>
        </div>

        <!-- Lesson Title & Description -->
        <div v-if="selectedLesson" class="lesson-info-section">
          <h2 class="lesson-title-main">{{ selectedLesson.title }}</h2>
          <p v-if="selectedLesson.description" class="lesson-description">{{ selectedLesson.description }}</p>
          
          <!-- Optional External Link (if lesson has external link) -->
          <button v-if="selectedLesson.externalLink" class="btn-external-link" @click="openExternalLink(selectedLesson.externalLink)">
            {{ selectedLesson.externalLinkText || 'Acessar recurso externo' }}
          </button>
        </div>

        <!-- Materials Section -->
        <div v-if="selectedLesson && selectedLesson.materials && selectedLesson.materials.length > 0" class="materials-section">
          <h3 class="materials-title">Materiais complementares</h3>
          <div class="materials-list">
            <div 
              v-for="(material, idx) in selectedLesson.materials" 
              :key="idx"
              class="material-item"
              @click="downloadMaterial(material)"
            >
              <span class="material-name">{{ material.name || 'Material ' + (idx + 1) }}</span>
              <i class="fa-solid fa-download"></i>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="selectedLesson" class="action-buttons-grid">
          <button 
            class="action-btn"
            :class="{ 'completed': selectedLesson.completed }"
            @click="markAsCompleted"
            :disabled="selectedLesson.completed || markingComplete"
          >
            <i class="fa-solid fa-check-circle"></i>
            <span>{{ selectedLesson.completed ? 'Aula concluída' : 'Marcar como concluído' }}</span>
          </button>
          <button class="action-btn" @click="replayLesson">
            <i class="fa-solid fa-rotate-right"></i>
            <span>Assistir novamente</span>
          </button>
        </div>
      </div>

      <!-- Right Sidebar - Course Playlist (30%) -->
      <div class="course-playlist-sidebar">
        <div class="playlist-header">
          <h3 class="playlist-title">Conteúdo do Curso</h3>
          <p class="playlist-meta">{{ totalLessons }} aulas • {{ course?.totalDuration || '0h 0min' }}</p>
        </div>

        <div v-if="loading" class="loading-info">Carregando módulos...</div>
        <div v-else-if="error" class="error-info">{{ error }}</div>
        
        <div v-else class="modules-list">
          <div 
            v-for="(module, idx) in modules" 
            :key="module.id || idx"
            class="module-block"
          >
            <button class="module-header-btn" @click="toggleModule(idx)">
              <div class="module-info">
                <div class="module-title-text">Módulo {{ module.orderIndex || idx + 1 }}: {{ module.title }}</div>
                <div class="module-progress-text">{{ getModuleProgressText(module) }}</div>
              </div>
              <i 
                class="fa-solid module-chevron"
                :class="module.expanded ? 'fa-chevron-down' : 'fa-chevron-right'"
              ></i>
            </button>
            
            <div v-if="module.expanded" class="lessons-list">
              <div 
                v-for="(lesson, lidx) in module.lessons" 
                :key="lesson.id || lidx"
                class="lesson-item-card"
                :class="{ 
                  'active': lesson.active,
                  'completed': lesson.completed
                }"
                @click="selectLesson(lesson)"
              >
                <div class="lesson-thumbnail">
                  <div class="thumbnail-gradient"></div>
                  <i v-if="lesson.active" class="fa-solid fa-play play-icon"></i>
                </div>
                <div class="lesson-details">
                  <div class="lesson-title-row">
                    <i v-if="lesson.completed" class="fa-solid fa-check-circle status-icon completed-icon"></i>
                    <div v-else-if="lesson.active" class="status-dot pulse-dot active-dot"></div>
                    <div v-else class="status-dot inactive-dot"></div>
                    <span class="lesson-title-text">{{ lesson.title }}</span>
                  </div>
                  <span class="lesson-duration-text">{{ lesson.duration || '0min' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'CourseDetailView',
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
    this.loadFontAwesome();
    this.fetchCourseDetails();
  },
  watch: {
    '$route.params.id'() {
      this.fetchCourseDetails()
    }
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
    getUserName() {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          return user.name || 'Usuário';
        }
      } catch (e) {
        // ignore
      }
      return 'Usuário';
    },
    getModuleProgressText(module) {
      if (!module.lessons || module.lessons.length === 0) return '0% concluído';
      const completed = module.lessons.filter(l => l.completed).length;
      const total = module.lessons.length;
      const percent = Math.round((completed / total) * 100);
      return `${percent}% concluído`;
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
        
        if (data.modules && Array.isArray(data.modules)) {
          this.modules = data.modules.map(module => ({
            ...module,
            expanded: false,
            lessons: module.lessons || []
          }))
          
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

        this.selectedLesson.completed = true
        this.modules.forEach(m => {
          if (m.lessons) {
            const lesson = m.lessons.find(l => l.id === lessonId)
            if (lesson) {
              lesson.completed = true
            }
          }
        })
        
        alert('Aula marcada como concluída!')
      } catch (err) {
        console.error('Erro ao marcar aula como concluída:', err)
        alert('Não foi possível marcar a aula como concluída. Tente novamente.')
      } finally {
        this.markingComplete = false
      }
    },
    replayLesson() {
      if (!this.selectedLesson || !this.selectedLesson.videoUrl) return;
      const video = document.querySelector('.lesson-video');
      if (video) {
        video.currentTime = 0;
        video.play();
      }
    },
    openExternalLink(url) {
      window.open(url, '_blank');
    },
    downloadMaterial(material) {
      if (material.url) {
        window.open(this.resolveMediaUrl(material.url), '_blank');
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
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
</style>