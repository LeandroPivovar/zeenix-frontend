<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-content video-card">
      <div class="modal-header">
        <h3 class="modal-title">{{ videoTitle || 'Bem-vindo à Zenix!' }}</h3>
        <button class="close-btn" @click="close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="video-container">
        <!-- Loader -->
        <div v-if="loading" class="video-loading">
          <div class="premium-spinner"></div>
          <span>Carregando vídeo de boas-vindas...</span>
        </div>

        <template v-else>
          <iframe 
            v-if="videoUrl"
            :src="getEmbedUrl(videoUrl)" 
            title="Vídeo Explicativo"
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            class="video-iframe"
          ></iframe>
          <div v-else class="video-placeholder">
            <div class="placeholder-icon">
              <i class="fas fa-play-circle"></i>
              <span>Vídeo indisponível</span>
            </div>
          </div>
        </template>
      </div>

      <div class="modal-footer" v-if="!loading">
        <button class="btn-primary" @click="close">
          Começar Agora
          <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FirstAccessVideoModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      videoUrl: '',
      videoTitle: '',
      loading: false,
      hasError: false
    }
  },
  watch: {
    visible(newVal) {
      if (newVal && !this.videoUrl) {
        this.loadOnboardingVideo();
      }
    }
  },
  methods: {
    async loadOnboardingVideo() {
      // 1. Tentar carregar do cache
      const cachedUrl = localStorage.getItem('zenix_onboarding_video_url');
      const cachedTitle = localStorage.getItem('zenix_onboarding_video_title');
      
      if (cachedUrl) {
        this.videoUrl = cachedUrl;
        this.videoTitle = cachedTitle || 'Bem-vindo à Zenix!';
        return;
      }

      this.loading = true;
      this.hasError = false;

      try {
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        const token = localStorage.getItem('token');
        
        // 2. Buscar todos os cursos
        const coursesRes = await fetch(`${apiBase}/courses`, {
          headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
        });

        if (!coursesRes.ok) throw new Error('Falha ao carregar cursos');
        const courses = await coursesRes.json();

        let foundVideo = null;
        let foundTitle = '';

        // 3. Percorrer cursos para achar a aula com isDerivTutorial === 2
        for (const course of courses) {
          const courseDetailRes = await fetch(`${apiBase}/courses/${course.id}`, {
            headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
          });

          if (courseDetailRes.ok) {
            const courseDetail = await courseDetailRes.json();
            if (courseDetail.modules) {
              for (const module of courseDetail.modules) {
                if (module.lessons) {
                  const onboardingLesson = module.lessons.find(l => l.isDerivTutorial === 2);
                  if (onboardingLesson) {
                    foundVideo = onboardingLesson.videoUrl || onboardingLesson.contentLink;
                    foundTitle = onboardingLesson.title;
                    break;
                  }
                }
              }
            }
          }
          if (foundVideo) break;
        }

        if (foundVideo) {
          this.videoUrl = this.resolveVideoUrl(foundVideo);
          this.videoTitle = foundTitle;
          
          // 4. Salvar no cache
          localStorage.setItem('zenix_onboarding_video_url', this.videoUrl);
          localStorage.setItem('zenix_onboarding_video_title', this.videoTitle);
        }
      } catch (e) {
        console.error('Erro ao carregar vídeo de onboarding:', e);
        this.hasError = true;
      } finally {
        this.loading = false;
      }
    },
    resolveVideoUrl(url) {
      if (!url) return '';
      if (url.startsWith('http')) return url;
      const apiBase = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
      return `${apiBase}${url}`;
    },
    getEmbedUrl(url) {
      if (!url) return '';
      
      // Se for um link de upload (resolvido por resolveVideoUrl), retorna ele mesmo
      // Mas se for YouTube/Vimeo, garante o formato embed
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('v=')) {
          videoId = url.split('v=')[1].split('&')[0];
        } else if (url.includes('embed/')) {
          videoId = url.split('embed/')[1].split('?')[0];
        } else if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1];
        }
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1`;
      } else if (url.includes('vimeo.com')) {
        const videoId = url.split('/').pop();
        return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
      }
      
      return url;
    },
    close() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10001;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-out;
}

.video-card {
  background: #0B0B0B;
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 24px;
  padding: 32px;
  width: 90%;
  max-width: 850px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(34, 197, 94, 0.1);
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: slideUp 0.4s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  color: white;
  font-size: 26px;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: #9CA3AF;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #EF4444;
  transform: rotate(90deg);
}

.video-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 */
  background: #050505;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.video-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  color: #8D8D8D;
  font-size: 14px;
  background: #0B0B0B;
}

.premium-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(34, 197, 94, 0.1);
  border-top-color: #22C55E;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.video-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0F0F0F;
  color: #4B5563;
}

.placeholder-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.placeholder-icon i {
  font-size: 48px;
  opacity: 0.2;
}

.modal-footer {
  display: flex;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
  color: white;
  border: none;
  border-radius: 14px;
  padding: 16px 40px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 20px -5px rgba(34, 197, 94, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 25px -5px rgba(34, 197, 94, 0.5);
  filter: brightness(1.1);
}

.btn-primary i {
  transition: transform 0.3s ease;
}

.btn-primary:hover i {
  transform: translateX(4px);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@media (max-width: 640px) {
  .video-card {
    padding: 24px;
    width: 95%;
    gap: 20px;
  }
  
  .modal-title {
    font-size: 20px;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
    padding: 14px;
  }
}
</style>
    close() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10001; /* Acima do Onboarding se necessário, mas será sequencial */
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-out;
}

.video-card {
  background: #0B0B0B;
  border: 1px solid rgba(34, 197, 94, 0.2); /* Borda verde suave */
  border-radius: 20px;
  padding: 32px;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(34, 197, 94, 0.1);
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: slideUp 0.4s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(to right, #ffffff, #a0a0a0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.close-btn {
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: #9CA3AF;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transform: rotate(90deg);
}

.video-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* Aspect Ratio 16:9 */
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.video-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #141414;
  color: #4B5563;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
}

.btn-primary {
  background: #22C55E;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 28px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #16A34A;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 640px) {
  .video-card {
    padding: 20px;
    width: 90%; /* More breathing room on sides */
    max-height: 85vh; /* Prevent overflow on vertical axis */
    overflow-y: auto; /* Enable scrolling if content is too tall */
  }
  
  .modal-title {
    font-size: 18px; /* Slightly smaller title */
  }

  .close-btn {
    width: 32px;
    height: 32px;
  }
}

/* Landscape mode handling for mobile */
@media (max-height: 500px) and (orientation: landscape) {
  .video-card {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    padding: 16px;
    max-height: 95vh;
  }
  
  .modal-header {
    width: 100%;
    margin-bottom: 10px;
  }

  .video-container {
    width: 100%;
    /* Limit video height in landscape to avoid taking full screen height */
    max-height: 60vh; 
  }
}
</style>
