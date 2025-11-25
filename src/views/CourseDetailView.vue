<template>
  <div class="layout noise-bg">
    <!-- Sidebar (AppSidebar handles fixed positioning) -->
    <!-- Note: AppSidebar logic handles its own width/collapsing. 
         We wrap the main content to offset it correctly via CSS (.layout margin-left) -->
    <AppSidebar :is-open="false" :is-collapsed="false" />

    <!-- Main Content Wrapper -->
    <div class="main-wrapper">
        
        <!-- Header -->
        <header class="course-header">
            <div class="header-inner">
                <div class="header-left">
                    <button class="back-btn" @click="$router.push('/academy')">
                        <i class="fas fa-arrow-left"></i>
                        Voltar
                    </button>
                    <h1 class="header-title">Zenix Academy</h1>
                </div>
                <div class="header-right">
                    <!-- User Info (Mocked based on example, or dynamic if available) -->
                    <div class="flex items-center space-x-3" style="display: flex; gap: 0.75rem; align-items: center;">
                        <div style="text-align: right;">
                            <div style="font-weight: 500; font-size: 0.875rem; color: #DFDFDF;">{{ userName }}</div>
                            <div style="display: flex; align-items: center; justify-content: flex-end; gap: 0.25rem; font-size: 0.75rem; color: #8D8D8D;">
                                <div class="pulse-dot" style="width: 0.5rem; height: 0.5rem; background-color: #22C55E; border-radius: 50%;"></div>
                                <span>Online</span>
                            </div>
                        </div>
                        <div style="width: 2.5rem; height: 2.5rem; background-color: rgba(34, 197, 94, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-user" style="color: #22C55E;"></i>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <main class="course-main" v-if="!loading && course">
            
            <!-- Center Column - Video & Content -->
            <div class="content-column">
                
                <!-- Breadcrumb -->
                <div class="breadcrumb">
                    <div class="breadcrumb-inner">
                        <span>Zenix Academy</span>
                        <i class="fas fa-chevron-right" style="font-size: 0.75rem;"></i>
                        <span>{{ course.title }}</span>
                        <template v-if="selectedLesson">
                            <i class="fas fa-chevron-right" style="font-size: 0.75rem;"></i>
                            <span class="breadcrumb-active">{{ selectedLesson.title }}</span>
                        </template>
                    </div>
                </div>

                <!-- Video Player -->
                <div class="video-player-section">
                    <div class="video-container">
                        <template v-if="selectedLesson && selectedLesson.videoUrl">
                            <video
                                class="video-element"
                                controls
                                :src="resolveMediaUrl(selectedLesson.videoUrl)"
                            >
                                Seu navegador não suporta reprodução de vídeo.
                            </video>
                        </template>
                        <div v-else class="video-placeholder-content">
                            <i class="fas fa-play-circle play-icon-large"></i>
                            <p style="color: #8D8D8D; font-size: 1.125rem;">Player de vídeo</p>
                        </div>
                        <div class="video-logo-watermark">ZENIX</div>
                    </div>
                </div>

                <!-- Lesson Title -->
                <div class="lesson-title-section" v-if="selectedLesson">
                    <h2 class="lesson-main-title">{{ selectedLesson.title }}</h2>
                    <!-- Optional External Link/CTA Button from design -->
                    <button v-if="false" class="action-btn btn-green" style="margin-bottom: 1.5rem;">
                        Criar seu cadastro
                    </button>
                </div>

                <!-- Materials Section -->
                <div class="materials-section">
                    <h3 class="section-heading">Materiais complementares</h3>
                    <div v-if="materialsLoading" class="materials-empty">
                        Carregando materiais...
                    </div>
                    <div v-else-if="!lessonMaterials.length" class="materials-empty">
                        Não há materiais complementares para este vídeo.
                    </div>
                    <div v-else class="materials-list">
                        <button
                            v-for="material in lessonMaterials"
                            :key="material.id"
                            class="material-item"
                            @click="openMaterial(material)"
                        >
                            <span class="material-name">{{ material.name }}</span>
                            <i class="fas fa-download download-icon"></i>
                        </button>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="action-buttons">
                    <button 
                        class="btn-action" 
                        :class="{ 'completed': selectedLesson?.completed }"
                        @click="markAsCompleted"
                        :disabled="!selectedLesson || markingComplete || selectedLesson?.completed"
                    >
                        <i
                            v-if="!selectedLesson?.completed"
                            class="fas fa-check-circle btn-icon-small gray"
                        ></i>
                        <span class="btn-text">{{ selectedLesson?.completed ? 'Concluído' : 'Marcar como concluído' }}</span>
                    </button>
                    <button 
                        v-if="selectedLesson?.completed"
                        class="btn-action"
                        @click="markAsIncomplete"
                        :disabled="markingIncomplete"
                    >
                        <i class="fas fa-rotate-right btn-icon-small"></i>
                        <span class="btn-text">Assistir novamente</span>
                    </button>
                </div>

            </div>

            <!-- Right Sidebar - Playlist -->
            <div class="playlist-column">
                <div class="playlist-header">
                    <h3 class="section-heading" style="margin-bottom: 0.25rem;">Conteúdo do Curso</h3>
                    <p class="playlist-meta">{{ totalLessons }} aulas • {{ course.totalDuration || 'Calculando...' }}</p>
                </div>

                <div class="modules-list">
                    <div v-for="(module, idx) in modules" :key="module.id || idx" class="module-container">
                        <button class="module-trigger" @click="toggleModule(idx)">
                            <div class="module-info">
                                <div class="module-title">Módulo {{ module.orderIndex || idx + 1 }}: {{ module.title }}</div>
                                <div class="module-progress" :style="{ color: getModuleProgress(module) === 100 ? '#22C55E' : '#8D8D8D' }">
                                    {{ getModuleProgress(module) }}% concluído
                                </div>
                            </div>
                            <i class="fas fa-chevron-down module-icon" :class="{ 'expanded': module.expanded }"></i>
                        </button>
                        
                        <div v-show="module.expanded" class="lessons-list">
                            <div 
                                v-for="(lesson, lidx) in module.lessons" 
                                :key="lesson.id || lidx"
                                class="lesson-item"
                                :class="{ 'active': selectedLesson && selectedLesson.id === lesson.id, 'completed': lesson.completed }"
                                @click="selectLesson(lesson)"
                            >
                                <div class="lesson-thumbnail">
                                    <div class="thumbnail-gradient"></div>
                                    <div class="play-overlay" v-if="selectedLesson && selectedLesson.id === lesson.id">
                                        <i class="fas fa-play" style="font-size: 0.75rem; color: #22C55E;"></i>
                                    </div>
                                </div>
                                <div class="lesson-info">
                                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                                        <i v-if="lesson.completed" class="fas fa-check-circle check-icon"></i>
                                        <div v-else-if="selectedLesson && selectedLesson.id === lesson.id" class="pulse-dot status-dot"></div>
                                        <div v-else class="status-circle"></div>
                                        <span class="lesson-name">{{ lesson.title }}</span>
                                    </div>
                                    <span class="lesson-duration">{{ lesson.duration || '5m 00s' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </main>

        <div v-else-if="loading" class="loading-container">
            <p>Carregando curso...</p>
        </div>

        <div v-else-if="error" class="error-container">
            <p>{{ error }}</p>
            <button class="btn-action" @click="fetchCourseDetails">Tentar novamente</button>
        </div>
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
      markingIncomplete: false,
      userName: 'Usuário',
      lessonMaterials: [],
      materialsLoading: false
    }
  },
  computed: {
    totalLessons() {
      return this.modules.reduce((total, module) => total + (module.lessons?.length || 0), 0)
    }
  },
  mounted() {
    this.loadFontAwesome();
    this.loadUserName();
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
    loadUserName() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.name) this.userName = user.name;
            } catch (e) {
                console.error(e);
            }
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
          if (res.status === 404) throw new Error('Curso não encontrado')
          throw new Error(`Erro ao buscar curso: ${res.statusText}`)
        }

        const data = await res.json()
        this.course = data
        
        if (data.modules && Array.isArray(data.modules)) {
          this.modules = data.modules.map(module => ({
            ...module,
            expanded: false, // Start collapsed
            lessons: module.lessons || []
          }))
          
          // Expand first module and select first lesson
          if (this.modules.length > 0) {
            this.modules[0].expanded = true
            if (this.modules[0].lessons && this.modules[0].lessons.length > 0) {
              this.selectedLesson = this.modules[0].lessons[0]
              await this.loadLessonMaterials(this.selectedLesson.id)
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
    async selectLesson(lesson) {
      this.selectedLesson = lesson
      await this.loadLessonMaterials(lesson.id)
    },
    getModuleProgress(module) {
        if (!module.lessons || module.lessons.length === 0) return 0;
        const completed = module.lessons.filter(l => l.completed).length;
        return Math.round((completed / module.lessons.length) * 100);
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

        if (!res.ok) throw new Error('Erro ao marcar aula como concluída')

        // Update local state
        this.selectedLesson.completed = true
        
        // Find and update inside modules array to reflect in sidebar
        for (const m of this.modules) {
            const l = m.lessons?.find(les => les.id === lessonId);
            if (l) l.completed = true;
        }
        
      } catch (err) {
        console.error('Erro ao marcar aula:', err)
        this.$root.$toast.error('Não foi possível marcar a aula como concluída.')
      } finally {
        this.markingComplete = false
      }
    },
    async markAsIncomplete() {
      if (!this.selectedLesson || !this.selectedLesson.completed) return
      
      this.markingIncomplete = true
      try {
        const token = localStorage.getItem('token')
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
        const courseId = this.$route.params.id
        const lessonId = this.selectedLesson.id
        
        const res = await fetch(`${apiBaseUrl}/courses/${courseId}/lessons/${lessonId}/complete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        })

        if (!res.ok) throw new Error('Erro ao remover conclusão da aula')

        // Update local state
        this.selectedLesson.completed = false
        
        // Find and update inside modules array to reflect in sidebar
        for (const m of this.modules) {
            const l = m.lessons?.find(les => les.id === lessonId);
            if (l) l.completed = false;
        }
        
      } catch (err) {
        console.error('Erro ao remover conclusão da aula:', err)
        this.$root.$toast?.error?.('Não foi possível remover a conclusão da aula.') || alert('Não foi possível remover a conclusão da aula.')
      } finally {
        this.markingIncomplete = false
      }
    },
    async loadLessonMaterials(lessonId) {
      if (!lessonId) {
        this.lessonMaterials = []
        return
      }
      this.materialsLoading = true
      this.lessonMaterials = []
      try {
        const token = localStorage.getItem('token')
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
        const res = await fetch(`${apiBaseUrl}/courses/lessons/${lessonId}/materials`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
          }
        })
        if (!res.ok) throw new Error('Erro ao carregar materiais')
        const data = await res.json()
        this.lessonMaterials = Array.isArray(data) ? data : []
      } catch (err) {
        console.error('Erro ao buscar materiais:', err)
        this.lessonMaterials = []
      } finally {
        this.materialsLoading = false
      }
    },
    openMaterial(material) {
      if (!material) return
      const path = material.filePath || material.link
      const url = this.resolveMediaUrl(path)
      if (url) {
        window.open(url, '_blank')
      }
    },
    resolveMediaUrl(path) {
      if (!path) return null
      if (path.startsWith('http://') || path.startsWith('https://')) return path
      const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
      return `${apiBaseUrl}${path}`
    }
  }
}
</script>

<style scoped src="../assets/css/views/courseDetailView.css"></style>
<style scoped>
.main-wrapper {
    width: 100%;
}
@media (max-width: 1024px) {
    .main-wrapper {
        margin-left: 0;
        width: 100%;
    }
}
</style>